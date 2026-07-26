import { localize } from '../../../nls.js';
import { MenuId, MenuRegistry } from '../../../platform/actions/common/actions.js';

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarFileMenu,
	title: { value: 'File', original: 'File', mnemonicTitle: localize({ key: 'mFile', comment: ['&& denotes a mnemonic'] }, '&&File') },
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarEditMenu,
	title: { value: 'Edit', original: 'Edit', mnemonicTitle: localize({ key: 'mEdit', comment: ['&& denotes a mnemonic'] }, '&&Edit') },
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarViewMenu,
	title: { value: 'View', original: 'View', mnemonicTitle: localize({ key: 'mView', comment: ['&& denotes a mnemonic'] }, '&&View') },
	order: 3
});

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarProjectMenu,
	title: { value: 'Project', original: 'Project', mnemonicTitle: localize({ key: 'mProject', comment: ['&& denotes a mnemonic'] }, '&&Project') },
	order: 4
});

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarBuildMenu,
	title: { value: 'Build', original: 'Build', mnemonicTitle: localize({ key: 'mBuild', comment: ['&& denotes a mnemonic'] }, '&&Build') },
	order: 5
});

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarDebugMenu,
	title: { value: 'Debug', original: 'Debug', mnemonicTitle: localize({ key: 'mDebug', comment: ['&& denotes a mnemonic'] }, '&&Debug') },
	order: 6
});

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarToolsMenu,
	title: { value: 'Tools', original: 'Tools', mnemonicTitle: localize({ key: 'mTools', comment: ['&& denotes a mnemonic'] }, '&&Tools') },
	order: 7
});

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarWindowMenu,
	title: { value: 'Window', original: 'Window', mnemonicTitle: localize({ key: 'mWindow', comment: ['&& denotes a mnemonic'] }, '&&Window') },
	order: 8
});

MenuRegistry.appendMenuItem(MenuId.MenubarMainMenu, {
	submenu: MenuId.MenubarHelpMenu,
	title: { value: 'Help', original: 'Help', mnemonicTitle: localize({ key: 'mHelp', comment: ['&& denotes a mnemonic'] }, '&&Help') },
	order: 9
});
