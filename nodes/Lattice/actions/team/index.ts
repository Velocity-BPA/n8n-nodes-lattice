/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { latticeApiRequest, latticeApiRequestAllItems } from '../../transport';
import { removeEmptyProperties } from '../../utils';

export const teamOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['team'],
			},
		},
		options: [
			{
				name: 'Add Member',
				value: 'addMember',
				description: 'Add a user to a team',
				action: 'Add team member',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new team',
				action: 'Create a team',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a team',
				action: 'Delete a team',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a team by ID',
				action: 'Get a team',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many teams',
				action: 'Get many teams',
			},
			{
				name: 'Get Members',
				value: 'getMembers',
				description: 'Get team members',
				action: 'Get team members',
			},
			{
				name: 'Remove Member',
				value: 'removeMember',
				description: 'Remove a user from a team',
				action: 'Remove team member',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update team details',
				action: 'Update a team',
			},
		],
		default: 'getAll',
	},
];

export const teamFields: INodeProperties[] = [
	// ----------------------------------
	//         team: create
	// ----------------------------------
	{
		displayName: 'Team Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['create'],
			},
		},
		description: 'Name of the team',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Team description',
			},
			{
				displayName: 'Lead ID',
				name: 'leadId',
				type: 'string',
				default: '',
				description: 'User ID of the team lead',
			},
			{
				displayName: 'Parent Team ID',
				name: 'parentTeamId',
				type: 'string',
				default: '',
				description: 'ID of the parent team for hierarchy',
			},
		],
	},

	// ----------------------------------
	//         team: get, delete, getMembers
	// ----------------------------------
	{
		displayName: 'Team ID',
		name: 'teamId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['get', 'delete', 'getMembers'],
			},
		},
		description: 'The ID of the team',
	},

	// ----------------------------------
	//         team: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['team'],
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
				resource: ['team'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         team: update
	// ----------------------------------
	{
		displayName: 'Team ID',
		name: 'teamId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['update'],
			},
		},
		description: 'The ID of the team to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Team description',
			},
			{
				displayName: 'Lead ID',
				name: 'leadId',
				type: 'string',
				default: '',
				description: 'User ID of the team lead',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Team name',
			},
			{
				displayName: 'Parent Team ID',
				name: 'parentTeamId',
				type: 'string',
				default: '',
				description: 'ID of the parent team for hierarchy',
			},
		],
	},

	// ----------------------------------
	//         team: addMember, removeMember
	// ----------------------------------
	{
		displayName: 'Team ID',
		name: 'teamId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['addMember', 'removeMember'],
			},
		},
		description: 'The ID of the team',
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['addMember', 'removeMember'],
			},
		},
		description: 'The ID of the user to add or remove',
	},
];

export async function executeTeamOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'create') {
		const name = this.getNodeParameter('name', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = removeEmptyProperties({
			name,
			description: additionalFields.description,
			lead_id: additionalFields.leadId,
			parent_team_id: additionalFields.parentTeamId,
		});

		responseData = await latticeApiRequest.call(this, 'POST', '/teams', body);
	} else if (operation === 'get') {
		const teamId = this.getNodeParameter('teamId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/teams/${teamId}`);
	} else if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;

		if (returnAll) {
			responseData = await latticeApiRequestAllItems.call(this, 'GET', '/teams');
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const response = await latticeApiRequest.call(this, 'GET', '/teams', {}, { per_page: limit });
			responseData = (response as IDataObject).data as IDataObject[];
		}
	} else if (operation === 'update') {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

		const body: IDataObject = removeEmptyProperties({
			name: updateFields.name,
			description: updateFields.description,
			lead_id: updateFields.leadId,
			parent_team_id: updateFields.parentTeamId,
		});

		responseData = await latticeApiRequest.call(this, 'PATCH', `/teams/${teamId}`, body);
	} else if (operation === 'delete') {
		const teamId = this.getNodeParameter('teamId', i) as string;
		responseData = await latticeApiRequest.call(this, 'DELETE', `/teams/${teamId}`);
	} else if (operation === 'getMembers') {
		const teamId = this.getNodeParameter('teamId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/teams/${teamId}/members`);
	} else if (operation === 'addMember') {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const userId = this.getNodeParameter('userId', i) as string;

		const body: IDataObject = {
			user_id: userId,
		};

		responseData = await latticeApiRequest.call(this, 'POST', `/teams/${teamId}/members`, body);
	} else if (operation === 'removeMember') {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const userId = this.getNodeParameter('userId', i) as string;

		responseData = await latticeApiRequest.call(this, 'DELETE', `/teams/${teamId}/members/${userId}`);
	} else {
		throw new Error(`Operation "${operation}" is not supported for the Team resource`);
	}

	return responseData;
}
