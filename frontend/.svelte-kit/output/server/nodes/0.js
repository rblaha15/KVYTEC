import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "svelte/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.BwptsjRC.js","_app/immutable/chunks/scheduler.D0Y8x8vo.js","_app/immutable/chunks/index.DpH1TRsL.js"];
export const stylesheets = [];
export const fonts = [];
