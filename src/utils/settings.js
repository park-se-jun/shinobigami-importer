import { CONSTANTS } from "../constants/constants.js";

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
}

