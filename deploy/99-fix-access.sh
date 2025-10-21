#!/usr/bin/env bash
#
# Learn Node UI - Environment Configuration Script
# This script runs during Docker container initialization to configure environment variables
#
# Features:
# - Validates required environment variables
# - Replaces placeholder values with actual configuration
# - Supports debug modes for troubleshooting
# - Follows security best practices
#

set -euo pipefail  # Exit on error, undefined variables, and pipe failures
IFS=$'\n\t'        # Set Internal Field Separator for better security

# ============================================================================
# Configuration
# ============================================================================

readonly SCRIPT_NAME="$(basename "${BASH_SOURCE[0]}")"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly WEB_ROOT="${WEB_ROOT:-/usr/share/nginx/html}"
readonly ENVIRONMENT="${ENVIRONMENT:-localdev}"

# Color codes for output (if terminal supports it)
if [[ -t 1 ]]; then
    readonly RED='\033[0;31m'
    readonly GREEN='\033[0;32m'
    readonly YELLOW='\033[1;33m'
    readonly BLUE='\033[0;34m'
    readonly NC='\033[0m' # No Color
else
    readonly RED=''
    readonly GREEN=''
    readonly YELLOW=''
    readonly BLUE=''
    readonly NC=''
fi

# ============================================================================
# Functions
# ============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $*" >&2
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $*" >&2
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $*" >&2
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $*" >&2
}

# Enable debug mode based on environment variable
setup_debug() {
    local debug_level="${MY_DEBUG,,}"  # Convert to lowercase

    case "${debug_level}" in
        true)
            log_info "Enabling bash debug mode"
            set -x
            ;;
        verbose)
            log_info "Enabling verbose bash debug mode"
            set -xv
            ;;
        *)
            # Debug mode disabled
            ;;
    esac
}

# Display environment information
show_environment() {
    log_info "Environment: ${ENVIRONMENT}"
    log_info "Web Root: ${WEB_ROOT}"

    if [[ "${SHOW_END_RESULT,,}" == "true" ]]; then
        log_info "Environment variables:"
        env | sort | cut -d= -f1 | sed 's/^/  - /'
    fi
}

# Validate that required environment variables are set
validate_required_variables() {
    local environment="${ENVIRONMENT,,}"

    # Skip validation for local development
    if [[ "${environment}" == "localdev" ]]; then
        log_info "Local development mode - skipping required variable validation"
        return 0
    fi

    local required_vars=(
        "API_URL"
    )

    local missing_vars=()

    for var_name in "${required_vars[@]}"; do
        if [[ -z "${!var_name:-}" ]]; then
            missing_vars+=("${var_name}")
        fi
    done

    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "Required environment variables are not set:"
        for var_name in "${missing_vars[@]}"; do
            log_error "  - ${var_name}"
        done
        log_error "Exiting due to missing required configuration"
        exit 1
    fi

    log_success "All required environment variables are set"
}

# Replace placeholder with actual value in files
replace_placeholder() {
    local placeholder="$1"
    local replacement="$2"
    local search_path="${3:-${WEB_ROOT}}"

    log_info "Searching for placeholder: ${placeholder}"

    # Find files containing the placeholder
    local files_found=()
    while IFS= read -r -d '' file; do
        files_found+=("${file}")
    done < <(grep -rlZ "${placeholder}" "${search_path}" 2>/dev/null || true)

    if [[ ${#files_found[@]} -eq 0 ]]; then
        log_warning "No files found containing placeholder: ${placeholder}"
        return 0
    fi

    log_info "Found ${#files_found[@]} file(s) containing placeholder"

    # Replace placeholder in each file
    for file_path in "${files_found[@]}"; do
        if [[ ! -w "${file_path}" ]]; then
            log_error "File is not writable: ${file_path}"
            continue
        fi

        # Create backup before modification
        if ! cp "${file_path}" "${file_path}.bak"; then
            log_error "Failed to create backup of: ${file_path}"
            continue
        fi

        # Perform replacement
        if sed -i "s|${placeholder}|${replacement}|g" "${file_path}"; then
            log_success "Updated: ${file_path}"

            if [[ "${SHOW_END_RESULT,,}" == "true" ]]; then
                log_info "Replaced '${placeholder}' with '...${replacement: -20}'"
            fi

            # Remove backup if successful
            rm -f "${file_path}.bak"
        else
            log_error "Failed to update: ${file_path}"
            # Restore from backup
            mv "${file_path}.bak" "${file_path}"
        fi
    done
}

# Main configuration function
configure_application() {
    local environment="${ENVIRONMENT,,}"

    if [[ "${environment}" == "localdev" ]]; then
        log_info "Running in local development mode - no configuration needed"
        return 0
    fi

    log_info "Configuring application for environment: ${ENVIRONMENT}"

    # Replace API_URL placeholder
    if [[ -n "${API_URL:-}" ]]; then
        replace_placeholder "FIXME_API_URL" "${API_URL}" "${WEB_ROOT}"
    fi

    # Add more placeholder replacements here as needed
    # Example:
    # if [[ -n "${ANALYTICS_ID:-}" ]]; then
    #     replace_placeholder "FIXME_ANALYTICS_ID" "${ANALYTICS_ID}" "${WEB_ROOT}"
    # fi

    log_success "Application configuration completed"
}

# ============================================================================
# Main Execution
# ============================================================================

main() {
    log_info "Starting ${SCRIPT_NAME}"

    # Setup debug mode
    setup_debug

    # Display environment information
    show_environment

    # Validate required variables
    validate_required_variables

    # Configure application
    configure_application

    log_success "${SCRIPT_NAME} completed successfully"
}

# Execute main function
main "$@"
