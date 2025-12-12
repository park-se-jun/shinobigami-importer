import { CONSTANTS } from "../constants/constants.js";
import { ImportShinobiDialog } from "../dialog/ImportShinobiDialog.js";

/**
 * 
 * @param {ActorDirectory} app 
 * @param {JQuery<HTMLElement>} html 
 */
export function addImportButton(app, html) {
    const $button = $("<button>").addClass("shinobi-import-button").append(`<span>닌자 가져오기</span>`).on("click",(e)=>{
        console.log(`${CONSTANTS.MODULE_ID}| 버튼이 클릭되었습니다`);
        // e.preventDefault();

        const newDialog = new ImportShinobiDialog();
        console.log("다이얼로그 생성")
        console.log(newDialog);
        newDialog.render(true);
    });
    const $actorTabHeader = html.find(".directory-header");
    $actorTabHeader.append($button)
}
