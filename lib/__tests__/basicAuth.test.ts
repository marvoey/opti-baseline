import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkBasicAuth } from '../basicAuth.ts';

const basic = (user: string, pass: string) => `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;

test('accepts the right password with any username', () => {
  assert.equal(checkBasicAuth(basic('', 's3cret'), 's3cret'), true);
  assert.equal(checkBasicAuth(basic('anyone', 's3cret'), 's3cret'), true);
});

test('accepts a password that contains a colon', () => {
  assert.equal(checkBasicAuth(basic('u', 'a:b:c'), 'a:b:c'), true);
});

test('rejects a wrong or partial password', () => {
  assert.equal(checkBasicAuth(basic('u', 'wrong'), 's3cret'), false);
  assert.equal(checkBasicAuth(basic('u', 's3cre'), 's3cret'), false);
  assert.equal(checkBasicAuth(basic('u', 's3cret!'), 's3cret'), false);
});

test('rejects a missing, malformed or non-Basic header', () => {
  assert.equal(checkBasicAuth(null, 's3cret'), false);
  assert.equal(checkBasicAuth('', 's3cret'), false);
  assert.equal(checkBasicAuth('Basic', 's3cret'), false);
  assert.equal(checkBasicAuth('Bearer s3cret', 's3cret'), false);
  assert.equal(checkBasicAuth(`Basic ${Buffer.from('nocolon').toString('base64')}`, 'nocolon'), false);
});

test('never matches when no password is configured', () => {
  assert.equal(checkBasicAuth(basic('u', ''), ''), false);
  assert.equal(checkBasicAuth(null, ''), false);
});
