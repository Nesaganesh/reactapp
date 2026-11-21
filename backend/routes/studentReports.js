const crypto = require('crypto');
const express = require('express');
const studentReportsStore = require('../services/studentReportsStore');
const CostumeMeasurement = require('../models/CostumeMeasurement');

const router = express.Router();
const skills = [
  'Choreography & step memory',
  'Rhythm & timing',
  'Coordination & technique',
  'Expression & energy',
  'Confidence & stage presence',
  'Teamwork & formations'
];
const gradeBands = [
  { minimum: 27, maximum: 30, grade: 'A+', description: 'Outstanding' },
  { minimum: 24, maximum: 26, grade: 'A', description: 'Excellent' },
  { minimum: 21, maximum: 23, grade: 'B+', description: 'Very good' },
  { minimum: 18, maximum: 20, grade: 'B', description: 'Good progress' },
  { minimum: 15, maximum: 17, grade: 'C', description: 'Developing' },
  { minimum: 0, maximum: 14, grade: 'D', description: 'More support recommended' }
];

const asyncHandler = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

function sendDatabaseError(error, req, res, next) {
  if (res.headersSent) return next(error);
  console.error('Student reports database error:', error);
  const unavailable = error.name === 'ResourceNotFoundException' || error.name === 'ServiceUnavailableException';
  return res.status(unavailable ? 503 : 500).json({
    error: unavailable
      ? 'Student reports database is unavailable. Confirm the DynamoDB table is created and the backend IAM role has access.'
      : 'Unable to complete the student reports request.'
  });
}

function safeEqual(first, second) {
  const firstBuffer = Buffer.from(String(first));
  const secondBuffer = Buffer.from(String(second));
  return firstBuffer.length === secondBuffer.length && crypto.timingSafeEqual(firstBuffer, secondBuffer);
}

function sessionSecret() {
  return process.env.STUDENT_REPORT_SESSION_SECRET;
}

function signToken(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', sessionSecret()).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

function requireTeacher(req, res, next) {
  const secret = sessionSecret();
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!secret || !token.includes('.')) {
    return res.status(401).json({ error: 'Teacher sign-in required.' });
  }

  const [encoded, suppliedSignature] = token.split('.');
  const expectedSignature = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
  if (!safeEqual(suppliedSignature, expectedSignature)) {
    return res.status(401).json({ error: 'Teacher sign-in required.' });
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (payload.role !== 'teacher' || payload.expiresAt < Date.now()) {
      return res.status(401).json({ error: 'Teacher sign-in required.' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Teacher sign-in required.' });
  }

  return next();
}

function hashAccessCode(code) {
  return crypto.createHmac('sha256', sessionSecret()).update(String(code).trim()).digest('hex');
}

function hashLegacyAccessCode(code) {
  return crypto.createHash('sha256').update(String(code).trim()).digest('hex');
}

function accessCodeMatches(credential, code) {
  const expectedHash = credential.hashVersion === 'hmac-sha256-v1'
    ? hashAccessCode(code)
    : hashLegacyAccessCode(code);
  return safeEqual(credential.codeHash, expectedHash);
}

function parentCodeCipherKey() {
  return crypto.createHash('sha256').update(`${sessionSecret()}:parent-code-display`).digest();
}

function encryptParentCode(code) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', parentCodeCipherKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(code), 'utf8'), cipher.final()]);
  return [iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), encrypted.toString('base64url')].join('.');
}

function decryptParentCode(encryptedCode) {
  if (!encryptedCode || typeof encryptedCode !== 'string') return null;
  try {
    const [ivValue, tagValue, contentValue] = encryptedCode.split('.');
    const decipher = crypto.createDecipheriv('aes-256-gcm', parentCodeCipherKey(), Buffer.from(ivValue, 'base64url'));
    decipher.setAuthTag(Buffer.from(tagValue, 'base64url'));
    return Buffer.concat([decipher.update(Buffer.from(contentValue, 'base64url')), decipher.final()]).toString('utf8');
  } catch (error) {
    return null;
  }
}

function createReport(student, { branch, group, term, assessmentDate, scores, observations, comments }) {
  const normalizedScores = scores.map(Number);
  const totalScore = normalizedScores.reduce((total, score) => total + score, 0);
  const grade = gradeBands.find(band => totalScore >= band.minimum && totalScore <= band.maximum);
  return {
    id: crypto.randomUUID(),
    studentId: student.id,
    studentName: student.name,
    branch,
    group,
    term: String(term).trim().slice(0, 60),
    assessmentDate: assessmentDate || new Date().toISOString().slice(0, 10),
    scores: normalizedScores,
    skillNames: skills,
    observations: Array.isArray(observations) ? skills.map((skill, index) => String(observations[index] || '').slice(0, 500)) : skills.map(() => ''),
    comments: String(comments || '').slice(0, 3000),
    totalScore,
    grade: grade.grade,
    gradeDescription: grade.description,
    createdAt: new Date().toISOString()
  };
}

function validateReportInput({ branch, group, term, scores }) {
  if (!branch || !group || !term || !Array.isArray(scores) || scores.length !== skills.length) {
    return 'Branch, group, term and six skill scores are required.';
  }
  const normalizedScores = scores.map(score => Number(score));
  if (normalizedScores.some(score => !Number.isInteger(score) || score < 1 || score > 5)) {
    return 'Each skill score must be an integer from 1 to 5.';
  }
  return null;
}

router.post('/teacher/login', (req, res) => {
  const configuredCode = process.env.STUDENT_REPORT_TEACHER_CODE;
  const secret = sessionSecret();
  if (!configuredCode || !secret) {
    return res.status(503).json({ error: 'Teacher access is not configured on the server.' });
  }
  if (!safeEqual(req.body.accessCode || '', configuredCode)) {
    return res.status(401).json({ error: 'Invalid access code.' });
  }
  return res.json({ token: signToken({ role: 'teacher', expiresAt: Date.now() + 8 * 60 * 60 * 1000 }) });
});

router.post('/teacher/reports/clear-all', requireTeacher, asyncHandler(async (req, res) => {
  if (req.body.confirmation !== 'DELETE ALL REPORTS') {
    return res.status(400).json({ error: 'Type DELETE ALL REPORTS to confirm this action.' });
  }
  const deletedCount = await studentReportsStore.deleteItemsByEntityTypes(['REPORT']);
  return res.json({ deletedCount, message: `Removed ${deletedCount} student report(s). Student profiles were kept.` });
}));

router.post('/teacher/parent-codes/clear-all', requireTeacher, asyncHandler(async (req, res) => {
  if (req.body.confirmation !== 'REMOVE ALL PARENT CODES') {
    return res.status(400).json({ error: 'Type REMOVE ALL PARENT CODES to confirm this action.' });
  }
  const deletedCount = await studentReportsStore.deleteItemsByEntityTypes(['PARENT_CODE', 'PARENT_CODE_LOOKUP']);
  return res.json({ deletedCount, message: `Removed ${deletedCount} parent-code record(s). Generate new codes individually from student profiles.` });
}));

router.get('/teacher/students', requireTeacher, asyncHandler(async (req, res) => {
  const { branch, group } = req.query;
  if (!branch || !group) {
    return res.status(400).json({ error: 'Branch and group are required.' });
  }

  const { students: measurementStudents, unassignedGroupStudents } = await CostumeMeasurement.findReportRosterByBranch(branch, group);
  let records = await studentReportsStore.listStudents(branch, group);
  const knownNames = new Set(records.map(student => String(student.name || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase()));
  let importedCount = 0;

  for (const measurement of measurementStudents) {
    const normalizedName = measurement.name.toLocaleLowerCase();
    if (knownNames.has(normalizedName)) continue;

    try {
      await studentReportsStore.createStudent({
        id: `costume-${measurement.id}`,
        name: measurement.name,
        branch: measurement.branch,
        group: measurement.group,
        section: null,
        source: 'CostumeMeasurements',
        sourceMeasurementId: measurement.id,
        createdAt: new Date().toISOString()
      });
      knownNames.add(normalizedName);
      importedCount += 1;
    } catch (error) {
      if (error.name !== 'ConditionalCheckFailedException') throw error;
    }
  }

  if (importedCount || measurementStudents.length) records = await studentReportsStore.listStudents(branch, group);
  const measurementNames = new Set(measurementStudents.map(student => student.name.toLocaleLowerCase()));
  records = records.filter(student => measurementNames.has(String(student.name || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase()));
  const students = await Promise.all(records.map(async student => {
    const [reports, parentCode] = await Promise.all([
      studentReportsStore.getReports(student.id, branch),
      studentReportsStore.getParentCode(student.id)
    ]);
    return {
      id: student.id,
      name: student.name,
      group: student.group,
      branch: student.branch,
      branchUnassigned: !student.branch,
      parentCodeSet: Boolean(parentCode),
      parentAccessCode: decryptParentCode(parentCode?.encryptedCode),
      reports
    };
  }));

  return res.json({
    students,
    branch,
    branchNeedsConfirmation: students.some(student => student.branchUnassigned),
    importedCount,
    unassignedMeasurementStudents: unassignedGroupStudents
  });
}));

router.post('/teacher/measurements/:measurementId/group', requireTeacher, asyncHandler(async (req, res) => {
  const branch = String(req.body.branch || '').trim();
  const group = String(req.body.group || '').trim();
  const validBranches = ['Ipswich', 'Colchester', 'Chelmsford', 'Croydon'];
  const validGroups = ['PeppyToez', 'LittleLegends', 'EnergeticExpressors', 'TeensSociety'];
  if (!validBranches.includes(branch) || !validGroups.includes(group)) {
    return res.status(400).json({ error: 'Select a valid branch and class group.' });
  }

  let measurement;
  try {
    measurement = await CostumeMeasurement.assignReportGroup(req.params.measurementId, branch, group);
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      return res.status(409).json({ error: 'This costume entry is missing, belongs to another branch, or already has a group.' });
    }
    throw error;
  }
  return res.json({ message: 'Class group assigned to the costume record.' });
}));

router.post('/teacher/reports', requireTeacher, asyncHandler(async (req, res) => {
  const validationError = validateReportInput(req.body);
  if (!req.body.studentId || validationError) {
    return res.status(400).json({ error: validationError || 'Student ID is required.' });
  }

  const student = await studentReportsStore.getStudent(req.body.studentId);
  if (!student) return res.status(404).json({ error: 'Student not found.' });
  if (student.branch && student.branch !== req.body.branch) {
    return res.status(409).json({ error: 'The selected branch does not match this student’s saved branch assignment.' });
  }
  if (student.group && student.group !== req.body.group) {
    return res.status(409).json({ error: 'The selected group does not match this student’s saved group assignment.' });
  }
  if (!await CostumeMeasurement.hasStudentInBranchAndGroup(req.body.branch, req.body.group, student.name)) {
    return res.status(409).json({ error: 'Reports can only be created for students listed in the matching CostumeMeasurements branch and group.' });
  }

  const report = createReport(student, req.body);
  await studentReportsStore.saveReports([{ student, report }]);
  return res.status(201).json({ report });
}));

router.post('/teacher/reports/bulk', requireTeacher, asyncHandler(async (req, res) => {
  const { studentIds, branch, group, term, assessmentDate, scores, observations, comments } = req.body;
  if (!Array.isArray(studentIds) || studentIds.length < 1 || studentIds.length > 50 || !branch || !group || !term || !Array.isArray(scores) || scores.length !== skills.length) {
    return res.status(400).json({ error: 'Select 1–50 students and provide branch, group, term and six skill scores.' });
  }
  if (new Set(studentIds).size !== studentIds.length || studentIds.some(id => typeof id !== 'string')) {
    return res.status(400).json({ error: 'Selected student list is invalid.' });
  }

  const validationError = validateReportInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const selectedStudents = await Promise.all(studentIds.map(studentId => studentReportsStore.getStudent(studentId)));
  if (selectedStudents.some(student => !student)) {
    return res.status(404).json({ error: 'One or more selected students were not found.' });
  }
  if (selectedStudents.some(student => student.group !== group)) {
    return res.status(409).json({ error: 'One or more selected students do not belong to the selected group.' });
  }
  if (selectedStudents.some(student => student.branch && student.branch !== branch)) {
    return res.status(409).json({ error: 'One or more selected students have a different saved branch.' });
  }
  const sourceRosterMatches = await Promise.all(selectedStudents.map(student =>
    CostumeMeasurement.hasStudentInBranchAndGroup(branch, group, student.name)
  ));
  if (sourceRosterMatches.some(matches => !matches)) {
    return res.status(409).json({ error: 'Reports can only be created for students listed in the matching CostumeMeasurements branch and group.' });
  }

  const entries = selectedStudents.map(student => ({ student, report: createReport(student, req.body) }));
  const reports = entries.map(entry => entry.report);
  await studentReportsStore.saveReports(entries);
  return res.status(201).json({ reports, savedCount: reports.length });
}));

async function generateAndSaveParentCode(student, branch, replace) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = generateParentCode([]);
    try {
      await studentReportsStore.saveParentCode({
        student,
        codeHash: hashAccessCode(code),
        hashVersion: 'hmac-sha256-v1',
        encryptedCode: encryptParentCode(code),
        branch,
        replace
      });
      return code;
    } catch (error) {
      const current = await studentReportsStore.getParentCode(student.id);
      if (!replace && current) {
        const conflict = new Error('A parent code has already been registered for this student.');
        conflict.statusCode = 409;
        throw conflict;
      }
      if (error.name !== 'TransactionCanceledException') throw error;
    }
  }
  throw new Error('Could not generate an unused code. Please try again.');
}

router.post('/teacher/students/:studentId/parent-code/reset', requireTeacher, asyncHandler(async (req, res) => {
  const student = await studentReportsStore.getStudent(req.params.studentId);
  if (!student) return res.status(404).json({ error: 'Student not found.' });
  if (!await CostumeMeasurement.hasStudentInBranchAndGroup(student.branch, student.group, student.name)) {
    return res.status(409).json({ error: 'Parent codes can only be generated for students listed in the matching CostumeMeasurements branch and group.' });
  }
  const code = await generateAndSaveParentCode(student, student.branch, true);
  return res.json({ accessCode: code, message: 'Parent authorization code reset.' });
}));

router.post('/parent/register', asyncHandler(async (req, res) => {
  if (!sessionSecret()) {
    return res.status(503).json({ error: 'Parent access is not configured on the server.' });
  }

  const branch = String(req.body.branch || '').trim();
  const studentName = String(req.body.studentName || '').trim().replace(/\s+/g, ' ');
  const validBranches = ['Ipswich', 'Colchester', 'Chelmsford', 'Croydon'];
  if (!validBranches.includes(branch) || !studentName || studentName.length > 120) {
    return res.status(400).json({ error: 'Choose a branch and enter your child’s full name.' });
  }

  if (!await CostumeMeasurement.hasStudentInBranch(branch, studentName)) {
    return res.status(400).json({ error: 'We could not verify that student and branch. Check the details or contact a teacher.' });
  }

  const matches = (await studentReportsStore.findStudentsByName(studentName))
    .filter(student => String(student.name || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase() === studentName.toLocaleLowerCase());
  if (matches.length !== 1 || (matches[0].branch && matches[0].branch !== branch)) {
    return res.status(400).json({ error: 'We could not verify that student and branch. Check the details or contact a teacher.' });
  }

  const student = matches[0];
  if (await studentReportsStore.getParentCode(student.id)) {
    return res.status(409).json({ error: 'A parent code has already been registered for this student. Please contact a teacher to reset it.' });
  }

  let code;
  try {
    code = await generateAndSaveParentCode(student, branch, false);
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json({ error: 'A parent code has already been registered for this student. Please contact a teacher to reset it.' });
    }
    throw error;
  }
  return res.status(201).json({ studentName: student.name, branch, accessCode: code });
}));

router.post('/parent/authorize', asyncHandler(async (req, res) => {
  const branch = String(req.body.branch || '').trim();
  const firstName = String(req.body.firstName || '').trim().toLocaleLowerCase();
  if (!branch || !firstName || !req.body.accessCode) {
    return res.status(400).json({ error: 'Branch, student first name and authorization code are required.' });
  }

  let access = await studentReportsStore.findParentCodeByHash(hashAccessCode(req.body.accessCode));
  if (!access) access = await studentReportsStore.findParentCodeByHash(hashLegacyAccessCode(req.body.accessCode));
  if (access && !accessCodeMatches(access, req.body.accessCode)) access = null;
  if (!access) {
    return res.status(401).json({ error: 'Unable to verify those details.' });
  }

  const student = await studentReportsStore.getStudent(access.studentId);
  if (!student || student.name.trim().split(/\s+/)[0].toLocaleLowerCase() !== firstName || (student.branch && student.branch !== branch)) {
    return res.status(401).json({ error: 'Unable to verify those details.' });
  }
  if (!await CostumeMeasurement.hasStudentInBranchAndGroup(branch, student.group, student.name)) {
    return res.status(401).json({ error: 'Unable to verify those details.' });
  }

  const reports = await studentReportsStore.getReports(student.id, branch);
  return res.json({ student: { id: student.id, name: student.name }, reports });
}));

router.use((error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token.' });
  }
  if (error.name === 'ForbiddenError') {
    return res.status(403).json({ error: 'You do not have permission to access this resource.' });
  }
  if (error.name === 'NotFoundError') {
    return res.status(404).json({ error: 'Resource not found.' });
  }
  if (error.name === 'ConflictError') {
    return res.status(409).json({ error: error.message });
  }
  if (error.name === 'ServiceUnavailableException') {
    return res.status(503).json({ error: 'Service temporarily unavailable. Please try again later.' });
  }
  console.error('Unexpected error:', error);
  return res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
});

module.exports = router;
