# Templates Library

Copy-paste templates for common tasks. Each template includes inline documentation and checklists.

## Quick Links

| Template | Use Case | View |
|----------|----------|------|
| [NEW_PAGE.tsx](./NEW_PAGE.tsx.md) | Standard pages with PageLayout | Most common |
| [API_ROUTE.ts](./API_ROUTE.ts.md) | API routes with Inngest pattern | POST endpoints |
| [INNGEST_FUNCTION.ts](./INNGEST_FUNCTION.ts.md) | Background job handlers | Async tasks |
| [COMPONENT_WITH_BARREL.tsx](./COMPONENT_WITH_BARREL.tsx.md) | New components with exports | Components |
| [METADATA_ONLY.ts](./METADATA_ONLY.ts.md) | Metadata generation only | OG images, etc. |

## Coming Soon

- ARCHIVE_PAGE.tsx - Filterable list pages
- ERROR_BOUNDARY.tsx - Error handling wrapper
- TEST_SUITE.test.tsx - Test suite setup

## Usage

1. **Find template** - Choose from table above
2. **Copy code** - Copy the template code block
3. **Replace placeholders** - Search for `REPLACE:` comments
4. **Follow checklist** - Each template has validation checklist
5. **Run linter** - `npm run lint` before committing

## Template Structure

Each template includes:
- **Template Code** - Copy-paste ready boilerplate
- **Common Modifications** - Frequent variations
- **Checklist** - Pre-commit validation steps
- **Related Templates** - Similar patterns
- **Related Docs** - Deep dive documentation

## Contributing

When adding new templates:
1. Follow existing structure (Template Code → Modifications → Checklist)
2. Include inline `REPLACE:` comments for placeholders
3. Add to this README table
4. Link to related docs

## Related Documentation

- [Component Patterns](../ai/COMPONENT_PATTERNS.md)
- [Decision Trees](../ai/DECISION_TREES.md)
- [Quick Reference](../ai/QUICK_REFERENCE.md)
