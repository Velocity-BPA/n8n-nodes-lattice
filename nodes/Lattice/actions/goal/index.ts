/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { latticeApiRequest, latticeApiRequestAllItems } from '../../transport';
import { removeEmptyProperties, parseKeyResults, getCurrentYear, getCurrentQuarter } from '../../utils';
import { GOAL_STATUSES, GOAL_TIME_PERIODS } from '../../constants';

export const goalOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['goal'],
			},
		},
		options: [
			{
				name: 'Add Progress Update',
				value: 'addProgressUpdate',
				description: 'Add a progress update to a goal',
				action: 'Add progress update',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new goal',
				action: 'Create a goal',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a goal',
				action: 'Delete a goal',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a goal by ID',
				action: 'Get a goal',
			},
			{
				name: 'Get by Team',
				value: 'getByTeam',
				description: "Get a team's goals",
				action: 'Get team goals',
			},
			{
				name: 'Get by User',
				value: 'getByUser',
				description: "Get a user's goals",
				action: 'Get user goals',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many goals',
				action: 'Get many goals',
			},
			{
				name: 'Get Progress',
				value: 'getProgress',
				description: 'Get progress updates for a goal',
				action: 'Get progress updates',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update goal details',
				action: 'Update a goal',
			},
		],
		default: 'getAll',
	},
];

export const goalFields: INodeProperties[] = [
	// ----------------------------------
	//         goal: create
	// ----------------------------------
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['goal'],
				operation: ['create'],
			},
		},
		description: 'Title of the goal',
	},
	{
		displayName: 'Owner ID',
		name: 'ownerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['goal'],
				operation: ['create'],
			},
		},
		description: 'User ID of the goal owner',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['goal'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Goal description',
			},
			{
				displayName: 'Key Results (JSON)',
				name: 'keyResults',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Key results as JSON array or comma-separated list',
			},
			{
				displayName: 'Parent Goal ID',
				name: 'parentGoalId',
				type: 'string',
				default: '',
				description: 'ID of parent goal for alignment',
			},
			{
				displayName: 'Team ID',
				name: 'teamId',
				type: 'string',
				default: '',
				description: 'Team ID if this is a team goal',
			},
			{
				displayName: 'Time Period',
				name: 'timePeriod',
				type: 'options',
				options: GOAL_TIME_PERIODS,
				default: getCurrentQuarter(),
				description: 'Time period for the goal',
			},
			{
				displayName: 'Year',
				name: 'year',
				type: 'number',
				default: getCurrentYear(),
				description: 'Year for the goal',
			},
		],
	},

	// ----------------------------------
	//         goal: get, delete, getProgress
	// ----------------------------------
	{
		displayName: 'Goal ID',
		name: 'goalId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['goal'],
				operation: ['get', 'delete', 'getProgress'],
			},
		},
		description: 'The ID of the goal',
	},

	// ----------------------------------
	//         goal: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['goal'],
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
				resource: ['goal'],
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
				resource: ['goal'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: GOAL_STATUSES,
				default: '',
				description: 'Filter by goal status',
			},
			{
				displayName: 'Time Period',
				name: 'timePeriod',
				type: 'options',
				options: GOAL_TIME_PERIODS,
				default: '',
				description: 'Filter by time period',
			},
			{
				displayName: 'Year',
				name: 'year',
				type: 'number',
				default: getCurrentYear(),
				description: 'Filter by year',
			},
		],
	},

	// ----------------------------------
	//         goal: update
	// ----------------------------------
	{
		displayName: 'Goal ID',
		name: 'goalId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['goal'],
				operation: ['update'],
			},
		},
		description: 'The ID of the goal to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['goal'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Goal description',
			},
			{
				displayName: 'Progress',
				name: 'progress',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 100,
				},
				default: 0,
				description: 'Progress percentage (0-100)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: GOAL_STATUSES,
				default: 'on_track',
				description: 'Goal status',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Goal title',
			},
		],
	},

	// ----------------------------------
	//         goal: getByUser
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['goal'],
				operation: ['getByUser'],
			},
		},
		description: 'The ID of the user',
	},

	// ----------------------------------
	//         goal: getByTeam
	// ----------------------------------
	{
		displayName: 'Team ID',
		name: 'teamId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['goal'],
				operation: ['getByTeam'],
			},
		},
		description: 'The ID of the team',
	},

	// ----------------------------------
	//         goal: addProgressUpdate
	// ----------------------------------
	{
		displayName: 'Goal ID',
		name: 'goalId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['goal'],
				operation: ['addProgressUpdate'],
			},
		},
		description: 'The ID of the goal',
	},
	{
		displayName: 'Progress',
		name: 'progress',
		type: 'number',
		typeOptions: {
			minValue: 0,
			maxValue: 100,
		},
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['goal'],
				operation: ['addProgressUpdate'],
			},
		},
		description: 'Progress percentage (0-100)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['goal'],
				operation: ['addProgressUpdate'],
			},
		},
		options: [
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Optional note for the progress update',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: GOAL_STATUSES,
				default: 'on_track',
				description: 'Updated status',
			},
		],
	},
];

export async function executeGoalOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'create') {
		const title = this.getNodeParameter('title', i) as string;
		const ownerId = this.getNodeParameter('ownerId', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const keyResults = additionalFields.keyResults
			? parseKeyResults(additionalFields.keyResults as string)
			: undefined;

		const body: IDataObject = removeEmptyProperties({
			title,
			owner_id: ownerId,
			description: additionalFields.description,
			team_id: additionalFields.teamId,
			time_period: additionalFields.timePeriod,
			year: additionalFields.year,
			parent_goal_id: additionalFields.parentGoalId,
			key_results: keyResults,
		});

		responseData = await latticeApiRequest.call(this, 'POST', '/goals', body);
	} else if (operation === 'get') {
		const goalId = this.getNodeParameter('goalId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/goals/${goalId}`);
	} else if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as IDataObject;

		const query: IDataObject = removeEmptyProperties({
			status: filters.status,
			time_period: filters.timePeriod,
			year: filters.year,
		});

		if (returnAll) {
			responseData = await latticeApiRequestAllItems.call(this, 'GET', '/goals', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.per_page = limit;
			const response = await latticeApiRequest.call(this, 'GET', '/goals', {}, query);
			responseData = (response as IDataObject).data as IDataObject[];
		}
	} else if (operation === 'update') {
		const goalId = this.getNodeParameter('goalId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

		const body: IDataObject = removeEmptyProperties({
			title: updateFields.title,
			description: updateFields.description,
			status: updateFields.status,
			progress: updateFields.progress,
		});

		responseData = await latticeApiRequest.call(this, 'PATCH', `/goals/${goalId}`, body);
	} else if (operation === 'delete') {
		const goalId = this.getNodeParameter('goalId', i) as string;
		responseData = await latticeApiRequest.call(this, 'DELETE', `/goals/${goalId}`);
	} else if (operation === 'getProgress') {
		const goalId = this.getNodeParameter('goalId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/goals/${goalId}/progress-updates`);
	} else if (operation === 'getByUser') {
		const userId = this.getNodeParameter('userId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/users/${userId}/goals`);
	} else if (operation === 'getByTeam') {
		const teamId = this.getNodeParameter('teamId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/teams/${teamId}/goals`);
	} else if (operation === 'addProgressUpdate') {
		const goalId = this.getNodeParameter('goalId', i) as string;
		const progress = this.getNodeParameter('progress', i) as number;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = removeEmptyProperties({
			progress,
			note: additionalFields.note,
			status: additionalFields.status,
		});

		responseData = await latticeApiRequest.call(this, 'POST', `/goals/${goalId}/progress-updates`, body);
	} else {
		throw new Error(`Operation "${operation}" is not supported for the Goal resource`);
	}

	return responseData;
}
