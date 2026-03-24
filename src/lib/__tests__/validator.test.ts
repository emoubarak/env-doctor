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

  it('should validate a correct UUID', async () => {
    const result = validateValue('550e8400-e29b-41d4-a716-446655440000', { format: 'uuid' });
    assert.strictEqual(result.isValid, true);
  });

  it('should reject an incorrect UUID', async () => {
    const result = validateValue('not-a-uuid', { format: 'uuid' });
    assert.strictEqual(result.isValid, false);
  });

  it('should validate a correct regex pattern', async () => {
    const result = validateValue('abc123', { format: 'regex', pattern: '^[a-z][0-9]+$' });
    assert.strictEqual(result.isValid, true);
  });

  it('should reject an incorrect regex pattern', async () => {
    const result = validateValue('123abc', { format: 'regex', pattern: '^[a-z][0-9]+$' });
    assert.strictEqual(result.isValid, false);
  });

  it('should validate a correct date', async () => {
    const result = validateValue('2023-01-01', { format: 'date' });
    assert.strictEqual(result.isValid, true);
  });

  it('should reject an incorrect date', async () => {
    const result = validateValue('invalid-date', { format: 'date' });
    assert.strictEqual(result.isValid, false);
  });

  it('should validate a correct datetime', async () => {
    const result = validateValue('2023-01-01T10:00:00Z', { format: 'datetime' });
    assert.strictEqual(result.isValid, true);
  });

  it('should reject an incorrect datetime', async () => {
    const result = validateValue('invalid-datetime', { format: 'datetime' });
    assert.strictEqual(result.isValid, false);
  });

  it('should validate a correct port', async () => {
    const result = validateValue('8080', { format: 'port' });
    assert.strictEqual(result.isValid, true);
  });

  it('should reject an incorrect port', async () => {
    const result = validateValue('70000', { format: 'port' });
    assert.strictEqual(result.isValid, false);
  });

  it('should validate a correct host', async () => {
    const result = validateValue('example.com', { format: 'host' });
    assert.strictEqual(result.isValid, true);
  });

  it('should reject an incorrect host', async () => {
    const result = validateValue('invalid_host!', { format: 'host' });
    assert.strictEqual(result.isValid, false);
  });

  it('should validate a correct semver', async () => {
    const result = validateValue('1.0.0', { format: 'semver' });
    assert.strictEqual(result.isValid, true);
  });

  it('should reject an incorrect semver', async () => {
    const result = validateValue('1.0', { format: 'semver' });
    assert.strictEqual(result.isValid, false);
  });

  it('should validate a correct hex color', async () => {
    const result = validateValue('#ffffff', { format: 'hex' });
    assert.strictEqual(result.isValid, true);
  });

  it('should reject an incorrect hex color', async () => {
    const result = validateValue('#gggggg', { format: 'hex' });
    assert.strictEqual(result.isValid, false);
  });

  it('should validate a correct base64 string', async () => {
    const result = validateValue('SGVsbG8gV29ybGQ=', { format: 'base64' });
    assert.strictEqual(result.isValid, true);
  });

  it('should reject an incorrect base64 string', async () => {
    const result = validateValue('invalid-base64', { format: 'base64' });
    assert.strictEqual(result.isValid, false);
  });
});