/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { latticeApiRequest, latticeApiRequestAllItems } from '../../transport';
import { CUSTOM_ATTRIBUTE_TYPES } from '../../constants';

export const customAttributeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customAttribute'],
			},
		},
		options: [
			{
				name: 'Get by User',
				value: 'getByUser',
				description: "Get a user's custom field values",
				action: 'Get user custom attributes',
			},
			{
				name: 'Get Definitions',
				value: 'getDefinitions',
				description: 'Get all custom attribute definitions',
				action: 'Get attribute definitions',
			},
			{
				name: 'Update by User',
				value: 'updateByUser',
				description: "Update a user's custom field values",
				action: 'Update user custom attributes',
			},
		],
		default: 'getDefinitions',
	},
];

export const customAttributeFields: INodeProperties[] = [
	// ----------------------------------
	//         customAttribute: getDefinitions
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['customAttribute'],
				operation: ['getDefinitions'],
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
				resource: ['customAttribute'],
				operation: ['getDefinitions'],
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
				resource: ['customAttribute'],
				operation: ['getDefinitions'],
			},
		},
		options: [
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: CUSTOM_ATTRIBUTE_TYPES,
				default: '',
				description: 'Filter by attribute type',
			},
		],
	},

	// ----------------------------------
	//         customAttribute: getByUser
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['customAttribute'],
				operation: ['getByUser'],
			},
		},
		description: 'The ID of the user',
	},

	// ----------------------------------
	//         customAttribute: updateByUser
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['customAttribute'],
				operation: ['updateByUser'],
			},
		},
		description: 'The ID of the user',
	},
	{
		displayName: 'Attributes',
		name: 'attributes',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Attribute',
		default: {},
		displayOptions: {
			show: {
				resource: ['customAttribute'],
				operation: ['updateByUser'],
			},
		},
		options: [
			{
				displayName: 'Attribute',
				name: 'attribute',
				values: [
					{
						displayName: 'Attribute ID',
						name: 'attributeId',
						type: 'string',
						default: '',
						description: 'The ID of the custom attribute definition',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The value to set for the attribute',
					},
				],
			},
		],
	},
];

export async function executeCustomAttributeOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'getDefinitions') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as IDataObject;

		const query: IDataObject = {};
		if (filters.type) {
			query.type = filters.type;
		}

		if (returnAll) {
			responseData = await latticeApiRequestAllItems.call(this, 'GET', '/custom-attributes', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.per_page = limit;
			const response = await latticeApiRequest.call(this, 'GET', '/custom-attributes', {}, query);
			responseData = (response as IDataObject).data as IDataObject[];
		}
	} else if (operation === 'getByUser') {
		const userId = this.getNodeParameter('userId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/users/${userId}/custom-attributes`);
	} else if (operation === 'updateByUser') {
		const userId = this.getNodeParameter('userId', i) as string;
		const attributesData = this.getNodeParameter('attributes', i) as IDataObject;
		const attributes = (attributesData.attribute as IDataObject[]) || [];

		const body: IDataObject = {
			attributes: attributes.map((attr) => ({
				attribute_id: attr.attributeId,
				value: attr.value,
			})),
		};

		responseData = await latticeApiRequest.call(this, 'PATCH', `/users/${userId}/custom-attributes`, body);
	} else {
		throw new Error(`Operation "${operation}" is not supported for the Custom Attribute resource`);
	}

	return responseData;
}
