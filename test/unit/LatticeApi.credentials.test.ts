/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { LatticeApi } from '../../credentials/LatticeApi.credentials';

describe('LatticeApi Credentials', () => {
	let credentials: LatticeApi;

	beforeEach(() => {
		credentials = new LatticeApi();
	});

	describe('Credential Definition', () => {
		it('should have correct name', () => {
			expect(credentials.name).toBe('latticeApi');
		});

		it('should have correct display name', () => {
			expect(credentials.displayName).toBe('Lattice API');
		});

		it('should have documentation URL', () => {
			expect(credentials.documentationUrl).toBeDefined();
		});
	});

	describe('Properties', () => {
		it('should have apiKey property', () => {
			const apiKeyProperty = credentials.properties.find(
				(p) => p.name === 'apiKey'
			);
			expect(apiKeyProperty).toBeDefined();
			expect(apiKeyProperty?.type).toBe('string');
			expect(apiKeyProperty?.typeOptions?.password).toBe(true);
		});

		it('should require apiKey', () => {
			const apiKeyProperty = credentials.properties.find(
				(p) => p.name === 'apiKey'
			);
			expect(apiKeyProperty?.required).toBe(true);
		});
	});

	describe('Authentication', () => {
		it('should use httpHeaderAuth', () => {
			expect(credentials.authenticate).toBeDefined();
			expect(credentials.authenticate).toHaveProperty('type', 'generic');
		});

		it('should set Authorization header with Bearer token', () => {
			const auth = credentials.authenticate as {
				type: string;
				properties: { headers: { Authorization: string } };
			};
			expect(auth.properties.headers.Authorization).toBe('=Bearer {{$credentials.apiKey}}');
		});
	});
});
