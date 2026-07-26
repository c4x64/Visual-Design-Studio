import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { registerSingleton, InstantiationType } from '../../../../platform/instantiation/common/extensions.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { WinFormsControlType, WinFormsControl, WinFormsForm, createDefaultControl } from '../common/winforms.js';

export const IWinFormsExtensionService = createDecorator<IWinFormsExtensionService>('winformsExtensionService');

export interface IWinFormsControlRegistration {
	type: string;
	displayName: string;
	icon: string;
	defaultWidth: number;
	defaultHeight: number;
	defaultProperties: Record<string, { type: string; defaultValue: unknown }>;
	renderer: (control: WinFormsControl) => HTMLElement;
	codeGenerator: (control: WinFormsControl, form: WinFormsForm) => string[];
}

export interface IWinFormsExtensionService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeForm: Event<void>;
	readonly onDidSelectControl: Event<string | null>;

	getForm(): WinFormsForm;
	setForm(form: WinFormsForm): void;
	getSelectedControl(): string | null;
	selectControl(id: string | null): void;

	addControl(type: string): void;
	addControlAt(type: string, x: number, y: number): void;
	removeControl(id: string): void;

	registerControl(registration: IWinFormsControlRegistration): void;
	getRegisteredControls(): IWinFormsControlRegistration[];

	build(): void;
	generateCode(): string;
	startDebug(): void;
	startWithoutDebug(): void;
	openOptions(): void;
	showToolbox(): void;
	showProperties(): void;
}

export class WinFormsExtensionService implements IWinFormsExtensionService {
	readonly _serviceBrand: undefined;

	private _form: WinFormsForm;
	private _selectedControl: string | null = null;
	private _registeredControls: Map<string, IWinFormsControlRegistration> = new Map();
	private _onDidChangeForm = new Emitter<void>();
	private _onDidSelectControl = new Emitter<string | null>();

	readonly onDidChangeForm = this._onDidChangeForm.event;
	readonly onDidSelectControl = this._onDidSelectControl.event;

	constructor() {
		this._form = {
			name: 'Form1',
			width: 800,
			height: 500,
			text: 'Form1',
			controls: [],
			events: {},
		};
	}

	getForm(): WinFormsForm { return this._form; }
	setForm(form: WinFormsForm): void {
		this._form = form;
		this._onDidChangeForm.fire();
	}

	getSelectedControl(): string | null { return this._selectedControl; }
	selectControl(id: string | null): void {
		this._selectedControl = id;
		this._onDidSelectControl.fire(id);
	}

	addControl(type: string): void {
		this.addControlAt(type, 10, 10);
	}

	addControlAt(type: string, x: number, y: number): void {
		const controlType = type as WinFormsControlType;
		const id = `${controlType}_${this._form.controls.length}`;
		const control = createDefaultControl(controlType, id);
		control.x = x;
		control.y = y;
		this._form.controls.push(control);
		this._onDidChangeForm.fire();
	}

	removeControl(id: string): void {
		const idx = this._form.controls.findIndex(c => c.id === id);
		if (idx >= 0) {
			this._form.controls.splice(idx, 1);
			this._onDidChangeForm.fire();
		}
	}

	registerControl(registration: IWinFormsControlRegistration): void {
		this._registeredControls.set(registration.type, registration);
	}

	getRegisteredControls(): IWinFormsControlRegistration[] {
		return Array.from(this._registeredControls.values());
	}

	build(): void {
		console.log('Build triggered');
	}

	generateCode(): string {
		return '';
	}

	startDebug(): void {
		console.log('Debug started');
	}

	startWithoutDebug(): void {
		console.log('Start without debug');
	}

	openOptions(): void {
		console.log('Options opened');
	}

	showToolbox(): void {
		console.log('Show toolbox');
	}

	showProperties(): void {
		console.log('Show properties');
	}
}

registerSingleton(IWinFormsExtensionService, WinFormsExtensionService, InstantiationType.Delayed);
