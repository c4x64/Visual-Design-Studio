import { localize2 } from '../../../../nls.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IViewContainersRegistry, IViewsRegistry, Extensions, ViewContainerLocation } from '../../../common/views.js';
import { WinFormsDesignerPane } from './winformsDesignerPane.js';
import { WINFORMS_VIEW_CONTAINER_ID, WINFORMS_DESIGNER_VIEW_ID, winformsViewIcon } from '../common/winforms.js';
import { registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { KeyMod, KeyCode } from '../../../../base/common/keyCodes.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import type { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IWinFormsExtensionService } from './winformsExtAPI.js';

const viewContainerRegistry = Registry.as<IViewContainersRegistry>(Extensions.ViewContainersRegistry);

viewContainerRegistry.registerViewContainer({
	id: WINFORMS_VIEW_CONTAINER_ID,
	title: localize2('winforms.container.title', 'WinForms Designer'),
	ctorDescriptor: new SyncDescriptor(ViewPaneContainer),
	storageId: 'workbench.winforms.views.state',
	icon: winformsViewIcon,
	alwaysUseContainerInfo: true,
	hideIfEmpty: false,
	order: 2,
	openCommandActionDescriptor: {
		id: WINFORMS_VIEW_CONTAINER_ID,
		title: localize2('winforms.openDesigner', 'WinForms Designer'),
		keybindings: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyD },
		order: 2
	},
}, ViewContainerLocation.Sidebar, { isDefault: false });

const viewsRegistry = Registry.as<IViewsRegistry>(Extensions.ViewsRegistry);

viewsRegistry.registerViews([{
	id: WINFORMS_DESIGNER_VIEW_ID,
	name: localize2('winforms.designer.title', 'Designer'),
	ctorDescriptor: new SyncDescriptor(WinFormsDesignerPane),
	containerIcon: winformsViewIcon,
	order: 0,
	canToggleVisibility: false,
	canMoveView: false,
	collapsed: false,
}], viewContainerRegistry.get(WINFORMS_VIEW_CONTAINER_ID)!);

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'winforms.addButton',
			title: localize2('winforms.addButton', 'Add Button'),
			menu: { id: MenuId.MenubarProjectMenu, group: '1_add', order: 1 },
			f1: true
		});
	}
	run(accessor: ServicesAccessor) {
		accessor.get(IWinFormsExtensionService).addControl('Button');
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'winforms.addLabel',
			title: localize2('winforms.addLabel', 'Add Label'),
			menu: { id: MenuId.MenubarProjectMenu, group: '1_add', order: 2 },
			f1: true
		});
	}
	run(accessor: ServicesAccessor) {
		accessor.get(IWinFormsExtensionService).addControl('Label');
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'winforms.addTextBox',
			title: localize2('winforms.addTextBox', 'Add TextBox'),
			menu: { id: MenuId.MenubarProjectMenu, group: '1_add', order: 3 },
			f1: true
		});
	}
	run(accessor: ServicesAccessor) {
		accessor.get(IWinFormsExtensionService).addControl('TextBox');
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'winforms.build',
			title: localize2('winforms.build', 'Build'),
			menu: { id: MenuId.MenubarBuildMenu, group: '1_build', order: 1 },
			keybinding: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyB, weight: KeybindingWeight.WorkbenchContrib },
			f1: true
		});
	}
	run(accessor: ServicesAccessor) {
		accessor.get(IWinFormsExtensionService).build();
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'winforms.generateCode',
			title: localize2('winforms.generateCode', 'Generate C# Code'),
			menu: { id: MenuId.MenubarBuildMenu, group: '2_generate', order: 1 },
			keybinding: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyG, weight: KeybindingWeight.WorkbenchContrib },
			f1: true
		});
	}
	run(accessor: ServicesAccessor) {
		accessor.get(IWinFormsExtensionService).generateCode();
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'winforms.startDebug',
			title: localize2('winforms.startDebug', 'Start Debugging'),
			menu: { id: MenuId.MenubarDebugMenu, group: '1_start', order: 1 },
			keybinding: { primary: KeyCode.F5, weight: KeybindingWeight.WorkbenchContrib },
			f1: true
		});
	}
	run(accessor: ServicesAccessor) {
		accessor.get(IWinFormsExtensionService).startDebug();
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'winforms.startWithoutDebug',
			title: localize2('winforms.startWithoutDebug', 'Start Without Debugging'),
			menu: { id: MenuId.MenubarDebugMenu, group: '1_start', order: 2 },
			keybinding: { primary: KeyMod.CtrlCmd | KeyCode.F5, weight: KeybindingWeight.WorkbenchContrib },
			f1: true
		});
	}
	run(accessor: ServicesAccessor) {
		accessor.get(IWinFormsExtensionService).startWithoutDebug();
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'winforms.options',
			title: localize2('winforms.options', 'Options'),
			menu: { id: MenuId.MenubarToolsMenu, group: '1_options', order: 1 },
			f1: true
		});
	}
	run(accessor: ServicesAccessor) {
		accessor.get(IWinFormsExtensionService).openOptions();
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'winforms.toolbox',
			title: localize2('winforms.toolbox', 'Toolbox'),
			menu: { id: MenuId.MenubarViewMenu, group: '1_winforms', order: 1 },
			f1: true
		});
	}
	run(accessor: ServicesAccessor) {
		accessor.get(IWinFormsExtensionService).showToolbox();
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'winforms.properties',
			title: localize2('winforms.properties', 'Properties Window'),
			menu: { id: MenuId.MenubarViewMenu, group: '1_winforms', order: 2 },
			keybinding: { primary: KeyCode.F4, weight: KeybindingWeight.WorkbenchContrib },
			f1: true
		});
	}
	run(accessor: ServicesAccessor) {
		accessor.get(IWinFormsExtensionService).showProperties();
	}
});
