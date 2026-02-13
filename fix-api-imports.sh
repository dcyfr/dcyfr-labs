#!/bin/bash
files=(
  "src/__tests__/integration/api-research.test.ts"
  "src/__tests__/lib/api-guardrails.test.ts"
  "src/app/api/admin/api-usage/route.ts"
  "src/app/api/analytics/daily/route.ts"
  "src/app/api/inngest/route.ts"
  "src/app/api/research/route.ts"
  "src/lib/perplexity.ts"
  "src/lib/unified-cost-aggregator.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    perl -i -pe "s|from '@/lib/api-security'|from '@/lib/api/api-security'|g" "$file"
    perl -i -pe "s|from '@/lib/api-guardrails'|from '@/lib/api/api-guardrails'|g" "$file"
    perl -i -pe "s|from '\./api-usage-tracker'|from '\./api/api-usage-tracker'|g" "$file"
    echo "✓ Fixed: $file"
  fi
done
