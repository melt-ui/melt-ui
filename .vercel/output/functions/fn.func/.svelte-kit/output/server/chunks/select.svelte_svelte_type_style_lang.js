import { tv } from "tailwind-variants";
import "clsx";
import "shiki-es";
const mobileNav_svelte_svelte_type_style_lang = "";
const buttonVariants = tv({
  base: "inline-flex items-center justify-center rounded font-semibold transition disabled:opacity-50 disabled:pointer-events-none active:translate-y-0.5",
  variants: {
    variant: {
      default: "bg-magnum-600 text-white hover:bg-magnum-700/90 ",
      ghost: "hover:bg-magnum-600/25 data-[active=true]:border-magnum-600 data-[active=true]:bg-magnum-600/25 hover:text-white border-transparent border",
      link: "underline-offset-4 hover:underline text-primary",
      outline: "border border-magnum-600/60 hover:bg-magnum-600/20 hover:text-white"
    },
    size: {
      default: "px-5 h-11 py-3 rounded-md",
      sm: "h-9 px-3"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
const previewWrapper_svelte_svelte_type_style_lang = "";
const select_svelte_svelte_type_style_lang = "";
export {
  buttonVariants as b
};
