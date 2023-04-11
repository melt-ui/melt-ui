import { schema as Accordion } from './Accordion/schema';
import { schema as AspectRatio } from './AspectRatio/schema';
import { schema as Checkbox } from './Checkbox/schema';
import { schema as Collapsible } from './Collapsible/schema';
import { schema as Dialog } from './Dialog/schema';
import { schema as Popper } from './Popper/schema';
import { schema as Progress } from './Progress/schema';
import { schema as Slider } from './Slider/schema';
import { schema as Switch } from './Switch/schema';
import { schema as Toggle } from './Toggle/schema';

export const components = {
	accordion: Accordion,
	'aspect-ratio': AspectRatio,
	checkbox: Checkbox,
	collapsible: Collapsible,
	slider: Slider,
	switch: Switch,
	toggle: Toggle,
	progress: Progress,
	dialog: Dialog,
};

export const internal = {
	popper: Popper,
};

export const allSchemas = {
	...components,
	...internal,
};
