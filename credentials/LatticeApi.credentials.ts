/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LatticeApi implements ICredentialType {
	name = 'latticeApi';
	displayName = 'Lattice API';
	documentationUrl = 'https://developers.latticehq.com/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'API Key from Lattice Admin → Organization → Settings → API Keys. Note: API access requires approval from Lattice.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.latticehq.com/v1',
			url: '/users',
			method: 'GET',
			qs: {
				per_page: 1,
			},
		},
	};
}
