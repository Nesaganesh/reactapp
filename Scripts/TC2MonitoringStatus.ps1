[CmdletBinding()]
Param(
	$RequestEnvironments,
	[string]$collectionurl = "https://vsrm.dev.azure.com/Derivco",
	[string]$projectName = "Sports-ClientQA",
	[string]$user = "nesa.ganesh@derivco.co.uk",
	[string]$token = "oma63udosvjgxhvr3r2325zppdsnh5kzvasx2hsa2unl6effjl5q"
)

#$requestEnvironmentsParam = $RequestEnvironments #get this from TC parameter

$requestEnvironmentsParam = @('Login UK Sports Home', 'PlaceBet UK')  

$collectionurl = "https://vsrm.dev.azure.com/Derivco"
$projectName = "Sports-ClientQA"
$releaseinfo = "definitionId=125"

# Base64-encodes the Personal Access Token (PAT) appropriately
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f $user,$token)))
$uri = "$($collectionurl)/$($projectName)/_apis/release/releases?$($releaseinfo)"

Write-Output $uri
$result = Invoke-RestMethod -Uri $uri -Method Get -ContentType "application/json" -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)}

$releaseList = @()
$i=0
foreach ($line in $result.value) {
	if($i -le 2){
		$releaseList += $line.id
		$i++		
	 }
}

Write-Output $releaseList


$releaseStatus = @()
foreach ($line in $releaseList) {
	
	
	$definitionInfo = $line
	$uri = "$($collectionurl)/$($projectName)/_apis/release/releases/$($definitionInfo)"
	#Write-Output $uri
	$result = Invoke-RestMethod -Uri $uri -Method Get -ContentType "application/json" -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)}
	#Write-Output $result.environments
	$arrayEnvironmentNames = @();
	foreach ($line in $result.environments) { $arrayEnvironmentNames += $line.name  }
	#Write-Output $arrayEnvironmentNames
	
	foreach($environmentName in $requestEnvironmentsParam) 
	{
		if($arrayEnvironmentNames -like $environmentName) 
		{
			foreach ($line in $result.environments) {
		
				if($environmentName -like $line.name) {
					$releaseStatus += $line.status
					Write-Output $line.name $line.status
				}
			}
		
		}else {
			
			Write-Output " NOT Matched  " $environmentName
			$releaseStatus += "rejected"
		}
	}
	
	
}

if($releaseStatus.Length -eq 0 -or $releaseStatus -contains "rejected"){
	
	throw "Last 3 releases under TC2 Monitoring system has status Rejected/Failed...... So cannot execute tests for now ...."
}

Write-Output "All TC2 environments looks good"


