/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHookFunctions,
	IDataObject,
	JsonObject,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const BASE_URL = 'https://api.latticehq.com/v1';

export async function latticeApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	const options: {
		method: IHttpRequestMethods;
		url: string;
		json: boolean;
		body?: IDataObject;
		qs?: IDataObject;
	} = {
		method,
		url: `${BASE_URL}${endpoint}`,
		json: true,
	};

	if (Object.keys(body).length > 0) {
		options.body = body;
	}

	if (Object.keys(query).length > 0) {
		options.qs = query;
	}

	try {
		const response = await this.helpers.requestWithAuthentication.call(
			this,
			'latticeApi',
			options,
		);
		return response as IDataObject | IDataObject[];
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: getErrorMessage(error),
		});
	}
}

export async function latticeApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
	dataKey = 'data',
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];

	let responseData: IDataObject;
	query.per_page = 100;
	query.page = 1;
	let hasMorePages = true;

	while (hasMorePages) {
		responseData = (await latticeApiRequest.call(
			this,
			method,
			endpoint,
			body,
			query,
		)) as IDataObject;

		const items = responseData[dataKey] as IDataObject[];
		if (items) {
			returnData.push(...items);
		}

		const meta = responseData.meta as IDataObject | undefined;
		if (meta) {
			const totalPages = meta.total_pages as number;
			const currentPage = query.page as number;
			if (currentPage >= totalPages) {
				hasMorePages = false;
			} else {
				query.page = currentPage + 1;
			}
		} else {
			hasMorePages = false;
		}
	}

	return returnData;
}

function getErrorMessage(error: unknown): string {
	if (error && typeof error === 'object') {
		const errorObj = error as IDataObject;
		
		// Handle Lattice API error format
		if (errorObj.error && typeof errorObj.error === 'object') {
			const apiError = errorObj.error as IDataObject;
			if (apiError.message) {
				return String(apiError.message);
			}
		}

		// Handle standard error response
		if (errorObj.message) {
			return String(errorObj.message);
		}

		// Handle response body error
		if (errorObj.body && typeof errorObj.body === 'object') {
			const bodyError = errorObj.body as IDataObject;
			if (bodyError.error && typeof bodyError.error === 'object') {
				const nestedError = bodyError.error as IDataObject;
				if (nestedError.message) {
					return String(nestedError.message);
				}
			}
		}
	}

	return 'An unknown error occurred';
}
