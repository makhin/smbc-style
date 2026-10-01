#Requires -Version 5.1
<#
.SYNOPSIS
Refreshes local packages using existing dependencies and builds smbc-style.
.EXAMPLE
.\scripts\Build-Updated.ps1 -Update Ui
.EXAMPLE
.\scripts\Build-Updated.ps1 -Update Theme
.EXAMPLE
.\scripts\Build-Updated.ps1
#>
[CmdletBinding()]
param(
    [ValidateSet('All', 'Theme', 'Ui')]
    [string] $Update = 'All',
    [string] $ProjectsRoot = (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent)
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'Build-Common.ps1')
Invoke-SmbcBuild -ProjectsRoot $ProjectsRoot -Update $Update
