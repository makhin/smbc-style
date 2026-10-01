#Requires -Version 5.1
<#
.SYNOPSIS
Installs all three sibling projects from scratch and builds smbc-style.
.EXAMPLE
.\scripts\Build-Clean.ps1
#>
[CmdletBinding()]
param(
    [string] $ProjectsRoot = (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent)
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'Build-Common.ps1')
Invoke-SmbcBuild -ProjectsRoot $ProjectsRoot -Clean
