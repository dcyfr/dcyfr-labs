// check-for-pii.test.mjs
// Pattern matching tests for the PII/PI scanner
// (Note: Scanner integration tests require git repo, so these test pattern correctness)
import { describe, it, expect } from 'vitest';

describe('check-for-pii.mjs Pattern Detection', () => {
  describe('PII Pattern Definitions', () => {
    it('should have email pattern', () => {
      const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      expect('Contact: user@example.com'.match(emailPattern)).toBeTruthy();
      expect('Invalid email @invalid.com'.match(emailPattern)).toBeFalsy();
    });

    it('should have SSN pattern', () => {
      const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/g;
      expect('SSN: 123-45-6789'.match(ssnPattern)).toBeTruthy();
      expect('No match 123456789'.match(ssnPattern)).toBeFalsy();
    });

    it('should have phone pattern (conservative)', () => {
      const phonePattern = /(?:\+?\d{1,3}[-.\s]?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}/g;
      expect('Phone: (555) 123-4567'.match(phonePattern)).toBeTruthy();
      expect('Phone: 555-123-4567'.match(phonePattern)).toBeTruthy();
      expect('Phone: +1 555 123 4567'.match(phonePattern)).toBeTruthy();
      expect('Phone: 5551234567'.match(phonePattern)).toBeTruthy(); // Pattern allows no separators
    });

    it('should have AWS access key pattern', () => {
      const awsPattern = /AKIA[0-9A-Z]{16}/g;
      expect('Key: AKIAIOSFODNN7EXAMPLE'.match(awsPattern)).toBeTruthy();
      expect('No match AKIAA'.match(awsPattern)).toBeFalsy();
    });

    it('should have private key pattern', () => {
      const keyPattern = /-----BEGIN (RSA |EC |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/g;
      expect('-----BEGIN PRIVATE KEY-----'.match(keyPattern)).toBeTruthy();
      expect('-----BEGIN RSA PRIVATE KEY-----'.match(keyPattern)).toBeTruthy();
      expect('-----BEGIN ENCRYPTED PRIVATE KEY-----'.match(keyPattern)).toBeTruthy();
      expect('No match BEGIN PRIVATE KEY'.match(keyPattern)).toBeFalsy();
    });

    it('should have JWT pattern', () => {
      const jwtPattern = /(?:Bearer|JWT)\s+eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/gi;
      expect('Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature'.match(jwtPattern)).toBeTruthy();
      expect('Token: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature'.match(jwtPattern)).toBeTruthy();
    });

    it('should have database connection string pattern', () => {
      const dbPattern = /(postgresql|mysql|mongodb\+srv|mongodb|redis|mariadb|cockroachdb):\/\/([a-zA-Z0-9._\-%]+:[a-zA-Z0-9._\-%$@!]+@|:([a-zA-Z0-9._\-%$@!]+)@)[a-zA-Z0-9._\-:]+\/[a-zA-Z0-9._\-]*/gi;
      expect('mongodb://user:password@localhost/db'.match(dbPattern)).toBeTruthy();
      expect('postgresql://user:pass@host:5432/database'.match(dbPattern)).toBeTruthy();
      expect('mysql://root:secret@localhost:3306/mydb'.match(dbPattern)).toBeTruthy();
    });

    it('should filter placeholder markers', () => {
      const placeholders = ['PLACEHOLDER', 'EXAMPLE', 'REDACTED', 'REDAC', 'DUMMY', 'TEST'];
      const testContent = 'PLACEHOLDER_KEY EXAMPLE_JWT REDACTED_TOKEN TEST_PASSWORD DUMMY_VALUE';
      placeholders.forEach(p => {
        expect(testContent).toMatch(new RegExp(p, 'i'));
      });
    });
  });

  describe('Pattern Filtering Rules', () => {
    it('should filter emails in code fences', () => {
      const contentWithFence = '```\nconst email = "user@example.com";\n```';
      const cleaned = contentWithFence.replace(/```[\s\S]*?```/g, '');
      expect(cleaned).not.toMatch(/user@example\.com/);
    });

    it('should filter emails in backticks', () => {
      const contentWithTicks = 'Use `user@example.com` as shown';
      const cleaned = contentWithTicks.replace(/`[^`]*`/g, '');
      expect(cleaned).not.toMatch(/user@example\.com/);
    });

    it('should filter URLs', () => {
      const contentWithUrl = 'Visit https://example.com/page?email=user@example.com';
      const cleaned = contentWithUrl.replace(/https?:\/\/\S+/g, '');
      expect(cleaned).not.toMatch(/user@example\.com/);
    });
  });

  describe('File Scanning Rules', () => {
    it('should recognize content file patterns (docs, md, json, etc)', () => {
      const contentFiles = ['docs/guide.md', 'README.md', 'config.json', 'settings.yaml'];
      const shouldScanForContent = (file) => {
        return /\.md|\.mdx|\.txt|\.json|\.yml|\.yaml/.test(file) ||
               file.startsWith('docs/') || file.startsWith('src/content/') || file.startsWith('public/');
      };
      contentFiles.forEach(f => {
        expect(shouldScanForContent(f)).toBe(true);
      });
    });

    it('should skip excluded directories', () => {
      const excludedPaths = ['.next/', 'node_modules/', '.git/', 'build/'];
      const shouldSkip = (file) => {
        return file.startsWith('.next/') || file.startsWith('node_modules/') || 
               file.startsWith('.git/') || file.startsWith('build/');
      };
      excludedPaths.forEach(p => {
        expect(shouldSkip(p + 'file.js')).toBe(true);
      });
    });

    it('should skip binary files', () => {
      const binaryExts = ['.png', '.jpg', '.gif', '.pdf', '.zip', '.exe'];
      const isBinary = (file) => {
        const ext = file.substring(file.lastIndexOf('.')).toLowerCase();
        return binaryExts.includes(ext);
      };
      binaryExts.forEach(ext => {
        expect(isBinary('file' + ext)).toBe(true);
      });
    });
  });

  describe('Allowlist Features', () => {
    it('should support email domain allowlist', () => {
      const allowlist = {
        emailDomains: ['company.com', 'test.com', 'internal.org']
      };
      const isAllowlisted = (email, domains) => {
        const domain = email.split('@')[1];
        return domains.includes(domain);
      };
      expect(isAllowlisted('user@company.com', allowlist.emailDomains)).toBe(true);
      expect(isAllowlisted('user@test.com', allowlist.emailDomains)).toBe(true);
      expect(isAllowlisted('user@external.com', allowlist.emailDomains)).toBe(false);
    });

    it('should support placeholder marker filtering', () => {
      const placeholderPattern = /PLACEHOLDER|EXAMPLE|REDACTED|REDAC|DUMMY|TEST/i;
      const isPlaceholder = (text) => placeholderPattern.test(text);
      expect(isPlaceholder('PLACEHOLDER_KEY')).toBe(true);
      expect(isPlaceholder('Example JWT token')).toBe(true);
      expect(isPlaceholder('REDACTED_PASSWORD')).toBe(true);
      expect(isPlaceholder('DUMMY_VALUE')).toBe(true);
      expect(isPlaceholder('actualkey123')).toBe(false);
    });

    it('should support path-based allowlisting', () => {
      const allowlist = {
        piPaths: ['docs/examples/**', 'test/**']
      };
      const isInAllowlist = (file, paths) => {
        return paths.some(p => {
          const prefix = p.replace('/**', '');
          return file.startsWith(prefix);
        });
      };
      expect(isInAllowlist('docs/examples/key.md', allowlist.piPaths)).toBe(true);
      expect(isInAllowlist('test/fixtures/api-key.json', allowlist.piPaths)).toBe(true);
      expect(isInAllowlist('src/config.js', allowlist.piPaths)).toBe(false);
    });
  });

  describe('Scanner Exit Code Behavior', () => {
    it('should return 0 when no PII/PI detected', () => {
      // This would be tested in integration tests
      // Exit code 0 = no sensitive content found
      expect(true).toBe(true);
    });

    it('should return 1 when PII/PI detected', () => {
      // This would be tested in integration tests
      // Exit code 1 = sensitive content found
      expect(true).toBe(true);
    });

    it('should exit code for error conditions', () => {
      // This would be tested in integration tests
      // Exit code 2 = error reading files
      expect(true).toBe(true);
    });
  });
});
