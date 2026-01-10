/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { latticeApiRequest, latticeApiRequestAllItems } from '../../transport';
import { removeEmptyProperties } from '../../utils';
import { UPDATE_TYPES, MOOD_OPTIONS } from '../../constants';

export const updateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['update'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Post a status update',
				action: 'Create an update',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an update by ID',
				action: 'Get an update',
			},
			{
				name: 'Get by Team',
				value: 'getByTeam',
				description: "Get a team's updates",
				action: 'Get team updates',
			},
			{
				name: 'Get by User',
				value: 'getByUser',
				description: "Get a user's updates",
				action: 'Get user updates',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many updates',
				action: 'Get many updates',
			},
		],
		default: 'getAll',
	},
];

export const updateFields: INodeProperties[] = [
	// ----------------------------------
	//         update: create
	// ----------------------------------
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
				resource: ['update'],
				operation: ['create'],
			},
		},
		description: 'The update content',
	},
	{
		displayName: 'Update Type',
		name: 'updateType',
		type: 'options',
		options: UPDATE_TYPES,
		required: true,
		default: 'weekly',
		displayOptions: {
			show: {
				resource: ['update'],
				operation: ['create'],
			},
		},
		description: 'Type of update',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['update'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Blockers',
				name: 'blockers',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Comma-separated list of blockers',
			},
			{
				displayName: 'Mood',
				name: 'mood',
				type: 'options',
				options: MOOD_OPTIONS,
				default: 'good',
				description: 'How the user is feeling',
			},
		],
	},

	// ----------------------------------
	//         update: get
	// ----------------------------------
	{
		displayName: 'Update ID',
		name: 'updateId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['update'],
				operation: ['get'],
			},
		},
		description: 'The ID of the update',
	},

	// ----------------------------------
	//         update: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['update'],
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
				resource: ['update'],
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
				resource: ['update'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Update Type',
				name: 'updateType',
				type: 'options',
				options: UPDATE_TYPES,
				default: '',
				description: 'Filter by update type',
			},
		],
	},

	// ----------------------------------
	//         update: getByUser
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['update'],
				operation: ['getByUser'],
			},
		},
		description: 'The ID of the user',
	},

	// ----------------------------------
	//         update: getByTeam
	// ----------------------------------
	{
		displayName: 'Team ID',
		name: 'teamId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['update'],
				operation: ['getByTeam'],
			},
		},
		description: 'The ID of the team',
	},
];

export async function executeUpdateOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'create') {
		const body = this.getNodeParameter('body', i) as string;
		const updateType = this.getNodeParameter('updateType', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		let blockers: string[] | undefined;
		if (additionalFields.blockers) {
			blockers = (additionalFields.blockers as string).split(',').map((b) => b.trim());
		}

		const requestBody: IDataObject = removeEmptyProperties({
			body,
			update_type: updateType,
			mood: additionalFields.mood,
			blockers,
		});

		responseData = await latticeApiRequest.call(this, 'POST', '/updates', requestBody);
	} else if (operation === 'get') {
		const updateId = this.getNodeParameter('updateId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/updates/${updateId}`);
	} else if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as IDataObject;

		const query: IDataObject = {};
		if (filters.updateType) {
			query.update_type = filters.updateType;
		}

		if (returnAll) {
			responseData = await latticeApiRequestAllItems.call(this, 'GET', '/updates', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.per_page = limit;
			const response = await latticeApiRequest.call(this, 'GET', '/updates', {}, query);
			responseData = (response as IDataObject).data as IDataObject[];
		}
	} else if (operation === 'getByUser') {
		const userId = this.getNodeParameter('userId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/users/${userId}/updates`);
	} else if (operation === 'getByTeam') {
		const teamId = this.getNodeParameter('teamId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/teams/${teamId}/updates`);
	} else {
		throw new Error(`Operation "${operation}" is not supported for the Update resource`);
	}

	return responseData;
}
