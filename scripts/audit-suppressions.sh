#!/bin/bash
# Monthly audit script for LGTM suppressions
# Usage: npm run audit:suppressions

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📋 LGTM Suppression Audit - $(date '+%B %Y')"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Find all LGTM suppressions (excluding documentation)
SUPPRESSIONS=$(grep -rn "lgtm \[" \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.mjs" \
  src/ scripts/ 2>/dev/null)

if [[ -z "$SUPPRESSIONS" ]]; then
  echo "✅ No LGTM suppressions found in codebase!"
  echo ""
  exit 0
fi

# Count total suppressions
TOTAL=$(echo "$SUPPRESSIONS" | wc -l | tr -d ' ')
echo "📊 Total Suppressions: $TOTAL"
echo ""

# Group by rule
echo "📈 Suppressions by Rule:"
echo "$SUPPRESSIONS" \
  | sed 's/.*lgtm \[\([^]]*\)\].*/\1/' \
  | sort \
  | uniq -c \
  | sort -rn \
  | awk '{printf "   %-40s %3d\n", $2, $1}'
echo ""

# List all suppressions with context
echo "📝 All Suppressions:"
echo ""
echo "$SUPPRESSIONS" | while IFS= read -r line; do
  FILE=$(echo "$line" | cut -d: -f1)
  LINE_NUM=$(echo "$line" | cut -d: -f2)
  CONTENT=$(echo "$line" | cut -d: -f3-)
  RULE=$(echo "$CONTENT" | sed 's/.*lgtm \[\([^]]*\)\].*/\1/')

  echo "   📄 $FILE:$LINE_NUM"
  echo "      Rule: $RULE"
  echo "      $CONTENT"
  echo ""
done

# Review questions
echo "═══════════════════════════════════════════════════════════"
echo "🔍 Review Questions (for each suppression above):"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "1. ❓ Is this suppression still necessary?"
echo "2. ❓ Has the code pattern changed since suppression was added?"
echo "3. ❓ Is there a fix available now that wasn't available before?"
echo "4. ❓ Is the justification still technically accurate?"
echo "5. ❓ Can we restructure the code to eliminate the warning?"
echo ""

# Baseline check
BASELINE=2  # Updated January 21, 2026 - Target: valid file-system-race suppressions only
if [[ "$TOTAL" -gt "$BASELINE" ]]; then
  echo "⚠️  WARNING: Suppression count increased"
  echo "   Baseline: $BASELINE"
  echo "   Current:  $TOTAL"
  echo "   Increase: $((TOTAL - BASELINE))"
  echo ""
  echo "   New suppressions should be reviewed and potentially fixed."
  echo ""
elif [[ "$TOTAL" -lt "$BASELINE" ]]; then
  echo "✅ IMPROVEMENT: Suppression count decreased"
  echo "   Baseline: $BASELINE"
  echo "   Current:  $TOTAL"
  echo "   Decrease: $((BASELINE - TOTAL))"
  echo ""
  echo "   Great work! Remember to update baseline in this script."
  echo ""
else
  echo "✅ Suppression count stable at baseline ($BASELINE)"
  echo ""
fi

# Action items
echo "═══════════════════════════════════════════════════════════"
echo "📋 Action Items:"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "1. Review each suppression listed above"
echo "2. Attempt to fix at least one suppression this month"
echo "3. Update CODEQL_SUPPRESSIONS.md if patterns change"
echo "4. Update baseline in this script if count legitimately changes"
echo "5. Document findings in monthly security review"
echo ""
echo "📚 References:"
echo "   - Fix examples: docs/security/private/CODEQL_FINDINGS_RESOLVED.md"
echo "   - Analysis: docs/security/private/LGTM_SUPPRESSION_ANALYSIS.md"
echo "   - Process: docs/security/LGTM_APPROVAL_PROCESS.md"
echo ""
