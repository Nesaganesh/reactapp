param (
    $TeamName,
    $ColourBackground,
    $SendMessage,
    $IconLocation,
    $WebHookUrl,
    $ErrorMessage,
    $ReleaseId
)


$message = @{
    "sender"= $TeamName
    "summary"= "TestingPost"
    "themeColor"= $ColourBackground
    "title"= $TeamName
    "text"= $null
    "sections"= @(
        @{
            "title"= $null
            "text"= $null
            "markdown"= $true
            "images"= $null
            "activityTitle"= ($SendMessage -eq $null -or $SendMessage -eq '') ?  $ErrorMessage : $SendMessage
            "activitySubtitle"= "https://dev.azure.com/Derivco/Sports-ClientQA/_releaseProgress?releaseId="+ $ReleaseId
            "activityText"= ""
            "activityImage"= $IconLocation
            "activityImageType"= "article"
        })
    "potentialAction"= @()
} 

$url = $WebHookUrl

$body = $message | ConvertTo-Json -Compress

Write-Host "URL: $url"

Write-Host "body: $body"

if($SendMessage -ne $null -and $SendMessage -ne ''){

Write-Host "URL: $url"

Write-Host "body: $body"

Invoke-RestMethod -Method Post -Uri $url -Headers $null -ContentType "application/json" -Body $body | Out-Null

}elseif(($SendMessage -eq $null -or $SendMessage -eq '') -and $ErrorMessage -ne $null -and $ErrorMessage -ne ''){

#Assign different team chat to receive errors irrespective of expected error list

$url = $WebHookUrl

Invoke-RestMethod -Method Post -Uri $url -Headers $null -ContentType "application/json" -Body $body | Out-Null

}