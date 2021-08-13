/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import type * as azdataType from 'azdata';
import * as constants from '../common/constants';
import * as newProjectTool from '../tools/newProjectTool';

import { getConnectionName } from './utils';
import { Deferred } from '../common/promise';
import { cssStyles } from '../common/uiConstants';
import { IconPathHelper } from '../common/iconHelper';
import { UpdateDataModel } from '../models/api/update';
import { exists, getAzdataApi, getDataWorkspaceExtensionApi } from '../common/utils';

export class UpdateProjectFromDatabaseDialog {
	public dialog: azdataType.window.Dialog;
	public updateProjectFromDatabaseTab: azdataType.window.DialogTab;
	public sourceConnectionTextBox: azdataType.InputBoxComponent | undefined;
	private selectConnectionButton: azdataType.ButtonComponent | undefined;
	public sourceDatabaseDropDown: azdataType.DropDownComponent | undefined;
	public projectLocationTextBox: azdataType.InputBoxComponent | undefined;
	private formBuilder: azdataType.FormBuilder | undefined;
	private connectionId: string | undefined;
	private toDispose: vscode.Disposable[] = [];
	private initDialogComplete!: Deferred<void>;
	private initDialogPromise: Promise<void> = new Promise<void>((resolve, reject) => this.initDialogComplete = { resolve, reject });

	public updateProjectFromDatabaseCallback: ((model: UpdateDataModel) => any) | undefined;

	constructor(private profile: azdataType.IConnectionProfile | undefined) {
		this.dialog = getAzdataApi()!.window.createModelViewDialog(constants.updateProjectFromDatabaseDialogName, 'updateProjectFromDatabaseDialog');
		this.updateProjectFromDatabaseTab = getAzdataApi()!.window.createTab(constants.updateProjectFromDatabaseDialogName);
		this.dialog.registerCloseValidator(async () => {
			return this.validate();
		});
	}

	public async openDialog(): Promise<void> {
		this.initializeDialog();
		this.dialog.okButton.label = constants.updateProjectDialogOkButtonText;
		this.dialog.okButton.enabled = false;
		this.toDispose.push(this.dialog.okButton.onClick(async () => await this.handleUpdateButtonClick()));

		this.dialog.cancelButton.label = constants.cancelButtonText;

		getAzdataApi()!.window.openDialog(this.dialog);
		await this.initDialogPromise;

		if (this.profile) {
			await this.updateConnectionComponents(getConnectionName(this.profile), this.profile.id, this.profile.databaseName!);
		}

		this.tryEnableUpdateButton();
	}

	private dispose(): void {
		this.toDispose.forEach(disposable => disposable.dispose());
	}

	private initializeDialog(): void {
		this.initializeUpdateProjectFromDatabaseTab();
		this.dialog.content = [this.updateProjectFromDatabaseTab];
	}

	private initializeUpdateProjectFromDatabaseTab(): void {
		this.updateProjectFromDatabaseTab.registerContent(async view => {

			const connectionRow = this.createConnectionRow(view);
			const databaseRow = this.createDatabaseRow(view);
			const sourceDatabaseFormSection = view.modelBuilder.flexContainer().withLayout({ flexFlow: 'column' }).component();
			sourceDatabaseFormSection.addItems([connectionRow, databaseRow]);

			const projectLocationRow = this.createProjectLocationRow(view);
			const targetProjectFormSection = view.modelBuilder.flexContainer().withLayout({ flexFlow: 'column' }).component();
			targetProjectFormSection.addItems([projectLocationRow]);

			this.formBuilder = <azdataType.FormBuilder>view.modelBuilder.formContainer()
				.withFormItems([
					{
						title: constants.sourceDatabase,
						components: [
							{
								component: sourceDatabaseFormSection,
							}
						]
					},
					{
						title: constants.targetProject,
						components: [
							{
								component: targetProjectFormSection,
							}
						]
					},
				], {
					horizontal: false,
					titleFontSize: cssStyles.titleFontSize
				})
				.withLayout({
					width: '100%',
					padding: '10px 10px 0 20px'
				});

			let formModel = this.formBuilder.component();
			await view.initializeModel(formModel);
			this.selectConnectionButton?.focus();
			this.initDialogComplete?.resolve();
		});
	}

	private createConnectionRow(view: azdataType.ModelView): azdataType.FlexContainer {
		const sourceConnectionTextBox = this.createSourceConnectionComponent(view);
		const selectConnectionButton: azdataType.Component = this.createSelectConnectionButton(view);

		const serverLabel = view.modelBuilder.text().withProps({
			value: constants.server,
			requiredIndicator: true,
			width: cssStyles.updateProjectFromDatabaseLabelWidth
		}).component();

		const connectionRow = view.modelBuilder.flexContainer().withItems([serverLabel, sourceConnectionTextBox], { flex: '0 0 auto', CSSStyles: { 'margin-right': '10px', 'margin-bottom': '-5px', 'margin-top': '-10px' } }).withLayout({ flexFlow: 'row', alignItems: 'center' }).component();
		connectionRow.addItem(selectConnectionButton, { CSSStyles: { 'margin-right': '0px', 'margin-bottom': '-5px', 'margin-top': '-10px' } });

		return connectionRow;
	}

	private createDatabaseRow(view: azdataType.ModelView): azdataType.FlexContainer {
		this.sourceDatabaseDropDown = view.modelBuilder.dropDown().withProps({
			ariaLabel: constants.databaseNameLabel,
			required: true,
			width: cssStyles.updateProjectFromDatabaseTextboxWidth
		}).component();

		this.sourceDatabaseDropDown.onValueChanged(() => {
			this.tryEnableUpdateButton();
		});

		const databaseLabel = view.modelBuilder.text().withProps({
			value: constants.databaseNameLabel,
			requiredIndicator: true,
			width: cssStyles.updateProjectFromDatabaseLabelWidth
		}).component();

		const databaseRow = view.modelBuilder.flexContainer().withItems([databaseLabel, <azdataType.DropDownComponent>this.sourceDatabaseDropDown], { flex: '0 0 auto', CSSStyles: { 'margin-right': '10px', 'margin-bottom': '-10px' } }).withLayout({ flexFlow: 'row', alignItems: 'center' }).component();

		return databaseRow;
	}

	private createSourceConnectionComponent(view: azdataType.ModelView): azdataType.InputBoxComponent {
		this.sourceConnectionTextBox = view.modelBuilder.inputBox().withProps({
			value: '',
			placeHolder: constants.selectConnection,
			width: cssStyles.updateProjectFromDatabaseTextboxWidth,
			enabled: false
		}).component();

		this.sourceConnectionTextBox.onTextChanged(() => {
			this.tryEnableUpdateButton();
		});

		return this.sourceConnectionTextBox;
	}

	private createSelectConnectionButton(view: azdataType.ModelView): azdataType.Component {
		this.selectConnectionButton = view.modelBuilder.button().withProps({
			ariaLabel: constants.selectConnection,
			iconPath: IconPathHelper.selectConnection,
			height: '16px',
			width: '16px'
		}).component();

		this.selectConnectionButton.onDidClick(async () => {
			let connection = await getAzdataApi()!.connection.openConnectionDialog();
			this.connectionId = connection.connectionId;

			let connectionTextboxValue: string;
			connectionTextboxValue = getConnectionName(connection);

			await this.updateConnectionComponents(connectionTextboxValue, this.connectionId, connection.options.database);
		});

		return this.selectConnectionButton;
	}

	private async updateConnectionComponents(connectionTextboxValue: string, connectionId: string, databaseName?: string) {
		this.sourceConnectionTextBox!.value = connectionTextboxValue;
		this.sourceConnectionTextBox!.updateProperty('title', connectionTextboxValue);

		// populate database dropdown with the databases for this connection
		if (connectionId) {
			this.sourceDatabaseDropDown!.loading = true;
			let databaseValues;
			try {
				databaseValues = (await getAzdataApi()!.connection.listDatabases(connectionId))
					// filter out system dbs
					.filter(db => !constants.systemDbs.includes(db));
			} catch (e) {
				// if the user doesn't have access to master, just set the database of the connection profile
				databaseValues = [databaseName!];
				console.warn(e);
			}

			this.sourceDatabaseDropDown!.values = databaseValues;
			this.sourceDatabaseDropDown!.loading = false;
			this.connectionId = connectionId;
		}

		// change the database inputbox value to the connection's database if there is one
		if (databaseName && databaseName !== constants.master) {
			this.sourceDatabaseDropDown!.value = databaseName;
		}

		// change icon to the one without a plus sign
		this.selectConnectionButton!.iconPath = IconPathHelper.connect;
	}

	private createProjectLocationRow(view: azdataType.ModelView): azdataType.FlexContainer {
		const browseFolderButton: azdataType.Component = this.createBrowseFolderButton(view);

		this.projectLocationTextBox = view.modelBuilder.inputBox().withProps({
			value: '',
			ariaLabel: constants.projectLocationLabel,
			placeHolder: constants.projectToUpdatePlaceholderText,
			width: cssStyles.updateProjectFromDatabaseTextboxWidth
		}).component();

		this.projectLocationTextBox.onTextChanged(() => {
			this.projectLocationTextBox!.updateProperty('title', this.projectLocationTextBox!.value);
			this.tryEnableUpdateButton();
		});

		const projectLocationLabel = view.modelBuilder.text().withProps({
			value: constants.projectLocationLabel,
			requiredIndicator: true,
			width: cssStyles.updateProjectFromDatabaseLabelWidth
		}).component();

		const projectLocationRow = view.modelBuilder.flexContainer().withItems([projectLocationLabel, this.projectLocationTextBox], { flex: '0 0 auto', CSSStyles: { 'margin-right': '10px', 'margin-bottom': '-10px' } }).withLayout({ flexFlow: 'row', alignItems: 'center' }).component();
		projectLocationRow.addItem(browseFolderButton, { CSSStyles: { 'margin-right': '0px', 'margin-bottom': '-10px' } });

		return projectLocationRow;
	}

	private createBrowseFolderButton(view: azdataType.ModelView): azdataType.ButtonComponent {
		const browseFolderButton = view.modelBuilder.button().withProps({
			ariaLabel: constants.browseButtonText,
			iconPath: IconPathHelper.folder_blue,
			height: '18px',
			width: '18px'
		}).component();

		browseFolderButton.onDidClick(async () => {
			let folderUris = await vscode.window.showOpenDialog({
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: false,
				openLabel: constants.selectString,
				defaultUri: newProjectTool.defaultProjectSaveLocation()
			});
			if (!folderUris || folderUris.length === 0) {
				return;
			}

			this.projectLocationTextBox!.value = folderUris[0].fsPath;
			this.projectLocationTextBox!.updateProperty('title', folderUris[0].fsPath);
		});

		return browseFolderButton;
	}

	private containsScriptFiles(): boolean {
		let toReturn: boolean = false;
		let dirs: string[] = [];
		const fs = require('fs');
		let path: string;

		dirs.push(this.projectLocationTextBox!.value!);

		while (dirs.length) {
			fs.readdirSync(dirs[0]).forEach((file: string) => {
				path = dirs[0] + '\\' + file;

				if (file.substr(-('.sql'.length)) === '.sql') {
					toReturn = true;

				} else if (fs.lstatSync(path).isDirectory()) {
					dirs.push(path);
				}
			});

			dirs.shift();
		}

		return toReturn;
	}

	// only enable Update button if all fields are filled
	public tryEnableUpdateButton(): void {
		if (this.sourceConnectionTextBox!.value && this.sourceDatabaseDropDown!.value &&
			this.projectLocationTextBox!.value) {
			this.dialog.okButton.enabled = true;
		} else {
			this.dialog.okButton.enabled = false;
		}
	}

	public async handleUpdateButtonClick(): Promise<void> {
		// TODO: Find way to not hardcode folderStructure and version
		const model: UpdateDataModel = {
			folderStructure: 'test',
			projectPath: this.projectLocationTextBox!.value!,
			serverId: this.connectionId!,
			version: 'SqlServer2016'
		};

		getAzdataApi()!.window.closeDialog(this.dialog);
		await this.updateProjectFromDatabaseCallback!(model);

		this.dispose();
	}

	async validate(): Promise<boolean> {
		try {
			if (await getDataWorkspaceExtensionApi().validateWorkspace() === false) {
				return false;
			}
			// the selected location should be an existing directory
			const parentDirectoryExists = await exists(this.projectLocationTextBox!.value!);
			if (!parentDirectoryExists) {
				this.showErrorMessage(constants.ProjectParentDirectoryNotExistError(this.projectLocationTextBox!.value!));
				return false;
			}

			// the selected location should contain .sql files
			if (!this.containsScriptFiles()) {
				this.showErrorMessage(constants.noScriptFiles);
				return false;
			}

			return true;
		} catch (err) {
			this.showErrorMessage(err?.message ? err.message : err);
			return false;
		}
	}

	protected showErrorMessage(message: string): void {
		this.dialog.message = {
			text: message,
			level: getAzdataApi()!.window.MessageLevel.Error
		};
	}
}
