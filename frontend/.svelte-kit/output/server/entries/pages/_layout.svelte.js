import { c as create_ssr_component, e as escape } from "../../chunks/ssr.js";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-14dxvdd_START --><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous" data-svelte-h="svelte-1sm7vij"><\/script><style data-svelte-h="svelte-i3bk2p">.w-45 {
			width: 45%;
		}
		.w-10 {
			width: 10%;
		}
		.w-40 {
			width: 40%;
		}
		.w-60 {
			width: 60%;
		}
		.w-20 {
			width: 20%;
		}
		.h-0 {
			height: 0;
		}
		/* @media (min-width: 768px) {
			.w-md-50 {
				width: 50%;
			}
		} */
		.mw {
			max-width: 15rem;
		}
		.mw-2 {
			max-width: 10rem;
		}
		.px-2-5 {
			padding-left: 0.75rem;
			padding-right: 0.75rem;
		}
		.bg-none {
			background-color: #00000000;
		}
		.min {
			min-width: 4.8rem;
		}</style><!-- HEAD_svelte-14dxvdd_END -->`, ""} <title>${escape("")}KVÝTEČ – Ekonomické zhodnocení provozu tepelného čerpadla</title> <div class="container my-3">${slots.default ? slots.default({}) : ``}</div>`;
});
export {
  Layout as default
};
