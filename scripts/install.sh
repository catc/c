#!/bin/sh

GITHUB_SOURCE_URL="https://github.com/catc/c.git"
DEFAULT_BIN_NAME="c"

install () {
  # check for supported shell
  if [[ $SHELL != *"zsh"* ]]; then
    echo "shell not supported, currently only supports 'zsh'"
    return
  fi

  # get bin name
  while true; do
    read -p "What bin name do you want to use? (default: c) " NAME

    if [[ -z "$NAME" ]]; then
      echo "Defaulting to 'c'"
      NAME=$DEFAULT_BIN_NAME
      break
    fi

    if (( $(wc -w <<< "$NAME") > 1 )); then
      echo "Name should be a single word "
      continue
    fi

    break
  done

  # create dir, clone
  mkdir $NAME
  cd $NAME
  command git clone "$GITHUB_SOURCE_URL" --depth=1 . || {
    nvm_echo >&2 'failed to clone repo'
    exit 2
  }

  # yarn/npm install
  if ! command -v yarn && ! command -v npm; then
    echo "Neither yarn and npm exist, you gotta have one..."
    exit 1
  fi
  INSTALL_COMMAND="yarn install"
  if [[ -z "$(command -v yarn)" ]]; then
    echo "yarn not installed, falling back to npm"
    INSTALL_COMMAND="npm install"
  fi
  command $INSTALL_COMMAND

  # TODO - setup src/index
  # TODO - add to .zshrc
}


install
