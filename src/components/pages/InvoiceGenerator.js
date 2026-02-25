import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import './InvoiceGenerator.css';
import Navbar from '../Navbar';
import logo from '../../assets/FDC_New_logo_resize.png';

const InvoiceGenerator = () => {
  const [invoiceType, setInvoiceType] = useState('single'); // 'single' or 'bulk'
  const [formData, setFormData] = useState({
    studentName: '',
    branch: 'Colchester',
    rate: '',
    numberOfClasses: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0]
  });
  const [bulkData, setBulkData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const invoiceRef = useRef();
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateInvoice = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleDownloadPDF = async () => {
    if (invoiceType === 'single') {
      // Single invoice download
      const element = invoiceRef.current;
      const fileName = `Invoice_${formData.studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      const opt = {
        margin: [10, 10, 10, 10],
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      html2pdf().set(opt).from(element).save();
    } else {
      // Bulk invoices - generate separate PDFs and zip them
      setDownloading(true);
      const zip = new JSZip();
      const dateStr = new Date().toISOString().split('T')[0];

      try {
        // Create a temporary container for rendering individual invoices
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        document.body.appendChild(tempContainer);

        for (let i = 0; i < bulkData.length; i++) {
          const invoice = bulkData[i];
          const studentName = invoice.studentName.replace(/\s+/g, '_');
          const fileName = `Invoice_${studentName}_${dateStr}.pdf`;

          // Render individual invoice
          tempContainer.innerHTML = '';
          const invoiceElement = document.createElement('div');
          invoiceElement.className = 'invoice-content';
          
          // Create invoice HTML
          invoiceElement.innerHTML = `
            ${generateInvoiceHTML(invoice)}
          `;
          
          tempContainer.appendChild(invoiceElement);

          // Generate PDF as blob
          const opt = {
            margin: [10, 10, 10, 10],
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
              scale: 2,
              useCORS: true,
              logging: false
            },
            jsPDF: { 
              unit: 'mm', 
              format: 'a4', 
              orientation: 'portrait' 
            }
          };

          const pdfBlob = await html2pdf().set(opt).from(invoiceElement).outputPdf('blob');
          zip.file(fileName, pdfBlob);
        }

        // Remove temporary container
        document.body.removeChild(tempContainer);

        // Generate and download zip
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = `Invoices_${dateStr}.zip`;
        link.click();
        URL.revokeObjectURL(link.href);

      } catch (error) {
        console.error('Error generating bulk PDFs:', error);
        alert('Error generating PDFs. Please try again.');
      } finally {
        setDownloading(false);
      }
    }
  };

  const generateInvoiceHTML = (data) => {
    const calculateSubTotal = () => {
      const rate = parseFloat(data.rate) || 0;
      const qty = parseInt(data.numberOfClasses) || 0;
      return (rate * qty).toFixed(2);
    };

    const generateInvoiceNumber = () => {
      const branch = data.branch.replace(/\s+/g, '_');
      const name = data.studentName.replace(/\s+/g, '_');
      return `${branch}_${name}`.substring(0, 30);
    };

    return `
      <div style="padding: 60px; background: white; min-height: 800px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 50px;">
          <div>
            <img src="${logo}" alt="Logo" style="width: 100px; height: 100px; margin-bottom: 15px;" />
            <h2 style="font-size: 24px; color: #333; margin: 10px 0;">Flytoez Dance Company</h2>
            <p style="color: #666; margin: 5px 0;">flytoezdancecompany@gmail.com</p>
            <p style="color: #666; margin: 5px 0;">United Kingdom</p>
          </div>
          <div>
            <h1 style="font-size: 48px; color: #666; font-weight: 400; letter-spacing: 2px;">INVOICE</h1>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
          <div>
            <p style="font-weight: 600; color: #333; margin-bottom: 10px;">Bill To:</p>
            <p style="color: #666; margin: 5px 0;">${data.studentName}</p>
            <p style="color: #666; margin: 5px 0;">${data.branch}</p>
            <p style="color: #666; margin: 5px 0;">United Kingdom</p>
          </div>
          <div style="text-align: right;">
            <div style="margin-bottom: 8px;">
              <span style="color: #333; font-weight: 500; margin-right: 30px;">Invoice#</span>
              <span style="color: #666;">${generateInvoiceNumber()}</span>
            </div>
            <div style="margin-bottom: 8px;">
              <span style="color: #333; font-weight: 500; margin-right: 30px;">Invoice Date</span>
              <span style="color: #666;">${new Date(data.invoiceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div style="margin-bottom: 8px;">
              <span style="color: #333; font-weight: 500; margin-right: 30px;">Due Date</span>
              <span style="color: #666;">${new Date(data.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead style="background: #7f8c8d; color: white;">
            <tr>
              <th style="padding: 15px; text-align: left;">Item Description</th>
              <th style="padding: 15px; text-align: left;">Qty</th>
              <th style="padding: 15px; text-align: left;">Rate</th>
              <th style="padding: 15px; text-align: left;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 15px; border-bottom: 1px solid #eee; color: #333;">${data.studentName}</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee; color: #333;">${data.numberOfClasses}</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee; color: #333;">${data.rate}</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee; color: #333;">${calculateSubTotal()}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-left: auto; width: 300px; margin-bottom: 40px;">
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
            <span style="color: #333;">Sub Total</span>
            <span style="color: #333;">${calculateSubTotal()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
            <span style="color: #333;">Sale Tax (0%)</span>
            <span style="color: #333;">0.00</span>
          </div>
          <div style="display: flex; justify-content: space-between; background: #d5d8dc; padding: 15px 10px; margin-top: 10px; font-weight: 700; font-size: 18px;">
            <span style="color: #333;">TOTAL</span>
            <span style="color: #333;">£ ${calculateSubTotal()}</span>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <p style="font-weight: 600; color: #333; margin-bottom: 10px;">Notes</p>
          <p style="color: #666; margin: 5px 0;">Nesaganesh Panneerselvam</p>
          <p style="color: #666; margin: 5px 0;">21663992</p>
          <p style="color: #666; margin: 5px 0;">400317</p>
        </div>

        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-style: italic;">Thank you for having business with Flytoez</p>
        </div>
      </div>
    `;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        // Validate and format data
        const formattedData = data.map((row, index) => ({
          studentName: row['Student Name'] || row['Name'] || row['student_name'] || '',
          branch: row['Branch'] || row['branch'] || 'Colchester',
          rate: parseFloat(row['Rate'] || row['rate'] || 0),
          numberOfClasses: parseInt(row['Number of Classes'] || row['Classes'] || row['classes'] || 0),
          invoiceDate: formData.invoiceDate,
          dueDate: formData.dueDate
        }));

        setBulkData(formattedData);
        alert(`Successfully loaded ${formattedData.length} records!`);
      } catch (error) {
        alert('Error reading file. Please ensure it\'s a valid Excel file with columns: Student Name, Branch, Rate, Number of Classes');
        console.error('File upload error:', error);
      }
    };
    reader.readAsBinaryString(file);
  };

  const calculateSubTotal = () => {
    const rate = parseFloat(formData.rate) || 0;
    const qty = parseInt(formData.numberOfClasses) || 0;
    return (rate * qty).toFixed(2);
  };

  const calculateTotal = () => {
    return calculateSubTotal();
  };

  const generateInvoiceNumber = () => {
    const branch = formData.branch.replace(/\s+/g, '_');
    const name = formData.studentName.replace(/\s+/g, '_');
    return `${branch}_${name}`.substring(0, 30);
  };

  return (
    <>
      <Navbar />
      <div className="invoice-generator-container">
        <h1>Student Invoice Generator</h1>
        
        {!showPreview ? (
          <div className="invoice-form-wrapper">
            {/* Invoice Type Selector */}
            <div className="invoice-type-selector">
              <label className="radio-option">
                <input
                  type="radio"
                  name="invoiceType"
                  value="single"
                  checked={invoiceType === 'single'}
                  onChange={(e) => setInvoiceType(e.target.value)}
                />
                <span>Single Invoice</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="invoiceType"
                  value="bulk"
                  checked={invoiceType === 'bulk'}
                  onChange={(e) => setInvoiceType(e.target.value)}
                />
                <span>Bulk Invoice (Excel Upload)</span>
              </label>
            </div>

            {invoiceType === 'single' ? (
              <form onSubmit={handleGenerateInvoice} className="invoice-form">
                <div className="form-group">
                  <label htmlFor="studentName">Student Name *</label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="branch">Branch/Location *</label>
                  <select
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                  >
                    <option value="Colchester">Colchester</option>
                    <option value="Chelmsford">Chelmsford</option>
                    <option value="Ipswich">Ipswich</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="rate">Rate per Class (£) *</label>
                    <input
                      type="number"
                      id="rate"
                      name="rate"
                      value={formData.rate}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="numberOfClasses">Number of Classes *</label>
                    <input
                      type="number"
                      id="numberOfClasses"
                      name="numberOfClasses"
                      value={formData.numberOfClasses}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="invoiceDate">Invoice Date</label>
                    <input
                      type="date"
                      id="invoiceDate"
                      name="invoiceDate"
                      value={formData.invoiceDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button type="submit" className="generate-btn">
                  Generate Invoice
                </button>
              </form>
            ) : (
              <div className="bulk-upload-section">
                <div className="upload-instructions">
                  <h3>Upload Excel File</h3>
                  <p>Your Excel file should have the following columns:</p>
                  <ul>
                    <li><strong>Student Name</strong> - Full name of the student</li>
                    <li><strong>Branch</strong> - Colchester, Chelmsford, or Ipswich</li>
                    <li><strong>Rate</strong> - Rate per class (numeric)</li>
                    <li><strong>Number of Classes</strong> - Number of classes (numeric)</li>
                  </ul>
                  <a href="/sample-invoice-template.csv" download className="template-link">
                    📥 Download Sample Template
                  </a>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="invoiceDate">Invoice Date (for all)</label>
                    <input
                      type="date"
                      id="invoiceDate"
                      name="invoiceDate"
                      value={formData.invoiceDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dueDate">Due Date (for all)</label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="file-upload-area">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".xlsx,.xls,.csv"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="upload-btn"
                  >
                    📁 Choose Excel File
                  </button>
                  {bulkData.length > 0 && (
                    <p className="file-status">✅ {bulkData.length} records loaded</p>
                  )}
                </div>

                {bulkData.length > 0 && (
                  <button
                    onClick={() => setShowPreview(true)}
                    className="generate-btn"
                  >
                    Generate {bulkData.length} Invoices
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="invoice-preview-container">
            <div className="invoice-actions">
              <button onClick={() => setShowPreview(false)} className="back-btn" disabled={downloading}>
                ← Back to Form
              </button>
              <button onClick={handleDownloadPDF} className="download-btn" disabled={downloading}>
                {downloading ? (
                  <>⏳ Generating {bulkData.length} PDFs...</>
                ) : (
                  <>📄 Download {invoiceType === 'bulk' ? 'as ZIP' : 'PDF'}</>
                )}
              </button>
            </div>

            <div ref={invoiceRef} className="invoice-preview">
              {invoiceType === 'single' ? (
                <InvoiceTemplate 
                  data={formData} 
                  logo={logo}
                  generateInvoiceNumber={generateInvoiceNumber}
                  calculateSubTotal={calculateSubTotal}
                  calculateTotal={calculateTotal}
                />
              ) : (
                bulkData.map((invoice, index) => (
                  <div key={index} className={index > 0 ? 'page-break' : ''}>
                    <InvoiceTemplate 
                      data={invoice} 
                      logo={logo}
                      generateInvoiceNumber={() => {
                        const branch = invoice.branch.replace(/\s+/g, '_');
                        const name = invoice.studentName.replace(/\s+/g, '_');
                        return `${branch}_${name}`.substring(0, 30);
                      }}
                      calculateSubTotal={() => {
                        const rate = parseFloat(invoice.rate) || 0;
                        const qty = parseInt(invoice.numberOfClasses) || 0;
                        return (rate * qty).toFixed(2);
                      }}
                      calculateTotal={() => {
                        const rate = parseFloat(invoice.rate) || 0;
                        const qty = parseInt(invoice.numberOfClasses) || 0;
                        return (rate * qty).toFixed(2);
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Reusable Invoice Template Component
const InvoiceTemplate = ({ data, logo, generateInvoiceNumber, calculateSubTotal, calculateTotal }) => (
  <div className="invoice-content">
    <div className="invoice-header">
      <div className="company-info">
        <div className="company-logo">
          <img src={logo} alt="Flytoez Logo" className="logo-img" />
        </div>
        <h2>Flytoez Dance Company</h2>
        <p>United Kingdom</p>
      </div>
      <div className="invoice-title">
        <h1>INVOICE</h1>
      </div>
    </div>

    <div className="invoice-details">
      <div className="bill-to">
        <p className="label">Bill To:</p>
        <p className="value">{data.studentName}</p>
        <p className="value">{data.branch}</p>
        <p className="value">United Kingdom</p>
      </div>
      <div className="invoice-meta">
        <div className="meta-row">
          <span className="meta-label">Invoice#</span>
          <span className="meta-value">{generateInvoiceNumber()}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Invoice Date</span>
          <span className="meta-value">{new Date(data.invoiceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Due Date</span>
          <span className="meta-value">{new Date(data.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
    </div>

    <table className="invoice-table">
      <thead>
        <tr>
          <th>Item Description</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{data.studentName}</td>
          <td>{data.numberOfClasses}</td>
          <td>{data.rate}</td>
          <td>{calculateSubTotal()}</td>
        </tr>
      </tbody>
    </table>

    <div className="invoice-totals">
      <div className="totals-row">
        <span className="totals-label">Sub Total</span>
        <span className="totals-value">{calculateSubTotal()}</span>
      </div>
      <div className="totals-row">
        <span className="totals-label">Sale Tax (0%)</span>
        <span className="totals-value">0.00</span>
      </div>
      <div className="totals-row total">
        <span className="totals-label">TOTAL</span>
        <span className="totals-value">£ {calculateTotal()}</span>
      </div>
    </div>

    <div className="invoice-notes">
      <p className="notes-title">Notes</p>
      <p>Nesaganesh Panneerselvam</p>
      <p>21663992</p>
      <p>400317</p>
    </div>

    <div className="invoice-footer">
      <p>Thank you for having business with Flytoez</p>
    </div>
  </div>
);

export default InvoiceGenerator;
