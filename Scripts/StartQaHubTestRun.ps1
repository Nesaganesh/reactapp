[CmdletBinding()]
param (
    $QAHubBaseUri,
	$Tag,
	$Milestone,
	$ScrumTeamName,
	$ComponentName,
	$ProjectName
)

$ScrumTeams = New-Object 'System.Collections.Generic.Dictionary[String,String]'
$Projects = New-Object 'System.Collections.Generic.Dictionary[String,String]'
$Components = New-Object 'System.Collections.Generic.Dictionary[String,String]'

$ScrumTeams['Markets'] = '1'
$ScrumTeams['Red'] = '3'
$ScrumTeams['Green'] = '4'
$ScrumTeams['Blue'] = '5'
$ScrumTeams['Yellow'] = '6'
$ScrumTeams['Framework'] = '7'
$ScrumTeams['Integrations'] = '8'
$ScrumTeams['Homerun'] = '9'
$ScrumTeams['Touchdown'] = '10'
$ScrumTeams['Lobby'] = '11'
$ScrumTeams['Native'] = '12'
$ScrumTeams['California'] = '13'
$ScrumTeams['Flamingo'] = '30'
$ScrumTeams['Olympus'] = '31'
$ScrumTeams['Texas'] = '32'
$ScrumTeams['RegulatedMarkets'] = '33'
$ScrumTeams['Games'] = '35'
$ScrumTeams['TestOps'] = '36'


$Projects['TestRailTestProj'] = '2'
$Projects['SpinSportServices'] = '3'
$Projects['SpinSportClientBetting'] = '4'
$Projects['SpinSportClientSports'] = '5'
$Projects['SpinSportClientLobby'] = '6'
$Projects['SpinSportAdmin'] = '7'
$Projects['SpinSportNative'] = '8'
$Projects['SpinSportDashboardArchived'] = '9'
$Projects['SpinSportClientFrameworkOld'] = '10'
$Projects['SpinSportClientIntegrations'] = '11'
$Projects['RegulatedMarkets'] = '13'
$Projects['SpinSportClientPlatformArchive'] = '14'
$Projects['SpinSportOsiris'] = '15'
$Projects['SpinSportDashboard'] = '16'
$Projects['SpinSportClientCasino'] = '17'
$Projects['SpinSportClientPlatform'] = '18'
$Projects['TestOps'] = '19'
$Projects['SpinSportServicesClientServerApi'] = '20'

$Components['unspecified'] = '0'
$Components['backend'] = '1'
$Components['frontend'] = '2'
$Components['component'] = '3'
$Components['synthetic'] = '4'
$Components['integration'] = '5'


function GetScrumId([String] $ScrumName){
    
    
        if ($ScrumTeams.ContainsKey($ScrumName)) 
        {
            return $ScrumTeams[$ScrumName]
        }
        else
        {
        $message = "No ScrumId for ScrumTeam name '{0}'" -f $ScrumName
            throw $message
        }
    
}

function GetProjectId([String] $ProjectName){
    
    
        if ($Projects.ContainsKey($ProjectName)) 
        {
            return $Projects[$ProjectName]
        }
        else
        {
        $message = "No ProjectId for Project name '{0}'" -f $ProjectName
            throw $message
        }
    
}

function GetComponentId([String] $ComponentName){
    
    
        if ($Components.ContainsKey($ComponentName)) 
        {
            return $Components[$ComponentName]
        }
        else
        {
        $message = "No ComponentId for Component name '{0}'" -f $ComponentName
            throw $message
        }
    
}

function StartTestRun([String] $QAHubBaseUri, [String] $Tag, [String] $Milestone, [String] $ScrumTeamName, [String] $ComponentName, [String] $ProjectName)
 {
    $startTime=[int64](([datetime]::UtcNow)-(get-date "1/1/1970")).TotalMilliseconds
    $guid = [guid]::NewGuid().Guid

    Write-Host "Getting ScrumTeamId for Scrum team name = $ScrumTeamName"
    $scrumTeamId =  GetScrumId -ScrumName $ScrumTeamName
    Write-Host "$ScrumTeamName -> $scrumTeamId"

    Write-Host "Getting ProjectId for Project name = $ProjectName"
    $projectId =  GetProjectId -ProjectName $ProjectName
    Write-Host "$ProjectName -> $projectId"

    Write-Host "Getting ComponentId for Component name = $ComponentName"
    $componentId =  GetComponentId -ComponentName $ComponentName
    Write-Host "$ComponentName -> $componentId"

    Write-Host "StartTime in ms -> $startTime"
    Write-Host "Guid -> $guid"
 
    $uri = "{0}/Tests/runs/{1}/start/{2}?tag={3}&milestone={4}&scrumTeam={5}&component={6}&projectId={7}" -f $QAHubBaseUri,$guid,$startTime,$Tag,$Milestone,$scrumTeamId,$componentId,$projectId
    Write-Host "Uri to StartRun -> $uri"
    $Response = Invoke-WebRequest -Method 'GET' -UseBasicParsing -Uri $uri
    Write-Host $Response

    return [string]$guid
}


$guid = StartTestRun -QAHubBaseUri $QAHubBaseUri -Tag $Tag -Milestone $Milestone -ScrumTeamName $ScrumTeamName -ComponentName $ComponentName -ProjectName $ProjectName
Write-Host "Saving guid $guid into variable TestRunGuid"
Write-Host "##vso[task.setvariable variable=TestRunGuid]$guid"
