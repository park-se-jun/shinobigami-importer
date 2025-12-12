const config ={
    root:".",
    base:"/modules/shinobigami-importer/",
    publicDir: "public",
    server:{
        port:30001,
        open: '/game',
        proxy:{
            // '^(/modules/shinobigami-importer/(assets|lang|style.css))': 'http://localhost:30000',
            '^(?!/modules/shinobigami-importer)': 'http://localhost:30000',
            '/socket.io': {
				target: 'ws://localhost:30000',
				ws: true,
			},
        }
    }
    ,esbuild: {
		keepNames: true,
	},
    plugins:[]
}
export default config