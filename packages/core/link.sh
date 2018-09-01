#!/usr/bin/env bash

# Symlink specific files from the @milesj/build-tool-config package
ln -s -f "../build-tool-config/configs" "./configs"
ln -s -f "../build-tool-config/dotfiles" "./dotfiles"
ln -s -f "../build-tool-config/scripts" "./scripts"
