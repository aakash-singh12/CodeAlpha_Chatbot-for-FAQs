# ==========================================================================
# Aetheris Voyage - Native Windows PowerShell Web Server
# Serves local frontend files on http://localhost:8000 with CORS and no-cache
# ==========================================================================

$Port = 8000
$RootDirectory = $PSScriptRoot
if (-not $RootDirectory) { $RootDirectory = $pwd.Path }

# Build and start HTTP Listener
$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add("http://localhost:$Port/")

try {
    $Listener.Start()
    Write-Host "=================================================================" -ForegroundColor Cyan
    Write-Host "   Aetheris Voyage Space Customer Uplink Initialized (PowerShell)" -ForegroundColor Cyan
    Write-Host "=================================================================" -ForegroundColor Cyan
    Write-Host "   Launch URL  : http://localhost:$Port/" -ForegroundColor Green
    Write-Host "   Directory   : $RootDirectory" -ForegroundColor Yellow
    Write-Host "   Status      : Server online! Press Ctrl+C in terminal to stop." -ForegroundColor White
    Write-Host "=================================================================" -ForegroundColor Cyan

    while ($Listener.IsListening) {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response

        # Determine target file
        $LocalPath = $Request.Url.LocalPath
        if ($LocalPath -eq "/") { $LocalPath = "/index.html" }
        
        # Build file system path safely
        $FilePath = Join-Path $RootDirectory $LocalPath.TrimStart('/')
        
        if (Test-Path $FilePath -PathType Leaf) {
            # Determine correct content type
            $Extension = [System.IO.Path]::GetExtension($FilePath).ToLower()
            $ContentType = switch ($Extension) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "text/javascript; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                default { "application/octet-stream" }
            }

            # Read file bytes
            $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
            
            # Write response
            $Response.ContentLength64 = $Bytes.Length
            $Response.ContentType = $ContentType
            
            # Append dev headers
            $Response.Headers.Add("Access-Control-Allow-Origin", "*")
            $Response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
            $Response.Headers.Add("Pragma", "no-cache")
            $Response.Headers.Add("Expires", "0")
            
            $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
        } else {
            # File not found
            $Response.StatusCode = 404
            $ErrorMsg = [System.Text.Encoding]::UTF8.GetBytes("Space Server Error: File not found at orbital coordinates.")
            $Response.ContentType = "text/plain"
            $Response.ContentLength64 = $ErrorMsg.Length
            $Response.OutputStream.Write($ErrorMsg, 0, $ErrorMsg.Length)
        }
        $Response.Close()
    }
}
catch {
    Write-Host "An error occurred starting the HTTP Listener: $_" -ForegroundColor Red
}
finally {
    if ($Listener -and $Listener.IsListening) {
        $Listener.Stop()
        Write-Host "Server halted. Uplink connection severed." -ForegroundColor Yellow
    }
}
