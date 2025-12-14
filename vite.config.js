import path from 'node:path';

const config = {
    root: ".",
    base: "/modules/shinobigami-importer/",
    publicDir: "public",
    server: {
        port: 30001,
        open: '/game',
        proxy: {
            '^(/modules/shinobigami-importer/(assets|lang|style.css))': 'http://localhost:30000',
            '^(?!/modules/shinobigami-importer)': 'http://localhost:30000',
            '/socket.io': {

                target: 'ws://localhost:30000',
                ws: true,
            },
        }
    },
    build: {
        outDir: path.resolve(__dirname, "dist"),
        emptyOutdir: false,
        sourcemap: true,
        lib: {
            name: "Shinobigami Importer",
            entry: "src/shinobigamiImporter.js",
            formats: ["es"],
            fileName: "shinobigami-importer"
        }
    },
    esbuild: {
        keepNames: true,
    },
    plugins: []
}
export default config