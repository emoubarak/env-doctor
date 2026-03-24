import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateValue } from '../validator';

describe('Validator', () => {
  it('should validate a correct URL', async () => {
    const result = validateValue('https://example.com', { format: 'url' });
    assert.strictEqual(result.isValid, true);
  });

  it('should reject an incorrect URL', async () => {
    const result = validateValue('not-a-url', { format: 'url' });
    assert.strictEqual(result.isValid, false);
  });

  it('should validate a correct email', async () => {
    const result = validateValue('test@example.com', { format: 'email' });
    assert.strictEqual(result.isValid, true);
  });

  it('should reject an incorrect email', async () => {
    const result = validateValue('not-an-email', { format: 'email' });
    assert.strictEqual(result.isValid, false);
  });
});