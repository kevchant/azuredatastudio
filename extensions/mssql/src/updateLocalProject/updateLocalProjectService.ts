/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from 'azdata';
import * as mssql from '../mssql';
import * as Utils from '../utils';
import * as constants from '../constants';
import * as contracts from '../contracts';
import { AppContext } from '../appContext';
import { ClientCapabilities } from 'vscode-languageclient';
import { ISqlOpsFeature, SqlOpsDataClient } from 'dataprotocol-client';

export class UpdateLocalProjectService implements mssql.IUpdateLocalProjectService {
	public static asFeature(context: AppContext): ISqlOpsFeature {
		return class extends UpdateLocalProjectService {
			constructor(client: SqlOpsDataClient) {
				super(context, client);
			}

			fillClientCapabilities(capabilities: ClientCapabilities): void {
				Utils.ensure(capabilities, 'updateLocalProject')!.updateLocalProject = true;
			}

			initialize(): void {
			}
		};
	}

	private constructor(context: AppContext, protected readonly client: SqlOpsDataClient) {
		context.registerService(constants.UpdateLocalProjectService, this);
	}

	public updateProjectFromDatabase(folderStructure: string, projectPath: string, ownerUri: string, version: string, taskExecutionMode: azdata.TaskExecutionMode): Thenable<mssql.UpdateLocalProjectResult> {
		const params: contracts.UpdateLocalProjectParams = { folderStructure: folderStructure, projectPath: projectPath, ownerUri: ownerUri, version: version, taskExecutionMode: taskExecutionMode };
		return this.client.sendRequest(contracts.UpdateLocalProjectRequest.type, params).then(
			undefined,
			e => {
				this.client.logFailedRequest(contracts.UpdateLocalProjectRequest.type, e);
				return Promise.resolve(undefined);
			}
		);
	}
}
