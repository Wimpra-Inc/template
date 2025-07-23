#!/bin/bash

# Caminhos
SOURCE="$HOME/.config/google-chrome"
TARGET="$HOME/chrome-debug-profile"

# Cria destino
mkdir -p "$TARGET"

# Copia tudo (inclusive extensões e configs)
cp -r "$SOURCE/"* "$TARGET/"

# Remove locks/sockets
rm -f "$TARGET/Singleton*" "$TARGET/LOCK"
