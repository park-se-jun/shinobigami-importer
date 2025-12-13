import { CONSTANTS } from "../constants/constants.js";
import { CharacterSheetsAppspotParser, SeerSuckerV4CsvParser } from "../shinobiParser.js";

export class ImportShinobiDialog extends Dialog {
    /**@type {[ShinobiActorData,ShinobiItemData[]]|null} */
    _loadedData
    _debounceTimer
    _html// jQuery html 객체 캐싱

    constructor() {
        // 1. 상태 관리를 위한 변수들을 클래스 인스턴스에 할당
        const conf = {
            title: "난자가져오기",
            content: content,
            buttons: {
                one: {
                    label: "가져오기",
                    callback: async () => this._onImportClick(),
                    disabled: true
                }
            },
            // Dialog가 닫힐 때 정리
            close: () => { this._resetState(); },
            // 렌더링 시 실행할 메서드 연결
            render: (html) => this._onRender(html)
        };

        super(conf);

        // 클래스 필드로 상태 관리 (동시성 문제 해결)
        this._loadedData = null;
        this._debounceTimer = null;
        this._html = null; // jQuery html 객체 캐싱
    }

    /**
     * 다이얼로그가 렌더링될 때 호출되는 메서드
     * 이벤트 리스너를 등록하고 초기 상태를 설정합니다.
     */
    _onRender(html) {
        this._html = html;
        this._resetState();

        const urlInput = this._html.find("#url-input");
        const dataSource = this._html.find("#data-source");

        // 이벤트 리스너 등록
        urlInput.on('keyup change', () => this._handleInputChange());
        dataSource.on('change', () => this._handleInputChange());
        dataSource.on('change ', () => this._updatePlaceholder())
    }

    /**
     * 입력값이 변경되었을 때 실행 (디바운싱 적용)
     */
    _handleInputChange() {
        const url = this._html.find("#url-input").val().toString().trim();
        const source = this._html.find("#data-source").val();

        // 1. URL이 없으면 초기화 후 종료 (Early Return)
        if (!url) {
            this._resetState();
            return;
        }

        // 2. 기존 타이머 제거 및 로딩 상태 표시
        clearTimeout(this._debounceTimer);
        this._renderLoading();
        this._toggleButton(true); // 버튼 비활성화

        // 3. 디바운싱: 0.8초 뒤에 요청 실행
        this._debounceTimer = setTimeout(() => {
            this._importShinobi(url, source);
        }, 800);
    }

    _updatePlaceholder() {
        const source = this._html.find("#data-source").val();
        switch (source) {
            case "appspot.com":
                this._html.find("#url-input").attr("placeholder", "[key값만 입력해주세요]");
                break;
            case "seersuckerV4":
                this._html.find("#url-input").attr("placeholder", "[구글드라이브-> 파일-> 공유-> 웹에 게시-> .csv]");
                break;
        }
    }
    /**
     * 실제 데이터를 통신하고 파싱하는 로직
     */
    async _importShinobi(url, dataSource) {
        try {
            console.log(`${CONSTANTS.MODULE_ID}| [${dataSource}] 통신 시작`);

            let parser;
            let rawData;

            // 소스에 따른 분기 처리
            if (dataSource === "appspot.com") {
                const baseUrl = "https://character-sheets.appspot.com/shinobigami/display?ajax=1&key=";
                rawData = await $.ajax({
                    type: "GET", url: baseUrl + url, dataType: 'jsonp', data: { base64Image: 1 }
                });
                parser = new CharacterSheetsAppspotParser();
            }
            else if (dataSource === "seersuckerV4") {
                rawData = await $.ajax({
                    type: "GET", url: url, dataType: 'text', data: { base64Image: 1 }
                });
                parser = new SeerSuckerV4CsvParser();
            }

            // 파싱 및 성공 처리
            this._loadedData = parser.parse(rawData);
            this._renderSuccess(this._loadedData);
            this._toggleButton(false); // 버튼 활성화

        } catch (error) {
            console.error(error);
            this._loadedData = null;
            this._renderError(error.message || "알 수 없는 오류가 발생했습니다.");
            this._toggleButton(true);
        }
    }

    /**
     * 가져오기 버튼 클릭 시 실행
     */
    async _onImportClick() {
        console.log("가져오기 시작:", this._loadedData);
        if (!this._loadedData) return;

        try {
            const [shinobiActorData, shinobiItemDataArray] = this._loadedData;
            // @ts-ignore
            const actor = await Actor.create(shinobiActorData);
            // @ts-ignore
            await actor.createEmbeddedDocuments('Item', shinobiItemDataArray, {});
            let dataForUpdateTalent = {};
            dataForUpdateTalent['data.talent.table.0.0.state'] = shinobiActorData.data ? shinobiActorData.data.talent.table[0][0].state : undefined;
            dataForUpdateTalent['system.talent.table.0.0.state'] = shinobiActorData.system ? shinobiActorData.system.talent.table[0][0].state : undefined;
            // @ts-ignore
            await actor.update(dataForUpdateTalent);
            ui.notifications.info(`${actor.name} 가져오기 성공!`);
        } catch (err) {
            ui.notifications.error(`생성 실패: ${err.message}`);
        }
    }

    // --- UI 헬퍼 메서드 ---

    _resetState() {
        this._loadedData = null;
        this._toggleButton(true);
        this._updatePreviewContent(`
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 8px;">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span style="font-size: 13px;">URL을 입력하면 미리보기가 표시됩니다.</span>
        `, ''); // 클래스 제거
    }

    _renderLoading() {
        this._updatePreviewContent(`
            <div class="spinner"></div>
            <span style="font-size: 13px; color: #3b82f6; font-weight: 500;">데이터 불러오는 중...</span>
        `, '');
    }

    _renderError(msg) {
        this._updatePreviewContent(`
            <span style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">오류 발생</span>
            <span style="font-size: 12px;">${msg}</span>
        `, 'error');
    }

    _renderSuccess(data) {
        const [actorData] = data;
        const system = actorData.system || actorData.data; // V10~V12 호환성 확보 (system 권장)
        const details = system?.details || {};

        const name = actorData.name || "이름이 없습니다";
        const agency = details.agency || "소속이 없습니다";
        const biography = details.biography || "백스토리가 없습니다";

        const htmlContent = `
            <div class="preview-content">
                <h4 class="preview-name">${name}</h4>
                <span class="preview-agency">${agency}</span>
                <p class="preview-desc">${biography}</p>
            </div>
        `;
        this._updatePreviewContent(htmlContent, 'has-data');
    }

    /**
     * 미리보기 영역 DOM 업데이트 공통 함수
     */
    _updatePreviewContent(htmlContent, className) {
        if (!this._html) return;
        const previewEl = this._html.find("#preview-area");
        previewEl.removeClass("error has-data").addClass(className);
        previewEl.html(htmlContent);
    }

    _toggleButton(isDisabled) {
        if (!this._html) return;
        const btn = this._html.closest('.app').find('button.dialog-button.one'); // Dialog 버튼 찾기
        btn.prop('disabled', isDisabled);
        // 또는 this._html.parent().find(...) 를 사용해야 할 수도 있음 (Dialog 구조상)
    }
}

// HTML 템플릿은 그대로 유지 (가독성을 위해 파일 하단에 두거나 별도 파일로 분리 추천)
const content = `
<div class="dialog-box">
    <div class="dialog-body">
        <div class="form-group">
            <label class="form-label">리소스 출처</label>
            <div style="position: relative;">
                <select id="data-source" class="select-control">
                    <option value="appspot.com">character-sheets.appspot.com</option>
                    <option value="seersuckerV4">시어서커님 배포 자동화시트 v4 </option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">URL 주소</label>
            <input type="text" id="url-input" class="input-control" placeholder="[key값만 입력해주세요]" autocomplete="off">
        </div>
        <div id="preview-area">
            </div>
    </div>
</div>
`;