#Requires -Version 5.1
<#
.SYNOPSIS
Installs all three sibling projects from scratch and builds smbc-style.
.EXAMPLE
.\Build-Clean.ps1
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'Build-Common.ps1')
Push-Location -LiteralPath $PSScriptRoot
try { Invoke-SmbcBuild -Clean }
finally { Pop-Location }
