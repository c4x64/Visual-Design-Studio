import './media/winforms.css';
import { localize, localize2 } from '../../../../nls.js';
import { ViewPane, IViewPaneOptions } from '../../../browser/parts/views/viewPane.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { WinFormsControl, WinFormsForm, WinFormsControlType, WinFormsControlProperty } from '../common/winforms.js';
import { createDefaultControl } from '../common/winforms.js';
import { renderControl, generateStandaloneHtml } from './winformsRenderer.js';
import * as DOM from '../../../../base/browser/dom.js';

const WINFORMS_CONTROL_TYPES = [
	{ type: WinFormsControlType.Button, label: 'Button', icon: '⊞' },
	{ type: WinFormsControlType.Label, label: 'Label', icon: 'A' },
	{ type: WinFormsControlType.TextBox, label: 'TextBox', icon: 'T' },
	{ type: WinFormsControlType.ComboBox, label: 'ComboBox', icon: '▼' },
	{ type: WinFormsControlType.ListBox, label: 'ListBox', icon: '☰' },
	{ type: WinFormsControlType.CheckBox, label: 'CheckBox', icon: '☑' },
	{ type: WinFormsControlType.RadioButton, label: 'RadioButton', icon: '◉' },
	{ type: WinFormsControlType.Panel, label: 'Panel', icon: '▭' },
	{ type: WinFormsControlType.GroupBox, label: 'GroupBox', icon: '▣' },
	{ type: WinFormsControlType.PictureBox, label: 'PictureBox', icon: '🖼' },
	{ type: WinFormsControlType.ProgressBar, label: 'ProgressBar', icon: '▨' },
	{ type: WinFormsControlType.TrackBar, label: 'TrackBar', icon: '≡' },
	{ type: WinFormsControlType.TreeView, label: 'TreeView', icon: '🌳' },
];

export class WinFormsDesignerPane extends ViewPane {
	static readonly TITLE = localize2('winforms.designer.title', 'Designer');

	private _toolboxEl!: HTMLElement;
	private _designSurfaceEl!: HTMLElement;
	private _propertyGridEl!: HTMLElement;
	private _form: WinFormsForm;
	private _selectedControl: string | null = null;
	private _dragControlType: WinFormsControlType | null = null;

	constructor(
		options: IViewPaneOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
		this._form = this.createDefaultForm();
	}

	private createDefaultForm(): WinFormsForm {
		return {
			name: 'Form1',
			width: 800,
			height: 500,
			text: 'Form1',
			controls: [],
			events: {},
		};
	}

	protected override renderBody(parent: HTMLElement): void {
		parent.className = 'winforms-designer-container';

		const toolbar = DOM.$('.winforms-toolbar');
		parent.appendChild(toolbar);

		const newBtn = DOM.$('button.winforms-tb-btn', undefined, localize('new', 'New'));
		newBtn.onclick = () => this.newForm();
		toolbar.appendChild(newBtn);

		const generateBtn = DOM.$('button.winforms-tb-btn', undefined, localize('generateCode', 'Generate C#'));
		generateBtn.onclick = () => this.generateCode();
		toolbar.appendChild(generateBtn);

		const crossBtn = DOM.$('button.winforms-tb-btn', undefined, localize('crossCompile', 'Cross-Compile'));
		crossBtn.onclick = () => this.crossCompileHtml();
		toolbar.appendChild(crossBtn);

		const mainArea = DOM.$('.winforms-main');
		parent.appendChild(mainArea);

		this._toolboxEl = DOM.$('.winforms-toolbox');
		this._toolboxEl.appendChild(DOM.$('.winforms-panel-header', undefined, localize('toolbox', 'Toolbox')));
		this.populateToolbox();
		mainArea.appendChild(this._toolboxEl);

		const centerArea = DOM.$('.winforms-center');
		mainArea.appendChild(centerArea);

		this._designSurfaceEl = DOM.$('.winforms-design-surface');
		centerArea.appendChild(this._designSurfaceEl);

		this._propertyGridEl = DOM.$('.winforms-property-grid');
		this._propertyGridEl.appendChild(DOM.$('.winforms-panel-header', undefined, localize('properties', 'Properties')));
		centerArea.appendChild(this._propertyGridEl);

		this.renderForm();
		this.updatePropertyGrid();
	}

	private populateToolbox(): void {
		for (const ct of WINFORMS_CONTROL_TYPES) {
			const item = DOM.$('.winforms-toolbox-item');
			item.draggable = true;
			item.textContent = `${ct.icon} ${ct.label}`;
			item.dataset.controlType = ct.type;

			item.ondragstart = (e: DragEvent) => {
				this._dragControlType = ct.type;
				e.dataTransfer?.setData('text/plain', ct.type);
			};

			item.ondragend = () => {
				this._dragControlType = null;
			};

			item.onclick = () => {
				const control = createDefaultControl(ct.type, `${ct.type}_${this._form.controls.length}`);
				this._form.controls.push(control);
				this.renderForm();
				this.selectControl(control.id);
			};

			this._toolboxEl.appendChild(item);
		}
	}

	private renderForm(): void {
		DOM.clearNode(this._designSurfaceEl);

		const formEl = DOM.$('.winforms-form-surface');
		formEl.style.width = `${this._form.width}px`;
		formEl.style.height = `${this._form.height}px`;
		formEl.style.position = 'relative';
		formEl.style.overflow = 'hidden';

		formEl.ondragover = (e: DragEvent) => { e.preventDefault(); };
		formEl.ondrop = (e: DragEvent) => {
			e.preventDefault();
			if (this._dragControlType) {
				const rect = formEl.getBoundingClientRect();
				const x = Math.round(e.clientX - rect.left);
				const y = Math.round(e.clientY - rect.top);
				const control = createDefaultControl(this._dragControlType, `${this._dragControlType}_${this._form.controls.length}`);
				control.x = Math.max(0, x - 30);
				control.y = Math.max(0, y - 15);
				this._form.controls.push(control);
				this.renderForm();
				this.selectControl(control.id);
				this._dragControlType = null;
			}
		};

		for (const control of this._form.controls) {
			const el = this.createControlElement(control);
			formEl.appendChild(el);
		}

		formEl.onclick = () => {
			this._selectedControl = null;
			this.updatePropertyGrid();
			this.highlightSelection();
		};

		this._designSurfaceEl.appendChild(formEl);

		if (this._form.controls.length === 0) {
			const emptyMsg = DOM.$('.winforms-empty-message');
			emptyMsg.textContent = localize('dragControls', 'Drag controls from the toolbox or click to add them.');
			formEl.appendChild(emptyMsg);
		}
	}

	private createControlElement(control: WinFormsControl): HTMLElement {
		const el = DOM.$(`.winforms-control.winforms-${control.type.toLowerCase()}`);
		el.id = control.id;
		el.style.left = `${control.x}px`;
		el.style.top = `${control.y}px`;
		el.style.width = `${control.width}px`;
		el.style.height = `${control.height}px`;

		const inner = renderControl(control, this._form);
		if (inner) el.appendChild(inner);

		el.onclick = (e: MouseEvent) => {
			e.stopPropagation();
			this.selectControl(control.id);
		};

		el.onmousedown = () => {
			this.selectControl(control.id);
		};

		this.makeDraggableResizable(el, control);
		return el;
	}

	private makeDraggableResizable(el: HTMLElement, control: WinFormsControl): void {
		let isDragging = false;
		let isResizing = false;
		let startX: number;
		let startY: number;
		let startLeft: number;
		let startTop: number;
		let startWidth: number;
		let startHeight: number;

		el.onmousedown = (e: MouseEvent) => {
			if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'SELECT') return;
			const resizeHandle = (e.target as HTMLElement).closest('.wf-resize-handle');
			if (resizeHandle) return;

			isDragging = true;
			startX = e.clientX;
			startY = e.clientY;
			startLeft = control.x;
			startTop = control.y;
			el.style.cursor = 'move';
			e.preventDefault();

			const onMouseMove = (ev: MouseEvent) => {
				if (!isDragging) return;
				const dx = ev.clientX - startX;
				const dy = ev.clientY - startY;
				control.x = Math.max(0, startLeft + dx);
				control.y = Math.max(0, startTop + dy);
				el.style.left = `${control.x}px`;
				el.style.top = `${control.y}px`;
			};

			const onMouseUp = () => {
				isDragging = false;
				el.style.cursor = '';
				document.removeEventListener('mousemove', onMouseMove);
				document.removeEventListener('mouseup', onMouseUp);
			};

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);

			this.selectControl(control.id);
		};

		const resizeHandle = DOM.$('.wf-resize-handle');
		el.appendChild(resizeHandle);

		resizeHandle.onmousedown = (e: MouseEvent) => {
			e.stopPropagation();
			e.preventDefault();
			isResizing = true;
			startX = e.clientX;
			startY = e.clientY;
			startWidth = control.width;
			startHeight = control.height;

			const onMouseMove = (ev: MouseEvent) => {
				if (!isResizing) return;
				control.width = Math.max(20, startWidth + (ev.clientX - startX));
				control.height = Math.max(10, startHeight + (ev.clientY - startY));
				el.style.width = `${control.width}px`;
				el.style.height = `${control.height}px`;
			};

			const onMouseUp = () => {
				isResizing = false;
				document.removeEventListener('mousemove', onMouseMove);
				document.removeEventListener('mouseup', onMouseUp);
			};

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);
		};
	}

	private selectControl(id: string): void {
		this._selectedControl = id;
		this.updatePropertyGrid();
		this.highlightSelection();
	}

	private highlightSelection(): void {
		const allEls = this._designSurfaceEl.querySelectorAll('.winforms-control');
		allEls.forEach(el => (el as HTMLElement).classList.remove('selected'));
		if (this._selectedControl) {
			const sel = this._designSurfaceEl.querySelector(`#${CSS.escape(this._selectedControl)}`);
			if (sel) sel.classList.add('selected');
		}
	}

	private updatePropertyGrid(): void {
		DOM.clearNode(this._propertyGridEl);
		this._propertyGridEl.appendChild(DOM.$('.winforms-panel-header', undefined, localize('properties', 'Properties')));

		const selected = this._selectedControl
			? this.findControl(this._form.controls, this._selectedControl)
			: null;

		if (!selected) {
			const msg = DOM.$('.winforms-property-empty');
			msg.textContent = localize('noSelection', 'No control selected');
			this._propertyGridEl.appendChild(msg);
			return;
		}

		const nameLabel = DOM.$('span.wp-label');
		nameLabel.textContent = 'Name';
		const nameValue = DOM.$('span.wp-value');
		nameValue.textContent = selected.name;
		const nameRow = DOM.$('.winforms-property-row');
		nameRow.appendChild(nameLabel);
		nameRow.appendChild(nameValue);
		this._propertyGridEl.appendChild(nameRow);

		const typeLabel = DOM.$('span.wp-label');
		typeLabel.textContent = 'Type';
		const typeValue = DOM.$('span.wp-value');
		typeValue.textContent = selected.type;
		const typeRow = DOM.$('.winforms-property-row');
		typeRow.appendChild(typeLabel);
		typeRow.appendChild(typeValue);
		this._propertyGridEl.appendChild(typeRow);

		const categories = new Map<string, WinFormsControlProperty[]>();
		for (const prop of Object.values(selected.properties)) {
			if (!categories.has(prop.category)) categories.set(prop.category, []);
			categories.get(prop.category)!.push(prop);
		}

		for (const [cat, props] of categories) {
			const catHeader = DOM.$('.winforms-property-category');
			catHeader.textContent = cat;
			this._propertyGridEl.appendChild(catHeader);

			for (const prop of props) {
				const row = this.createPropertyRow(selected, prop);
				this._propertyGridEl.appendChild(row);
			}
		}
	}

	private createPropertyRow(control: WinFormsControl, prop: WinFormsControlProperty): HTMLElement {
		const row = DOM.$('.winforms-property-row');
		const label = DOM.$('span.wp-label');
		label.textContent = prop.name;
		row.appendChild(label);

		const valueEl = DOM.$('span.wp-value');

		switch (prop.type) {
			case 'boolean': {
				const cb = DOM.$('input') as HTMLInputElement;
				cb.type = 'checkbox';
				cb.checked = prop.value as boolean;
				cb.onchange = () => { prop.value = cb.checked; this.renderForm(); };
				valueEl.appendChild(cb);
				break;
			}
			case 'number': {
				const inp = DOM.$('input') as HTMLInputElement;
				inp.type = 'number';
				inp.value = String(prop.value);
				inp.style.width = '100%';
				inp.onchange = () => { prop.value = Number(inp.value); this.renderForm(); };
				valueEl.appendChild(inp);
				break;
			}
			case 'color': {
				const inp = DOM.$('input') as HTMLInputElement;
				inp.type = 'color';
				inp.value = prop.value as string;
				inp.onchange = () => { prop.value = inp.value; this.renderForm(); };
				valueEl.appendChild(inp);
				break;
			}
			case 'enum': {
				const sel = DOM.$('select') as HTMLSelectElement;
				sel.style.width = '100%';
				for (const opt of prop.enumValues ?? []) {
					const option = DOM.$('option') as HTMLOptionElement;
					option.value = opt;
					option.textContent = opt;
					if (opt === prop.value) option.selected = true;
					sel.appendChild(option);
				}
				sel.onchange = () => { prop.value = sel.value; this.renderForm(); };
				valueEl.appendChild(sel);
				break;
			}
			default: {
				const inp = DOM.$('input') as HTMLInputElement;
				inp.type = 'text';
				inp.value = String(prop.value ?? '');
				inp.style.width = '100%';
				inp.onchange = () => { prop.value = inp.value; this.renderForm(); };
				valueEl.appendChild(inp);
			}
		}

		row.appendChild(valueEl);
		return row;
	}

	private findControl(controls: WinFormsControl[], id: string): WinFormsControl | null {
		for (const c of controls) {
			if (c.id === id) return c;
			const found = this.findControl(c.children, id);
			if (found) return found;
		}
		return null;
	}

	private newForm(): void {
		this._form = this.createDefaultForm();
		this._selectedControl = null;
		this.renderForm();
		this.updatePropertyGrid();
	}

	private crossCompileHtml(): void {
		const html = generateStandaloneHtml(this._form);
		const blob = new Blob([html], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${this._form.name}.html`;
		a.click();
		URL.revokeObjectURL(url);
	}

	private generateCode(): void {
		const code = this.generateCSharpCode();
		const blob = new Blob([code], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${this._form.name}.Designer.cs`;
		a.click();
		URL.revokeObjectURL(url);
	}

	generateCSharpCode(): string {
		const lines: string[] = [];
		lines.push('namespace WinFormsApp;');
		lines.push('');
		lines.push(`partial class ${this._form.name}`);
		lines.push('{');
		lines.push('    private System.ComponentModel.IContainer components = null;');
		lines.push('');
		lines.push('    protected override void Dispose(bool disposing)');
		lines.push('    {');
		lines.push('        if (disposing && (components != null))');
		lines.push('        {');
		lines.push('            components.Dispose();');
		lines.push('        }');
		lines.push('        base.Dispose(disposing);');
		lines.push('    }');
		lines.push('');
		lines.push('    private void InitializeComponent()');
		lines.push('    {');

		for (const c of this._form.controls) {
			lines.push(`        this.${c.name} = new System.Windows.Forms.${c.type}();`);
		}

		lines.push(`        this.SuspendLayout();`);
		lines.push('');

		for (const c of this._form.controls) {
			lines.push(`        // ${c.name}`);
			for (const [key, prop] of Object.entries(c.properties)) {
				if (prop.value === prop.defaultValue) continue;
				switch (key) {
					case 'Text':
						lines.push(`        this.${c.name}.Text = "${prop.value}";`);
						break;
					case 'Enabled':
					case 'Visible':
					case 'ReadOnly':
					case 'Multiline':
					case 'Checked':
						lines.push(`        this.${c.name}.${key} = ${prop.value};`);
						break;
					case 'BackColor':
					case 'ForeColor':
						lines.push(`        this.${c.name}.${key} = System.Drawing.ColorTranslator.FromHtml("${prop.value}");`);
						break;
					case 'TabIndex':
					case 'MaxLength':
					case 'Minimum':
					case 'Maximum':
					case 'Value':
					case 'FontSize':
						lines.push(`        this.${c.name}.${key} = ${prop.value};`);
						break;
					case 'DropDownStyle':
						lines.push(`        this.${c.name}.DropDownStyle = System.Windows.Forms.ComboBoxStyle.${prop.value};`);
						break;
					case 'SelectionMode':
						lines.push(`        this.${c.name}.SelectionMode = System.Windows.Forms.SelectionMode.${prop.value};`);
						break;
					case 'BorderStyle':
						lines.push(`        this.${c.name}.BorderStyle = System.Windows.Forms.BorderStyle.${prop.value};`);
						break;
					case 'SizeMode':
						lines.push(`        this.${c.name}.SizeMode = System.Windows.Forms.PictureBoxSizeMode.${prop.value};`);
						break;
					case 'TextAlign':
						lines.push(`        this.${c.name}.TextAlign = System.Drawing.ContentAlignment.${prop.value};`);
						break;
				}
			}
			lines.push(`        this.${c.name}.Location = new System.Drawing.Point(${c.x}, ${c.y});`);
			lines.push(`        this.${c.name}.Size = new System.Drawing.Size(${c.width}, ${c.height});`);
			lines.push(`        this.${c.name}.Name = "${c.name}";`);
			lines.push(`        this.${c.name}.TabIndex = ${c.properties.TabIndex?.value ?? 0};`);
			lines.push(`        this.${c.name}.TabStop = true;`);
			lines.push('');
		}

		lines.push('        // Form');
		lines.push(`        this.ClientSize = new System.Drawing.Size(${this._form.width}, ${this._form.height});`);
		lines.push(`        this.Text = "${this._form.text}";`);
		lines.push(`        this.Name = "${this._form.name}";`);

		for (const c of this._form.controls) {
			lines.push(`        this.Controls.Add(this.${c.name});`);
		}

		lines.push('        this.ResumeLayout(false);');
		lines.push('    }');

		for (const c of this._form.controls) {
			lines.push('');
			lines.push(`    private System.Windows.Forms.${c.type} ${c.name};`);
		}

		lines.push('}');
		lines.push('');

		return lines.join('\n');
	}

	public override focus(): void {
		super.focus();
		this._designSurfaceEl?.focus();
	}
}
