Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$w = 1200; $h = 630

$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Background
$bgColor = [System.Drawing.Color]::FromArgb(255, 10, 10, 11)
$g.Clear($bgColor)

# Brand-red radial glow (top right), smooth via PathGradientBrush
$brand = [System.Drawing.Color]::FromArgb(225, 29, 42)
$cx = $w * 0.86
$cy = $h * 0.18
$r = 520
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse([float]($cx - $r), [float]($cy - $r), [float]($r * 2), [float]($r * 2))
$pgBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush($path)
$pgBrush.CenterColor = [System.Drawing.Color]::FromArgb(220, $brand.R, $brand.G, $brand.B)
$pgBrush.SurroundColors = [System.Drawing.Color[]]@([System.Drawing.Color]::FromArgb(0, $brand.R, $brand.G, $brand.B))
$blend = New-Object System.Drawing.Drawing2D.Blend(3)
$blend.Factors = [float[]]@(0.0, 0.55, 1.0)
$blend.Positions = [float[]]@(0.0, 0.55, 1.0)
$pgBrush.Blend = $blend
$g.FillPath($pgBrush, $path)
$pgBrush.Dispose()
$path.Dispose()

# Top brand bar
$barBrush = New-Object System.Drawing.SolidBrush $brand
$g.FillRectangle($barBrush, 0, 0, $w, 10)
$barBrush.Dispose()

# Logo (left)
$logoPath = Join-Path $root "src\assets\auto-style-logo.png"
$logo = [System.Drawing.Image]::FromFile($logoPath)
$logoSize = 260
$logoX = 100
$logoY = 90
$g.DrawImage($logo, [float]$logoX, [float]$logoY, [float]$logoSize, [float]$logoSize)
$logo.Dispose()

# Title
$titleFont = New-Object System.Drawing.Font("Arial", 58, [System.Drawing.FontStyle]::Bold)
$whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 245, 245, 244))
$g.DrawString("AUTO STYLE", $titleFont, $whiteBrush, [float]90, [float]390)
$titleFont.Dispose()

# Subtitle line 1
$subFont = New-Object System.Drawing.Font("Arial", 24, [System.Drawing.FontStyle]::Regular)
$mutedBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 168, 168, 168))
$g.DrawString("Accessoires Automobiles Premium", $subFont, $mutedBrush, [float]92, [float]470)

# Subtitle line 2 (brand-colored)
$brandBrush = New-Object System.Drawing.SolidBrush $brand
$g.DrawString("Livraison 69 Wilayas . Paiement a la livraison", $subFont, $brandBrush, [float]92, [float]508)

$subFont.Dispose()
$mutedBrush.Dispose()
$brandBrush.Dispose()
$whiteBrush.Dispose()
$g.Dispose()

$outPath = Join-Path $root "public\og-image.png"
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Output "Saved: $outPath"
