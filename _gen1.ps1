Add-Type -AssemblyName System.IO.Compression.FileSystem
$outPath = "D:\at happen\layout\公众号排版助手-产品设计说明书.docx"
if (Test-Path $outPath) { Remove-Item $outPath -Force }
$wdir = "D:\at happen\layout\_docxtmp"
if (Test-Path $wdir) { Remove-Item $wdir -Recurse -Force }
New-Item -ItemType Directory -Path $wdir -Force | Out-Null
foreach ($d in @("$wdir\_rels","$wdir\docProps","$wdir\word","$wdir\word\_rels")) { New-Item -ItemType Directory -Path $d -Force | Out-Null }
