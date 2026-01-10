/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const GOAL_STATUSES = [
	{ name: 'On Track', value: 'on_track' },
	{ name: 'Behind', value: 'behind' },
	{ name: 'At Risk', value: 'at_risk' },
	{ name: 'Complete', value: 'complete' },
];

export const GOAL_TIME_PERIODS = [
	{ name: 'Q1', value: 'Q1' },
	{ name: 'Q2', value: 'Q2' },
	{ name: 'Q3', value: 'Q3' },
	{ name: 'Q4', value: 'Q4' },
	{ name: 'Annual', value: 'Annual' },
];

export const USER_STATUSES = [
	{ name: 'Active', value: 'active' },
	{ name: 'Deactivated', value: 'deactivated' },
];

export const REVIEW_STATUSES = [
	{ name: 'Draft', value: 'draft' },
	{ name: 'Active', value: 'active' },
	{ name: 'Complete', value: 'complete' },
];

export const REVIEW_TYPES = [
	{ name: 'Self', value: 'self' },
	{ name: 'Peer', value: 'peer' },
	{ name: 'Manager', value: 'manager' },
	{ name: 'Upward', value: 'upward' },
];

export const FEEDBACK_TYPES = [
	{ name: 'Praise', value: 'praise' },
	{ name: 'Constructive', value: 'constructive' },
];

export const VISIBILITY_OPTIONS = [
	{ name: 'Public', value: 'public' },
	{ name: 'Private', value: 'private' },
	{ name: 'Manager Only', value: 'manager_only' },
];

export const MEETING_FREQUENCIES = [
	{ name: 'Weekly', value: 'weekly' },
	{ name: 'Biweekly', value: 'biweekly' },
	{ name: 'Monthly', value: 'monthly' },
];

export const MEETING_STATUSES = [
	{ name: 'Scheduled', value: 'scheduled' },
	{ name: 'Completed', value: 'completed' },
	{ name: 'Canceled', value: 'canceled' },
];

export const UPDATE_TYPES = [
	{ name: 'Weekly', value: 'weekly' },
	{ name: 'Daily', value: 'daily' },
];

export const MOOD_OPTIONS = [
	{ name: 'Great', value: 'great' },
	{ name: 'Good', value: 'good' },
	{ name: 'Okay', value: 'okay' },
	{ name: 'Bad', value: 'bad' },
];

export const CUSTOM_ATTRIBUTE_TYPES = [
	{ name: 'Text', value: 'text' },
	{ name: 'Number', value: 'number' },
	{ name: 'Date', value: 'date' },
	{ name: 'Dropdown', value: 'dropdown' },
];
