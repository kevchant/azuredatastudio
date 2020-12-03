/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as azdata from 'azdata';
import * as azurecore from 'azurecore';
import { azureResource } from 'azureResource';

async function getAzureCoreAPI(): Promise<azurecore.IExtension> {
	const api = (await vscode.extensions.getExtension(azurecore.extension.name)?.activate()) as azurecore.IExtension;
	if (!api) {
		throw new Error('azure core API undefined for sql-migration');
	}
	return api;
}

export type Subscription = azureResource.AzureResourceSubscription;
export async function getSubscriptions(account: azdata.Account): Promise<Subscription[]> {
	const api = await getAzureCoreAPI();
	const subscriptions = await api.getSubscriptions(account, false);
	let listOfSubscriptions = subscriptions.subscriptions;
	listOfSubscriptions.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});
	return subscriptions.subscriptions;
}

export type AzureProduct = azureResource.AzureGraphResource;

export type SqlManagedInstance = AzureProduct;
export async function getAvailableManagedInstanceProducts(account: azdata.Account, subscription: Subscription): Promise<SqlManagedInstance[]> {
	const api = await getAzureCoreAPI();

	const result = await api.getSqlManagedInstances(account, [subscription], false);
	return result.resources;
}

export type SqlServer = AzureProduct;
export async function getAvailableSqlServers(account: azdata.Account, subscription: Subscription): Promise<SqlServer[]> {
	const api = await getAzureCoreAPI();

	const result = await api.getSqlServers(account, [subscription], false);
	return result.resources;
}

export type SqlVMServer = AzureProduct;
export async function getAvailableSqlVMs(account: azdata.Account, subscription: Subscription): Promise<SqlVMServer[]> {
	const api = await getAzureCoreAPI();

	const result = await api.getSqlVMServer(account, [subscription], false);
	return result.resources;
}

export type StorageAccount = AzureProduct;
export async function getAvailableStorageAccounts(account: azdata.Account, subscription: Subscription): Promise<StorageAccount[]> {
	const api = await getAzureCoreAPI();
	const result = await api.getStorageAccounts(account, [subscription], false);
	sortResourceArrayByName(result.resources);
	return result.resources;
}

export type FileShares = AzureProduct;
export async function getFileShares(account: azdata.Account, subscription: Subscription, storageAccount: StorageAccount): Promise<FileShares[]> {
	const api = await getAzureCoreAPI();
	const url = `https://management.azure.com` +
		`/subscriptions/${subscription.id}` +
		`/resourceGroups/${storageAccount.resourceGroup}` +
		`/providers/Microsoft.Storage/storageAccounts/${storageAccount.name}` +
		`/fileServices/default/shares?api-version=2019-06-01`;

	let result = await api.makeHttpGetRequest(account, subscription, true, url);
	let fileShares = [];
	if (result.response.data?.value) {
		fileShares = result.response.data.value;
	}
	sortResourceArrayByName(fileShares);
	return fileShares;
}

export type BlobContainer = AzureProduct;
export async function getBlobContainers(account: azdata.Account, subscription: Subscription, storageAccount: StorageAccount): Promise<BlobContainer[]> {
	const api = await getAzureCoreAPI();
	const url = `https://management.azure.com` +
		`/subscriptions/${subscription.id}` +
		`/resourceGroups/${storageAccount.resourceGroup}` +
		`/providers/Microsoft.Storage/storageAccounts/${storageAccount.name}` +
		`/blobServices/default/containers?api-version=2019-06-01`;

	let result = await api.makeHttpGetRequest(account, subscription, true, url);
	let blobContainers = [];
	if (result.response.data?.value) {
		blobContainers = result.response.data.value;
	}
	sortResourceArrayByName(blobContainers);
	return blobContainers;
}

function sortResourceArrayByName(resourceArray: AzureProduct[]) {
	resourceArray.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});
}
