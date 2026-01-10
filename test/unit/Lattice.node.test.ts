/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Lattice } from '../../nodes/Lattice/Lattice.node';

describe('Lattice Node', () => {
	let latticeNode: Lattice;

	beforeEach(() => {
		latticeNode = new Lattice();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(latticeNode.description.displayName).toBe('Lattice');
		});

		it('should have correct name', () => {
			expect(latticeNode.description.name).toBe('lattice');
		});

		it('should have correct version', () => {
			expect(latticeNode.description.version).toBe(1);
		});

		it('should require latticeApi credentials', () => {
			const credentials = latticeNode.description.credentials;
			expect(credentials).toBeDefined();
			expect(credentials).toHaveLength(1);
			expect(credentials![0].name).toBe('latticeApi');
			expect(credentials![0].required).toBe(true);
		});

		it('should have icon defined', () => {
			expect(latticeNode.description.icon).toBe('file:lattice.svg');
		});

		it('should have inputs and outputs defined', () => {
			expect(latticeNode.description.inputs).toEqual(['main']);
			expect(latticeNode.description.outputs).toEqual(['main']);
		});
	});

	describe('Resources', () => {
		it('should have resource property', () => {
			const resourceProperty = latticeNode.description.properties.find(
				(p) => p.name === 'resource'
			);
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty?.type).toBe('options');
		});

		it('should have all 10 resources defined', () => {
			const resourceProperty = latticeNode.description.properties.find(
				(p) => p.name === 'resource'
			);
			const options = resourceProperty?.options as Array<{ value: string }>;
			
			expect(options).toHaveLength(10);
			
			const resourceValues = options.map((o) => o.value);
			expect(resourceValues).toContain('user');
			expect(resourceValues).toContain('team');
			expect(resourceValues).toContain('goal');
			expect(resourceValues).toContain('review');
			expect(resourceValues).toContain('feedback');
			expect(resourceValues).toContain('oneOnOne');
			expect(resourceValues).toContain('update');
			expect(resourceValues).toContain('praise');
			expect(resourceValues).toContain('competency');
			expect(resourceValues).toContain('customAttribute');
		});

		it('should have user as default resource', () => {
			const resourceProperty = latticeNode.description.properties.find(
				(p) => p.name === 'resource'
			);
			expect(resourceProperty?.default).toBe('user');
		});
	});

	describe('User Operations', () => {
		it('should have user operations defined', () => {
			const operationProperty = latticeNode.description.properties.find(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('user')
			);
			expect(operationProperty).toBeDefined();
		});
	});

	describe('Team Operations', () => {
		it('should have team operations defined', () => {
			const operationProperty = latticeNode.description.properties.find(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('team')
			);
			expect(operationProperty).toBeDefined();
		});
	});

	describe('Goal Operations', () => {
		it('should have goal operations defined', () => {
			const operationProperty = latticeNode.description.properties.find(
				(p) => p.name === 'operation' && 
				p.displayOptions?.show?.resource?.includes('goal')
			);
			expect(operationProperty).toBeDefined();
		});
	});
});

describe('Lattice Node Metadata', () => {
	it('should have valid subtitle expression', () => {
		const node = new Lattice();
		expect(node.description.subtitle).toBe('={{$parameter["operation"] + ": " + $parameter["resource"]}}');
	});

	it('should have transform group', () => {
		const node = new Lattice();
		expect(node.description.group).toContain('transform');
	});

	it('should have proper description', () => {
		const node = new Lattice();
		expect(node.description.description).toContain('Lattice API');
	});
});
