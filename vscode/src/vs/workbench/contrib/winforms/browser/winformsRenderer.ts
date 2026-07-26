import { WinFormsControl, WinFormsControlType, WinFormsForm } from '../common/winforms.js';
import * as DOM from '../../../../base/browser/dom.js';

export interface IWinFormsControlRenderer {
	render(control: WinFormsControl, form: WinFormsForm): HTMLElement;
	update(el: HTMLElement, control: WinFormsControl, form: WinFormsForm): void;
}

type RendererRegistry = Map<WinFormsControlType, IWinFormsControlRenderer>;

const renderers: RendererRegistry = new Map();

function propString(control: WinFormsControl, name: string, fallback = ''): string {
	return String(control.properties[name]?.value ?? fallback);
}

function propNum(control: WinFormsControl, name: string, fallback: number): number {
	return Number(control.properties[name]?.value ?? fallback);
}

function propBool(control: WinFormsControl, name: string, fallback = false): boolean {
	const v = control.properties[name]?.value;
	return typeof v === 'boolean' ? v : fallback;
}

renderers.set(WinFormsControlType.Button, {
	render(control) {
		const btn = DOM.$('button.wf-btn') as HTMLButtonElement;
		btn.textContent = propString(control, 'Text', control.name);
		btn.disabled = !propBool(control, 'Enabled', true);
		return btn;
	},
	update(el, control) {
		const btn = el as HTMLButtonElement;
		btn.textContent = propString(control, 'Text', control.name);
		btn.disabled = !propBool(control, 'Enabled', true);
	}
});

renderers.set(WinFormsControlType.Label, {
	render(control) {
		const label = DOM.$('span.wf-label');
		label.textContent = propString(control, 'Text', control.name);
		const align = propString(control, 'TextAlign', 'TopLeft');
		label.style.textAlign = alignToCss(align);
		return label;
	},
	update(el, control) {
		const label = el as HTMLElement;
		label.textContent = propString(control, 'Text', control.name);
		const align = propString(control, 'TextAlign', 'TopLeft');
		label.style.textAlign = alignToCss(align);
	}
});

renderers.set(WinFormsControlType.TextBox, {
	render(control) {
		const input = DOM.$('input.wf-textbox') as HTMLInputElement;
		input.type = 'text';
		input.value = propString(control, 'Text', '');
		input.readOnly = propBool(control, 'ReadOnly', false);
		input.disabled = !propBool(control, 'Enabled', true);
		return input;
	},
	update(el, control) {
		const input = el as HTMLInputElement;
		input.value = propString(control, 'Text', '');
		input.readOnly = propBool(control, 'ReadOnly', false);
		input.disabled = !propBool(control, 'Enabled', true);
	}
});

renderers.set(WinFormsControlType.ComboBox, {
	render(control) {
		const container = DOM.$('div.wf-combobox-container');
		const input = DOM.$('input.wf-combobox-input') as HTMLInputElement;
		input.type = 'text';
		input.value = propString(control, 'Text', '');
		input.disabled = !propBool(control, 'Enabled', true);
		const arrow = DOM.$('button.wf-combobox-arrow');
		arrow.textContent = '▾';
		arrow.tabIndex = -1;
		container.appendChild(input);
		container.appendChild(arrow);
		return container;
	},
	update(el, control) {
		const input = el.querySelector('.wf-combobox-input') as HTMLInputElement;
		if (input) {
			input.value = propString(control, 'Text', '');
			input.disabled = !propBool(control, 'Enabled', true);
		}
	}
});

renderers.set(WinFormsControlType.ListBox, {
	render(control) {
		const ul = DOM.$('ul.wf-listbox');
		const items = ['Item 1', 'Item 2', 'Item 3'];
		for (const item of items) {
			const li = DOM.$('li');
			li.textContent = item;
			ul.appendChild(li);
		}
		return ul;
	},
	update(_el, _control) {
	}
});

renderers.set(WinFormsControlType.CheckBox, {
	render(control) {
		const label = DOM.$('label.wf-checkbox');
		const cb = DOM.$('input') as HTMLInputElement;
		cb.type = 'checkbox';
		cb.checked = propBool(control, 'Checked', false);
		cb.disabled = !propBool(control, 'Enabled', true);
		label.appendChild(cb);
		label.appendChild(document.createTextNode(propString(control, 'Text', control.name)));
		return label;
	},
	update(el, control) {
		const cb = el.querySelector('input') as HTMLInputElement;
		if (cb) {
			cb.checked = propBool(control, 'Checked', false);
			cb.disabled = !propBool(control, 'Enabled', true);
		}
		const textNode = el.childNodes[1];
		if (textNode) textNode.textContent = propString(control, 'Text', control.name);
	}
});

renderers.set(WinFormsControlType.RadioButton, {
	render(control) {
		const label = DOM.$('label.wf-radiobutton');
		const rb = DOM.$('input') as HTMLInputElement;
		rb.type = 'radio';
		rb.name = `rb_${control.id}`;
		rb.checked = propBool(control, 'Checked', false);
		rb.disabled = !propBool(control, 'Enabled', true);
		label.appendChild(rb);
		label.appendChild(document.createTextNode(propString(control, 'Text', control.name)));
		return label;
	},
	update(el, control) {
		const rb = el.querySelector('input') as HTMLInputElement;
		if (rb) {
			rb.checked = propBool(control, 'Checked', false);
			rb.disabled = !propBool(control, 'Enabled', true);
		}
		const textNode = el.childNodes[1];
		if (textNode) textNode.textContent = propString(control, 'Text', control.name);
	}
});

renderers.set(WinFormsControlType.Panel, {
	render(control) {
		const div = DOM.$('div.wf-panel');
		const label = DOM.$('span.wf-panel-label');
		label.textContent = propString(control, 'Text', control.name);
		div.appendChild(label);
		return div;
	},
	update(el, control) {
		const label = el.querySelector('.wf-panel-label');
		if (label) label.textContent = propString(control, 'Text', control.name);
	}
});

renderers.set(WinFormsControlType.GroupBox, {
	render(control) {
		const fieldset = DOM.$('fieldset.wf-groupbox');
		const legend = DOM.$('legend');
		legend.textContent = propString(control, 'Text', control.name);
		fieldset.appendChild(legend);
		return fieldset;
	},
	update(el, control) {
		const legend = el.querySelector('legend');
		if (legend) legend.textContent = propString(control, 'Text', control.name);
	}
});

renderers.set(WinFormsControlType.PictureBox, {
	render(_control) {
		const div = DOM.$('div.wf-picturebox');
		const span = DOM.$('span');
		span.textContent = '🖼';
		div.appendChild(span);
		return div;
	},
	update(_el, _control) {
	}
});

renderers.set(WinFormsControlType.ProgressBar, {
	render(control) {
		const container = DOM.$('div.wf-progressbar');
		const fill = DOM.$('div.wf-progressbar-fill');
		const pct = Math.min(100, Math.max(0, propNum(control, 'Value', 0)));
		fill.style.width = `${pct}%`;
		container.appendChild(fill);
		return container;
	},
	update(el, control) {
		const fill = el.querySelector('.wf-progressbar-fill') as HTMLElement;
		if (fill) {
			const pct = Math.min(100, Math.max(0, propNum(control, 'Value', 0)));
			fill.style.width = `${pct}%`;
		}
	}
});

renderers.set(WinFormsControlType.TrackBar, {
	render(control) {
		const container = DOM.$('div.wf-trackbar');
		const input = DOM.$('input') as HTMLInputElement;
		input.type = 'range';
		input.min = String(propNum(control, 'Minimum', 0));
		input.max = String(propNum(control, 'Maximum', 10));
		input.value = String(propNum(control, 'Value', 5));
		input.disabled = !propBool(control, 'Enabled', true);
		container.appendChild(input);
		return container;
	},
	update(el, control) {
		const input = el.querySelector('input') as HTMLInputElement;
		if (input) {
			input.min = String(propNum(control, 'Minimum', 0));
			input.max = String(propNum(control, 'Maximum', 10));
			input.value = String(propNum(control, 'Value', 5));
			input.disabled = !propBool(control, 'Enabled', true);
		}
	}
});

renderers.set(WinFormsControlType.TreeView, {
	render(_control) {
		const container = DOM.$('div.wf-treeview');
		const ul = DOM.$('ul');
		const li1 = DOM.$('li');
		li1.textContent = 'Node 1';
		const ulSub = DOM.$('ul');
		const sub1 = DOM.$('li');
		sub1.textContent = 'Subnode 1.1';
		ulSub.appendChild(sub1);
		li1.appendChild(ulSub);
		ul.appendChild(li1);
		const li2 = DOM.$('li');
		li2.textContent = 'Node 2';
		ul.appendChild(li2);
		container.appendChild(ul);
		return container;
	},
	update(_el, _control) {
	}
});

renderers.set(WinFormsControlType.ListView, {
	render(_control) {
		const container = DOM.$('div.wf-listview');
		const table = DOM.$('table');
		table.style.width = '100%';
		const thead = DOM.$('thead');
		const headerRow = DOM.$('tr');
		for (const h of ['Column 1', 'Column 2', 'Column 3']) {
			const th = DOM.$('th');
			th.textContent = h;
			headerRow.appendChild(th);
		}
		thead.appendChild(headerRow);
		table.appendChild(thead);
		const tbody = DOM.$('tbody');
		for (let i = 1; i <= 3; i++) {
			const tr = DOM.$('tr');
			for (let j = 1; j <= 3; j++) {
				const td = DOM.$('td');
				td.textContent = `Item ${i}.${j}`;
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
		table.appendChild(tbody);
		container.appendChild(table);
		return container;
	},
	update(_el, _control) {
	}
});

renderers.set(WinFormsControlType.DateTimePicker, {
	render(control) {
		const input = DOM.$('input.wf-datetimepicker') as HTMLInputElement;
		input.type = 'date';
		input.value = propString(control, 'Text', '2025-01-01');
		input.disabled = !propBool(control, 'Enabled', true);
		return input;
	},
	update(el, control) {
		const input = el as HTMLInputElement;
		input.disabled = !propBool(control, 'Enabled', true);
	}
});

renderers.set(WinFormsControlType.MonthCalendar, {
	render(_control) {
		const container = DOM.$('div.wf-monthcalendar');
		const input = DOM.$('input') as HTMLInputElement;
		input.type = 'month';
		input.value = '2025-01';
		container.appendChild(input);
		return container;
	},
	update(_el, _control) {
	}
});

renderers.set(WinFormsControlType.RichTextBox, {
	render(control) {
		const textarea = DOM.$('textarea.wf-richtextbox') as HTMLTextAreaElement;
		textarea.value = propString(control, 'Text', '');
		textarea.readOnly = propBool(control, 'ReadOnly', false);
		textarea.disabled = !propBool(control, 'Enabled', true);
		return textarea;
	},
	update(el, control) {
		const textarea = el as HTMLTextAreaElement;
		textarea.value = propString(control, 'Text', '');
		textarea.readOnly = propBool(control, 'ReadOnly', false);
		textarea.disabled = !propBool(control, 'Enabled', true);
	}
});

function alignToCss(align: string): string {
	switch (align) {
		case 'TopLeft': case 'MiddleLeft': case 'BottomLeft': return 'left';
		case 'TopCenter': case 'MiddleCenter': case 'BottomCenter': return 'center';
		case 'TopRight': case 'MiddleRight': case 'BottomRight': return 'right';
		default: return 'left';
	}
}

export function getRenderer(type: WinFormsControlType): IWinFormsControlRenderer | undefined {
	return renderers.get(type);
}

export function hasRenderer(type: WinFormsControlType): boolean {
	return renderers.has(type);
}

export function registerRenderer(type: WinFormsControlType, renderer: IWinFormsControlRenderer): void {
	renderers.set(type, renderer);
}

export function renderControl(control: WinFormsControl, form: WinFormsForm): HTMLElement | null {
	const renderer = renderers.get(control.type);
	if (!renderer) return null;
	return renderer.render(control, form);
}

export function updateControl(el: HTMLElement, control: WinFormsControl, form: WinFormsForm): void {
	const renderer = renderers.get(control.type);
	if (renderer) renderer.update(el, control, form);
}

export function generateStandaloneHtml(form: WinFormsForm): string {
	const controlsJson = JSON.stringify(form.controls.map(c => ({
		type: c.type,
		id: c.id,
		name: c.name,
		x: c.x, y: c.y,
		width: c.width, height: c.height,
		text: c.properties.Text?.value ?? c.name,
		enabled: c.properties.Enabled?.value ?? true,
		visible: c.properties.Visible?.value ?? true,
		checked: c.properties.Checked?.value ?? false,
		readOnly: c.properties.ReadOnly?.value ?? false,
		textAlign: c.properties.TextAlign?.value ?? 'TopLeft',
		value: c.properties.Value?.value ?? 50,
		min: c.properties.Minimum?.value ?? 0,
		max: c.properties.Maximum?.value ?? 10,
		progressValue: c.properties.Value?.value ?? 50
	})));

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${form.name}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #1e1e1e; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Segoe UI', sans-serif; }
.form-window { background: #f0f0f0; border-radius: 4px; box-shadow: 0 4px 24px rgba(0,0,0,0.4); position: relative; overflow: hidden; }
.form-titlebar { background: #005a9e; color: white; padding: 6px 12px; font-size: 12px; font-weight: 600; user-select: none; }
.form-client { position: relative; }
.wf-control { position: absolute; overflow: hidden; }
.wf-btn { width: 100%; height: 100%; border: 1px solid #707070; background: linear-gradient(to bottom, #f0f0f0, #e0e0e0); color: #000; font-size: 9pt; font-family: 'Segoe UI', sans-serif; cursor: default; padding: 0 4px; }
.wf-btn:active { background: linear-gradient(to bottom, #d0d0d0, #c0c0c0); }
.wf-btn:disabled { color: #999; background: #e8e8e8; }
.wf-label { font-family: 'Segoe UI', sans-serif; font-size: 9pt; color: #000; padding: 2px 4px; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.wf-textbox { width: 100%; height: 100%; border: 1px solid #707070; background: white; color: #000; font-size: 9pt; font-family: 'Segoe UI', sans-serif; padding: 1px 2px; }
.wf-textbox:read-only { background: #f0f0f0; }
.wf-textbox:disabled { background: #f0f0f0; color: #999; }
.wf-combobox-container { width: 100%; height: 100%; display: flex; border: 1px solid #707070; background: white; }
.wf-combobox-input { flex: 1; border: none; outline: none; padding: 1px 2px; font-size: 9pt; font-family: 'Segoe UI', sans-serif; }
.wf-combobox-arrow { width: 18px; border: none; border-left: 1px solid #707070; background: linear-gradient(to bottom, #f0f0f0, #e0e0e0); cursor: default; font-size: 10px; display: flex; align-items: center; justify-content: center; }
.wf-listbox { width: 100%; height: 100%; border: 1px solid #707070; background: white; list-style: none; padding: 2px; font-size: 9pt; font-family: 'Segoe UI', sans-serif; overflow: auto; }
.wf-listbox li { padding: 1px 4px; }
.wf-listbox li:hover { background: #e8f0fe; }
.wf-checkbox, .wf-radiobutton { font-family: 'Segoe UI', sans-serif; font-size: 9pt; color: #000; display: flex; align-items: center; gap: 4px; padding: 2px 4px; cursor: default; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.wf-panel { width: 100%; height: 100%; border: 1px solid #707070; background: #f0f0f0; overflow: hidden; }
.wf-panel-label { display: block; padding: 4px; font-size: 9pt; font-family: 'Segoe UI', sans-serif; color: #000; }
.wf-groupbox { width: 100%; height: 100%; border: 1px solid #707070; background: #f0f0f0; padding: 8px; overflow: hidden; }
.wf-groupbox legend { font-size: 9pt; font-family: 'Segoe UI', sans-serif; color: #000; padding: 0 4px; }
.wf-picturebox { width: 100%; height: 100%; border: 1px solid #707070; background: white; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.wf-progressbar { width: 100%; height: 100%; border: 1px solid #707070; background: white; overflow: hidden; }
.wf-progressbar-fill { height: 100%; background: linear-gradient(to bottom, #4ec34e, #3a9e3a); transition: width 0.2s; }
.wf-trackbar { width: 100%; height: 100%; display: flex; align-items: center; padding: 0 4px; }
.wf-trackbar input { width: 100%; }
.wf-treeview { width: 100%; height: 100%; border: 1px solid #707070; background: white; overflow: auto; font-size: 9pt; font-family: 'Segoe UI', sans-serif; padding: 2px; }
.wf-treeview ul { list-style: none; padding-left: 16px; }
.wf-treeview li { padding: 1px 4px; }
.wf-listview { width: 100%; height: 100%; border: 1px solid #707070; background: white; overflow: auto; font-size: 9pt; }
.wf-listview table { border-collapse: collapse; width: 100%; }
.wf-listview th { background: linear-gradient(to bottom, #f0f0f0, #dcdcdc); padding: 2px 6px; text-align: left; border-bottom: 1px solid #a0a0a0; font-weight: 600; }
.wf-listview td { padding: 2px 6px; border-bottom: 1px solid #e0e0e0; }
.wf-listview tr:hover td { background: #e8f0fe; }
.wf-datetimepicker { width: 100%; height: 100%; border: 1px solid #707070; font-size: 9pt; font-family: 'Segoe UI', sans-serif; padding: 1px 2px; }
.wf-monthcalendar { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; border: 1px solid #707070; background: white; }
.wf-monthcalendar input { font-size: 9pt; font-family: 'Segoe UI', sans-serif; }
.wf-richtextbox { width: 100%; height: 100%; border: 1px solid #707070; font-size: 9pt; font-family: 'Segoe UI', sans-serif; padding: 2px; resize: none; }
.wf-richtextbox:read-only { background: #f0f0f0; }
</style>
</head>
<body>
<div class="form-window" style="width:${form.width}px">
  <div class="form-titlebar">${form.text}</div>
  <div class="form-client" style="height:${form.height}px">
${form.controls.map(c => `    <div class="wf-control" style="left:${c.x}px;top:${c.y}px;width:${c.width}px;height:${c.height}px" data-type="${c.type}" data-id="${c.id}"></div>`).join('\n')}
  </div>
</div>
<script>
(function() {
  const controls = ${controlsJson};

  const alignToCss = function(a) {
    switch (a) {
      case 'TopLeft': case 'MiddleLeft': case 'BottomLeft': return 'left';
      case 'TopCenter': case 'MiddleCenter': case 'BottomCenter': return 'center';
      case 'TopRight': case 'MiddleRight': case 'BottomRight': return 'right';
      default: return 'left';
    }
  };

  const controlRenderers = {
    Button: (c) => { const b = document.createElement('button'); b.className = 'wf-btn'; b.textContent = c.text; b.disabled = !c.enabled; return b; },
    Label: (c) => { const l = document.createElement('span'); l.className = 'wf-label'; l.textContent = c.text; l.style.textAlign = alignToCss(c.textAlign); return l; },
    TextBox: (c) => { const i = document.createElement('input'); i.className = 'wf-textbox'; i.type = 'text'; i.value = c.text; i.readOnly = c.readOnly; i.disabled = !c.enabled; return i; },
    CheckBox: (c) => { const l = document.createElement('label'); l.className = 'wf-checkbox'; const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = c.checked; l.appendChild(cb); l.appendChild(document.createTextNode(c.text)); return l; },
    RadioButton: (c) => { const l = document.createElement('label'); l.className = 'wf-radiobutton'; const rb = document.createElement('input'); rb.type = 'radio'; rb.checked = c.checked; l.appendChild(rb); l.appendChild(document.createTextNode(c.text)); return l; },
    ComboBox: (c) => { const ct = document.createElement('div'); ct.className = 'wf-combobox-container'; const inp = document.createElement('input'); inp.className = 'wf-combobox-input'; inp.value = c.text; inp.disabled = !c.enabled; ct.appendChild(inp); const a = document.createElement('button'); a.className = 'wf-combobox-arrow'; a.textContent = '\u25be'; ct.appendChild(a); return ct; },
    ListBox: (c) => { const ul = document.createElement('ul'); ul.className = 'wf-listbox'; for (let i = 1; i <= 3; i++) { const li = document.createElement('li'); li.textContent = 'Item ' + i; ul.appendChild(li); } return ul; },
    Panel: (c) => { const d = document.createElement('div'); d.className = 'wf-panel'; const l = document.createElement('span'); l.className = 'wf-panel-label'; l.textContent = c.name; d.appendChild(l); return d; },
    GroupBox: (c) => { const fs = document.createElement('fieldset'); fs.className = 'wf-groupbox'; const lg = document.createElement('legend'); lg.textContent = c.text; fs.appendChild(lg); return fs; },
    PictureBox: (c) => { const d = document.createElement('div'); d.className = 'wf-picturebox'; d.textContent = '\ud83d\uddbc'; return d; },
    ProgressBar: (c) => { const d = document.createElement('div'); d.className = 'wf-progressbar'; const f = document.createElement('div'); f.className = 'wf-progressbar-fill'; f.style.width = Math.min(100, Math.max(0, c.progressValue)) + '%'; d.appendChild(f); return d; },
    TrackBar: (c) => { const d = document.createElement('div'); d.className = 'wf-trackbar'; const i = document.createElement('input'); i.type = 'range'; i.min = c.min; i.max = c.max; i.value = c.value; i.disabled = !c.enabled; d.appendChild(i); return d; },
    TreeView: (c) => { const d = document.createElement('div'); d.className = 'wf-treeview'; const ul = document.createElement('ul'); const nodes = [{ text: 'Node 1', children: [{ text: 'Subnode 1.1' }] }, { text: 'Node 2' }]; function buildTree(parent, items) { items.forEach(function(item) { var li = document.createElement('li'); li.textContent = item.text; if (item.children) { var sub = document.createElement('ul'); buildTree(sub, item.children); li.appendChild(sub); } parent.appendChild(li); }); } buildTree(ul, nodes); d.appendChild(ul); return d; },
    ListView: (c) => { const d = document.createElement('div'); d.className = 'wf-listview'; var t = document.createElement('table'); t.style.width = '100%'; var thead = document.createElement('thead'); var hr = document.createElement('tr'); ['Column 1', 'Column 2', 'Column 3'].forEach(function(h) { var th = document.createElement('th'); th.textContent = h; hr.appendChild(th); }); thead.appendChild(hr); t.appendChild(thead); var tbody = document.createElement('tbody'); for (var r = 1; r <= 3; r++) { var tr = document.createElement('tr'); for (var c2 = 1; c2 <= 3; c2++) { var td = document.createElement('td'); td.textContent = 'Item ' + r + '.' + c2; tr.appendChild(td); } tbody.appendChild(tr); } t.appendChild(tbody); d.appendChild(t); return d; },
    DateTimePicker: (c) => { const i = document.createElement('input'); i.className = 'wf-datetimepicker'; i.type = 'date'; i.value = c.text || new Date().toISOString().slice(0, 10); i.disabled = !c.enabled; return i; },
    MonthCalendar: (c) => { const d = document.createElement('div'); d.className = 'wf-monthcalendar'; const i = document.createElement('input'); i.type = 'month'; i.value = new Date().toISOString().slice(0, 7); d.appendChild(i); return d; },
    RichTextBox: (c) => { const t = document.createElement('textarea'); t.className = 'wf-richtextbox'; t.value = c.text; t.readOnly = c.readOnly; t.disabled = !c.enabled; return t; }
  };

  controls.forEach(function(c) {
    const el = document.querySelector('[data-id="' + c.id.replace(/"/g, '\\"') + '"]');
    if (!el) return;
    const renderer = controlRenderers[c.type];
    if (renderer) {
      el.appendChild(renderer(c));
    }
  });
})();
</script>
</body>
</html>`;
}
