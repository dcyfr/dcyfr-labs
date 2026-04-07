#!/usr/bin/env python3
"""
Migrate Inngest v3 createFunction (3-arg) calls to v4 format (2-arg).

v3: inngest.createFunction(config, trigger, handler)
v4: inngest.createFunction({ ...config, triggers: [trigger] }, handler)
"""

import re
import sys
from pathlib import Path

BASE = Path("/Users/drew/Code/dcyfr/dcyfr-labs")

FILES = [
    "src/inngest/activity-cache-functions.ts",
    "src/inngest/api-cost-monitoring.ts",
    "src/inngest/blog-functions.ts",
    "src/inngest/contact-functions.ts",
    "src/inngest/credly-cache-functions.ts",
    "src/inngest/error-handler.ts",
    "src/inngest/functions.ts",
    "src/inngest/github-functions.ts",
    "src/inngest/google-indexing-functions.ts",
    "src/inngest/indexnow-functions.ts",
    "src/inngest/ip-reputation-functions.ts",
    "src/inngest/newsletter-functions.ts",
    "src/inngest/security-functions.ts",
    "src/inngest/session-management.ts",
    "src/inngest/social-analytics-functions.ts",
    "src/inngest/update-analytics-milestones.ts",
    "src/inngest/functions/dependency-security-audit.ts",
    "src/inngest/functions/design-token-validation.ts",
    "src/inngest/functions/sync-inoreader-feeds.ts",
    "src/lib/inngest/prompt-security.ts",
    # docs/features/google-indexing-integration-examples.ts -- SKIP (already fixed manually)
]


class JSScanner:
    """
    Scan JavaScript/TypeScript source, correctly tracking string/template
    literal boundaries (including nested ${...} expressions in template literals).
    """

    def __init__(self, text: str):
        self.text = text
        self.n = len(text)

    def _skip_line_comment(self, i: int) -> int:
        while i < self.n and self.text[i] != '\n':
            i += 1
        return i

    def _skip_block_comment(self, i: int) -> int:
        end = self.text.find('*/', i)
        return (end + 2) if end != -1 else self.n

    def _scan_code(self, start: int, open_ch: str, close_ch: str) -> int:
        """
        Starting from `start` (which is the character AFTER the opening delimiter),
        find the matching close delimiter, correctly handling strings, template
        literals with ${...} expressions, and comments. The initial depth is 1
        (we have already consumed one open_ch).
        """
        t = self.text
        n = self.n
        i = start
        depth = 1
        state_stack = ['code']
        template_brace_depth: list[int] = []

        while i < n:
            state = state_stack[-1]
            ch = t[i]

            if state == 'single':
                if ch == '\\':
                    i += 2
                    continue
                if ch == "'":
                    state_stack.pop()
            elif state == 'double':
                if ch == '\\':
                    i += 2
                    continue
                if ch == '"':
                    state_stack.pop()
            elif state == 'template':
                if ch == '\\':
                    i += 2
                    continue
                if ch == '`':
                    state_stack.pop()
                elif ch == '$' and i + 1 < n and t[i + 1] == '{':
                    # Enter template expression context
                    template_brace_depth.append(1)
                    state_stack.append('template_expr')
                    i += 2
                    continue
            elif state == 'template_expr':
                # Inside ${...} — track braces so we know when the expr ends
                if ch == '\\':
                    i += 2
                    continue
                if ch == "'":
                    state_stack.append('single')
                elif ch == '"':
                    state_stack.append('double')
                elif ch == '`':
                    state_stack.append('template')
                elif t[i:i+2] == '//':
                    i = self._skip_line_comment(i + 2)
                    continue
                elif t[i:i+2] == '/*':
                    i = self._skip_block_comment(i + 2)
                    continue
                elif ch == '{':
                    template_brace_depth[-1] += 1
                elif ch == '}':
                    template_brace_depth[-1] -= 1
                    if template_brace_depth[-1] == 0:
                        template_brace_depth.pop()
                        state_stack.pop()  # back to 'template'
            else:
                # Normal code — track open/close delimiters and string starts
                if ch == '\\':
                    i += 2
                    continue
                if ch == "'":
                    state_stack.append('single')
                elif ch == '"':
                    state_stack.append('double')
                elif ch == '`':
                    state_stack.append('template')
                elif t[i:i+2] == '//':
                    i = self._skip_line_comment(i + 2)
                    continue
                elif t[i:i+2] == '/*':
                    i = self._skip_block_comment(i + 2)
                    continue
                elif ch == open_ch:
                    depth += 1
                elif ch == close_ch:
                    depth -= 1
                    if depth == 0:
                        return i
            i += 1

        raise ValueError(
            f"No matching '{close_ch}' for '{open_ch}' from pos {start - 1} "
            f"(depth={depth}, state={state_stack})"
        )

    def find_matching_close(self, open_pos: int) -> int:
        """
        Given position of '{' or '(', return position of matching '}' or ')'.
        """
        ch = self.text[open_pos]
        if ch == '{':
            return self._scan_code(open_pos + 1, '{', '}')
        elif ch == '(':
            return self._scan_code(open_pos + 1, '(', ')')
        raise ValueError(f"Expected brace/paren at {open_pos}, got {ch!r}")

    def skip_whitespace_and_comments(self, pos: int) -> int:
        """Advance pos past whitespace and comments."""
        t = self.text
        n = self.n
        while pos < n:
            ch = t[pos]
            if ch in ' \t\n\r':
                pos += 1
                continue
            if t[pos:pos+2] == '//':
                pos = self._skip_line_comment(pos + 2)
                continue
            if t[pos:pos+2] == '/*':
                pos = self._skip_block_comment(pos + 2)
                continue
            break
        return pos


def extract_trigger_inner(trigger_str: str) -> tuple[str, bool]:
    """
    Given '{ event: "foo" }' or '{\n    cron: "...",\n  }',
    return (inner_content, has_trailing_line_comment).

    inner_content is stripped of outer braces and whitespace.
    has_trailing_line_comment is True if the inner content ends with a // comment,
    in which case the caller must put the closing } on its own line.
    """
    s = trigger_str.strip()
    assert s.startswith('{') and s.endswith('}'), f"Unexpected trigger: {s!r}"
    inner = s[1:-1].strip()

    # Strip trailing comma-only lines (from multiline objects like "event: ...,\n")
    # but preserve inline comments
    # Detect if inner ends with a line comment (// ...) — possibly after stripping
    # trailing commas/whitespace
    inner_stripped = inner.rstrip(',').rstrip()

    # Check if the last non-empty line ends with a // comment
    lines = inner.splitlines()
    last_line = ''
    for line in reversed(lines):
        stripped = line.strip()
        if stripped:
            last_line = stripped
            break

    has_trailing_comment = bool(re.search(r'//[^\n]*$', last_line))
    return inner, has_trailing_comment


def migrate_text(text: str, filename: str) -> tuple[str, int]:
    """
    Find all 3-arg createFunction calls and transform to v4 2-arg format.
    Returns (new_text, count).
    """
    scanner = JSScanner(text)
    count = 0
    result = []
    search_from = 0

    while True:
        match = re.search(r'\.createFunction\s*\(', text[search_from:])
        if not match:
            break

        abs_match_start = search_from + match.start()
        abs_paren_open = search_from + match.end() - 1  # index of '('

        # Skip to first arg
        pos_config_open = scanner.skip_whitespace_and_comments(abs_paren_open + 1)

        if pos_config_open >= len(text) or text[pos_config_open] != '{':
            search_from = abs_paren_open + 1
            continue

        # Find config block boundaries
        config_open = pos_config_open
        config_close = scanner.find_matching_close(config_open)

        # After config, expect comma
        pos_after_config = scanner.skip_whitespace_and_comments(config_close + 1)

        if pos_after_config >= len(text) or text[pos_after_config] != ',':
            search_from = config_close + 1
            continue

        # Find trigger block
        pos_trigger_open = scanner.skip_whitespace_and_comments(pos_after_config + 1)

        if pos_trigger_open >= len(text) or text[pos_trigger_open] != '{':
            # Second arg is not an object literal — already v4 or different pattern
            search_from = config_close + 1
            continue

        trigger_open = pos_trigger_open
        trigger_close = scanner.find_matching_close(trigger_open)
        trigger_raw = text[trigger_open:trigger_close + 1]

        # After trigger, expect comma (third arg = handler)
        pos_after_trigger = scanner.skip_whitespace_and_comments(trigger_close + 1)

        if pos_after_trigger >= len(text) or text[pos_after_trigger] != ',':
            # Only 2 args — already v4
            search_from = trigger_close + 1
            continue

        # This is a v3 3-arg call — transform it!
        trigger_inner, has_trailing_comment = extract_trigger_inner(trigger_raw)

        # Determine indentation from the config closing brace line
        config_close_line_start = text.rfind('\n', 0, config_close)
        if config_close_line_start == -1:
            config_close_line_start = 0
        else:
            config_close_line_start += 1
        config_close_indent = ''
        for ch in text[config_close_line_start:config_close]:
            if ch in ' \t':
                config_close_indent += ch
            else:
                break

        prop_indent = config_close_indent + '  '
        # If trigger inner ends with a line comment, put closing } on new line
        # to avoid the comment swallowing the closing brace
        if has_trailing_comment:
            trigger_obj = f"{{ {trigger_inner}\n{prop_indent}}}"
        else:
            trigger_obj = f"{{ {trigger_inner} }}"
        triggers_line = f"\n{prop_indent}triggers: [{trigger_obj}],"

        # Build new config block: ensure trailing comma on last property
        config_body = text[config_open + 1:config_close]
        stripped_body = config_body.rstrip()
        if stripped_body and stripped_body[-1] not in (',', '{'):
            trailing_ws = config_body[len(stripped_body):]
            new_config_body = stripped_body + ',' + trailing_ws
        else:
            new_config_body = config_body

        new_config = '{' + new_config_body + triggers_line + '\n' + config_close_indent + '}'

        # handler_start is right after the comma following the trigger
        handler_start = pos_after_trigger + 1

        # Find the outer closing paren of createFunction(
        outer_close = scanner.find_matching_close(abs_paren_open)

        # Everything between handler_start and outer_close is the handler + closing
        handler_and_rest = text[handler_start:outer_close]

        new_call = (
            text[abs_match_start:abs_paren_open + 1] +
            new_config +
            ',' +
            handler_and_rest +
            ')'
        )

        result.append(text[search_from:abs_match_start])
        result.append(new_call)
        search_from = outer_close + 1
        count += 1

    result.append(text[search_from:])
    return ''.join(result), count


def main():
    total = 0
    results = []

    for rel_path in FILES:
        path = BASE / rel_path
        if not path.exists():
            print(f"  SKIP (not found): {rel_path}")
            continue

        original = path.read_text(encoding='utf-8')
        try:
            modified, count = migrate_text(original, rel_path)
        except Exception as e:
            print(f"  ERROR in {rel_path}: {e}")
            import traceback
            traceback.print_exc()
            results.append((rel_path, -1))
            continue

        if count > 0:
            path.write_text(modified, encoding='utf-8')
            results.append((rel_path, count))
            total += count
        else:
            results.append((rel_path, 0))

    print("\nMigration Results:")
    print("-" * 60)
    for rel_path, count in results:
        if count < 0:
            status = "ERROR"
        elif count > 0:
            status = f"{count} function(s) transformed"
        else:
            status = "no changes (already v4 or no createFunction)"
        print(f"  {rel_path}: {status}")
    print("-" * 60)
    transformed_files = sum(1 for _, c in results if c > 0)
    print(f"  TOTAL: {total} function(s) transformed across {transformed_files} file(s)")


if __name__ == '__main__':
    main()
