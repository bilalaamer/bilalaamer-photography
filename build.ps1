param(
    [string]$Root = "E:\bilalaamer-photography"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$PhotoRoot = Join-Path $Root "photos"
$OutBase   = Join-Path $Root "assets\img"
$OutThumb  = Join-Path $OutBase "thumbs"
$OutFull   = Join-Path $OutBase "full"
$OutHero   = Join-Path $OutBase "hero"
$OutJs     = Join-Path $Root "assets\js\data.js"

foreach ($d in @($OutThumb, $OutFull, $OutHero)) {
    if (Test-Path -LiteralPath $d) { Remove-Item -LiteralPath $d -Recurse -Force }
    New-Item -ItemType Directory -Force -Path $d | Out-Null
}

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
if (-not $jpegCodec) { throw "No JPEG encoder available" }

function Get-Orientation($img) {
    try {
        $pi = $img.GetPropertyItem(274)
        return [BitConverter]::ToUInt16($pi.Value, 0)
    } catch { return 1 }
}

function Apply-Orientation($img, [int]$o) {
    switch ($o) {
        2 { $img.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX) }
        3 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
        4 { $img.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipY) }
        5 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipX) }
        6 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
        7 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipX) }
        8 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
    }
}

function Export-Jpeg([string]$src, [string]$dest, [int]$maxDim, [int]$quality) {
    if (-not (Test-Path -LiteralPath $src)) { throw "Missing source: $src" }
    $img = [System.Drawing.Image]::FromFile($src)
    try {
        $o = Get-Orientation $img
        if ($o -ne 1) { Apply-Orientation $img $o }
        $w = $img.Width; $h = $img.Height
        $scale = [Math]::Min(1.0, ([double]$maxDim / [Math]::Max($w, $h)))
        $nw = [Math]::Max(1, [int][Math]::Round($w * $scale))
        $nh = [Math]::Max(1, [int][Math]::Round($h * $scale))
        $bmp = New-Object System.Drawing.Bitmap -ArgumentList $nw, $nh, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
        try {
            $g = [System.Drawing.Graphics]::FromImage($bmp)
            try {
                $g.CompositingMode   = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
                $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
                $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $rect = New-Object System.Drawing.Rectangle -ArgumentList 0, 0, $nw, $nh
                $g.DrawImage($img, $rect)
            } finally { $g.Dispose() }
            $ep = New-Object System.Drawing.Imaging.EncoderParameters -ArgumentList 1
            $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter -ArgumentList @([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)
            $bmp.Save($dest, $jpegCodec, $ep)
            $ep.Dispose()
            return @{ Width = $nw; Height = $nh }
        } finally { $bmp.Dispose() }
    } finally { $img.Dispose() }
}

function Get-Images([string]$dir) {
    if (-not (Test-Path -LiteralPath $dir)) { return @() }
    return @(Get-ChildItem -LiteralPath $dir -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Extension -match '\.(jpg|jpeg|png)$' } |
        Sort-Object FullName)
}

function Get-Skipped([string]$dir) {
    if (-not (Test-Path -LiteralPath $dir)) { return 0 }
    return @(Get-ChildItem -LiteralPath $dir -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Extension -notmatch '\.(jpg|jpeg|png)$' }).Count
}

function Get-TopFolder([string]$filePath, [string]$baseDir) {
    $rel = $filePath.Substring($baseDir.TrimEnd('\').Length).TrimStart('\')
    $parts = $rel -split '\\'
    if ($parts.Count -gt 1) { return $parts[0] }
    return ""
}

function Resolve-Cat([string]$folder, $map, [string]$default) {
    if ($folder) {
        foreach ($m in $map) {
            if ($folder -match ("^(" + $m.Rx + ")$")) { return $m.Cat }
        }
    }
    return $default
}

$wedMap = @(
    @{ Rx = "bride|dulhan"; Cat = "w-bride" },
    @{ Rx = "groom"; Cat = "w-groom" },
    @{ Rx = "couple|together"; Cat = "w-couple" },
    @{ Rx = "ceremony|nikah|nikkah|shadi|barat|walima"; Cat = "w-ceremony" },
    @{ Rx = "decor|details"; Cat = "w-decor" },
    @{ Rx = "candid"; Cat = "w-candid" },
    @{ Rx = "family"; Cat = "w-family" }
)
$portMap = @(
    @{ Rx = "auto|car|motor"; Cat = "p-auto" },
    @{ Rx = "outdoor|travel"; Cat = "p-outdoor" },
    @{ Rx = "nature"; Cat = "p-nature" },
    @{ Rx = "event|corporate"; Cat = "p-event" }
)

$heroesHome = New-Object System.Collections.ArrayList
$portfolio = New-Object System.Collections.ArrayList
$weddings = New-Object System.Collections.ArrayList
$automobile = New-Object System.Collections.ArrayList
$pets = New-Object System.Collections.ArrayList
$errors = New-Object System.Collections.ArrayList
$weddingHeroSrc = $null
$weddingHeroCat = $null
$aboutSrc = $null

Write-Host "--- Main page ---"
$mainDir = Join-Path $PhotoRoot "Main page"
$mainImgs = Get-Images $mainDir
$i = 0
foreach ($f in $mainImgs) {
    $i++
    $name = "hero-{0:00}" -f $i
    try {
        $dest = Join-Path $OutHero "$name.jpg"
        $dims = Export-Jpeg -src $f.FullName -dest $dest -maxDim 2200 -quality 82
        [void]$heroesHome.Add([ordered]@{ id = $name; alt = ""; src = "assets/img/hero/$name.jpg"; w = $dims.Width; h = $dims.Height })
        Write-Host "  OK   $name  <-  $($f.Name)"
    } catch {
        [void]$errors.Add("$name : $($_.Exception.Message)")
        Write-Warning "  FAIL $name : $($_.Exception.Message)"
    }
}

Write-Host "--- Weddings ---"
$wedDir = Join-Path $PhotoRoot "Weddings"
$wedImgs = Get-Images $wedDir
$i = 0
foreach ($f in $wedImgs) {
    $i++
    $name = "wed-{0:00}" -f $i
    $cat = Resolve-Cat (Get-TopFolder $f.FullName $wedDir) $wedMap "w-other"
    try {
        $fullDims = Export-Jpeg -src $f.FullName -dest (Join-Path $OutFull "$name.jpg") -maxDim 1600 -quality 80
        $thumbDims = Export-Jpeg -src $f.FullName -dest (Join-Path $OutThumb "$name.jpg") -maxDim 640 -quality 76
        [void]$weddings.Add([ordered]@{
            id = $name; cat = $cat; alt = ""; file = $f.Name
            thumb = "assets/img/thumbs/$name.jpg"; full = "assets/img/full/$name.jpg"
            w = $fullDims.Width; h = $fullDims.Height
            tw = $thumbDims.Width; th = $thumbDims.Height
        })
        if (-not $weddingHeroSrc) { $weddingHeroSrc = $f.FullName; $weddingHeroCat = $cat }
        elseif ($cat -eq "w-bride" -and $weddingHeroCat -ne "w-bride") { $weddingHeroSrc = $f.FullName; $weddingHeroCat = $cat }
        Write-Host "  OK   $name [$cat]  <-  $($f.Name)"
    } catch {
        [void]$errors.Add("$name : $($_.Exception.Message)")
        Write-Warning "  FAIL $name : $($_.Exception.Message)"
    }
}

Write-Host "--- Automobile ---"
$autoDir = Join-Path $PhotoRoot "Automobile"
$autoImgs = Get-Images $autoDir
$autoHeroSrc = $null
$i = 0
foreach ($f in $autoImgs) {
    $i++
    $name = "auto-{0:00}" -f $i
    try {
        $fullDims = Export-Jpeg -src $f.FullName -dest (Join-Path $OutFull "$name.jpg") -maxDim 1600 -quality 80
        $thumbDims = Export-Jpeg -src $f.FullName -dest (Join-Path $OutThumb "$name.jpg") -maxDim 640 -quality 76
        [void]$automobile.Add([ordered]@{
            id = $name; cat = "a-shoot"; alt = ""; file = $f.Name
            thumb = "assets/img/thumbs/$name.jpg"; full = "assets/img/full/$name.jpg"
            w = $fullDims.Width; h = $fullDims.Height
            tw = $thumbDims.Width; th = $thumbDims.Height
        })
        if (-not $autoHeroSrc) { $autoHeroSrc = $f.FullName }
        Write-Host "  OK   $name  <-  $($f.Name)"
    } catch {
        [void]$errors.Add("$name : $($_.Exception.Message)")
        Write-Warning "  FAIL $name : $($_.Exception.Message)"
    }
}

Write-Host "--- Pets ---"
$petDir = Join-Path $PhotoRoot "Pets"
$petImgs = Get-Images $petDir
$petHeroSrc = $null
$i = 0
foreach ($f in $petImgs) {
    $i++
    $name = "pet-{0:00}" -f $i
    try {
        $fullDims = Export-Jpeg -src $f.FullName -dest (Join-Path $OutFull "$name.jpg") -maxDim 1600 -quality 80
        $thumbDims = Export-Jpeg -src $f.FullName -dest (Join-Path $OutThumb "$name.jpg") -maxDim 640 -quality 76
        [void]$pets.Add([ordered]@{
            id = $name; cat = "pet-shoot"; alt = ""; file = $f.Name
            thumb = "assets/img/thumbs/$name.jpg"; full = "assets/img/full/$name.jpg"
            w = $fullDims.Width; h = $fullDims.Height
            tw = $thumbDims.Width; th = $thumbDims.Height
        })
        if ($f.Name -eq "DSC08881-Enhanced-NR.JPG") { $petHeroSrc = $f.FullName }
        elseif (-not $petHeroSrc) { $petHeroSrc = $f.FullName }
        Write-Host "  OK   $name  <-  $($f.Name)"
    } catch {
        [void]$errors.Add("$name : $($_.Exception.Message)")
        Write-Warning "  FAIL $name : $($_.Exception.Message)"
    }
}

Write-Host "--- About ---"
$aboutDir = Join-Path $PhotoRoot "About"
$aboutImgs = Get-Images $aboutDir
if ($aboutImgs.Count -gt 0) {
    $preferred = $aboutImgs | Where-Object { $_.Name -eq "DSC05343-Enhanced-NR.JPG" } | Select-Object -First 1
    if ($preferred) { $aboutSrc = $preferred.FullName } else { $aboutSrc = $aboutImgs[0].FullName }
    Write-Host "  OK   about  <-  $([System.IO.Path]::GetFileName($aboutSrc))"
}

Write-Host "--- Portfolio ---"
$pfDir = Join-Path $PhotoRoot "Portfolio"
$pfImgs = Get-Images $pfDir
$i = 0
foreach ($f in $pfImgs) {
    $i++
    $name = "pf-{0:00}" -f $i
    $cat = Resolve-Cat (Get-TopFolder $f.FullName $pfDir) $portMap "p-other"
    try {
        if (-not $aboutSrc) { $aboutSrc = $f.FullName }
        $fullDims = Export-Jpeg -src $f.FullName -dest (Join-Path $OutFull "$name.jpg") -maxDim 1600 -quality 80
        $thumbDims = Export-Jpeg -src $f.FullName -dest (Join-Path $OutThumb "$name.jpg") -maxDim 640 -quality 76
        [void]$portfolio.Add([ordered]@{
            id = $name; cat = $cat; alt = ""; file = $f.Name
            thumb = "assets/img/thumbs/$name.jpg"; full = "assets/img/full/$name.jpg"
            w = $fullDims.Width; h = $fullDims.Height
            tw = $thumbDims.Width; th = $thumbDims.Height
        })
        Write-Host "  OK   $name [$cat]  <-  $($f.Name)"
    } catch {
        [void]$errors.Add("$name : $($_.Exception.Message)")
        Write-Warning "  FAIL $name : $($_.Exception.Message)"
    }
}

$weddingHeroEntry = $null
if ($weddingHeroSrc) {
    try {
        $dims = Export-Jpeg -src $weddingHeroSrc -dest (Join-Path $OutHero "hero-wedding.jpg") -maxDim 2200 -quality 82
        $weddingHeroEntry = [ordered]@{ id = "hero-wedding"; alt = ""; src = "assets/img/hero/hero-wedding.jpg"; w = $dims.Width; h = $dims.Height }
    } catch {
        [void]$errors.Add("hero-wedding : $($_.Exception.Message)")
        Write-Warning "  FAIL hero-wedding : $($_.Exception.Message)"
    }
}

$autoHeroEntry = $null
if ($autoHeroSrc) {
    try {
        $dims = Export-Jpeg -src $autoHeroSrc -dest (Join-Path $OutHero "hero-automobile.jpg") -maxDim 2200 -quality 82
        $autoHeroEntry = [ordered]@{ id = "hero-automobile"; alt = ""; src = "assets/img/hero/hero-automobile.jpg"; w = $dims.Width; h = $dims.Height }
    } catch {
        [void]$errors.Add("hero-automobile : $($_.Exception.Message)")
        Write-Warning "  FAIL hero-automobile : $($_.Exception.Message)"
    }
}

$petHeroEntry = $null
if ($petHeroSrc) {
    try {
        $dims = Export-Jpeg -src $petHeroSrc -dest (Join-Path $OutHero "hero-pets.jpg") -maxDim 2200 -quality 82
        $petHeroEntry = [ordered]@{ id = "hero-pets"; alt = ""; src = "assets/img/hero/hero-pets.jpg"; w = $dims.Width; h = $dims.Height }
    } catch {
        [void]$errors.Add("hero-pets : $($_.Exception.Message)")
        Write-Warning "  FAIL hero-pets : $($_.Exception.Message)"
    }
}

$aboutEntry = $null
if ($aboutSrc) {
    try {
        $dims = Export-Jpeg -src $aboutSrc -dest (Join-Path $OutHero "about.jpg") -maxDim 2200 -quality 82
        $aboutEntry = [ordered]@{ id = "about"; alt = ""; src = "assets/img/hero/about.jpg"; w = $dims.Width; h = $dims.Height }
    } catch {
        [void]$errors.Add("about : $($_.Exception.Message)")
        Write-Warning "  FAIL about : $($_.Exception.Message)"
    }
}

$data = [ordered]@{
    heroes = [ordered]@{
        home       = $heroesHome
        wedding    = $weddingHeroEntry
        automobile = $autoHeroEntry
        pets       = $petHeroEntry
        about      = $aboutEntry
    }
    portfolio  = $portfolio
    weddings   = $weddings
    automobile = $automobile
    pets       = $pets
}

$json = $data | ConvertTo-Json -Depth 6
$js = "window.SITE_DATA = " + $json + ";" + [Environment]::NewLine
[System.IO.File]::WriteAllText($OutJs, $js, (New-Object System.Text.UTF8Encoding($false)))

# --- mirror generated assets into the React app (if present) ---
$AppRoot = Join-Path $Root "app"
if (Test-Path -LiteralPath $AppRoot) {
    $AppPublic = Join-Path $AppRoot "public\assets"
    New-Item -ItemType Directory -Force -Path (Join-Path $AppPublic "js") | Out-Null
    robocopy $OutBase (Join-Path $AppPublic "img") /E /NFL /NDL /NJH /NJS /NP | Out-Null
    Copy-Item -LiteralPath $OutJs (Join-Path $AppPublic "js\data.js") -Force
    $favSrc = Join-Path $Root "favicon.svg"
    if (Test-Path -LiteralPath $favSrc) { Copy-Item -LiteralPath $favSrc (Join-Path $AppPublic "favicon.svg") -Force }
    Write-Host "Assets mirrored to app\public\assets for the React build."
}

Write-Host ""
Write-Host ("Done. Main page: {0}, Weddings: {1}, Automobile: {2}, Pets: {3}, Portfolio: {4}, Failures: {5}" -f `
    $heroesHome.Count, $weddings.Count, $automobile.Count, $petImgs.Count, $pfImgs.Count, $errors.Count)
if ($errors.Count -gt 0) {
    Write-Host "Failures:"
    $errors | ForEach-Object { Write-Host "  $_" }
}
$skipped = (Get-Skipped (Join-Path $PhotoRoot "Main page")) + (Get-Skipped (Join-Path $PhotoRoot "Weddings")) + (Get-Skipped (Join-Path $PhotoRoot "Automobile")) + (Get-Skipped (Join-Path $PhotoRoot "Portfolio"))
if ($skipped -gt 0) {
    Write-Host ""
    Write-Warning "$skipped file(s) with unsupported extensions were skipped (only JPG / JPEG / PNG are supported; convert HEIC or RAW files first)."
}
if ($errors.Count -gt 0) { exit 1 }
