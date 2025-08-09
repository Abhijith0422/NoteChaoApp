# Chaotic Keyboard Remapper - Quick Start Script
# This script opens the website in your default browser

Write-Host "🔀 Starting Chaotic Keyboard Remapper..." -ForegroundColor Cyan
Write-Host "⚠️  Prepare for chaos!" -ForegroundColor Yellow

# Get the current directory
$currentDir = Get-Location

# Path to the HTML file
$htmlFile = Join-Path $currentDir "index.html"

# Check if the file exists
if (Test-Path $htmlFile) {
    Write-Host "✅ Found index.html" -ForegroundColor Green
    Write-Host "🌐 Opening in your default browser..." -ForegroundColor Blue
    
    # Open in default browser
    Start-Process $htmlFile
    
    Write-Host ""
    Write-Host "🎉 Chaotic Keyboard Remapper is now running!" -ForegroundColor Green
    Write-Host "📝 Start typing with your physical keyboard to experience the chaos!" -ForegroundColor White
    Write-Host "⏰ Keys will shuffle every 60 seconds WITHOUT WARNING!" -ForegroundColor Red
    Write-Host "🤫 No countdown timer - chaos strikes silently!" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "💡 Features:" -ForegroundColor Yellow
    Write-Host "   - Silent key remapping every minute (no timer shown)" -ForegroundColor White
    Write-Host "   - Physical keyboard input with chaotic output" -ForegroundColor White
    Write-Host "   - NO key mappings shown - discover by typing!" -ForegroundColor White
    Write-Host "   - Inverted caps lock behavior" -ForegroundColor White
    Write-Host "   - Special keys (Backspace, Enter, Space) occasionally remapped" -ForegroundColor White
    Write-Host "   - Toggle chaos on/off with the button" -ForegroundColor White
    Write-Host ""
    Write-Host "🛑 To stop: Close the browser tab or click 'Stop Chaos'" -ForegroundColor Red
} else {
    Write-Host "❌ Error: index.html not found in current directory!" -ForegroundColor Red
    Write-Host "📁 Make sure you're in the correct folder with the website files." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
