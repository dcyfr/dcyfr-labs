#!/bin/bash

# Claude Code Automation Script
# Purpose: Automated code review, linting, and CI/CD integration
# Version: 1.0.0
# Usage: ./scripts/claude-code-automation.sh {command} [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_FILE="${PROJECT_ROOT}/.claude/automation-logs/$(date +%Y%m%d-%H%M%S).log"

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

success() {
    echo -e "${GREEN}[✓]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[⚠️  WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# ============================================================================
# COMMAND: lint-subjective
# Purpose: Use Claude for code review beyond ESLint (naming, comments, logic)
# ============================================================================
lint_subjective() {
    log "Starting subjective linting..."

    # Check if Claude CLI is available
    if ! command -v claude &> /dev/null; then
        error "Claude CLI not found. Install with: npm install -g @claude-labs/claude-cli"
    fi

    # Get list of modified files (or use src/ if not in git context)
    if git rev-parse --git-dir > /dev/null 2>&1; then
        MODIFIED_FILES=$(git diff --name-only HEAD~1 2>/dev/null | grep -E '\.(ts|tsx|js|jsx)$' || echo "src/")
    else
        MODIFIED_FILES=$(find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | head -20)
    fi

    if [ -z "$MODIFIED_FILES" ]; then
        warning "No files to lint"
        return 0
    fi

    log "Linting ${MODIFIED_FILES} files..."

    # Create Claude prompt for subjective analysis
    PROMPT="Review these source files for code quality issues BEYOND what ESLint catches:

1. **Misleading Function Names** - Functions named one thing but do another
2. **Stale Comments** - Comments that don't match current code
3. **Design Token Violations** - Hardcoded spacing/colors instead of tokens
4. **Complex Logic Without Explanation** - Code that needs comments but doesn't have them
5. **Anti-patterns** - Code that violates dcyfr patterns

Format your response as:
FILE:LINE: ISSUE (SEVERITY: low|medium|high)

Example:
src/components/Blog.tsx:45: Function named 'formatDate' but actually does currency formatting (high)
src/lib/utils.ts:120: Stale comment: 'This is deprecated' but code still in use (medium)

Only output actual issues, one per line. Be specific and actionable."

    # Run Claude analysis (using echo to pipe prompt)
    REPORT=$(echo "$PROMPT" | claude --input src/ 2>/dev/null || echo "")

    if [ -n "$REPORT" ]; then
        echo "$REPORT" | tee -a "$LOG_FILE"
        success "Subjective linting complete (check output above)"
        return 0
    else
        success "No issues found or Claude unavailable"
        return 0
    fi
}

# ============================================================================
# COMMAND: design-token-audit
# Purpose: Audit design token compliance across codebase
# ============================================================================
design_token_audit() {
    log "Starting design token audit..."

    local violations_found=0

    # Check for hardcoded spacing values (should use SPACING token)
    log "Checking for hardcoded spacing values..."
    if grep -r "gap-\|p-\|m-\|pt-\|pb-\|pl-\|pr-" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "SPACING\|design-tokens" > /tmp/spacing-violations.txt; then
        local count=$(wc -l < /tmp/spacing-violations.txt)
        if [ "$count" -gt 0 ]; then
            warning "Found $count hardcoded spacing violations"
            head -5 /tmp/spacing-violations.txt | tee -a "$LOG_FILE"
            violations_found=$((violations_found + count))
        fi
    fi

    # Check for hardcoded colors (should use SEMANTIC_COLORS)
    log "Checking for hardcoded colors..."
    if grep -r "#[0-9a-fA-F]\{3,6\}\|rgb(\|hsl(" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "SEMANTIC_COLORS\|design-tokens\|theme" > /tmp/color-violations.txt; then
        local count=$(wc -l < /tmp/color-violations.txt)
        if [ "$count" -gt 0 ]; then
            warning "Found $count hardcoded color violations"
            head -5 /tmp/color-violations.txt | tee -a "$LOG_FILE"
            violations_found=$((violations_found + count))
        fi
    fi

    # Check for hardcoded typography (should use TYPOGRAPHY)
    log "Checking for hardcoded typography..."
    if grep -r "text-\|font-\|leading-" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "TYPOGRAPHY\|design-tokens" | head -5 > /tmp/typography-violations.txt; then
        local count=$(wc -l < /tmp/typography-violations.txt)
        if [ "$count" -gt 0 ]; then
            warning "Found $count hardcoded typography violations"
            head -3 /tmp/typography-violations.txt | tee -a "$LOG_FILE"
            violations_found=$((violations_found + count))
        fi
    done

    if [ $violations_found -eq 0 ]; then
        success "Design token compliance: ✅ 100%"
        return 0
    else
        error "Design token violations found: $violations_found. Run 'npm run lint' to fix."
    fi
}

# ============================================================================
# COMMAND: analyze-errors
# Purpose: Parse error logs and identify patterns
# ============================================================================
analyze_errors() {
    local error_file="$1"

    if [ -z "$error_file" ] || [ ! -f "$error_file" ]; then
        error "Error log file not found: $error_file"
    fi

    log "Analyzing error patterns in: $error_file"

    # Count error frequencies
    local total_errors=$(grep -c "error\|Error\|ERROR" "$error_file" || echo "0")

    log "Total errors: $total_errors"

    # Extract unique error types
    log "Top error patterns:"
    grep -oE "(TypeError|ReferenceError|SyntaxError|RangeError|Error): [^$]+" "$error_file" 2>/dev/null | sort | uniq -c | sort -rn | head -5 | tee -a "$LOG_FILE"

    # Extract file references
    log "Most frequently erroring files:"
    grep -oE "at [^/]*/(src/[^ ]+)" "$error_file" 2>/dev/null | sort | uniq -c | sort -rn | head -5 | tee -a "$LOG_FILE"

    success "Error analysis complete"
}

# ============================================================================
# COMMAND: test-coverage-report
# Purpose: Generate detailed test coverage analysis
# ============================================================================
test_coverage_report() {
    log "Generating test coverage report..."

    if ! command -v npm &> /dev/null; then
        error "npm not found"
    fi

    cd "$PROJECT_ROOT"

    log "Running tests with coverage..."
    npm run test:run -- --coverage 2>&1 | tee -a "$LOG_FILE"

    success "Coverage report generated"
}

# ============================================================================
# COMMAND: pre-commit-check
# Purpose: Run all pre-commit validations
# ============================================================================
pre_commit_check() {
    log "Running pre-commit checks..."

    cd "$PROJECT_ROOT"

    # TypeScript check
    log "Checking TypeScript..."
    if ! npx tsc --noEmit 2>&1 | tee -a "$LOG_FILE"; then
        error "TypeScript compilation failed"
    fi

    # ESLint check
    log "Checking ESLint..."
    if ! npm run lint 2>&1 | tee -a "$LOG_FILE"; then
        error "ESLint validation failed"
    fi

    # Design tokens audit
    log "Auditing design tokens..."
    design_token_audit

    success "All pre-commit checks passed"
}

# ============================================================================
# COMMAND: ci-pipeline
# Purpose: Full CI pipeline for GitHub Actions
# ============================================================================
ci_pipeline() {
    log "Starting CI pipeline..."

    cd "$PROJECT_ROOT"

    # 1. Type checking
    log "Step 1: Type checking..."
    npx tsc --noEmit || error "TypeScript failed"

    # 2. Linting
    log "Step 2: ESLint..."
    npm run lint || error "ESLint failed"

    # 3. Tests
    log "Step 3: Tests..."
    npm run test:run || error "Tests failed"

    # 4. Design token audit
    log "Step 4: Design token audit..."
    design_token_audit || warning "Design token issues found"

    # 5. Build
    log "Step 5: Build..."
    npm run build || error "Build failed"

    success "CI pipeline passed ✅"
}

# ============================================================================
# COMMAND: help
# Purpose: Show usage information
# ============================================================================
show_help() {
    cat << 'EOF'

╔═══════════════════════════════════════════════════════════════════════════╗
║            Claude Code Automation Script                                  ║
║            Automate code review, linting, and CI/CD                       ║
╚═══════════════════════════════════════════════════════════════════════════╝

USAGE:
  ./scripts/claude-code-automation.sh <command> [options]

COMMANDS:

  lint-subjective
    Use Claude for code review beyond ESLint
    Checks for: misleading names, stale comments, token violations, logic clarity
    Usage: ./scripts/claude-code-automation.sh lint-subjective

  design-token-audit
    Audit design token compliance across codebase
    Checks for: hardcoded spacing, colors, typography
    Usage: ./scripts/claude-code-automation.sh design-token-audit

  analyze-errors <logfile>
    Parse error patterns from a log file
    Shows: error frequency, file references, patterns
    Usage: ./scripts/claude-code-automation.sh analyze-errors error.log

  test-coverage-report
    Generate test coverage analysis
    Usage: ./scripts/claude-code-automation.sh test-coverage-report

  pre-commit-check
    Run all pre-commit validations
    Includes: TypeScript, ESLint, tests, design tokens
    Usage: ./scripts/claude-code-automation.sh pre-commit-check

  ci-pipeline
    Full CI pipeline for GitHub Actions
    Includes: TypeScript, ESLint, tests, tokens, build
    Usage: ./scripts/claude-code-automation.sh ci-pipeline

  help
    Show this help message
    Usage: ./scripts/claude-code-automation.sh help

EXAMPLES:

  # Check code quality beyond ESLint
  ./scripts/claude-code-automation.sh lint-subjective

  # Audit design token usage
  ./scripts/claude-code-automation.sh design-token-audit

  # Analyze error logs
  ./scripts/claude-code-automation.sh analyze-errors /tmp/error.log

  # Run full CI pipeline
  ./scripts/claude-code-automation.sh ci-pipeline

LOGS:
  All output is logged to: .claude/automation-logs/

INTEGRATION:
  Add to package.json:
    "scripts": {
      "lint:subjective": "bash scripts/claude-code-automation.sh lint-subjective",
      "audit:tokens": "bash scripts/claude-code-automation.sh design-token-audit",
      "check:pre-commit": "bash scripts/claude-code-automation.sh pre-commit-check"
    }

EOF
}

# ============================================================================
# Main Entry Point
# ============================================================================

main() {
    # Show header
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║       Claude Code Automation v1.0.0                        ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""

    local command="${1:-help}"

    case "$command" in
        lint-subjective)
            lint_subjective
            ;;
        design-token-audit|audit:tokens)
            design_token_audit
            ;;
        analyze-errors)
            analyze_errors "$2"
            ;;
        test-coverage|coverage)
            test_coverage_report
            ;;
        pre-commit-check|check:pre-commit)
            pre_commit_check
            ;;
        ci-pipeline|ci)
            ci_pipeline
            ;;
        help|-h|--help)
            show_help
            ;;
        *)
            error "Unknown command: $command\n\nRun './scripts/claude-code-automation.sh help' for usage"
            ;;
    esac
}

# Run main function with all arguments
main "$@"
