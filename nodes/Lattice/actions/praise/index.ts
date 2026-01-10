/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { latticeApiRequest, latticeApiRequestAllItems } from '../../transport';
import { removeEmptyProperties } from '../../utils';
import { VISIBILITY_OPTIONS } from '../../constants';

export const praiseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['praise'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Give praise/kudos to a user',
				action: 'Create praise',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get praise by ID',
				action: 'Get praise',
			},
			{
				name: 'Get by User',
				value: 'getByUser',
				description: 'Get praise received by a user',
				action: 'Get user praise',
			},
			{
				name: 'Get Given by User',
				value: 'getGivenByUser',
				description: 'Get praise given by a user',
				action: 'Get praise given',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many praise items',
				action: 'Get many praise',
			},
		],
		default: 'getAll',
	},
];

export const praiseFields: INodeProperties[] = [
	// ----------------------------------
	//         praise: create
	// ----------------------------------
	{
		displayName: 'Receiver ID',
		name: 'receiverId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['praise'],
				operation: ['create'],
			},
		},
		description: 'User ID of the person receiving praise',
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
				resource: ['praise'],
				operation: ['create'],
			},
		},
		description: 'The praise message',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['praise'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Core Value ID',
				name: 'coreValueId',
				type: 'string',
				default: '',
				description: 'ID of the associated company core value',
			},
			{
				displayName: 'Visibility',
				name: 'visibility',
				type: 'options',
				options: VISIBILITY_OPTIONS,
				default: 'public',
				description: 'Who can see this praise',
			},
		],
	},

	// ----------------------------------
	//         praise: get
	// ----------------------------------
	{
		displayName: 'Praise ID',
		name: 'praiseId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['praise'],
				operation: ['get'],
			},
		},
		description: 'The ID of the praise',
	},

	// ----------------------------------
	//         praise: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['praise'],
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
				resource: ['praise'],
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
				resource: ['praise'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Core Value ID',
				name: 'coreValueId',
				type: 'string',
				default: '',
				description: 'Filter by core value',
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
	//         praise: getByUser, getGivenByUser
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['praise'],
				operation: ['getByUser', 'getGivenByUser'],
			},
		},
		description: 'The ID of the user',
	},
];

export async function executePraiseOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'create') {
		const receiverId = this.getNodeParameter('receiverId', i) as string;
		const body = this.getNodeParameter('body', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const requestBody: IDataObject = removeEmptyProperties({
			receiver_id: receiverId,
			body,
			core_value_id: additionalFields.coreValueId,
			visibility: additionalFields.visibility,
		});

		responseData = await latticeApiRequest.call(this, 'POST', '/praise', requestBody);
	} else if (operation === 'get') {
		const praiseId = this.getNodeParameter('praiseId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/praise/${praiseId}`);
	} else if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as IDataObject;

		const query: IDataObject = removeEmptyProperties({
			core_value_id: filters.coreValueId,
			visibility: filters.visibility,
		});

		if (returnAll) {
			responseData = await latticeApiRequestAllItems.call(this, 'GET', '/praise', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.per_page = limit;
			const response = await latticeApiRequest.call(this, 'GET', '/praise', {}, query);
			responseData = (response as IDataObject).data as IDataObject[];
		}
	} else if (operation === 'getByUser') {
		const userId = this.getNodeParameter('userId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/users/${userId}/praise/received`);
	} else if (operation === 'getGivenByUser') {
		const userId = this.getNodeParameter('userId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/users/${userId}/praise/given`);
	} else {
		throw new Error(`Operation "${operation}" is not supported for the Praise resource`);
	}

	return responseData;
}
