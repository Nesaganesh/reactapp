param (
    $NewValue,
    $VariableName,
    $VariableGroupId
)

if($NewValue -ne $null -and $NewValue -ne '' -and $VariableName -ne $null -and $VariableName -ne ''){
Write-Host "Starting to update below library variables"

Write-Host "NewValue : $NewValue"
Write-Host $VariableName
Write-Host "VariableGroupId:$VariableGroupId"

$url = "$($env:SYSTEM_TEAMFOUNDATIONCOLLECTIONURI)$env:SYSTEM_TEAMPROJECTID/_apis/distributedtask/variablegroups/$($VariableGroupId)?api-version=5.1-preview.1"

Write-Host "URL: $url"

$authHeader = @{Authorization = "Bearer $env:SYSTEM_ACCESSTOKEN"}

$definition = Invoke-RestMethod -Uri $url -Headers $authHeader

Write-Host "Pipeline = $($definition | ConvertTo-Json -Depth 100)"

$definition.variables.$($VariableName).Value = "$($NewValue)"

$definitionJson = $definition | ConvertTo-Json -Depth 100 -Compress

Invoke-RestMethod -Method Put -Uri $url -Headers $authHeader -ContentType "application/json" -Body ([System.Text.Encoding]::UTF8.GetBytes($definitionJson)) | Out-Null

}
