while ($true) {
    Write-Output "Starting LocalTunnel..."
    npx --yes localtunnel --port 5173
    Start-Sleep -Seconds 3
}

