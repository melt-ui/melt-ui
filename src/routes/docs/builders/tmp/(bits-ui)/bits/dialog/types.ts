import type {
	AsChild,
	Expand,
	HTMLDivAttributes,
	HTMLHeadingAttributes,
	OmitOpen,
	OnChangeFn,
	Transition,
	TransitionParams,
} from '../../internal/index.js';
import type { HTMLButtonAttributes } from 'svelte/elements';

import type { CreateDialogProps } from '@melt-ui/svelte';
import type { ButtonEventHandler } from '../../helpers/index.js';

type Props = Expand<
	OmitOpen<Omit<CreateDialogProps, 'role'>> & {
		open?: CreateDialogProps['defaultOpen'] & {};
		onOpenChange?: OnChangeFn<CreateDialogProps['defaultOpen']>;
	}
>;

type TriggerProps = AsChild & HTMLButtonAttributes;

type CloseProps = TriggerProps;

type ContentProps<T extends Transition = Transition> = Expand<
	{
		transition?: T;
		transitionConfig?: TransitionParams<T>;
	} & AsChild
> &
	HTMLDivAttributes;

type DescriptionProps = AsChild & HTMLDivAttributes;
type OverlayProps = AsChild & HTMLDivAttributes;
type PortalProps = AsChild & HTMLDivAttributes;
type TitleProps = Expand<
	{
		level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	} & AsChild
> &
	HTMLHeadingAttributes;

type TriggerEvents = {
	'm-click': ButtonEventHandler<MouseEvent>;
	'm-keydown': ButtonEventHandler<KeyboardEvent>;
};
type CloseEvents = TriggerEvents;

export type {
	Props,
	CloseProps,
	TitleProps,
	PortalProps,
	ContentProps,
	TriggerProps,
	OverlayProps,
	DescriptionProps,
	//
	Props as DialogProps,
	CloseProps as DialogCloseProps,
	TitleProps as DialogTitleProps,
	PortalProps as DialogPortalProps,
	ContentProps as DialogContentProps,
	TriggerProps as DialogTriggerProps,
	OverlayProps as DialogOverlayProps,
	DescriptionProps as DialogDescriptionProps,
	//
	TriggerEvents,
	CloseEvents,
	//
	TriggerEvents as DialogTriggerEvents,
	CloseEvents as DialogCloseEvents,
};
