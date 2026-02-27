import { describe, expect, test } from 'bun:test';
import { getHash } from '../source/functions/getHash';

describe('getHash', () => {
	test('returns the same hash for the same input', () => {
		const hash1 = getHash('test-input');
		const hash2 = getHash('test-input');
		expect(hash1).toBe(hash2);
	});

	test('returns different hashes for different inputs', () => {
		const hash1 = getHash('input-a');
		const hash2 = getHash('input-b');
		expect(hash1).not.toBe(hash2);
	});
});
