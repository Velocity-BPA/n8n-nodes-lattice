/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

/**
 * Removes undefined and empty string values from an object
 * Keeps null, false, and 0 values
 */
export function cleanDataObject(obj: IDataObject): IDataObject {
	const result: IDataObject = {};

	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined && value !== '') {
			result[key] = value;
		}
	}

	return result;
}

/**
 * Alias for cleanDataObject for backward compatibility
 */
export function removeEmptyProperties(obj: IDataObject): IDataObject {
	return cleanDataObject(obj);
}

/**
 * Formats a date for the Lattice API
 */
export function formatDateForApi(date: Date | string): string {
	if (date instanceof Date) {
		return date.toISOString();
	}
	return date;
}

/**
 * Converts a string to a date in ISO format
 */
export function toIsoDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toISOString();
}

/**
 * Validates an email address format
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Builds query string object from filters, excluding undefined values
 */
export function buildQueryString(filters: IDataObject): IDataObject {
	const query: IDataObject = {};

	for (const [key, value] of Object.entries(filters)) {
		if (value !== undefined) {
			query[key] = value;
		}
	}

	return query;
}

/**
 * Builds query parameters from options
 */
export function buildQueryParams(options: IDataObject): IDataObject {
	const query: IDataObject = {};

	if (options.page) {
		query.page = options.page;
	}

	if (options.perPage) {
		query.per_page = options.perPage;
	}

	if (options.userId) {
		query.user_id = options.userId;
	}

	if (options.teamId) {
		query.team_id = options.teamId;
	}

	if (options.status) {
		query.status = options.status;
	}

	if (options.timePeriod) {
		query.time_period = options.timePeriod;
	}

	if (options.year) {
		query.year = options.year;
	}

	return query;
}

/**
 * Simplifies API response for cleaner output
 */
export function simplifyResponse(data: IDataObject): IDataObject {
	// Remove metadata and return just the core data
	if (data.data && typeof data.data === 'object') {
		return data.data as IDataObject;
	}
	return data;
}

/**
 * Parses key results from input (array or string)
 */
export function parseKeyResults(input: unknown): IDataObject[] {
	if (!input) {
		return [];
	}

	// If already an array, filter out invalid entries
	if (Array.isArray(input)) {
		return input.filter((item) => {
			if (typeof item === 'object' && item !== null) {
				const kr = item as IDataObject;
				return kr.title && String(kr.title).trim() !== '';
			}
			return false;
		}) as IDataObject[];
	}

	// If string, try to parse as JSON
	if (typeof input === 'string') {
		if (!input.trim()) {
			return [];
		}

		try {
			const parsed = JSON.parse(input);
			if (Array.isArray(parsed)) {
				return parseKeyResults(parsed);
			}
			return [parsed as IDataObject];
		} catch {
			// If not JSON, treat as comma-separated list of key result titles
			return input.split(',').map((title) => ({
				title: title.trim(),
			}));
		}
	}

	return [];
}

/**
 * Formats a user display name
 */
export function formatUserName(user: IDataObject): string {
	const firstName = user.first_name as string || '';
	const lastName = user.last_name as string || '';
	return `${firstName} ${lastName}`.trim() || (user.email as string) || 'Unknown User';
}

/**
 * Gets the current year
 */
export function getCurrentYear(): number {
	return new Date().getFullYear();
}

/**
 * Gets the current quarter
 */
export function getCurrentQuarter(): string {
	const month = new Date().getMonth();
	if (month < 3) return 'Q1';
	if (month < 6) return 'Q2';
	if (month < 9) return 'Q3';
	return 'Q4';
}
