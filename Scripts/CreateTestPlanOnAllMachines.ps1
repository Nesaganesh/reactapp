[CmdletBinding()]
param (
    $RequestProjectParam,
	$MilestoneParam,
	$DockerTestPlanNameParam,
	$SelectOnlyfromSectionParam,
	$TestRailUserName,
	$TestRailPassword,

	
	[Parameter(Mandatory=$False)]
    [string[]] $RequestSectionListParam=@(),

	[Parameter(Mandatory=$False)]
    [string[]] $RequestSuiteParam=@()
)


# Data prep
$testRailUrl = 'https://testrail.ludologic.com/index.php?/api/v2/'
$requestProject = $RequestProjectParam #get this from TC parameter
$requestMilestone = $MilestoneParam #get this from TC parameter
$requestTestPlan = $DockerTestPlanNameParam #get this from TC parameter
$requestSectionList = $RequestSectionListParam #get this from TC parameter
$selectOnlyfromSection = $SelectOnlyfromSectionParam #get this from TC parameter
$requestSuite = $RequestSuiteParam #get this from TC parameter
$testRailUserName = $TestRailUserName #get this from TC parameter
$testRailPassword = $TestRailPassword #get this from TC parameter
$requiredId=''

Write-Host $testRailUrl
Write-Host $requestProject
Write-Host $requestMilestone
Write-Host $requestTestPlan
Write-Host $requestSectionList
Write-Host $selectOnlyfromSection
Write-Host $requestSuite
Write-Host $testRailUserName
Write-Host $testRailPassword

# Basci Authorization
#$testrailuser = 'nesa.ganesh@derivco.co.uk' #get this from TC parameter
#$testrailtoken = 'cSgmfb.m4wekNt8Tty50-DH8oNkX9EBlHRHr4DVPT' #get this from TC parameter


$pair = "$($testRailUserName):$($testRailPassword)"
$encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($pair))
$basicAuthValue = "Basic $encodedCreds"

# setting Headers
$table_headers = @{
"Authorization" = $basicAuthValue
"Content-Type" = "application/json"
"Accept" = "application/json"
}


function InvokeApi([string]$ApiUrl, [string]$IsPost, $BodyInfo) {

	$Stoploop = $false
	[int]$Retrycount = "0"

 	do {			
		Try {
			if ($IsPost -eq "true") {
				$invokeApiResult = Invoke-RestMethod -Method POST -Uri $ApiUrl -Headers $table_headers -ContentType "application/json" -Body $BodyInfo
			
			}
			else {
				$invokeApiResult = Invoke-RestMethod -Method GET -Uri $ApiUrl -Headers $table_headers -ContentType "application/json" | ConvertTo-JSON
			
			}
			$Stoploop = $true
			return $invokeApiResult;
		}
		Catch {
			
			$ErrorMessage = $_.Exception.Message
			Write-Host $ApiUrl
			Write-Host "************ Exception from Testrail  *************** " $ErrorMessage

			if ($Retrycount -gt 3){
				$Stoploop = $true
			}
			else {
				$Retrycount = $Retrycount + 1
				Start-Sleep -Seconds 1
				Write-Host "Retry $Retrycount / 3"
			}
		}	 
	}
	While ($Stoploop -eq $false)
}





#set values
$projectid = '0';
$milestoneId = '0';

Function CheckJsonParsingForValueAttribute($response)
{
	if($response.value -ne $null) {
	$response=$response.value
	}
	return $response
}


# GET Project id
$projectUrl = $testRailUrl+"get_projects&is_completed=0"
Write-Host $projectUrl
#$R = Invoke-RestMethod -Method GET -Uri $projectUrl -Headers $table_headers -ContentType "application/json" | ConvertTo-JSON
$R = InvokeApi $projectUrl "false"

$x = $R | Out-String | ConvertFrom-Json
$x=CheckJsonParsingForValueAttribute($x)

foreach($projectname in $x) {
	if($projectname.name -eq $requestProject) {
		$projectid = $projectname.id
		break
	}
}

Write-Host Project id $projectid

# GET test Plans
$getPlansUrl = $testRailUrl+"get_plans/$projectid&is_completed=0"
#$getPlanResponse = Invoke-RestMethod -Method GET -Uri $getPlansUrl -Headers $table_headers -ContentType "application/json" | ConvertTo-JSON
$getPlanResponse = InvokeApi $getPlansUrl "false"
$getPlanResponseObject = $getPlanResponse | Out-String | ConvertFrom-Json
$getPlanResponseObject=CheckJsonParsingForValueAttribute($getPlanResponseObject)

if($getPlanResponseObject.name -contains $requestTestPlan){
    Write-Host "test rail plan exists already"
	foreach($milestone in $getPlanResponseObject) {
	if($getPlanResponseObject.name -eq $requestTestPlan) {
		$requiredId = $getPlanResponseObject.id
		break
	}
  }
}

else{

# GET Milestone id
$milestoneUrl = $testRailUrl+"get_milestones/$projectid&is_completed=0"
#$milestoneResponse = Invoke-RestMethod -Method GET -Uri $milestoneUrl -Headers $table_headers -ContentType "application/json" | ConvertTo-JSON
$milestoneResponse = InvokeApi $milestoneUrl "false"
$milestoneResponseObject = $milestoneResponse | Out-String | ConvertFrom-Json 
$milestoneResponseObject=CheckJsonParsingForValueAttribute($milestoneResponseObject)

foreach($milestone in $milestoneResponseObject) {
	if($milestone.name -eq $requestMilestone) {
		$milestoneId = $milestone.id
		break
	}
}

Write-Host Milestone id $milestoneId
$properties = New-Object -TypeName PSObject
$properties | Add-Member -MemberType NoteProperty -Name "name" -Value $requestTestPlan
$properties | Add-Member -MemberType NoteProperty -Name "milestone_id" -Value $milestoneId
$properties | Add-Member -MemberType NoteProperty -Name "description" -Value $requestTestPlan

Write-Host $properties


#GET Poject Suites
$getSuitesUrl = $testRailUrl+"get_suites/$projectid"
#$getSuitesResponse = Invoke-RestMethod -Method GET -Uri $getSuitesUrl -Headers $table_headers -ContentType "application/json" | ConvertTo-JSON
$getSuitesResponse = InvokeApi $getSuitesUrl "false"
$getSuitesResponseObject = $getSuitesResponse | Out-String | ConvertFrom-Json
$getSuitesResponseObject=CheckJsonParsingForValueAttribute($getSuitesResponseObject)

Write-Host GetSuites response $getSuitesResponseObject

$totalcases = 0

$customobjectPlanEntriesArray = @()

Function GetIdFromChildParentId($parentid)
{
	$sectionList = @()
	$listOfSearchChildSections = $getSuiteSectionsResponseObject | where { $_.parent_id -eq $parentid}
	
	if($listOfSearchChildSections) {
	
		$sectionList += $parentid
		foreach($section in $listOfSearchChildSections) {
			$sectionList += $section.id
		}
	}
	
	return $sectionList

}

function GetSectionChildsFunction($GetSectionChilds) {

	$GetSectionChildsArray = @()
	if($GetSectionChilds.count -gt 0) {
	
		for($i=0; $i -lt 6; $i++){
			
			foreach($id in $GetSectionChilds) {
				
				$GetSectionChildsArray += GetIdFromChildParentId($id)
			}
		 }
	}
	
	if($GetSectionChildsArray.count -gt 0){
	
		foreach($id in $GetSectionChildsArray) {
				
			$GetSectionChildsArray += GetIdFromChildParentId($id)
		}
	}
	
	return $GetSectionChildsArray
}


$allRequestSuites = @()
if($requestSuite) {

	#Write-Host "FINAL SUITE LIST >>>>>>>>>>>>>>>>>>>>" $requestSuite
	foreach($suite in $requestSuite) {


		$section = $getSuitesResponseObject | where { $_.name -eq $suite}
		Write-Host sections inside the suite $section
		$allRequestSuites += $section
	}

	#Write-Host "FINAL SUITE LIST >>>>>>>>>>>>>>>>>>>>" $allRequestSuites.length
} else {

	$allRequestSuites = $getSuitesResponseObject

}

foreach($suite in $allRequestSuites) {
	
	$suiteId = $suite.id
	$suiteName = $suite.name
	
	#if($suiteId -eq 26141) {

	Write-Host "FINAL LIST >>>>>>>>>>>>>>>>>>>>" $suiteId $suiteName
	
	#GET Poject Suites Sections 
	$getSuiteSectionsUrl = $testRailUrl+"get_sections/$projectid&suite_id=$suiteId"
	#$getSuiteSectionsUrl = $testRailUrl+"get_sections/$projectid&suite_id=26141"
	#$getSuiteSectionsResponse = Invoke-RestMethod -Method GET -Uri $getSuiteSectionsUrl -Headers $table_headers -ContentType "application/json" | ConvertTo-JSON
	$getSuiteSectionsResponse = InvokeApi $getSuiteSectionsUrl "false"
	$getSuiteSectionsResponseObject = $getSuiteSectionsResponse | Out-String | ConvertFrom-Json
	
	$getSuiteSectionsResponseObject=CheckJsonParsingForValueAttribute($getSuiteSectionsResponseObject)
	
	Write-Host SuiteSection Response is $getSuiteSectionsResponseObject -Compress

	$uniqueSectionList = @()
	Write-Host "requestSectionList"   $requestSectionList
	foreach($requestSection in $requestSectionList){

		$GetSectionChilds = [System.Collections.ArrayList]@()
		Write-Host requested section is $requestSection
		$sectionId = $getSuiteSectionsResponseObject | where { $_.name -eq $requestSection}		
		Write-Host "section id"   $sectionId.id
		Write-Host "uniqueSectionList"   $getSuiteSectionsResponseObject.length
		if($sectionId.id){
		
			
			$uniqueSectionList += $sectionId.id
		
			if($GetSectionChilds.count -eq 0 ) {
			
				$GetSectionChilds = GetIdFromChildParentId($sectionId.id)
			}
			
			$uniqueSectionList += GetSectionChildsFunction($GetSectionChilds)
			
		}
		
	}
	
	$finalList = $uniqueSectionList | select -Unique
	# $finalList this to get all the possible given sections from the suites 
	
	# below code to get the all possbile cases from the given suite and sections
	
	
	Write-Host "final unique list"   $finalList
	
	$allAutomatedCaseIds = @()
	if($finalList) {
		
		foreach($uniqueSectionId in $finalList) {
	
			#GET Poject Suites Cases
			$getCasesUrl = $testRailUrl+"get_cases/$projectid&suite_id=$suiteId&section_id=$uniqueSectionId"
			#$getCasesUrl = $testRailUrl+"get_cases/$projectid&suite_id=166&section_id=$uniqueSectionId"
			Try
			{
              #$getCasesResponse = Invoke-RestMethod -Method GET -Uri $getCasesUrl -Headers $table_headers -ContentType "application/json" | ConvertTo-JSON
			  $getCasesResponse = InvokeApi $getCasesUrl "false"
			}
			Catch{
              #$getCasesResponse = Invoke-RestMethod -Method GET -Uri $getCasesUrl -Headers $table_headers -ContentType "application/json" | ConvertTo-JSON
			  $getCasesResponse = InvokeApi $getCasesUrl "false"
			}
			
			$getCasesResponseObject = $getCasesResponse | Out-String | ConvertFrom-Json
			$getCasesResponseObject=CheckJsonParsingForValueAttribute($getCasesResponseObject)
			Write-Host Case response object is "getCasesResponseObject"   $getCasesResponseObject
			Write-Host "**********************************************************************************"
			$automatedTest = $getCasesResponseObject | sort custom_automated | where {$_.custom_automated -eq 1}
			$customobjectAutomatedTestCaseArray = [PSCustomObject]@()
			
			
			Write-Host "uniqueSectionList"   $getCasesUrl
			#Write-Host "uniqueSectionList"   $getCasesResponseObject
			Write-Host "uniqueSectionList"   $getCasesResponseObject
			
			foreach($case in $getCasesResponseObject) {
			
				if($case.custom_automated -eq 1) {
					$customobjectAutomatedTestCaseArray += $case.id
					$totalcases = $totalcases + 1
				}
			}
			
			$allAutomatedCaseIds += $customobjectAutomatedTestCaseArray
			$includeAllCases = [System.Convert]::ToBoolean("false")
			
			if($automatedTest.length -gt 0){

				
			}
			
		}
		
		
				
	}else {

			if($selectOnlyfromSection -eq 'false') {
			
				Write-Host 'PICK everything'
				#GET Poject Suites Cases
				$getCasesUrl = $testRailUrl+"get_cases/$projectid&suite_id=$suiteId"
				#$getCasesResponse = Invoke-RestMethod -Method GET -Uri $getCasesUrl -Headers $table_headers -ContentType "application/json" | ConvertTo-JSON
				$getCasesResponse = InvokeApi $getCasesUrl "false"
				$getCasesResponseObject = $getCasesResponse | Out-String | ConvertFrom-Json 
				
				$getCasesResponseObject=CheckJsonParsingForValueAttribute($getCasesResponseObject)
				Write-Host Case response object is "getCasesResponseObject"   $getCasesResponseObject
				Write-Host "**********************************************************************************"
				$automatedTest = $getCasesResponseObject | sort custom_automated | where {$_.custom_automated -eq 1}
				$customobjectAutomatedTestCaseArray = [PSCustomObject]@()
				
				
				Write-Host "uniqueSectionList"   $getCasesUrl
				#Write-Host "uniqueSectionList"   $getCasesResponseObject
				Write-Host "uniqueSectionList"   $getCasesResponseObject
				
				foreach($case in $getCasesResponseObject) {
				
					if($case.custom_automated -eq 1) {
						$customobjectAutomatedTestCaseArray += $case.id
						$totalcases = $totalcases + 1
					}
				}
				
				$allAutomatedCaseIds += $customobjectAutomatedTestCaseArray
				$includeAllCases = [System.Convert]::ToBoolean("false")
				
				if($automatedTest.length -gt 0){

					
				}
				
			}
				
	}
	
		if($allAutomatedCaseIds.count -gt 0) {
			$customobject = New-Object psobject
			Add-Member -inputobject $customobject -membertype Noteproperty -name "suite_id" -value $suiteId
			Add-Member -inputobject $customobject -membertype Noteproperty -name "name" -value $suiteName
			Add-Member -inputobject $customobject -membertype Noteproperty -name "include_all" -value $includeAllCases
			Add-Member -inputobject $customobject -membertype Noteproperty -name "case_ids" -value $allAutomatedCaseIds
			
			$customobjectPlanEntriesArray += $customobject
		}
	#}
}

$properties | Add-Member -MemberType NoteProperty -Name "entries" -Value $customobjectPlanEntriesArray

Write-Host total Cases automated $totalcases
Write-Host Total number of plan entries you have are $customobjectPlanEntriesArray
$testplanbody = $properties | ConvertTo-Json -Depth 5 -Compress
Write-Host $testplanbody


	Write-Host 'Test plan not available and proceed to create a new one !!!!!!!'
	# POST
	$createTestplanUrl = $testRailUrl+"add_plan/$projectid"
	#Invoke-RestMethod -Method POST -Uri $createTestplanUrl -Headers $table_headers -ContentType "application/json" -Body $testplanbody
	$responseTestPlan = InvokeApi $createTestplanUrl "true" $testplanbody
	Write-Host $responseTestPlan	
	$testrailPlanId = CheckJsonParsingForValueAttribute($responseTestPlan)
	$requiredId = $testrailPlanId.id
	
}

Write-Host $requiredId
Write-Host "##vso[task.setvariable variable=testRailViewId]$requiredId"
