import { CONSTANTS } from "../constants/constants.js";
import { localize } from "./localize.js";

export function registerSettings() {
    // @ts-ignore
    game.settings?.register(CONSTANTS.MODULE_ID, "gmOnly", {
        name: "ShinobigamiImporter.settings.gmOnly.name",
        hint: "ShinobigamiImporter.settings.gmOnly.hint",
        scope: 'world',     // "world" = sync to db, "client" = local storage
        config: true,       // false if you dont want it to show in module config
        type: Boolean,       // You want the primitive class, e.g. Number, not the name of the class as a string
        default: false,
        // requiresReload: true, // true if you want to prompt the user to reload
    })
    game.settings?.registerMenu("shinobigami-importer", "openDataSource", {
        name: "ShinobigamiImporter.settings.dataSource.name",
        label: "",
        hint: "ShinobigamiImporter.settings.dataSource.hint",
        icon: "fas fa-book",
        type: DataSourceMenu,
        restricted: false
    })

}
class DataSourceMenu extends FormApplication {
    constructor() {
        super();
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "settings-data-source",
            title: localize("ShinobigamiImporter.settings.dataSource.name"),
            width: 400,
        });
    }
    async _renderInner(data) {
        const html = `
            <div class="link-menu-container">
            <h1>${localize("ShinobigamiImporter.settings.dataSource.name")}</h1>
                <a href="https://character-sheets.appspot.com/shinobigami/" target="_blank" class="link-card">
                    <i class="fas fa-book-open"></i> <div class="link-info">
                        <span class="link-title">${localize("ShinobigamiImporter.dialog.dataSource.appspot.name")}</span>
                    </div>
                </a>

                <a href="https://docs.google.com/spreadsheets/d/1bjkyWRSlkEWw2xM_YuzlLXJbcFOq_2r3zyY-Mk-Jo20/edit?gid=2029654248#gid=2029654248" target="_blank" class="link-card">
                    <i class="fas fa-book-open"></i> <div class="link-info">
                        <span class="link-title">${localize("ShinobigamiImporter.dialog.dataSource.seersuckerV4.name")}</span>
                    </div>
                </a>
            </div>
        `
        return $(html)
    }

    async _updateObject(event, formData) { }
}

