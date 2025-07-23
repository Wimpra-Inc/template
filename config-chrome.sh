#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  echo "Iniciando no Linux..."
  bash ./chrome-installer/linux.sh
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  echo "Iniciando no Windows..."
  powershell.exe -ExecutionPolicy Bypass -File start-chrome-debug.ps1
else
  echo "Sistema operacional não suportado: $OSTYPE"
fi
