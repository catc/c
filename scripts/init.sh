#!/bin/sh

# heavily borrowed from the nvm install script
# https://github.com/nvm-sh/nvm/blob/master/install.sh

GITHUB_SOURCE_URL="https://github.com/catc/c.git"
DEFAULT_BIN_NAME="c"
BIN_PATH="/usr/local/bin"
TEMPLATES_DIR="./src/templates"
CLI_VAR_START="# ---- c cli start"
CLI_VAR="C_CLI_DIR"


try_profile() {
  if [ -z "${1-}" ] || [ ! -f "${1}" ]; then
    return 1
  fi
  echo "${1}"
}

detect_profile () {
  local DETECTED_PROFILE
  DETECTED_PROFILE=''

  # TODO - eventually support ".bashrc", ".bash_profile"
  for EACH_PROFILE in ".profile" ".zshrc"; do
    if DETECTED_PROFILE="$(try_profile "${HOME}/${EACH_PROFILE}")"; then
      break
    fi
  done

  if [[ -z "$DETECTED_PROFILE" ]]; then 
    echo "Could not detect profile to update"
    exit 1
  fi

  echo "$DETECTED_PROFILE"
}

get_root_dir () {
  DIR="$(dirname "$(readlink -f "$0")")"
  DIR=${DIR%/*}
  echo "$DIR"
}

export_dir_path_var () {
  NAME=$1
  DIR=$(get_root_dir)
  PROFILE=$(detect_profile)

  echo "updating '$PROFILE'"

  # TODO - can probably remove C_CLI_DIR

  # update profile
  SOURCE_STR="\\n${CLI_VAR_START}\\nexport C_CLI_DIR=\"${DIR}\"\\n. <(${NAME} --completion)\\n# ---- c cli end\\n"
  command printf "${SOURCE_STR}" >> "$PROFILE"
}

unset_dir_path_var () {
  PROFILE=$(detect_profile)
  echo "Remove references in $PROFILE"
  command sed -ie "/${CLI_VAR_START}/,+3d" $PROFILE
}

add_symlink () {
  NAME=$1
  DIR=$(get_root_dir)

  BIN_PATH="$DIR/cli.sh"
  OUTPUT_PATH="/usr/local/bin/$NAME"
  echo "Symlinking $BIN_PATH -> $OUTPUT_PATH"
  command ln -s $BIN_PATH $OUTPUT_PATH
}

remove_symlink () {
  NAME=$1
  if [[ -z "$NAME" ]]; then
    echo "Must provide name of CLI bin"
    exit 1
  fi

  BIN_PATH="/usr/local/bin/$NAME"
  echo "Removing '$BIN_PATH' symlink"
  command unlink $BIN_PATH
}

yarn_install () {
  if ! command -v yarn && ! command -v npm; then
    echo "Neither yarn and npm exist, you gotta have at least one..."
    exit 1
  fi
  INSTALL_COMMAND="yarn install"
  if [[ -z "$(command -v yarn)" ]]; then
    echo "yarn not installed, falling back to npm"
    INSTALL_COMMAND="npm install"
  fi
  command $INSTALL_COMMAND || {
    echo "failed to install npm modules"
    exit 1
  }
}

setup_src_index () {
  NAME=$1
  echo "Generating src/index.ts with name '$NAME'"
  HYGEN_TMPLS=$TEMPLATES_DIR ./node_modules/.bin/hygen init new --name $NAME
}

clear_repo () {
  DIR=$(get_root_dir)
  printf "\n\nCleaned up everything, run \`rm -rf $DIR\` to remove repo\n"
}

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

    if (command -v "$NAME"); then 
      echo "bin with name '$NAME' already exists"
      continue
    fi

    break
  done

  # create dir, clone
  mkdir $NAME
  cd $NAME
  command git clone "$GITHUB_SOURCE_URL" --depth=1 . || {
    echo "failed to clone repo"
    exit 2
  }

  # yarn/npm install
  yarn_install

  # setup src/index.ts
  setup_src_index $NAME

  # export variables to profile
  export_dir_path_var $NAME

  # symlink
  add_symlink $NAME

  echo "Get started by running \`$NAME new\`"
}

implode () {
  NAME=$1
  if [[ -z "$NAME" ]]; then
    echo "Must provide name of CLI bin"
    exit 1
  fi

  # remove bin symlink
  remove_symlink $NAME

  # remove entry from profile
  unset_dir_path_var

  # clear repo message
  clear_repo
}


if [[ $1 == "install" ]]; then
  install
elif [ $1 == "implode" ]; then
  implode $2
else
  echo "unsupported action"
  exit 1
fi
