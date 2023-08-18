import type {
	AsChild,
	Expand,
	HTMLDivAttributes,
	OmitChecked,
	OmitOpen,
	OmitValue,
	OnChangeFn
} from "$internal/index.js";
import type {
	CreateMenubarProps,
	CreateMenubarMenuProps,
	CreateMenuCheckboxItemProps,
	CreateMenuRadioGroupProps,
	MenubarRadioItemProps,
	CreateMenubarSubmenuProps,
	MenubarComponentEvents
} from "@melt-ui/svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

type Props = Expand<CreateMenubarProps> & HTMLDivAttributes;

type MenuProps = Expand<
	OmitOpen<CreateMenubarMenuProps> & {
		open?: CreateMenubarMenuProps["defaultOpen"] & {};
		onOpenChange?: OnChangeFn<CreateMenubarMenuProps["defaultOpen"]>;
	}
>;

type CheckboxItemProps = Expand<
	OmitChecked<CreateMenuCheckboxItemProps> & {
		checked?: CreateMenuCheckboxItemProps["defaultChecked"] & {};
		onCheckedChange?: OnChangeFn<CreateMenuCheckboxItemProps["defaultChecked"]>;
		disabled?: boolean;
	}
> &
	AsChild &
	HTMLDivAttributes;

type RadioGroupProps = Expand<
	OmitValue<CreateMenuRadioGroupProps> & {
		value?: CreateMenuRadioGroupProps["defaultValue"] & {};
		onValueChange?: OnChangeFn<CreateMenuRadioGroupProps["defaultValue"]>;
	}
> &
	AsChild &
	HTMLDivAttributes;

type ContentProps = {
	sideOffset?: number;
} & AsChild &
	HTMLDivAttributes;

type GroupProps = AsChild & HTMLDivAttributes;

type ItemProps = {
	disabled?: boolean;
} & AsChild &
	HTMLDivAttributes;

type CheckboxItemIndicatorProps = HTMLDivAttributes;

type LabelProps = AsChild & HTMLDivAttributes;

type RadioItemProps = Expand<MenubarRadioItemProps> & AsChild & HTMLDivAttributes;

type SeparatorProps = AsChild & HTMLDivAttributes;

type SubProps = Expand<CreateMenubarSubmenuProps>;

type SubContentProps = AsChild & HTMLDivAttributes;

type SubTriggerProps = {
	disabled?: boolean;
} & AsChild &
	HTMLDivAttributes;

type TriggerProps = AsChild & HTMLButtonAttributes;

type TriggerEvents = MenubarComponentEvents["trigger"];
type ItemEvents = MenubarComponentEvents["item"];
type SubTriggerEvents = MenubarComponentEvents["subTrigger"];
type CheckboxItemEvents = MenubarComponentEvents["checkboxItem"];
type RadioItemEvents = MenubarComponentEvents["radioItem"];
type ContentEvents = MenubarComponentEvents["menu"];
type SubContentEvents = MenubarComponentEvents["submenu"];

export type {
	Props,
	SubProps,
	MenuProps,
	ItemProps,
	GroupProps,
	LabelProps,
	TriggerProps,
	ContentProps,
	RadioItemProps,
	SeparatorProps,
	RadioGroupProps,
	SubContentProps,
	SubTriggerProps,
	CheckboxItemProps,
	CheckboxItemIndicatorProps,

	//
	Props as MenubarProps,
	SubProps as MenubarSubProps,
	MenuProps as MenubarMenuProps,
	ItemProps as MenubarItemProps,
	GroupProps as MenubarGroupProps,
	LabelProps as MenubarLabelProps,
	ContentProps as MenubarContentProps,
	TriggerProps as MenubarTriggerProps,
	RadioItemProps as MenubarRadioItemProps,
	SeparatorProps as MenubarSeparatorProps,
	SubContentProps as MenubarSubContentProps,
	SubTriggerProps as MenubarSubTriggerProps,
	RadioGroupProps as MenubarRadioGroupProps,
	CheckboxItemProps as MenubarCheckboxItemProps,
	CheckboxItemIndicatorProps as MenubarCheckboxItemIndicatorProps,
	//
	TriggerEvents,
	ItemEvents,
	SubTriggerEvents,
	CheckboxItemEvents,
	RadioItemEvents,
	ContentEvents,
	SubContentEvents,
	//
	TriggerEvents as MenubarTriggerEvents,
	ItemEvents as MenubarItemEvents,
	SubTriggerEvents as MenubarSubTriggerEvents,
	CheckboxItemEvents as MenubarCheckboxItemEvents,
	RadioItemEvents as MenubarRadioItemEvents,
	ContentEvents as MenubarContentEvents,
	SubContentEvents as MenubarSubContentEvents
};
