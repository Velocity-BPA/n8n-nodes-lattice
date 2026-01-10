/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { latticeApiRequest, latticeApiRequestAllItems } from '../../transport';
import { removeEmptyProperties } from '../../utils';
import { MEETING_FREQUENCIES, MEETING_STATUSES } from '../../constants';

export const oneOnOneOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['oneOnOne'],
			},
		},
		options: [
			{
				name: 'Add Agenda Item',
				value: 'addAgendaItem',
				description: 'Add an item to the agenda',
				action: 'Add agenda item',
			},
			{
				name: 'Add Note',
				value: 'addNote',
				description: 'Add a note to the meeting',
				action: 'Add meeting note',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Schedule a new 1:1 meeting',
				action: 'Create a 1:1',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a 1:1 meeting by ID',
				action: 'Get a 1:1',
			},
			{
				name: 'Get Agenda',
				value: 'getAgenda',
				description: 'Get agenda items for a 1:1',
				action: 'Get agenda',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many 1:1 meetings',
				action: 'Get many 1 1s',
			},
			{
				name: 'Get Notes',
				value: 'getNotes',
				description: 'Get meeting notes',
				action: 'Get notes',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update 1:1 meeting details',
				action: 'Update a 1:1',
			},
		],
		default: 'getAll',
	},
];

export const oneOnOneFields: INodeProperties[] = [
	// ----------------------------------
	//         oneOnOne: create
	// ----------------------------------
	{
		displayName: 'Manager ID',
		name: 'managerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['oneOnOne'],
				operation: ['create'],
			},
		},
		description: 'User ID of the manager',
	},
	{
		displayName: 'Report ID',
		name: 'reportId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['oneOnOne'],
				operation: ['create'],
			},
		},
		description: 'User ID of the direct report',
	},
	{
		displayName: 'Scheduled At',
		name: 'scheduledAt',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['oneOnOne'],
				operation: ['create'],
			},
		},
		description: 'When the meeting is scheduled',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['oneOnOne'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Frequency',
				name: 'frequency',
				type: 'options',
				options: MEETING_FREQUENCIES,
				default: 'weekly',
				description: 'Meeting frequency',
			},
		],
	},

	// ----------------------------------
	//         oneOnOne: get, getAgenda, getNotes
	// ----------------------------------
	{
		displayName: 'Meeting ID',
		name: 'meetingId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['oneOnOne'],
				operation: ['get', 'getAgenda', 'getNotes'],
			},
		},
		description: 'The ID of the 1:1 meeting',
	},

	// ----------------------------------
	//         oneOnOne: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['oneOnOne'],
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
				resource: ['oneOnOne'],
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
				resource: ['oneOnOne'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Manager ID',
				name: 'managerId',
				type: 'string',
				default: '',
				description: 'Filter by manager',
			},
			{
				displayName: 'Report ID',
				name: 'reportId',
				type: 'string',
				default: '',
				description: 'Filter by direct report',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: MEETING_STATUSES,
				default: '',
				description: 'Filter by meeting status',
			},
		],
	},

	// ----------------------------------
	//         oneOnOne: update
	// ----------------------------------
	{
		displayName: 'Meeting ID',
		name: 'meetingId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['oneOnOne'],
				operation: ['update'],
			},
		},
		description: 'The ID of the 1:1 meeting to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['oneOnOne'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Frequency',
				name: 'frequency',
				type: 'options',
				options: MEETING_FREQUENCIES,
				default: 'weekly',
				description: 'Meeting frequency',
			},
			{
				displayName: 'Scheduled At',
				name: 'scheduledAt',
				type: 'dateTime',
				default: '',
				description: 'When the meeting is scheduled',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: MEETING_STATUSES,
				default: 'scheduled',
				description: 'Meeting status',
			},
		],
	},

	// ----------------------------------
	//         oneOnOne: addAgendaItem
	// ----------------------------------
	{
		displayName: 'Meeting ID',
		name: 'meetingId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['oneOnOne'],
				operation: ['addAgendaItem'],
			},
		},
		description: 'The ID of the 1:1 meeting',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['oneOnOne'],
				operation: ['addAgendaItem'],
			},
		},
		description: 'Title of the agenda item',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['oneOnOne'],
				operation: ['addAgendaItem'],
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
				description: 'Description of the agenda item',
			},
		],
	},

	// ----------------------------------
	//         oneOnOne: addNote
	// ----------------------------------
	{
		displayName: 'Meeting ID',
		name: 'meetingId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['oneOnOne'],
				operation: ['addNote'],
			},
		},
		description: 'The ID of the 1:1 meeting',
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['oneOnOne'],
				operation: ['addNote'],
			},
		},
		description: 'Content of the note',
	},
	{
		displayName: 'Visibility',
		name: 'visibility',
		type: 'options',
		options: [
			{
				name: 'Shared',
				value: 'shared',
			},
			{
				name: 'Private',
				value: 'private',
			},
		],
		default: 'shared',
		displayOptions: {
			show: {
				resource: ['oneOnOne'],
				operation: ['addNote'],
			},
		},
		description: 'Whether the note is visible to both parties',
	},
];

export async function executeOneOnOneOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'create') {
		const managerId = this.getNodeParameter('managerId', i) as string;
		const reportId = this.getNodeParameter('reportId', i) as string;
		const scheduledAt = this.getNodeParameter('scheduledAt', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = removeEmptyProperties({
			manager_id: managerId,
			report_id: reportId,
			scheduled_at: scheduledAt,
			frequency: additionalFields.frequency,
		});

		responseData = await latticeApiRequest.call(this, 'POST', '/one-on-ones', body);
	} else if (operation === 'get') {
		const meetingId = this.getNodeParameter('meetingId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/one-on-ones/${meetingId}`);
	} else if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as IDataObject;

		const query: IDataObject = removeEmptyProperties({
			manager_id: filters.managerId,
			report_id: filters.reportId,
			status: filters.status,
		});

		if (returnAll) {
			responseData = await latticeApiRequestAllItems.call(this, 'GET', '/one-on-ones', {}, query);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			query.per_page = limit;
			const response = await latticeApiRequest.call(this, 'GET', '/one-on-ones', {}, query);
			responseData = (response as IDataObject).data as IDataObject[];
		}
	} else if (operation === 'update') {
		const meetingId = this.getNodeParameter('meetingId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

		const body: IDataObject = removeEmptyProperties({
			scheduled_at: updateFields.scheduledAt,
			frequency: updateFields.frequency,
			status: updateFields.status,
		});

		responseData = await latticeApiRequest.call(this, 'PATCH', `/one-on-ones/${meetingId}`, body);
	} else if (operation === 'getAgenda') {
		const meetingId = this.getNodeParameter('meetingId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/one-on-ones/${meetingId}/agenda`);
	} else if (operation === 'addAgendaItem') {
		const meetingId = this.getNodeParameter('meetingId', i) as string;
		const title = this.getNodeParameter('title', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = removeEmptyProperties({
			title,
			description: additionalFields.description,
		});

		responseData = await latticeApiRequest.call(this, 'POST', `/one-on-ones/${meetingId}/agenda`, body);
	} else if (operation === 'getNotes') {
		const meetingId = this.getNodeParameter('meetingId', i) as string;
		responseData = await latticeApiRequest.call(this, 'GET', `/one-on-ones/${meetingId}/notes`);
	} else if (operation === 'addNote') {
		const meetingId = this.getNodeParameter('meetingId', i) as string;
		const content = this.getNodeParameter('content', i) as string;
		const visibility = this.getNodeParameter('visibility', i) as string;

		const body: IDataObject = {
			content,
			visibility,
		};

		responseData = await latticeApiRequest.call(this, 'POST', `/one-on-ones/${meetingId}/notes`, body);
	} else {
		throw new Error(`Operation "${operation}" is not supported for the One-on-One resource`);
	}

	return responseData;
}
