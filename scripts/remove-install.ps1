if ((Split-Path -Leaf (Get-Location)) -eq "scripts") {
    cd ..
}

Get-ChildItem -Path ".\packages" -Recurse -Directory -Filter "node_modules" | Remove-Item -Recurse -Force

if (Test-Path ".\node_modules") {
    Remove-Item ".\node_modules" -Recurse -Force
}