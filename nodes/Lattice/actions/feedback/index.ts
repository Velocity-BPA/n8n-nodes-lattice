/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { latticeApiRequest, latticeApiRequestAllItems } from '../../transport';
import { removeEmptyProperties } from '../../utils';
import { FEEDBACK_TYPES, VISIBILITY_OPTIONS } from '../../constants';

export const feedbackOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['feedback'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Give feedback to a user',
				action: 'Create feedback',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get feedback by ID',
				action: 'Get feedback',
			},
			{
				name: 'Get by User',
				value: 'getByUser',
				description: 'Get feedback for or from a user',
				action: 'Get user feedback',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many feedback items',
				action: 'Get many feedback',
			},
			{
				name: 'Get Stats',
				value: 'getStats',
				description: 'Get feedback analytics',
				action: 'Get feedback stats',
			},
			{
				name: 'Request',
				value: 'request',
				description: 'Request feedback from others',
				action: 'Request feedback',
			},
		],
		default: 'getAll',
	},
];

export const feedbackFields: INodeProperties[] = [
	// ----------------------------------
	//         feedback: create
	// ----------------------------------
	{
		displayName: 'Receiver ID',
		name: 'receiverId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['feedback'],
				operation: ['create'],
			},
		},
		description: 'User ID of the person receiving feedback',
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['feedback'],
				operation: ['create'],
			},
		},
		description: 'The feedback content',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: FEEDBACK_TYPES,
		required: true,
		default: 'praise',
		displayOptions: {
			show: {
				resource: ['feedback'],
				operation: ['create'],
			},
		},
		description: 'Type of feedback',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['feedback'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Visibility',
				name: 'visibility',
				type: 'options',
				options: VISIBILITY_OPTIONS,
				default: 'public',
				description: 'Who can see this feedback',
			},
		],
	},

	// ----------------------------------
	//         feedback: get
	// ----------------------------------
	{
		displayName: 'Feedback ID',
		name: 'feedbackId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['feedback'],
				operation: ['get'],
			},
		},
		description: 'The ID of the feedback',
	},

	// ----------------------------------
	//         feedback: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['feedback'],
				operation: ['getAll'],
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
				resource: ['feedback'],
				operation: ['getAll'],
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
				resource: ['feedback'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: FEEDBACK_TYPES,
				default: '',
				description: 'Filter by feedback type',
			},
			{
				displayName: 'Visibility',
				name: 'visibility',
				type: 'options',
				options: VISIBILITY_OPTIONS,
				default: '',
				description: 'Filter by visibility',
			},
		],
	},

	// ----------------------------------
	//         feedback: getByUser
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['feedback'],
				operation: ['getByUser'],
			},
		},
		description: 'The ID of the user',
	},
	{
		displayName: 'Direction',
		name: 'direction',
		type: 'options',
		options: [
			{
				name: 'Received',
				value: 'received',
			},
			{
				name: 'Given',
				value: 'given',
			},
		],
		default: 'received',
		displayOptions: {
			show: {
				resource: ['feedback'],
				operation: ['getByUser'],
			},
		},
		description: 'Whether to get feedback received or given',
	},

	// ----------------------------------
	//         feedback: request
	// ----------------------------------
	{
		displayName: 'Requestee IDs',
		name: 'requesteeIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['feedback'],
				operation: ['request'],
			},
		},
		description: 'Comma-separated list of user IDs to request feedback from',
	},
	{
		displayName: 'About User ID',
		name: 'aboutUserId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['feedback'],
				operation: ['request'],
			},
		},
		description: 'User ID of the person feedback is requested about',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['feedback'],
				operation: ['request'],
			},
		},
		description: 'Optional message to include with the request',
	},
];

export async function executeFeedbackOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'create') {
		const receiverId = this.getNodeParameter('receiverId', i) as string;
		const body = this.getNodeParameter('body', i) as string;
		const type = this.getNodeParameter('type', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const requestBody: IDataObject = removeEmptyProperties({
			receiver_id: receiverId,
			body,
			type,
			visibility: additionalFields.visibility,
		});

		responseData = await latticeApiRequest.call(this, 'POST', '/feedback', requestBody);
	} else if (operation === 'get') {
		const feedbackId = this.getNodeParameter('feedbackId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/feedback/${feedbackId}`);
	} else if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as IDataObject;

		const query: IDataObject = removeEmptyProperties({
			type: filters.type,
			visibility: filters.visibility,
		});

		if (returnAll) {
			responseData = await latticeApiRequestAllItems.call(this, 'GET', '/feedback', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.per_page = limit;
			const response = await latticeApiRequest.call(this, 'GET', '/feedback', {}, query);
			responseData = (response as IDataObject).data as IDataObject[];
		}
	} else if (operation === 'getByUser') {
		const userId = this.getNodeParameter('userId', i) as string;
		const direction = this.getNodeParameter('direction', i) as string;

		const endpoint = direction === 'received'
			? `/users/${userId}/feedback/received`
			: `/users/${userId}/feedback/given`;

		responseData = await latticeApiRequest.call(this, 'GET', endpoint);
	} else if (operation === 'getStats') {
		responseData = await latticeApiRequest.call(this, 'GET', '/feedback/stats');
	} else if (operation === 'request') {
		const requesteeIds = this.getNodeParameter('requesteeIds', i) as string;
		const aboutUserId = this.getNodeParameter('aboutUserId', i) as string;
		const message = this.getNodeParameter('message', i) as string;

		const requestBody: IDataObject = removeEmptyProperties({
			requestee_ids: requesteeIds.split(',').map((id) => id.trim()),
			about_user_id: aboutUserId,
			message,
		});

		responseData = await latticeApiRequest.call(this, 'POST', '/feedback/requests', requestBody);
	} else {
		throw new Error(`Operation "${operation}" is not supported for the Feedback resource`);
	}

	return responseData;
}
