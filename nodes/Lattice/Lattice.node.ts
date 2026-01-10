/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	userOperations,
	userFields,
	executeUserOperation,
	teamOperations,
	teamFields,
	executeTeamOperation,
	goalOperations,
	goalFields,
	executeGoalOperation,
	reviewOperations,
	reviewFields,
	executeReviewOperation,
	feedbackOperations,
	feedbackFields,
	executeFeedbackOperation,
	oneOnOneOperations,
	oneOnOneFields,
	executeOneOnOneOperation,
	updateOperations,
	updateFields,
	executeUpdateOperation,
	praiseOperations,
	praiseFields,
	executePraiseOperation,
	competencyOperations,
	competencyFields,
	executeCompetencyOperation,
	customAttributeOperations,
	customAttributeFields,
	executeCustomAttributeOperation,
} from './actions';

// Emit licensing notice on node load
const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]
This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;

let licenseNoticeEmitted = false;

function emitLicensingNotice(): void {
	if (!licenseNoticeEmitted) {
		console.warn(LICENSING_NOTICE);
		licenseNoticeEmitted = true;
	}
}

export class Lattice implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Lattice',
		name: 'lattice',
		icon: 'file:lattice.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Lattice API for performance management and HR operations',
		defaults: {
			name: 'Lattice',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'latticeApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Competency',
						value: 'competency',
					},
					{
						name: 'Custom Attribute',
						value: 'customAttribute',
					},
					{
						name: 'Feedback',
						value: 'feedback',
					},
					{
						name: 'Goal',
						value: 'goal',
					},
					{
						name: 'One-on-One',
						value: 'oneOnOne',
					},
					{
						name: 'Praise',
						value: 'praise',
					},
					{
						name: 'Review',
						value: 'review',
					},
					{
						name: 'Team',
						value: 'team',
					},
					{
						name: 'Update',
						value: 'update',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'user',
			},
			// User
			...userOperations,
			...userFields,
			// Team
			...teamOperations,
			...teamFields,
			// Goal
			...goalOperations,
			...goalFields,
			// Review
			...reviewOperations,
			...reviewFields,
			// Feedback
			...feedbackOperations,
			...feedbackFields,
			// One-on-One
			...oneOnOneOperations,
			...oneOnOneFields,
			// Update
			...updateOperations,
			...updateFields,
			// Praise
			...praiseOperations,
			...praiseFields,
			// Competency
			...competencyOperations,
			...competencyFields,
			// Custom Attribute
			...customAttributeOperations,
			...customAttributeFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		emitLicensingNotice();

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[];

				switch (resource) {
					case 'user':
						responseData = await executeUserOperation.call(this, operation, i);
						break;
					case 'team':
						responseData = await executeTeamOperation.call(this, operation, i);
						break;
					case 'goal':
						responseData = await executeGoalOperation.call(this, operation, i);
						break;
					case 'review':
						responseData = await executeReviewOperation.call(this, operation, i);
						break;
					case 'feedback':
						responseData = await executeFeedbackOperation.call(this, operation, i);
						break;
					case 'oneOnOne':
						responseData = await executeOneOnOneOperation.call(this, operation, i);
						break;
					case 'update':
						responseData = await executeUpdateOperation.call(this, operation, i);
						break;
					case 'praise':
						responseData = await executePraiseOperation.call(this, operation, i);
						break;
					case 'competency':
						responseData = await executeCompetencyOperation.call(this, operation, i);
						break;
					case 'customAttribute':
						responseData = await executeCustomAttributeOperation.call(this, operation, i);
						break;
					default:
						throw new NodeOperationError(
							this.getNode(),
							`Resource "${resource}" is not supported`,
						);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
