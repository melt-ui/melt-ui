import { elementDerived } from "@melt-ui/svelte/internal/helpers";
import { writable } from "svelte/store";

type SeparatorArgs = {
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
}

export function createSeparator(args: SeparatorArgs = {}) {
    const orientation = writable(args.orientation ?? 'horizontal');
    const decorative = writable(args.decorative ?? 'false');

    const separator = elementDerived([orientation, decorative], ([$orientation, $decorative]) => {
        return {
            'data-orientation': $orientation,
            role: $decorative ? 'none' : 'separator',
        }
    })

    return {
        separator
    }
}