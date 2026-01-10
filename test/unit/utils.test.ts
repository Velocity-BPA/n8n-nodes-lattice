/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	cleanDataObject,
	formatDateForApi,
	parseKeyResults,
	buildQueryString,
} from '../../nodes/Lattice/utils';

describe('Lattice Utilities', () => {
	describe('cleanDataObject', () => {
		it('should remove undefined values', () => {
			const input = {
				name: 'Test',
				value: undefined,
				count: 0,
			};
			const result = cleanDataObject(input);
			expect(result).toEqual({ name: 'Test', count: 0 });
		});

		it('should remove empty strings', () => {
			const input = {
				name: 'Test',
				description: '',
				valid: true,
			};
			const result = cleanDataObject(input);
			expect(result).toEqual({ name: 'Test', valid: true });
		});

		it('should keep null values', () => {
			const input = {
				name: 'Test',
				value: null,
			};
			const result = cleanDataObject(input);
			expect(result).toEqual({ name: 'Test', value: null });
		});

		it('should handle empty objects', () => {
			const result = cleanDataObject({});
			expect(result).toEqual({});
		});

		it('should keep zero values', () => {
			const input = { count: 0, progress: 0 };
			const result = cleanDataObject(input);
			expect(result).toEqual({ count: 0, progress: 0 });
		});

		it('should keep false boolean values', () => {
			const input = { active: false, enabled: true };
			const result = cleanDataObject(input);
			expect(result).toEqual({ active: false, enabled: true });
		});
	});

	describe('formatDateForApi', () => {
		it('should format Date object to ISO string', () => {
			const date = new Date('2024-01-15T10:30:00Z');
			const result = formatDateForApi(date);
			expect(result).toBe('2024-01-15T10:30:00.000Z');
		});

		it('should pass through string dates', () => {
			const dateString = '2024-01-15';
			const result = formatDateForApi(dateString);
			expect(result).toBe('2024-01-15');
		});

		it('should handle ISO string input', () => {
			const isoString = '2024-01-15T10:30:00.000Z';
			const result = formatDateForApi(isoString);
			expect(result).toBe('2024-01-15T10:30:00.000Z');
		});
	});

	describe('parseKeyResults', () => {
		it('should parse valid key results array', () => {
			const input = [
				{ title: 'KR1', targetValue: 100 },
				{ title: 'KR2', targetValue: 50 },
			];
			const result = parseKeyResults(input);
			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({ title: 'KR1', targetValue: 100 });
		});

		it('should handle empty array', () => {
			const result = parseKeyResults([]);
			expect(result).toEqual([]);
		});

		it('should handle undefined', () => {
			const result = parseKeyResults(undefined);
			expect(result).toEqual([]);
		});

		it('should filter out invalid entries', () => {
			const input = [
				{ title: 'Valid', targetValue: 100 },
				{ title: '', targetValue: 50 }, // Invalid - empty title
				{ title: 'Also Valid', targetValue: 0 },
			];
			const result = parseKeyResults(input);
			expect(result).toHaveLength(2);
		});
	});

	describe('buildQueryString', () => {
		it('should build query object from filters', () => {
			const filters = {
				status: 'active',
				department: 'Engineering',
			};
			const result = buildQueryString(filters);
			expect(result).toEqual({
				status: 'active',
				department: 'Engineering',
			});
		});

		it('should skip undefined values', () => {
			const filters = {
				status: 'active',
				department: undefined,
			};
			const result = buildQueryString(filters);
			expect(result).toEqual({ status: 'active' });
		});

		it('should handle empty filters', () => {
			const result = buildQueryString({});
			expect(result).toEqual({});
		});

		it('should handle pagination parameters', () => {
			const filters = {
				page: 1,
				per_page: 25,
			};
			const result = buildQueryString(filters);
			expect(result).toEqual({ page: 1, per_page: 25 });
		});
	});
});
