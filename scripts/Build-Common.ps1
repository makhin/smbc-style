#Requires -Version 5.1
# Shared implementation; run Build-Clean.ps1 or Build-Updated.ps1.
Set-StrictMode -Version Latest

function Invoke-ProjectNpm {
    param([string] $Project, [string[]] $Arguments)

    Write-Host "[$(Split-Path $Project -Leaf)] npm $($Arguments -join ' ')" -ForegroundColor Cyan
    Push-Location -LiteralPath $Project
    try {
        # npm.cmd avoids npm.ps1 execution-policy problems on Windows.
        & $script:SmbcNpm @Arguments | Out-Host
        if ($LASTEXITCODE -ne 0) {
            throw "npm $($Arguments -join ' ') failed in '$Project' (exit $LASTEXITCODE)."
        }
    }
    finally { Pop-Location }
}

function New-ProjectArchive {
    param([string] $Project)

    $manifest = Get-Content -LiteralPath (Join-Path $Project 'package.json') -Raw | ConvertFrom-Json
    $filename = '{0}-{1}.tgz' -f ($manifest.name -replace '^@', '' -replace '/', '-'), $manifest.version
    # Normal pack runs the project's prepack build, including type checking.
    Invoke-ProjectNpm $Project @('pack')
    $archive = Join-Path $Project $filename
    if (-not (Test-Path -LiteralPath $archive -PathType Leaf)) {
        throw "npm pack did not create '$archive'."
    }
    # npm runs inside a sibling consumer, so its archive path starts with .. .
    return Join-Path (Join-Path '..' (Split-Path $Project -Leaf)) $filename
}

function Install-ProjectDependencies {
    param([string] $Project, [string[]] $LocalPackages = @(), [string] $SaveFlag = '--save-prod')

    if ($LocalPackages.Count -gt 0) {
        # A newly built same-version archive has a new integrity hash. Refresh
        # the manifest/lock before ci; ci alone would reject the old integrity.
        Invoke-ProjectNpm $Project (@('install', '--package-lock-only', '--ignore-scripts', '--include=dev', $SaveFlag) + $LocalPackages)
    }
    # ci replaces node_modules and installs exactly the refreshed lockfile.
    Invoke-ProjectNpm $Project @('ci', '--include=dev')
}

function Invoke-SmbcBuild {
    param([switch] $Clean, [string] $Update = 'All')

    $npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
    if (-not $npmCommand) { $npmCommand = Get-Command npm -ErrorAction Stop }
    $script:SmbcNpm = $npmCommand.Source
    $node = Get-Command node -ErrorAction Stop
    $nodeVersionText = & $node.Source --version
    if ($LASTEXITCODE -ne 0) { throw 'Could not determine the Node.js version.' }
    $nodeVersion = [version] ($nodeVersionText.Trim() -replace '^v', '')
    if ($nodeVersion -lt [version] '22.12.0') { throw 'Node.js 22.12 or newer is required.' }

    $theme = Join-Path '.' 'devextreme-theme'
    $ui = Join-Path '.' 'smbc-ui'
    $app = Join-Path '.' 'smbc-style'
    foreach ($project in @($theme, $ui, $app)) {
        foreach ($file in @('package.json', 'package-lock.json')) {
            if (-not (Test-Path -LiteralPath (Join-Path $project $file) -PathType Leaf)) {
                throw "Missing '$file' in '$project'. All three repositories must be sibling directories."
            }
        }
        if (-not $Clean -and -not (Test-Path -LiteralPath (Join-Path $project 'node_modules') -PathType Container)) {
            throw "Dependencies are missing in '$project'. Run Build-Clean.ps1 first."
        }
    }

    $archives = @()
    if ($Clean -or $Update -ne 'Ui') {
        if ($Clean) { Install-ProjectDependencies $theme }
        $themeArchive = New-ProjectArchive $theme
        if ($Clean) {
            Install-ProjectDependencies $ui @($themeArchive) '--save-dev'
        }
        else {
            # Keep the registry peer range; only the UI devDependency is local.
            Invoke-ProjectNpm $ui @('install', '--include=dev', '--save-dev', $themeArchive)
        }
        $archives += $themeArchive
    }

    # Theme updates also rebuild UI: Tailwind compiles against the theme bridge.
    $archives += New-ProjectArchive $ui
    if ($Clean) {
        Install-ProjectDependencies $app $archives
    }
    else {
        Invoke-ProjectNpm $app (@('install', '--include=dev', '--save-prod') + $archives)
    }
    Invoke-ProjectNpm $app @('run', 'lint')
    # build already runs tsc -b before vite build.
    Invoke-ProjectNpm $app @('run', 'build')
    Write-Host "Build complete: $(Join-Path $app 'dist')" -ForegroundColor Green
}
