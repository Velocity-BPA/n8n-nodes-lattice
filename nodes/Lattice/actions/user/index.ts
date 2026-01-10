/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { latticeApiRequest, latticeApiRequestAllItems } from '../../transport';
import { removeEmptyProperties } from '../../utils';
import { USER_STATUSES } from '../../constants';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new user (invite)',
				action: 'Create a user',
			},
			{
				name: 'Deactivate',
				value: 'deactivate',
				description: 'Deactivate a user account',
				action: 'Deactivate a user',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a user by ID',
				action: 'Get a user',
			},
			{
				name: 'Get Direct Reports',
				value: 'getDirectReports',
				description: "Get a user's direct reports",
				action: 'Get direct reports',
			},
			{
				name: 'Get Manager',
				value: 'getManager',
				description: "Get a user's manager",
				action: 'Get manager',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many users',
				action: 'Get many users',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update user details',
				action: 'Update a user',
			},
			{
				name: 'Update Manager',
				value: 'updateManager',
				description: "Update a user's manager",
				action: 'Update manager',
			},
		],
		default: 'getAll',
	},
];

export const userFields: INodeProperties[] = [
	// ----------------------------------
	//         user: create
	// ----------------------------------
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
		description: 'Email address of the user to invite',
	},
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
		description: "User's first name",
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
		description: "User's last name",
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Department',
				name: 'department',
				type: 'string',
				default: '',
				description: 'Department name',
			},
			{
				displayName: 'Manager ID',
				name: 'managerId',
				type: 'string',
				default: '',
				description: "ID of the user's manager",
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Employment start date',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Job title',
			},
		],
	},

	// ----------------------------------
	//         user: get
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'deactivate', 'getManager', 'getDirectReports'],
			},
		},
		description: 'The ID of the user',
	},

	// ----------------------------------
	//         user: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['user'],
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
				resource: ['user'],
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
				resource: ['user'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: USER_STATUSES,
				default: 'active',
				description: 'Filter by user status',
			},
		],
	},

	// ----------------------------------
	//         user: update
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['update'],
			},
		},
		description: 'The ID of the user to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Department',
				name: 'department',
				type: 'string',
				default: '',
				description: 'Department name',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: "User's first name",
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: "User's last name",
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Employment start date',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Job title',
			},
		],
	},

	// ----------------------------------
	//         user: updateManager
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['updateManager'],
			},
		},
		description: 'The ID of the user',
	},
	{
		displayName: 'Manager ID',
		name: 'managerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['updateManager'],
			},
		},
		description: 'The ID of the new manager',
	},
];

export async function executeUserOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'create') {
		const email = this.getNodeParameter('email', i) as string;
		const firstName = this.getNodeParameter('firstName', i) as string;
		const lastName = this.getNodeParameter('lastName', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = removeEmptyProperties({
			email,
			first_name: firstName,
			last_name: lastName,
			title: additionalFields.title,
			department: additionalFields.department,
			manager_id: additionalFields.managerId,
			start_date: additionalFields.startDate,
		});

		responseData = await latticeApiRequest.call(this, 'POST', '/users', body);
	} else if (operation === 'get') {
		const userId = this.getNodeParameter('userId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/users/${userId}`);
	} else if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as IDataObject;

		const query: IDataObject = {};
		if (filters.status) {
			query.status = filters.status;
		}

		if (returnAll) {
			responseData = await latticeApiRequestAllItems.call(this, 'GET', '/users', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.per_page = limit;
			const response = await latticeApiRequest.call(this, 'GET', '/users', {}, query);
			responseData = (response as IDataObject).data as IDataObject[];
		}
	} else if (operation === 'update') {
		const userId = this.getNodeParameter('userId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

		const body: IDataObject = removeEmptyProperties({
			first_name: updateFields.firstName,
			last_name: updateFields.lastName,
			title: updateFields.title,
			department: updateFields.department,
			start_date: updateFields.startDate,
		});

		responseData = await latticeApiRequest.call(this, 'PATCH', `/users/${userId}`, body);
	} else if (operation === 'deactivate') {
		const userId = this.getNodeParameter('userId', i) as string;
		responseData = await latticeApiRequest.call(this, 'POST', `/users/${userId}/deactivate`);
	} else if (operation === 'getManager') {
		const userId = this.getNodeParameter('userId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/users/${userId}/manager`);
	} else if (operation === 'getDirectReports') {
		const userId = this.getNodeParameter('userId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/users/${userId}/direct-reports`);
	} else if (operation === 'updateManager') {
		const userId = this.getNodeParameter('userId', i) as string;
		const managerId = this.getNodeParameter('managerId', i) as string;

		const body: IDataObject = {
			manager_id: managerId,
		};

		responseData = await latticeApiRequest.call(this, 'PATCH', `/users/${userId}/manager`, body);
	} else {
		throw new Error(`Operation "${operation}" is not supported for the User resource`);
	}

	return responseData;
}
