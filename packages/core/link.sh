#!/usr/bin/env bash

# Symlink specific files from the @milesj/build-tool-config package
ln -s -f "../config/configs" "./configs"
ln -s -f "../config/dotfiles" "./dotfiles"
ln -s -f "../config/scripts" "./scripts"
