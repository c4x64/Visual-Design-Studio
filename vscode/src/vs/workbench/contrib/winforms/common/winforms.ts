import { localize } from '../../../../nls.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';

export const WINFORMS_VIEW_CONTAINER_ID = 'workbench.view.winforms';
export const WINFORMS_DESIGNER_VIEW_ID = 'winforms.designer';
export const WINFORMS_TOOLBOX_VIEW_ID = 'winforms.toolbox';
export const WINFORMS_PROPERTIES_VIEW_ID = 'winforms.properties';

export const winformsViewIcon = registerIcon('winforms-view-icon', Codicon.window, localize('winformsViewIcon', 'View icon of the WinForms designer view.'));

export const enum WinFormsControlType {
	Button = 'Button',
	Label = 'Label',
	TextBox = 'TextBox',
	ComboBox = 'ComboBox',
	ListBox = 'ListBox',
	CheckBox = 'CheckBox',
	RadioButton = 'RadioButton',
	Panel = 'Panel',
	GroupBox = 'GroupBox',
	PictureBox = 'PictureBox',
	ProgressBar = 'ProgressBar',
	TreeView = 'TreeView',
	ListView = 'ListView',
	DateTimePicker = 'DateTimePicker',
	MonthCalendar = 'MonthCalendar',
	TrackBar = 'TrackBar',
	RichTextBox = 'RichTextBox',
}

export interface WinFormsControlProperty {
	name: string;
	type: 'string' | 'number' | 'boolean' | 'color' | 'enum' | 'font' | 'image';
	value: unknown;
	defaultValue: unknown;
	enumValues?: string[];
	category: string;
	description: string;
}

export interface WinFormsControl {
	id: string;
	type: WinFormsControlType;
	name: string;
	x: number;
	y: number;
	width: number;
	height: number;
	properties: Record<string, WinFormsControlProperty>;
	children: WinFormsControl[];
	events: Record<string, string>;
}

export interface WinFormsForm {
	name: string;
	width: number;
	height: number;
	text: string;
	controls: WinFormsControl[];
	events: Record<string, string>;
}

export function createDefaultControl(type: WinFormsControlType, id: string): WinFormsControl {
	const base = {
		id,
		type,
		name: type + id,
		x: 10,
		y: 10,
		width: 100,
		height: 30,
		properties: {} as Record<string, WinFormsControlProperty>,
		children: [],
		events: {},
	};

	switch (type) {
		case WinFormsControlType.Button:
			base.properties = {
				Text: { name: 'Text', type: 'string' as const, value: 'button1', defaultValue: '', category: 'Appearance', description: 'The text displayed on the button.' },
				Enabled: { name: 'Enabled', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is enabled.' },
				Visible: { name: 'Visible', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is visible.' },
				BackColor: { name: 'BackColor', type: 'color' as const, value: '#E0E0E0', defaultValue: '#E0E0E0', category: 'Appearance', description: 'The background color.' },
				ForeColor: { name: 'ForeColor', type: 'color' as const, value: '#000000', defaultValue: '#000000', category: 'Appearance', description: 'The foreground color.' },
				FontSize: { name: 'FontSize', type: 'number' as const, value: 9, defaultValue: 9, category: 'Appearance', description: 'The font size.' },
				TabIndex: { name: 'TabIndex', type: 'number' as const, value: 0, defaultValue: 0, category: 'Behavior', description: 'The tab order.' },
			};
			base.width = 100;
			base.height = 30;
			break;

		case WinFormsControlType.Label:
			base.properties = {
				Text: { name: 'Text', type: 'string' as const, value: 'label1', defaultValue: '', category: 'Appearance', description: 'The text displayed on the label.' },
				Enabled: { name: 'Enabled', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is enabled.' },
				Visible: { name: 'Visible', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is visible.' },
				ForeColor: { name: 'ForeColor', type: 'color' as const, value: '#000000', defaultValue: '#000000', category: 'Appearance', description: 'The foreground color.' },
				FontSize: { name: 'FontSize', type: 'number' as const, value: 9, defaultValue: 9, category: 'Appearance', description: 'The font size.' },
				TextAlign: { name: 'TextAlign', type: 'enum' as const, value: 'TopLeft', defaultValue: 'TopLeft', enumValues: ['TopLeft', 'TopCenter', 'TopRight', 'MiddleLeft', 'MiddleCenter', 'MiddleRight', 'BottomLeft', 'BottomCenter', 'BottomRight'], category: 'Appearance', description: 'The text alignment.' },
			};
			base.width = 120;
			base.height = 23;
			break;

		case WinFormsControlType.TextBox:
			base.properties = {
				Text: { name: 'Text', type: 'string' as const, value: '', defaultValue: '', category: 'Appearance', description: 'The text content.' },
				Enabled: { name: 'Enabled', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is enabled.' },
				Visible: { name: 'Visible', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is visible.' },
				BackColor: { name: 'BackColor', type: 'color' as const, value: '#FFFFFF', defaultValue: '#FFFFFF', category: 'Appearance', description: 'The background color.' },
				ForeColor: { name: 'ForeColor', type: 'color' as const, value: '#000000', defaultValue: '#000000', category: 'Appearance', description: 'The foreground color.' },
				ReadOnly: { name: 'ReadOnly', type: 'boolean' as const, value: false, defaultValue: false, category: 'Behavior', description: 'Makes the text box read-only.' },
				Multiline: { name: 'Multiline', type: 'boolean' as const, value: false, defaultValue: false, category: 'Behavior', description: 'Enables multi-line editing.' },
				MaxLength: { name: 'MaxLength', type: 'number' as const, value: 32767, defaultValue: 32767, category: 'Behavior', description: 'The maximum number of characters.' },
			};
			base.width = 150;
			base.height = 23;
			break;

		case WinFormsControlType.ComboBox:
			base.properties = {
				Text: { name: 'Text', type: 'string' as const, value: '', defaultValue: '', category: 'Appearance', description: 'The text shown in the combo box.' },
				Enabled: { name: 'Enabled', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is enabled.' },
				Visible: { name: 'Visible', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is visible.' },
				DropDownStyle: { name: 'DropDownStyle', type: 'enum' as const, value: 'DropDown', defaultValue: 'DropDown', enumValues: ['DropDown', 'DropDownList', 'Simple'], category: 'Appearance', description: 'The style of the combo box.' },
			};
			base.width = 150;
			base.height = 23;
			break;

		case WinFormsControlType.ListBox:
			base.properties = {
				Enabled: { name: 'Enabled', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is enabled.' },
				Visible: { name: 'Visible', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is visible.' },
				BackColor: { name: 'BackColor', type: 'color' as const, value: '#FFFFFF', defaultValue: '#FFFFFF', category: 'Appearance', description: 'The background color.' },
				ForeColor: { name: 'ForeColor', type: 'color' as const, value: '#000000', defaultValue: '#000000', category: 'Appearance', description: 'The foreground color.' },
				SelectionMode: { name: 'SelectionMode', type: 'enum' as const, value: 'One', defaultValue: 'One', enumValues: ['None', 'One', 'MultiSimple', 'MultiExtended'], category: 'Behavior', description: 'The selection mode.' },
			};
			base.width = 150;
			base.height = 100;
			break;

		case WinFormsControlType.CheckBox:
			base.properties = {
				Text: { name: 'Text', type: 'string' as const, value: 'checkBox1', defaultValue: '', category: 'Appearance', description: 'The text displayed next to the check box.' },
				Checked: { name: 'Checked', type: 'boolean' as const, value: false, defaultValue: false, category: 'Appearance', description: 'Indicates whether the check box is checked.' },
				Enabled: { name: 'Enabled', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is enabled.' },
				Visible: { name: 'Visible', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is visible.' },
			};
			base.width = 100;
			base.height = 24;
			break;

		case WinFormsControlType.RadioButton:
			base.properties = {
				Text: { name: 'Text', type: 'string' as const, value: 'radioButton1', defaultValue: '', category: 'Appearance', description: 'The text displayed next to the radio button.' },
				Checked: { name: 'Checked', type: 'boolean' as const, value: false, defaultValue: false, category: 'Appearance', description: 'Indicates whether the radio button is checked.' },
				Enabled: { name: 'Enabled', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is enabled.' },
				Visible: { name: 'Visible', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is visible.' },
			};
			base.width = 100;
			base.height = 24;
			break;

		case WinFormsControlType.Panel:
			base.properties = {
				Enabled: { name: 'Enabled', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is enabled.' },
				Visible: { name: 'Visible', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is visible.' },
				BackColor: { name: 'BackColor', type: 'color' as const, value: '#F0F0F0', defaultValue: '#F0F0F0', category: 'Appearance', description: 'The background color.' },
				BorderStyle: { name: 'BorderStyle', type: 'enum' as const, value: 'None', defaultValue: 'None', enumValues: ['None', 'FixedSingle', 'Fixed3D'], category: 'Appearance', description: 'The border style.' },
			};
			base.width = 200;
			base.height = 150;
			break;

		case WinFormsControlType.GroupBox:
			base.properties = {
				Text: { name: 'Text', type: 'string' as const, value: 'groupBox1', defaultValue: '', category: 'Appearance', description: 'The group box caption.' },
				Enabled: { name: 'Enabled', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is enabled.' },
				Visible: { name: 'Visible', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is visible.' },
			};
			base.width = 200;
			base.height = 120;
			break;

		case WinFormsControlType.PictureBox:
			base.properties = {
				Enabled: { name: 'Enabled', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is enabled.' },
				Visible: { name: 'Visible', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is visible.' },
				SizeMode: { name: 'SizeMode', type: 'enum' as const, value: 'Normal', defaultValue: 'Normal', enumValues: ['Normal', 'StretchImage', 'AutoSize', 'CenterImage', 'Zoom'], category: 'Behavior', description: 'How the image is displayed.' },
				BorderStyle: { name: 'BorderStyle', type: 'enum' as const, value: 'None', defaultValue: 'None', enumValues: ['None', 'FixedSingle', 'Fixed3D'], category: 'Appearance', description: 'The border style.' },
			};
			base.width = 120;
			base.height = 100;
			break;

		case WinFormsControlType.ProgressBar:
			base.properties = {
				Enabled: { name: 'Enabled', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is enabled.' },
				Visible: { name: 'Visible', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is visible.' },
				Minimum: { name: 'Minimum', type: 'number' as const, value: 0, defaultValue: 0, category: 'Behavior', description: 'The minimum value.' },
				Maximum: { name: 'Maximum', type: 'number' as const, value: 100, defaultValue: 100, category: 'Behavior', description: 'The maximum value.' },
				Value: { name: 'Value', type: 'number' as const, value: 50, defaultValue: 50, category: 'Behavior', description: 'The current value.' },
			};
			base.width = 200;
			base.height = 23;
			break;

		case WinFormsControlType.TrackBar:
			base.properties = {
				Enabled: { name: 'Enabled', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is enabled.' },
				Visible: { name: 'Visible', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is visible.' },
				Minimum: { name: 'Minimum', type: 'number' as const, value: 0, defaultValue: 0, category: 'Behavior', description: 'The minimum value.' },
				Maximum: { name: 'Maximum', type: 'number' as const, value: 10, defaultValue: 10, category: 'Behavior', description: 'The maximum value.' },
				Value: { name: 'Value', type: 'number' as const, value: 5, defaultValue: 5, category: 'Behavior', description: 'The current value.' },
			};
			base.width = 200;
			base.height = 45;
			break;

		case WinFormsControlType.TreeView:
			base.properties = {
				Enabled: { name: 'Enabled', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is enabled.' },
				Visible: { name: 'Visible', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is visible.' },
				BackColor: { name: 'BackColor', type: 'color' as const, value: '#FFFFFF', defaultValue: '#FFFFFF', category: 'Appearance', description: 'The background color.' },
			};
			base.width = 200;
			base.height = 150;
			break;

		default:
			base.properties = {
				Text: { name: 'Text', type: 'string' as const, value: type, defaultValue: '', category: 'Appearance', description: 'The text.' },
				Enabled: { name: 'Enabled', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is enabled.' },
				Visible: { name: 'Visible', type: 'boolean' as const, value: true, defaultValue: true, category: 'Behavior', description: 'Indicates whether the control is visible.' },
			};
	}

	return base;
}
