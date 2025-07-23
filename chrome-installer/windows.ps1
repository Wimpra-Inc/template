# Caminhos
$source = "$env:LOCALAPPDATA\Google\Chrome\User Data"
$target = "$env:USERPROFILE\chrome-debug-profile"

# Cria pasta destino se não existir
if (-Not (Test-Path $target)) {
    New-Item -ItemType Directory -Path $target | Out-Null
}

# Copia todos os dados
Copy-Item -Path "$source\*" -Destination $target -Recurse -Force

# Remove arquivos de lock
Remove-Item "$target\LOCK" -ErrorAction SilentlyContinue
Remove-Item "$target\Singleton*" -ErrorAction SilentlyContinue
