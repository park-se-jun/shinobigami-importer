import { CONSTANTS } from "../constants/constants.js";
import { ImportShinobiDialog } from "../dialog/ImportShinobiDialog.js";
import { localize } from "./localize.js";

/**
 * 
 * @param {ActorDirectory} app 
 * @param {JQuery<HTMLElement>} html 
 */
export function addImportButton(app, html) {

    // @ts-ignore
    const isGmOnly = game.settings?.get(CONSTANTS.MODULE_ID, "gmOnly")
    if (isGmOnly && !game.user?.isGM) return;

    const $button = $("<button>")
        .addClass("shinobi-import-button")
        .append(`<span>${localize("ShinobigamiImporter.importShinobi")}</span>`)
        .on("click", (e) => {
            console.log(`${CONSTANTS.MODULE_ID}| button clicked`);
            // e.preventDefault();

            const newDialog = new ImportShinobiDialog();
            console.log("create dialog")
            console.log(newDialog);
            newDialog.render(true);
        });
    const $actorTabHeader = html.find(".directory-header");
    $actorTabHeader.append($button)
}
