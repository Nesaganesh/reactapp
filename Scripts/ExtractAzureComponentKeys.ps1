Param([Parameter(Mandatory=$True)][string]$EnvironmentName)

Write-Output "Using EnvironmentName $EnvironmentName"
$rgs = Get-AzResourceGroup -Tag @{"EnvironmentName"="$EnvironmentName"}

Write-Output "Search returned $($rgs.Count)"
$AzureRGNames = @()

foreach ($rg in $rgs) {  
  Write-Output "Resource Group $($rg.ResourceGroupName)"
  
  foreach ($tag in $rg.tags.keys) {
    if ($tag -eq "EnvironmentName" -and $rg.tags[$tag] -eq $EnvironmentName) {
      Write-Output "Adding resource group to list $($rg.ResourceGroupName)"
      $AzureRGNames += $rg.ResourceGroupName
    }
  }
}

$secretWildcardNames = {'*-primarykey','*-url','*-masterkey','*-databaseid','*-containerid'}

foreach ($AzureRGName in $AzureRGNames) {
  $keyvaultnames = Get-AzResource -ResourceGroupName $AzureRGName -ResourceType Microsoft.KeyVault/vaults | Select-Object Name
  
  foreach ($keyvaultname in $keyvaultnames) {
    Write-Output "Name $($keyvaultname.Name)"
    
    if($keyvaultname.Name -like "sec-kvt-rqpnjrzplw") {
      Write-Output "Found a security key vault"
      $secretnames = Get-AzKeyVaultSecret -VaultName $keyvaultname.Name | Select-Object Name      

      foreach ($secretname In $secretnames) {
        switch -wildcard ($secretname.Name) {
          $secretWildcardNames {
            Write-Output "*************** Found secret $_"
            $secret = Get-AzKeyVaultSecret -VaultName $keyvaultname.Name -Name $_ -AsPlainText
            
            Write-Output "Secret Name $_ => Secret Value $secret"
            # Set-OctopusVariable -name $_ -value $secret.SecretValueText

            if ($_ -like "csm-eventhub-clientinteractions-fn-primarykey"){

              Write-Host "##vso[task.setvariable variable=ClickStreamEventHubSharedAccessKey]$secret"
              
            break
            }

          }
          Default {
            Write-Output "No known secrets have been found..."
          }
        }
      }
    }
  }
}