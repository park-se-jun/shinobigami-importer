import { CONSTANTS } from './constants/constants.js';
import { addImportButton } from './utils/addImportButton.js';
import { registerSettings } from './utils/settings.js';

console.log("Hello World! This code runs immediately when the file is loaded.");

Hooks.on("init", () => {
    registerSettings();
    console.log(`${CONSTANTS.MODULE_ID}| initialized`);
})

Hooks.on("renderActorDirectory", async (app, html) => {
    addImportButton(app, html);
})
Hooks.on('setup', async () => {
    console.log(`${CONSTANTS.MODULE_ID}| setup Complete`);
})
Hooks.on('ready', async () => {
    console.log(`${CONSTANTS.MODULE_ID}| ready`);
})


