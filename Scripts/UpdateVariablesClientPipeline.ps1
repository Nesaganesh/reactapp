param (
    $OctopusEnvironment,
    $Target
)

Write-Output "OctopusEnvironment -> $OctopusEnvironment"
Write-Output "Target -> $Target "

$environmentName = ''
$project = ''
$qaHubProjectName = ''

Write-Host "##vso[task.setvariable variable=Target]$Target"
if("$Target" -eq "Chrome")
{

    Write-Host "##vso[task.setvariable variable=Target]$Target"
}

if("$Target" -eq "IOSSafari")
{
    Write-Host "##vso[task.setvariable variable=Target]$Target"
}

if("$Target" -eq "Android")
{
    Write-Host "##vso[task.setvariable variable=Target]$Target"
}


if("$OctopusEnvironment" -eq "Pickles-the-Dog")
{
    $environmentName = 'pickles-the-dog'
    $project = 'SpinSport Client Sports'
    $qaHubProjectName = 'SpinSportClientSports'
}

if("$OctopusEnvironment" -eq "Harambe-the-Gorilla")
{
    $environmentName = 'harambe-the-gorilla'
    $project = 'SpinSport Client Platform'
    $qaHubProjectName = 'SpinSportClientPlatform'
}



Write-Host "Env $environmentName"
Write-Host "project $project"
Write-Host "qaHubProjectName $qaHubProjectName"

Write-Host "##vso[task.setvariable variable=EnvironmentConfiguration]$environmentName"
Write-Host "##vso[task.setvariable variable=Project]$project"
Write-Host "##vso[task.setvariable variable=QaHubProjectName]$qaHubProjectName"