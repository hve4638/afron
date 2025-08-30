if ((Split-Path -Leaf (Get-Location)) -eq "scripts") {
    cd ..
}

Get-Desktop 0 | Switch-Desktop
code ".\"
Start-Sleep -Seconds 3

Get-Desktop 1 | Switch-Desktop
code ".\packages\front"
Start-Sleep -Seconds 3

Get-Desktop 2 | Switch-Desktop
code ".\packages\core"
Start-Sleep -Seconds 3

Get-Desktop 3 | Switch-Desktop
code ".\packages\electron"
Start-Sleep -Seconds 3


Get-Desktop 0 | Switch-Desktop