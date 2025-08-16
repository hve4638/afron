if ((Split-Path -Leaf (Get-Location)) -eq "scripts") {
    cd ..
}

Get-ChildItem -Path ".\packages" -Recurse -Directory -Filter "dist" | Remove-Item -Recurse -Force


if (Test-Path ".\packages\electron\static") {
    Remove-Item ".\packages\electron\static" -Recurse -Force
}