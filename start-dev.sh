#!/bin/bash

# only tested on macOS
export TAURI_DEV_WATCHER_IGNORE_FILE=$(pwd)/.taurignore
pkill MIDIServer
yarn tauri dev