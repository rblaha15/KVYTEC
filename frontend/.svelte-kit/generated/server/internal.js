
import root from '../root.svelte';
import { set_building, set_prerendering } from '__sveltekit/environment';
import { set_assets } from '__sveltekit/paths';
import { set_manifest, set_read_implementation } from '__sveltekit/server';
import { set_private_env, set_public_env, set_safe_public_env } from '../../../node_modules/@sveltejs/kit/src/runtime/shared-server.js';

export const options = {
	app_dir: "_app",
	app_template_contains_nonce: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: true,
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	env_private_prefix: '',
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!doctype html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<link rel=\"icon\" href=\"/favicon.ico\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\n\t\t<meta name=\"google-site-verification\" content=\"ydQlngGSRhQrntBac6bjoXuJDKV1tokVKra6StaFDdw\" />\n<meta name=\"google-site-verification\" content=\"ydQlngGSRhQrntBac6bjoXuJDKV1tokVKra6StaFDdw\" />\n\n\t\t<style>\n\t\t\t@media (prefers-color-scheme: dark) {\n\t\t\t\t* {\n\t\t\t\t\tcolor-scheme: dark;\n\t\t\t\t\t--bs-body-color: #dee2e6;\n\t\t\t\t\t--bs-body-color-rgb: 222, 226, 230;\n\t\t\t\t\t--bs-body-bg: #212529;\n\t\t\t\t\t--bs-body-bg-rgb: 33, 37, 41;\n\t\t\t\t\t--bs-emphasis-color: #fff;\n\t\t\t\t\t--bs-emphasis-color-rgb: 255, 255, 255;\n\t\t\t\t\t--bs-secondary-color: rgba(222, 226, 230, 0.75);\n\t\t\t\t\t--bs-secondary-color-rgb: 222, 226, 230;\n\t\t\t\t\t--bs-secondary-bg: #343a40;\n\t\t\t\t\t--bs-secondary-bg-rgb: 52, 58, 64;\n\t\t\t\t\t--bs-tertiary-color: rgba(222, 226, 230, 0.5);\n\t\t\t\t\t--bs-tertiary-color-rgb: 222, 226, 230;\n\t\t\t\t\t--bs-tertiary-bg: #2b3035;\n\t\t\t\t\t--bs-tertiary-bg-rgb: 43, 48, 53;\n\t\t\t\t\t--bs-primary-text-emphasis: #6ea8fe;\n\t\t\t\t\t--bs-secondary-text-emphasis: #a7acb1;\n\t\t\t\t\t--bs-success-text-emphasis: #75b798;\n\t\t\t\t\t--bs-info-text-emphasis: #6edff6;\n\t\t\t\t\t--bs-warning-text-emphasis: #ffda6a;\n\t\t\t\t\t--bs-danger-text-emphasis: #ea868f;\n\t\t\t\t\t--bs-light-text-emphasis: #f8f9fa;\n\t\t\t\t\t--bs-dark-text-emphasis: #dee2e6;\n\t\t\t\t\t--bs-primary-bg-subtle: #031633;\n\t\t\t\t\t--bs-secondary-bg-subtle: #161719;\n\t\t\t\t\t--bs-success-bg-subtle: #051b11;\n\t\t\t\t\t--bs-info-bg-subtle: #032830;\n\t\t\t\t\t--bs-warning-bg-subtle: #332701;\n\t\t\t\t\t--bs-danger-bg-subtle: #2c0b0e;\n\t\t\t\t\t--bs-light-bg-subtle: #343a40;\n\t\t\t\t\t--bs-dark-bg-subtle: #1a1d20;\n\t\t\t\t\t--bs-primary-border-subtle: #084298;\n\t\t\t\t\t--bs-secondary-border-subtle: #41464b;\n\t\t\t\t\t--bs-success-border-subtle: #0f5132;\n\t\t\t\t\t--bs-info-border-subtle: #087990;\n\t\t\t\t\t--bs-warning-border-subtle: #997404;\n\t\t\t\t\t--bs-danger-border-subtle: #842029;\n\t\t\t\t\t--bs-light-border-subtle: #495057;\n\t\t\t\t\t--bs-dark-border-subtle: #343a40;\n\t\t\t\t\t--bs-heading-color: inherit;\n\t\t\t\t\t--bs-link-color: #6ea8fe;\n\t\t\t\t\t--bs-link-hover-color: #8bb9fe;\n\t\t\t\t\t--bs-link-color-rgb: 110, 168, 254;\n\t\t\t\t\t--bs-link-hover-color-rgb: 139, 185, 254;\n\t\t\t\t\t--bs-code-color: #e685b5;\n\t\t\t\t\t--bs-highlight-color: #dee2e6;\n\t\t\t\t\t--bs-highlight-bg: #664d03;\n\t\t\t\t\t--bs-border-color: #495057;\n\t\t\t\t\t--bs-border-color-translucent: rgba(255, 255, 255, 0.15);\n\t\t\t\t\t--bs-form-valid-color: #75b798;\n\t\t\t\t\t--bs-form-valid-border-color: #75b798;\n\t\t\t\t\t--bs-form-invalid-color: #ea868f;\n\t\t\t\t\t--bs-form-invalid-border-color: #ea868f;\n\t\t\t\t}\n\t\t\t}\n\t\t</style>\n\n\t\t" + head + "\n\t</head>\n\n\t<body data-sveltekit-preload-data=\"hover\">\n\t\t<div style=\"display: contents\">" + body + "</div>\n\t</body>\n</html>\n",
		error: ({ status, message }) => "<!doctype html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<title>" + message + "</title>\n\n\t\t<style>\n\t\t\tbody {\n\t\t\t\t--bg: white;\n\t\t\t\t--fg: #222;\n\t\t\t\t--divider: #ccc;\n\t\t\t\tbackground: var(--bg);\n\t\t\t\tcolor: var(--fg);\n\t\t\t\tfont-family:\n\t\t\t\t\tsystem-ui,\n\t\t\t\t\t-apple-system,\n\t\t\t\t\tBlinkMacSystemFont,\n\t\t\t\t\t'Segoe UI',\n\t\t\t\t\tRoboto,\n\t\t\t\t\tOxygen,\n\t\t\t\t\tUbuntu,\n\t\t\t\t\tCantarell,\n\t\t\t\t\t'Open Sans',\n\t\t\t\t\t'Helvetica Neue',\n\t\t\t\t\tsans-serif;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\theight: 100vh;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t.error {\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tmax-width: 32rem;\n\t\t\t\tmargin: 0 1rem;\n\t\t\t}\n\n\t\t\t.status {\n\t\t\t\tfont-weight: 200;\n\t\t\t\tfont-size: 3rem;\n\t\t\t\tline-height: 1;\n\t\t\t\tposition: relative;\n\t\t\t\ttop: -0.05rem;\n\t\t\t}\n\n\t\t\t.message {\n\t\t\t\tborder-left: 1px solid var(--divider);\n\t\t\t\tpadding: 0 0 0 1rem;\n\t\t\t\tmargin: 0 0 0 1rem;\n\t\t\t\tmin-height: 2.5rem;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t}\n\n\t\t\t.message h1 {\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 1em;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t@media (prefers-color-scheme: dark) {\n\t\t\t\tbody {\n\t\t\t\t\t--bg: #222;\n\t\t\t\t\t--fg: #ddd;\n\t\t\t\t\t--divider: #666;\n\t\t\t\t}\n\t\t\t}\n\t\t</style>\n\t</head>\n\t<body>\n\t\t<div class=\"error\">\n\t\t\t<span class=\"status\">" + status + "</span>\n\t\t\t<div class=\"message\">\n\t\t\t\t<h1>" + message + "</h1>\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>\n"
	},
	version_hash: "1dtnc2a"
};

export async function get_hooks() {
	return {
		
		
	};
}

export { set_assets, set_building, set_manifest, set_prerendering, set_private_env, set_public_env, set_read_implementation, set_safe_public_env };
