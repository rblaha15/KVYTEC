

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.w2uN5MT3.js","_app/immutable/chunks/scheduler.D0Y8x8vo.js","_app/immutable/chunks/index.DpH1TRsL.js","_app/immutable/chunks/stores.BnTEVQlP.js","_app/immutable/chunks/entry.MvQi4hsT.js"];
export const stylesheets = [];
export const fonts = [];
