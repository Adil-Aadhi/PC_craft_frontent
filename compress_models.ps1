$models = Get-ChildItem -Path "public\models" -Filter *.glb
foreach ($model in $models) {
    Write-Host "Compressing $($model.Name) (${$model.Length} bytes)..."
    $tempFile = "public\models\__tmp_$($model.Name)"
    # Run gltf-pipeline for Draco compression
    npx -y gltf-pipeline -i "$($model.FullName)" -o "$tempFile" -d
    if (Test-Path $tempFile) {
        Remove-Item -Path "$($model.FullName)" -Force -Confirm:$false
        Rename-Item -Path $tempFile -NewName "$($model.Name)"
        Write-Host "Replaced $($model.Name)"
    } else {
        Write-Host "Failed to compress $($model.Name)"
    }
}
Write-Host "Compression completed."
