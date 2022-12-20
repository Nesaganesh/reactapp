[CmdletBinding()]
Param(
	[string]$RequestEnvironment,
	[string]$collectionurl = "https://vsrm.dev.azure.com/Derivco",
	[string]$projectName = "Sports-ClientQA",
	[string]$user = "deepanshu.verma@derivco.co.uk",
	[string]$token = "mszzk4reu4riymbfl6bn4ji7f2ckgmmnqwtxdtasmhym4zdvo4sa",
	[int]$definitionId = 241
)

$body = @"

{
    "definitionId": $($definitionId)
}
"@

### Base64-encodes the Personal Access Token (PAT) appropriately
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f $user,$token)))
$uri = "$($collectionurl)/$($projectName)/_apis/release/releases?api-version=6.0"

Write-Output $uri
Write-Output $body
$result = Invoke-RestMethod -Uri $uri -Method Post -ContentType "application/json" -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -Body $body

Write-Host "Result = $($result | ConvertTo-Json -Depth 100)"

#### Check Status


$releaseResult = Invoke-RestMethod -Uri $uri -Method Get -ContentType "application/json" -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)}

Write-Host "Result = $($result | ConvertTo-Json -Depth 100)"

$definitionInfo = $releaseResult.value[0].id

Write-Output $definitionInfo

Do {

	$uri = "$($collectionurl)/$($projectName)/_apis/release/releases/$($definitionInfo)"
	#Write-Output $uri
	$result = Invoke-RestMethod -Uri $uri -Method Get -ContentType "application/json" -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)}


	foreach ($line in $result.environments) {
		
		if($line.name -like "Login and Bet Placement UK Sports Home") {
			$releaseStatus = $line.status
			$environmentInfo = $line.id
			Write-Output $line.name $line.status


		}
	}

} while ($releaseStatus -like "inProgress" || $releaseStatus -like "queued") 

if($releaseStatus -like "failed"){
	throw "Login and Betting failed for all UK Dead animals Environment(they are alive), cannot proceed"
}

if ($releaseStatus -like "rejected" || $releaseStatus -like "failed" ) {
	$deploymentUri = "$($collectionurl)/$($projectName)/_apis/release/releases/$($definitionInfo)/environments/$($environmentInfo)"
	$resultDeploy = Invoke-RestMethod -Uri $deploymentUri -Method Get -ContentType "application/json" -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)}

	foreach ($step in $resultDeploy.deploySteps) {

		foreach($phase in $step.releaseDeployPhases)
		{
			foreach( $job in $phase.deploymentJobs) 
			{
				if ($job.name.Contains($RequestEnvironment.ToLower())) {
					$environmentStatus = $job.status
				}
			}
		}
		
	}
} else {
	$environmentStatus = "succeeded"
}

# "Agent job Multiplier: pickles-the-dog"

if ($environmentStatus -like "failed" || $environmentStatus -like "rejected") {
	throw "Login and Betting failed for UK $($RequestEnvironment) Environment(they are alive), cannot proceed"
}


Write-Output "ALl Dead animals looks dead . Continuing with test run ..."
