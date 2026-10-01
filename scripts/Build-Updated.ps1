#Requires -Version 5.1
<#
.SYNOPSIS
Refreshes local packages using existing dependencies and builds smbc-style.
.EXAMPLE
.\Build-Updated.ps1 -Update Ui
.EXAMPLE
.\Build-Updated.ps1 -Update Theme
.EXAMPLE
.\Build-Updated.ps1
#>
[CmdletBinding()]
param(
    [ValidateSet('All', 'Theme', 'Ui')]
    [string] $Update = 'All'
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'Build-Common.ps1')
Push-Location -LiteralPath $PSScriptRoot
try { Invoke-SmbcBuild -Update $Update }
finally { Pop-Location }
