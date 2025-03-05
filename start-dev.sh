#!/bin/bash

# only tested on macOS
# This script has only been tested on macos.
export TAURI_DEV_WATCHER_IGNORE_FILE=$(pwd)/.taurignore
pkill MIDIServer
yarn tauri dev