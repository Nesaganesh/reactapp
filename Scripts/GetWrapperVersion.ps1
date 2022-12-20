param (
    $TargetParam,
    $VariableGroupId
)

Write-Host "Our Target is >>>>>>> " $TargetParam

$packageName = ''
$url = ''
$wrapperName = ''
if($TargetParam -eq 'IOSNative') {
    $packageName="SpinSport.Client.Launcher.IOS.Automation"
    $url = "https://proget.derivcosports.com/feeds/dev/SpinSport.Client.Launcher.IOS.Automation/"
    $wrapperName = "file=@Betway_Sports_app.ipa"
}else {
    $packageName="SpinSport.Client.Launcher.Android.Automation"
    $url = "https://proget.derivcosports.com/feeds/dev/SpinSport.Client.Launcher.Android.Automation/"
    $wrapperName = "file=@android.deviceteam.com.betway.sports.debug-Signed.apk"
}
Write-Host "Our Package is >>>>>>> " $packageName

$response = Invoke-WebRequest $url
$result = $response.Links | Select href
Write-Host $result 

if($TargetParam -eq 'IOSNative') {
	$result1 = $result[2].href.replace('/log-in?ReturnUrl=%2Ffeeds%2Fdev%2FSpinSport.Client.Launcher.IOS.Automation%2F', '')
}else {
	$result1 = $result[2].href.replace('/log-in?ReturnUrl=%2Ffeeds%2Fdev%2FSpinSport.Client.Launcher.Android.Automation%2F', '')
}

Write-Host "result 1 >>>>>>>> " $result1
$result2 = $result1.replace('-Sports%2522', '')

$version=$result2
Write-Host "Result 2 >>>>>>>>>> "$version

$removeFolder=-join($packageName,".$version")

Write-Host $removeFolder

wget https://dist.nuget.org/win-x86-commandline/latest/nuget.exe

mono nuget.exe install $packageName -Version $version -Source https://proget.derivcosports.com/nuget/dev/

cd $removeFolder

$request_cmd = curl -u "derivco2:YsYLxvQVA5nDmuvK72aa" -X POST "https://api-cloud.browserstack.com/app-automate/upload" -F $wrapperName

Write-Host "My Reponse url is " $request_cmd

cd ..

rm -r $removeFolder

ls

$nativeapppathvalue = $request_cmd.SubString(12, 45)

Write-Host "Native app path new value "$nativeapppathvalue

$scriptFilePath = "$($env:SYSTEM_DEFAULTWORKINGDIRECTORY)/_AutomationScripts/drop/UpdateLibraryVariable.ps1"
Write-Host "Directory >>>>>>>>>>> " $scriptFilePath
& $scriptFilePath -NewValue $nativeapppathvalue -VariableName 'NativeAppPath' -VariableGroupId $VariableGroupId

