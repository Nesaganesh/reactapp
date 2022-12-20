Param(
    [string]$environmentConfigurationParam = ""
)

if($environmentConfigurationParam -eq 'staging') {
				
	$domainUrl = "https://staging.betway.com/"
} elseif($environmentConfigurationParam -eq 'live') {
				
	$domainUrl = "https://sports.betway.com/"
} elseif($environmentConfigurationParam -ne 'staging') {
				
	$domainUrl = "https://m-"+$environmentConfigurationParam+".spinsport.ludologic.com/"
}


$value = @{
	langId="en"
}	
$json = $value | ConvertTo-Json

$environmentUrlEndpoint = $domainUrl + "wapi/Version/GetVersion/"
Write-Host $json
Write-Host $environmentUrlEndpoint

try{

$responseClientVersion = Invoke-RestMethod -Method POST -Uri $environmentUrlEndpoint -ContentType "application/json" -Body $json 


Write-Host $responseClientVersion
Write-Host $responseClientVersion.Version

$clientVersion = $responseClientVersion.Version

Write-Host "##vso[task.setvariable variable=ClientVersion]$clientVersion"
}catch{
	$clientVersion= "Unknown"
	Write-Host "##vso[task.setvariable variable=ClientVersion]$clientVersion"
}
