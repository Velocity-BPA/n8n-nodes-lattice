/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { latticeApiRequest, latticeApiRequestAllItems } from '../../transport';

export const competencyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['competency'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a competency by ID',
				action: 'Get a competency',
			},
			{
				name: 'Get by Level',
				value: 'getByLevel',
				description: 'Get competencies for a job level',
				action: 'Get competencies by level',
			},
			{
				name: 'Get by User',
				value: 'getByUser',
				description: "Get a user's competency ratings",
				action: 'Get user competencies',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many competencies',
				action: 'Get many competencies',
			},
		],
		default: 'getAll',
	},
];

export const competencyFields: INodeProperties[] = [
	// ----------------------------------
	//         competency: get
	// ----------------------------------
	{
		displayName: 'Competency ID',
		name: 'competencyId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['competency'],
				operation: ['get'],
			},
		},
		description: 'The ID of the competency',
	},

	// ----------------------------------
	//         competency: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['competency'],
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
				resource: ['competency'],
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
				resource: ['competency'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Category',
				name: 'category',
				type: 'string',
				default: '',
				description: 'Filter by competency category',
			},
		],
	},

	// ----------------------------------
	//         competency: getByUser
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['competency'],
				operation: ['getByUser'],
			},
		},
		description: 'The ID of the user',
	},

	// ----------------------------------
	//         competency: getByLevel
	// ----------------------------------
	{
		displayName: 'Level ID',
		name: 'levelId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['competency'],
				operation: ['getByLevel'],
			},
		},
		description: 'The ID of the job level',
	},
];

export async function executeCompetencyOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'get') {
		const competencyId = this.getNodeParameter('competencyId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/competencies/${competencyId}`);
	} else if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as IDataObject;

		const query: IDataObject = {};
		if (filters.category) {
			query.category = filters.category;
		}

		if (returnAll) {
			responseData = await latticeApiRequestAllItems.call(this, 'GET', '/competencies', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.per_page = limit;
			const response = await latticeApiRequest.call(this, 'GET', '/competencies', {}, query);
			responseData = (response as IDataObject).data as IDataObject[];
		}
	} else if (operation === 'getByUser') {
		const userId = this.getNodeParameter('userId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/users/${userId}/competencies`);
	} else if (operation === 'getByLevel') {
		const levelId = this.getNodeParameter('levelId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/levels/${levelId}/competencies`);
	} else {
		throw new Error(`Operation "${operation}" is not supported for the Competency resource`);
	}

	return responseData;
}
