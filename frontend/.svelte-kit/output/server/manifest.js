export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.ico"]),
	mimeTypes: {},
	_: {
		client: {"start":"_app/immutable/entry/start.Btp1i0jI.js","app":"_app/immutable/entry/app.pewt4ElG.js","imports":["_app/immutable/entry/start.Btp1i0jI.js","_app/immutable/chunks/entry.MvQi4hsT.js","_app/immutable/chunks/scheduler.D0Y8x8vo.js","_app/immutable/entry/app.pewt4ElG.js","_app/immutable/chunks/scheduler.D0Y8x8vo.js","_app/immutable/chunks/index.DpH1TRsL.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
