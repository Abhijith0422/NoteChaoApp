# NotePad - Simple Text Editor Launcher
# Opens the text editor in your default browser

Write-Host "Starting NotePad - Simple Text Editor..." -ForegroundColor Blue

# Get the directory where this script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Path to the HTML file
$htmlFile = Join-Path $scriptDir "index.html"

# Check if the HTML file exists
if (Test-Path $htmlFile) {
    Write-Host "Opening NotePad in your default browser..." -ForegroundColor Green
    
    # Open the HTML file in the default browser
    Start-Process $htmlFile
    
    Write-Host "NotePad is now running in your browser!" -ForegroundColor Green
    Write-Host "Enjoy writing with your clean, simple text editor." -ForegroundColor Gray
} else {
    Write-Host "Error: index.html not found in the script directory!" -ForegroundColor Red
    Write-Host "Make sure all files are in the same folder." -ForegroundColor Yellow
}

# Keep the window open briefly
Start-Sleep -Seconds 2
