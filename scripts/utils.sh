#!/usr/bin/env bash
#
# Utilities
#

# Color definitions for each type
ERROR_COLOR=$(echo -en '\033[00;31m')
SUCCESS_COLOR=$(echo -en '\033[00;32m')
WARNING_COLOR=$(echo -en '\033[00;33m')
PROGRESS_COLOR=$(echo -en '\033[00;34m')
DEBUG_COLOR=$(echo -en '\033[00;36m')
HIGHLIGHT_COLOR=$(echo -en '\033[1;37m')
RESTORE_COLOR=$(echo -en '\033[0m')

# Prints an error message on the console.
#
# $@: Message text.
utils::echo_error() {
    echo "${ERROR_COLOR}"$@"${RESTORE_COLOR}"
}

# Prints an info message on the console.
#
# $@: Message text.
utils::echo_info() {
    echo "$@"
}

# Prints a success message on the console.
#
# $@: Message text.
utils::echo_success() {
    echo "${SUCCESS_COLOR}$@${RESTORE_COLOR}"
}

# Prints a warning message on the console.
#
# $@: Message text.
utils::echo_warning() {
    echo "${WARNING_COLOR}$@${RESTORE_COLOR}"
}

# Prints a progress message on the console.
#
# $@: Message text.
utils::echo_progress() {
    echo "${PROGRESS_COLOR}$@${RESTORE_COLOR}"
}

# Executes only if DEBUG is defined
utils::if_debug() {
    if [[ "x$DEBUG" != "x" ]]; then
        "$@"
    fi
}

# Prints a debug message on the console only if DEBUG is defined
#
# $@: Message text.
utils::echo_debug() {
    utils::if_debug echo "${DEBUG_COLOR}$@${RESTORE_COLOR}"
}

# Prints a highlight message on the console.
#
# $@: Message text.
utils::echo_highlight() {
    echo "${HIGHLIGHT_COLOR}$@${RESTORE_COLOR}"
}

# Disables all colors.
utils::echo_disable_colors() {
    ERROR_COLOR=""
    SUCCESS_COLOR=""
    WARNING_COLOR=""
    PROGRESS_COLOR=""
    DEBUG_COLOR=""
    HIGHLIGHT_COLOR=""
    RESTORE_COLOR=""
}

# Prints the step first, executes the command and finally
# prints the result of the execution.
# `done` signals the successful execution.
# `failed` signals the unsuccessful execution.
#
# $1: A text describing the step.
# $2: The command that should be executed.
# $@: The arguments used for the command.
#
# Returns 0 on success, otherwise 1.
utils::exec() {
    local step_name=$1
    shift
    local command=$1
    shift

    utils::if_debug utils::echo_info "$(utils::echo_debug DEBUG Step:) $step_name"
    utils::if_debug utils::echo_info "$(utils::echo_debug DEBUG Command:) $command"
    utils::if_debug utils::echo_info "$(utils::echo_debug DEBUG Args:) $@"
    echo -n "$step_name"

    local output; output=`${command} "$@" 2>&1`
    local result=$?
    local output_indents=$(echo "${output}"| sed 's/^/    /')

    if [[ "$result" -eq 0 ]]; then
        echo " ... $(utils::echo_success done)"
        if [[ "x$output" != "x" ]]; then
            echo "$output_indents"
        fi
    else
        echo " ... $(utils::echo_error failed)"
        if [[ "x$output" != "x" ]]; then
            echo "$output_indents"
        fi
        return 1
    fi

    return 0
}

# Prints the step first, executes the command and finally
# prints the result of the execution.
# `done` signals the successful execution.
# `failed` signals the unsuccessful execution.
#
# If the execution fails an exit (1) signal will be called.
#
# $1: A text describing the step.
# $2: The command that should be executed.
# $@: The arguments used for the command.
#
# Returns 0 on success, otherwise exit (1).
utils::exec_or_exit(){
    utils::exec "$@"

    if [[ "$?" -ne 0 ]]; then
        exit 1
    fi

    return 0
}

# Checks if an environment variable is present.
# If not present an error message will be printed.
#
# $1: Name of the environment variable.
#
# Returns 0 if exists, otherwise 1.
utils::requires_environment_variable() {
    local var_name=$1
    local var_exists=`env | grep "${var_name}="`

    if [[ -z "${var_exists}" ]]; then
      utils::echo_error "Environment variable ${var_name} is undefined." >&2
      return 1
    fi
    return 0
}

# Checks if a given value matches a regex pattern.
#
# $1: Name of the value.
# $2: Value that should be checked.
# $3: Regex pattern used for check.
#
# Returns 0 if matches, otherwise 1.
utils::validation::must_match() {
    local name=$1
    local value=$2
    local regex_pattern=$3

    if [[ ${value} =~ $regex_pattern ]] ; then
        return 0
    fi

    utils::echo_error "$name '$value' must match: $regex_pattern"

    return 1
}

# Checks if a given value is not empty.
#
# $1: Name of the value.
# $2: Value that should be checked.
#
# Returns 0 if not empty, otherwise 1.
utils::validation::must_not_empty() {
    local name=$1
    local value=$2

    if [[ "x$value" != "x" ]] ; then
        return 0
    fi

    utils::echo_error "$name must be not empty."

    return 1
}

# Read all properties from a property file.
#
# $1: Path to the property file.
utils::properties::readAll() {
    local propertyFile=$1
    if [ -f "$propertyFile" ]
    then
        while IFS='=' read -r key value
        do
            [[ "$key" =~ ^#.*$ || "$key" == '' ]] && continue
            key=$(echo $key | tr ".\-/" "_" | tr -cd 'A-Za-z0-9_' | tr [:lower:] [:upper:])
            local trimmedValue=$(utils::trim "$value")
            eval ${key}=\${trimmedValue}
        done < "$propertyFile"
    else
        utils::echo_error "$propertyFile not found."
        exit 1
    fi
}

utils::trim() {
    local value=$1
    echo "$value" | awk '$1=$1'
}
