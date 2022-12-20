

[CmdletBinding()]
param (
    $RequestProjectParam,
	$MilestoneParam
)

# Data prep
$testRailUrl = 'https://testrail.ludologic.com/index.php?/api/v2/'
$requestProject = $RequestProjectParam #get this from TC parameter
$requestMilestone = $MilestoneParam #get this from TC parameter

# Basci Authorization
$user = 'nesa.ganesh@derivco.co.uk' #get this from TC parameter
$pass = 'cSgmfb.m4wekNt8Tty50-DH8oNkX9EBlHRHr4DVPT' #get this from TC parameter

$pair = "$($user):$($pass)"
$encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($pair))
$basicAuthValue = "Basic $encodedCreds"

# setting Headers
$table_headers = @{
"Authorization" = $basicAuthValue
"Content-Type" = "application/json"
}

#set values
$projectid = '0';
$milestoneId = '0';

function InvokeApi([string]$ApiUrl, [string]$IsPost, $BodyInfo) {

	$Stoploop = $false
	[int]$Retrycount = "0"

 	do {			
		Try {
			if ($IsPost -eq "true") {
				Write-Host "BodyInfo " $BodyInfo
				$invokeApiResult = Invoke-RestMethod -Method POST -Uri $ApiUrl -Headers $table_headers -ContentType "application/json"
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

# GET Milestone id
$milestoneUrl = $testRailUrl+"get_milestones/$projectid&is_completed=0"
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


#GET Poject TestPlans
$getTestPlanUrl = $testRailUrl+"get_plans/$projectid"
$getTestPlanResponse = InvokeApi $getTestPlanUrl "false"
$getTestPlanResponseObject = $getTestPlanResponse | Out-String | ConvertFrom-Json
$getTestPlanResponseObject=CheckJsonParsingForValueAttribute($getTestPlanResponseObject)
$allTestPlans = $getTestPlanResponseObject
Write-Host "Total Number of TestPlans " $allTestPlans.count


function CloseTestPlans($allTestPlans)
{
	if($allTestPlansWithDevops.count > 0) {
	
		foreach($testPlan in $allTestPlans) {

			$planId = $testPlan.id
			$planName = $testPlan.name
			
			#Close Poject Test Plan
			$getClosePlanUrl = $testRailUrl+"close_plan/$planId"
			Write-Host $getClosePlanUrl
			$getClosePlanResponse = InvokeApi $getClosePlanUrl "true"
			Write-Host $getClosePlanResponse
			Write-Host "Given Plan id $planId is closed with plan name $planName"
		}
	}else {
		Write-Host "Since Test Plans are not created before day before yesterday... so not closing the test plan"
	}
}

function GetTestPlans($testPlanNameString)
{
	Write-Host $testPlanNameString
	$allTestPlansWithDevops = $allTestPlans | where { ($_.created_on -lt $yesterdayMilliSeconds) -and ($_.is_completed -eq [System.Convert]::ToBoolean("False")) -and($_.milestone_id -eq $milestoneId) -and ($_.name.Contains($testPlanNameString))}
	
	Write-Host "After the filter with milestone, is_completed false and completed_on less than yesterday " $allTestPlansWithDevops.count
	
	return $allTestPlansWithDevops

}

# TestPlans which are created 2 days before will only be closed 
$yesterdayMilliSeconds = (New-TimeSpan -Start (Get-Date "01/01/1970") -End (Get-Date).AddDays(-2)).TotalSeconds
Write-Host $yesterdayMilliSeconds

$testPlanNames = @("_Regression_")

foreach($testPlanNameString in $testPlanNames) {

	$allTestPlansWithDevops = GetTestPlans($testPlanNameString)

	CloseTestPlans($allTestPlansWithDevops)
}



