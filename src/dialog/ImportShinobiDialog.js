import { CONSTANTS } from "../constants/constants.js";
import { CharacterSheetsAppspotParser, SeerSuckerV4CsvParser } from "../shinobiParser.js";

let loadedData = null;

export class ImportShinobiDialog extends Dialog {

    constructor() {
        super({
            title: "난자가져오기",
            content: content,
            buttons: {
                one: {
                    label: "가져오기",
                    callback: async (html, e) => {
                        console.log("버튼이 눌렸어용")
                        console.log(loadedData)
                        if (loadedData) {
                            const [shinobiActorData, shinobiItemDataArray] = loadedData;
                            const actor = await Actor.create(shinobiActorData);
                            await actor.createEmbeddedDocuments('Item', shinobiItemDataArray, {});
                        }
                    },
                    disabled: true
                }
            },
            close: (html) => { loadedData = null },
            render: async (html) => {
                /** 상태 변수 */
                let debounceTimer;
                loadedData = null;
                /** 사용할 요소 가져오기 */
                const buttonElement = getButtonElement()
                const urlInputElement = getUrlInputElement();
                const dataSourceElement = getDataSourceElement();
                const previewAreaElement = getPreviewAreaElement();

                /** 콜백 등록 */
                urlInputElement.on('keyup change', async (e) => {
                    const url = $(e.target).val().toString();
                    const dataSource = dataSourceElement.val();
                    handleChange(url, dataSource)

                })
                dataSourceElement.on('change', (e) => {
                    const url = urlInputElement.val();
                    const dataSource = $(e.target).val();
                    handleChange(url, dataSource)
                })

                function handleChange(url, dataSource) {
                    if (!url.trim()) {// url이 비었으면 초기화
                        renderInitialState();
                        loadedData = null;
                        buttonDisable(true);
                        return;
                    }

                    clearTimeout(debounceTimer);
                    renderLoading();
                    buttonDisable(true);

                    debounceTimer = setTimeout(() => {
                        console.log("디바운서 타이머")
                        importShinobi(url, dataSource);
                    }, 800);
                }
                /**
                 * 
                 * @param {string} url 
                 * @param {dataSource} dataSource 
                 */
                async function importShinobi(url, dataSource) {
                    try {
                        let parser;
                        
                        switch (dataSource) {
                            case "appspot.com":
                                console.log(`${CONSTANTS.MODULE_ID}| appspot 통신 시작`)
                                 const appspotData= await $.ajax({
                                    type: "GET",
                                    url: url,
                                    dataType: 'jsonp',
                                    data:{base64Image:1}
                                });
                                parser = new CharacterSheetsAppspotParser();
                                loadedData = parser.parse(appspotData);

                                break;
                            case "seersuckerV4":
                                console.log(`${CONSTANTS.MODULE_ID}| 시어서커 구글독 통신 시작`)
                                parser = new SeerSuckerV4CsvParser();
                                const seersuckerV4Data = await $.ajax({
                                    type: "GET",
                                    url: url,
                                    dataType: 'text',
                                    data:{base64Image:1},
                                });
                                console.log(seersuckerV4Data);
                                loadedData = parser.parse(seersuckerV4Data);
                                console.log(loadedData);
                                break;
                        }
                        renderSuccess(loadedData);
                        buttonDisable(false);

                    } catch (error) {
                        loadedData = null;
                        renderError(error.message);
                        buttonDisable(true);
                    }
                }

                function buttonDisable(bool) {
                    buttonElement.prop('disabled', bool);
                }
                function getButtonElement() {
                    return html.find('button');
                }

                function getDataSourceElement() {
                    return html.find("#data-source");
                }

                function getUrlInputElement() {
                    return html.find("#url-input");
                }

                function getPreviewAreaElement() {
                    return html.find("#preview-area");
                }


                function renderInitialState() {
                    previewAreaElement.attr(''); // 클래스 초기화
                    previewAreaElement.html(`
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 8px;">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span style="font-size: 13px;">URL을 입력하면 미리보기가 표시됩니다.</span>
            `);
                }

                function renderLoading() {
                    previewAreaElement.attr(''); // 클래스 초기화
                    previewAreaElement.html(`
                <div class="spinner"></div>
                <span style="font-size: 13px; color: #3b82f6; font-weight: 500;">데이터 불러오는 중...</span>
            `);
                }

                function renderError(msg) {
                    previewAreaElement.attr('error'); // 클래스 초기화

                    previewAreaElement.html(`
                <span style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">오류 발생</span>
                <span style="font-size: 12px;">${msg}</span>
            `);
                }
                /**
                 * 
                 * @param {[ShinobiActorData,ShinobiItemData[]]} data 
                 */
                function renderSuccess(data) {
                    const [actorData, ItemDataArray] = data;
                    previewAreaElement.attr('has-data'); // 클래스 초기화
                    const shinobiName = actorData.name != "" ? actorData.name: "이름이 없습니다"
                    let agency;
                    let biography;
                    if(Number(game.version.split(".")[0]) >=12){
                        console.log(`${CONSTANTS.MODULE_ID}| v12`)
                        agency = actorData.system.details.agency != ""? actorData.system.details.agency: "소속이 없습니다";
                        biography = actorData.system.details.biography != "" ? actorData.system.details.biography: "백스토리가 없습니다";
                    }else{
                        console.log(`${CONSTANTS.MODULE_ID}| v11`)
                        agency = actorData.data.details.agency != ""? actorData.data.details.agency: "소속이 없습니다";
                        biography = actorData.data.details.biography != "" ? actorData.data.details.biography: "백스토리가 없습니다";
                    }
                    previewAreaElement.html(
                        `<div class="preview-content">
                    <h4 class="preview-name">${shinobiName}</h4>
                    <span class="preview-agency">${agency}</span>
                    <p class="preview-desc">${biography}</p>

                </div>`);
                }

            }
        })
    }

}
const content =
    `<style>
        /* --- 다이얼로그 박스 --- */
        .dialog-box {
            /* ---width: 90%; max-width: 500px; ---*/
            overflow: hidden;
            animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }


        /* 본문 */
        .dialog-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
        
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-label { font-size: 14px; font-weight: 500; color: #374151; }
        
        .input-control, .select-control {
            width: 100%;
            border: 1px solid #d1d5db; border-radius: 8px;
            font-size: 14px; outline: none; transition: border-color 0.2s;
        }
        .input-control:focus, .select-control:focus { border-color: #3b82f6; ring: 2px solid #93c5fd; }

        /* 미리보기 영역 */
        #preview-area {
            margin-top: 8px;
            min-height: 160px;
            border: 2px dashed ; border-radius: 8px;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            text-align: center; color: #9ca3af; padding: 16px;
            transition: all 0.3s;
        }
        #preview-area.has-data { border-style: solid; border-color: #bfdbfe; }
        #preview-area.error { border-color: #fca5a5; color: #ef4444; }

        /* 미리보기 콘텐츠 스타일 */
        .preview-content { width: 100%; text-align: left; }
        .preview-img { width: 100%; height: 140px; object-fit: cover; border-radius: 6px; margin-bottom: 12px; }
        .preview-name { font-weight: bold; color: #1f2937; margin-bottom: 4px; font-size: 16px; }
        .preview-desc { font-size: 13px; color: #4b5563; margin-bottom: 8px; line-height: 1.4; }
        .preview-agency { display: inline-block; padding: 2px 8px;  color: #1e40af; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; }

        /* 로딩 스피너 */
        .spinner {
            border: 3px solid #e5e7eb; border-top: 3px solid #3b82f6;
            border-radius: 50%; width: 24px; height: 24px;
            animation: spin 1s linear infinite; margin-bottom: 8px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

 </style>


     <div class="dialog-box">

            <!-- 본문 -->
            <div class="dialog-body">
                <!-- 드롭다운 -->
                <div class="form-group">
                    <label class="form-label">리소스 출처</label>
                    <div style="position: relative;">
                        <select id="data-source" class="select-control">
                            <option value="appspot.com">character-sheets.appspot.com</option>
                            <option value="seersuckerV4">시어서커님 배포 자동화시트 v4 </option>
                        </select>
                    </div>
                </div>

                <!-- URL 입력 -->
                <div class="form-group">
                    <label class="form-label">URL 주소</label>
                    <input type="text" id="url-input" class="input-control" placeholder="https://example.com" autocomplete="off">
                </div>

                <!-- 미리보기 영역 -->
                <div id="preview-area">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 8px;">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span style="font-size: 13px;">URL을 입력하면 미리보기가 표시됩니다.</span>
                </div>
            </div>
        </div>
`
/**
 * 
 * @param {JQuery<HTMLElement>} html 
 */
function renderPreview(html) {


}

