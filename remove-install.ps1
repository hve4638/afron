Get-ChildItem -Path ".\packages" -Recurse -Directory -Filter "node_modules" | Remove-Item -Recurse -Force
