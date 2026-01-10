/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { latticeApiRequest, latticeApiRequestAllItems } from '../../transport';
import { REVIEW_STATUSES, REVIEW_TYPES } from '../../constants';

export const reviewOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['review'],
			},
		},
		options: [
			{
				name: 'Get by User',
				value: 'getByUser',
				description: "Get a user's reviews",
				action: 'Get user reviews',
			},
			{
				name: 'Get Cycle',
				value: 'getCycle',
				description: 'Get a review cycle by ID',
				action: 'Get review cycle',
			},
			{
				name: 'Get Cycles',
				value: 'getCycles',
				description: 'Get all review cycles',
				action: 'Get review cycles',
			},
			{
				name: 'Get Questions',
				value: 'getQuestions',
				description: 'Get questions for a review cycle',
				action: 'Get cycle questions',
			},
			{
				name: 'Get Responses',
				value: 'getResponses',
				description: 'Get submitted responses for a review',
				action: 'Get review responses',
			},
			{
				name: 'Get Review',
				value: 'getReview',
				description: 'Get a specific review',
				action: 'Get a review',
			},
		],
		default: 'getCycles',
	},
];

export const reviewFields: INodeProperties[] = [
	// ----------------------------------
	//         review: getCycles
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['review'],
				operation: ['getCycles'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		displayOptions: {
			show: {
				resource: ['review'],
				operation: ['getCycles'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['review'],
				operation: ['getCycles'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: REVIEW_STATUSES,
				default: '',
				description: 'Filter by cycle status',
			},
		],
	},

	// ----------------------------------
	//         review: getCycle, getQuestions
	// ----------------------------------
	{
		displayName: 'Cycle ID',
		name: 'cycleId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['review'],
				operation: ['getCycle', 'getQuestions'],
			},
		},
		description: 'The ID of the review cycle',
	},

	// ----------------------------------
	//         review: getReview, getResponses
	// ----------------------------------
	{
		displayName: 'Review ID',
		name: 'reviewId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['review'],
				operation: ['getReview', 'getResponses'],
			},
		},
		description: 'The ID of the review',
	},

	// ----------------------------------
	//         review: getByUser
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['review'],
				operation: ['getByUser'],
			},
		},
		description: 'The ID of the user',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['review'],
				operation: ['getByUser'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: REVIEW_STATUSES,
				default: '',
				description: 'Filter by review status',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: REVIEW_TYPES,
				default: '',
				description: 'Filter by review type',
			},
		],
	},
];

export async function executeReviewOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'getCycles') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as IDataObject;

		const query: IDataObject = {};
		if (filters.status) {
			query.status = filters.status;
		}

		if (returnAll) {
			responseData = await latticeApiRequestAllItems.call(this, 'GET', '/review-cycles', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.per_page = limit;
			const response = await latticeApiRequest.call(this, 'GET', '/review-cycles', {}, query);
			responseData = (response as IDataObject).data as IDataObject[];
		}
	} else if (operation === 'getCycle') {
		const cycleId = this.getNodeParameter('cycleId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/review-cycles/${cycleId}`);
	} else if (operation === 'getReview') {
		const reviewId = this.getNodeParameter('reviewId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/reviews/${reviewId}`);
	} else if (operation === 'getByUser') {
		const userId = this.getNodeParameter('userId', i) as string;
		const filters = this.getNodeParameter('filters', i) as IDataObject;

		const query: IDataObject = {};
		if (filters.status) {
			query.status = filters.status;
		}
		if (filters.type) {
			query.type = filters.type;
		}

		responseData = await latticeApiRequest.call(this, 'GET', `/users/${userId}/reviews`, {}, query);
	} else if (operation === 'getQuestions') {
		const cycleId = this.getNodeParameter('cycleId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/review-cycles/${cycleId}/questions`);
	} else if (operation === 'getResponses') {
		const reviewId = this.getNodeParameter('reviewId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/reviews/${reviewId}/responses`);
	} else {
		throw new Error(`Operation "${operation}" is not supported for the Review resource`);
	}

	return responseData;
}
