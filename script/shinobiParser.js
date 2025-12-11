import Papa from "papaparse";
import { CONSTANTS } from "../constants/constants";

/**
import { countColumn } from '../../../fvtt/data/Data/modules/_CodeMirror/src/util/misc';
 * 타깃이 되는 csv 파일의 분석
 * 1행에는 59개의 쉼표가 있음(60열)
 * 120행 까지 있음
 * 16행, 100행~120행은 보지 않는다.(api 코드가 있어서 쉼표 갯수에 혼동이 온다)
 *
 *
 * 전체를 배열로 만들었을 때의 주요 데이터 위치
 * [4][2] : 이름
 * gap:[3][r,v,z,ad,ah,al]
 * skillTable : [4][q]~[14][ao]
 */

class AbstractParser {
    _curFvttVersion;
    _data;
    constructor() {
        if (this.constructor === AbstractParser) {
            throw new Error("추상클래스 입니다");
        }
        this._curFvttVersion = Number(game.version.split('.')[0])
    }
    /**
     * 
     * @param {any} data 
     * @abstract
     * @returns {[ShinobiActorData, ShinobiItemData[]]}
     */
    parse(data) {
        if (!data) throw Error("데이터 없음");
        this._initData(data);
        const shinobiActorData = this._getShinobiActorData();
        const shinobiItemDataArray = this._getShinobiItemData();
        if (this._curFvttVersion >= 12) {
            shinobiActorData.system = shinobiActorData.data;
            delete shinobiActorData.data;
            for (let shinobiItemData of shinobiItemDataArray) {
                shinobiItemData.system = shinobiItemData.data;
                delete shinobiItemData.data;
            }
        }
        return [shinobiActorData, shinobiItemDataArray];
    }
    _initData(data) {
        throw new Error("_initData(data)추상메소드 입니다");
    }
    /**
     * @abstract
     * @returns {ShinobiItemData[]}
     */
    _getShinobiItemData() {
        throw new Error("_getShinobiItemData() : 추상메소드 입니다");
    }

    /**
     * @abstract
     * @returns {ShinobiActorData}
     */
    _getShinobiActorData() {

        throw new Error("_getShinobiActorData() : 추상메소드 입니다");
    }
}

class CharacterSheetsAppspotParser extends AbstractParser {
    /**@type {CharacterSheetsAppspotParser} */
    static instance = null;
    /**@type {CharacterSheetAppspotData} */
    _data;


    constructor() {
        super()
        if (CharacterSheetsAppspotParser.instance) {
            return CharacterSheetsAppspotParser.instance;
        }
        CharacterSheetsAppspotParser.instance = this;
        return this;
    }

    /**@override */
    _getShinobiItemData() {
        /**@type {ShinobiItemData[]} */
        let items = [];
        let dataEditedByKr = (this._data.editlang == "kr");
        for (let ability of this._data.ninpou) {
            if (ability.name == null)
                continue;

            /**@type {ShinobiItemData} */
            const abilityData = {
                name: ability.name,
                type: "ability",
                data: {
                    type: this.#getText(ability.type),
                    gap: this.#getText(ability.range),
                    cost: this.#getText(ability.cost),
                    talent: this.#getText(ability.targetSkill),
                    hidden: (ability.secret != null) ? true : false,
                    description: this.#getText(ability.effect) + "(" + this.#getText(ability.page) + ")"
                }
            };

            items.push(abilityData);
        }

        for (let background of this._data.background) {
            if (background.name == null)
                continue;
            /**@type {ShinobiItemData} */
            const backgroundData = {
                name: background.name,
                type: "background",
                data: {
                    type: (background.type == "長所" || background.type == "장점") ? "pros" : "cons",
                    exp: this.#getText(background.point),
                    description: this.#getText(background.effect)
                }
            };

            items.push(backgroundData);
        }

        for (let bond of this._data.personalities) {
            if (bond.name == null)
                continue;

            /**@type {ShinobiItemData} */
            let bondData = {
                name: bond.name,
                type: "bond",
                data: {
                    residence: (bond.place != null) ? true : false,
                    secret: (bond.secret != null) ? true : false,
                    finish: (bond.specialEffect != null) ? true : false
                }
            };

            let emotion = bond.emotion;
            let direction = bond.direction;

            if (direction == "1") {
                if (emotion == "1")
                    bondData.data.feeling = (dataEditedByKr ? "공감" : "1:共感")
                if (emotion == "2")
                    bondData.data.feeling = (dataEditedByKr ? "우정" : "2:友情");
                if (emotion == "3")
                    bondData.data.feeling = (dataEditedByKr ? "애정" : "3:愛情");
                if (emotion == "4")
                    bondData.data.feeling = (dataEditedByKr ? "충성" : "4:忠誠");
                if (emotion == "5")
                    bondData.data.feeling = (dataEditedByKr ? "동경" : "5:憧憬");
                if (emotion == "6")
                    bondData.data.feeling = (dataEditedByKr ? "관심" : "6:狂信");

            } else {
                if (emotion == "1")
                    bondData.data.feeling = (dataEditedByKr ? "불신" : "1:不信");
                if (emotion == "2")
                    bondData.data.feeling = (dataEditedByKr ? "분노" : "2:怒り");
                if (emotion == "3")
                    bondData.data.feeling = (dataEditedByKr ? "질투" : "3:妬み");
                if (emotion == "4")
                    bondData.data.feeling = (dataEditedByKr ? "모멸" : "4:侮蔑");
                if (emotion == "5")
                    bondData.data.feeling = (dataEditedByKr ? "열등" : "5:劣等感");
                if (emotion == "6")
                    bondData.data.feeling = (dataEditedByKr ? "살의" : "6:殺意");

            }

            items.push(bondData);
        }
        return items;
    }
    /**@override */
    _getShinobiActorData() {
        let dataEditedByKr = (this._data.editlang == "kr");
        /**@type ShinobiData */
        let data = {
            // @ts-ignore
            talent: {},
            // @ts-ignore
            details: {
                age: this.#getText(this._data.base.age),
                sex: this.#getText(this._data.base.sex),
                purpose: this.#getText(this._data.base.stylerule),
                identify: this.#getText(this._data.base.cover),
                belief: this.#getText(this._data.base.belief),
                exp: (this.#getText(this._data.base.exp) == "") ? 0 : this.#getText(this._data.base.exp),
                expContent: "",
                biography: this.#getText(this._data.base.memo).replace(/\r?\n/g, '<br>')
            }
        }

        if (this._data.base.race == "1") {
            data.details.agency = this._data.base.upperstyle;
            data.details.grade = this.#getText(this._data.base.level)

            if (data.details.agency == "a") {
                data.details.agency = dataEditedByKr ? "하스바 인군" : "斜歯忍軍";
                data.talent.curiosity = 1;
                data.talent.gap = { "1": true };
            } else if (data.details.agency == "ab") {
                data.details.agency = dataEditedByKr ? "쿠라마 신류" : "鞍馬神流"
                data.talent.curiosity = 2;
                data.talent.gap = { "1": true, "2": true };
            }
            else if (data.details.agency == "bc") {
                data.details.agency = dataEditedByKr ? "하구레모노" : "ハグレモノ"
                data.talent.curiosity = 3;
                data.talent.gap = { "2": true, "3": true };
            }
            else if (data.details.agency == "cd") {
                data.details.agency = dataEditedByKr ? "히라사카 기관" : "比良坂機関"
                data.talent.curiosity = 4;
                data.talent.gap = { "3": true, "4": true };
            }
            else if (data.details.agency == "de") {
                data.details.agency = dataEditedByKr ? "사립 오토기 학원" : "私立御斎学園"
                data.talent.curiosity = 5;
                data.talent.gap = { "4": true, "5": true };
            }
            else if (data.details.agency == "e") {
                data.details.agency = dataEditedByKr ? "오니의 혈통" : "隠忍の血統"
                data.talent.curiosity = 6;
                data.talent.gap = { "5": true, "6": true };
            }


        }

        data.talent.table = [
            [{ "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }],
            [{ "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }],
            [{ "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }],
            [{ "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }],
            [{ "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }],
            [{ "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }, { "state": false, "num": 12, "stop": false }]
        ];
        for (let skill of this._data.learned) {
            if (skill.id == null)
                continue;

            let splited = skill.id.split(".")
            let row = +splited[1].split("row")[1]
            let name = +splited[2].split("name")[1]

            data.talent.table[name][row].state = true;

        }

        /**@type {ShinobiActorData} */
        let actorData = {
            name: this._data.base.name,
            type: (this._data.base.race == "1") ? "character" : "commoner",
            // @ts-ignore
            data: data

        }
        return actorData;
    }
    _initData(json) {
        this._data = json;
    }
    /**
     * @param {string} data 
     * @returns {string}
     */
    #getText(data) {
        return data != null ? data.trim() : "";
    }
}


class SeerSuckerV4CsvParser extends AbstractParser {
    /**@type {SeerSuckerV4CsvParser} */
    static instance = null;
    _data;

    constructor() {
        super();
        if (SeerSuckerV4CsvParser.instance) {
            return SeerSuckerV4CsvParser.instance;
        }
        SeerSuckerV4CsvParser.instance = this;
        return this;
    }
    /**
     *
     * @param {string} rawText
     * @returns {[ShinobiActorData, ShinobiItemData[]]}
     */

    /**@override */
    _getShinobiItemData() {
        /** @type {ShinobiItemData[]} */
        // @ts-ignore
        let items = [];
        items.push(...this.#getAbilities());
        items.push(...this.#getBackgrounds());
        items.push(...this.#getTools());
        items.push(...this.#getFinishes());
        return items;
    }
    #getFinishes() {
        /**@type {ShinobiItemData[]} */
        const finishes = [];
        for (let i = 0; i < 3; i++) {
            const finishName = this.#getDataAt(13 + i * 9, 46);

            if (finishName === "") {
                continue;
            }
            const finishTalent = this.#getDataAt(13 + i * 9 + 1, 46);
            const finishType = this.#getDataAt(13 + i * 9 + 2, 46);
            const finishStrong = this.#getDataAt(13 + i * 9 + 3, 45) != "" ? this.#getDataAt(13 + i * 9 + 3, 45) : "없음";
            const finishWeek = this.#getDataAt(13 + i * 9 + 3, 49) != "" ? this.#getDataAt(13 + i * 9 + 3, 49) : "없음";
            const finishDescription =
                `<b>강점:</b> ${finishStrong} <br>
            <b>약점:</b> ${finishWeek} <br>
            ${this.#getDataAt(13 + i * 9 + 4, 46)}`
            finishes.push({
                name: finishName,
                type: 'finish',
                data: {
                    type: finishType,
                    talent: finishTalent,
                    description: finishDescription
                }
            })
        }
        return finishes;
    }
    #getTools() {
        /**@type {ShinobiItemData[]} */
        const tools = [];
        for (let i = 0; i < 6; i++) {
            const toolQuantity = this.#getDataAt(4 + i, 46);
            if (toolQuantity === "" || toolQuantity === "0") {
                continue;
            }
            const toolName = this.#getDataAt(4 + i, 43);
            tools.push(
                {
                    name: toolName,
                    type: "item",
                    data: {
                        quantity: toolQuantity
                    }
                }
            )
        }
        return tools;
    }
    #getBackgrounds() {
        /**@type {ShinobiItemData[]} */
        const bgs = [];
        const prosBg = this.#getDataAt(16, 20);
        const consBg = this.#getDataAt(17, 20);
        bgs.push({
            name: prosBg,
            type: "background",
            data: {
                type: "pros",
                description: prosBg
            }
        });
        bgs.push({
            name: consBg,
            type: "background",
            data: {
                type: "cons",
                description: consBg
            }
        })
        return bgs;
    }
    #getAbilities() {
        /**@type {ShinobiItemData[]} */
        const abilities = [];

        for (let i = 0; i < 12; i++) {
            const abilityName = this.#getDataAt(25 + 2 * i, 17);
            if (abilityName === "") {
                continue;
            }
            const abilityType = this.#getDataAt(25 + 2 * i, 20);
            const abilityTalent = this.#getDataAt(25 + 2 * i, 21);
            const abilityGap = this.#getDataAt(25 + 2 * i, 24);
            const abilityCost = this.#getDataAt(25 + 2 * i, 25);
            const abilityDesc = this.#getDataAt(25 + 2 * i, 28);

            abilities.push({
                name: abilityName,
                type: "ability",
                data: {
                    cost: abilityCost,
                    description: abilityDesc,
                    gap: abilityGap,
                    type: abilityType,
                    talent: abilityTalent

                }
            })
        }
        return abilities
    }

    /**
     * @override
     * @returns {ShinobiActorData}
     */
    _getShinobiActorData() {
        return {
            name: this.#getName() || "",
            type: "character",
            data: this.#getShinobiData()
        };
    }
    /**
     * 
     * @returns {ShinobiData}
     */
    #getShinobiData() {
        return {
            talent: this.#getTalent(),
            details: this.#getDetails()
        }
    }
    /**
     * @returns {Details}
     */
    #getDetails() {
        const age = this.#getDataAt(17, 3);
        const sex = this.#getDataAt(17, 8);
        const purpose = this.#getDataAt(19, 3);
        const identify = this.#getDataAt(21, 4);
        const belief = this.#getDataAt(20, 7);
        const exp = this.#getDataAt(20, 12);
        const biography = this.#getDataAt(18, 20);
        const agency = this.#getDataAt(18, 3);
        const grade = this.#getDataAt(21, 7);
        return {
            age,
            sex,
            purpose,
            identify,
            belief,
            exp,
            expContent: "",
            biography,
            agency,
            grade
        }
    }
    /**
     * 
     * @returns {Talent}
     */
    #getTalent() {
        /**@type {Gap} */
        const gap = {};

        //gap 구하기
        for (let i = 0; i < 6; i++) {
            let columnIndex = 18 + 4 * i;
            if (Number(this.#getDataAt(3, columnIndex)) === -1) {
                gap[i] = true;
            }
        }

        //curiosity 구하기
        let curiosity = this.#getDataAt(21, 13);
        let curiosityCode = 0;
        switch (curiosity) {
            case "기술":
                curiosityCode = 1;
                break;
            case "체술":
                curiosityCode = 2;
                break;
            case "인술":
                curiosityCode = 3;
                break;
            case "모술":
                curiosityCode = 4;
                break;
            case "전술":
                curiosityCode = 5;
                break;
            case "요술":
                curiosityCode = 6;
                break;
            default:
                break;
        }


        //table 구하기
        /**@type {SkillTable} */
        let skillTable = Array.from({ length: 6 }, () => Array.from({ length: 11 },
            () => ({
                // 2. 내부 배열(6개 열)을 생성하며, 매번 새로운 객체를 반환
                state: false,
                num: 12,
                stop: false
            })));// 매직넘버들 const로 뺄 것

        for (let i = 0; i < 6; i++) {
            let indexX = CONSTANTS.SKILL_START_RAW + CONSTANTS.SKILL_GAP_TO_NEXT * i;
            for (let j = 0; j < 11; j++) {
                let indexY = CONSTANTS.SKILL_START_CAL + j;
                skillTable[i][j].state = JSON.parse(this.#getDataAt(indexY, indexX).toLowerCase());
            }
        }

        return {
            gap: gap,
            curiosity: curiosityCode,
            table: skillTable
        };
    }
    /**
     * 
     * @returns {string}
     */
    #getName() {
        return this.#getDataAt(4, 2);
    }

    _initData(text) {

        this._data = Papa.parse(text, { header: false }).data
        // const lines = text.trim.split('\n');
        // for (const line of lines) {
        //     this.#csvData = line.split(',');
        // }
    }
    /**
     *
     * @param {number} raw 엑셀로 볼때 기준 행
     * @param {string|number} column 엑셀로 볼 때 기준 열 r1c1, a1 둘다 지원
     * @returns {string}
     */
    #getDataAt(raw, column) {
        return this._data[raw - 1][this.#getXfrom(column) - 1].trim();
    }
    /**
     *
     * @param {string|number} column
     * @returns {number}
     */
    #getXfrom(column) {
        if (typeof column === 'number') {
            return column;
        }
        const aCharCode = 'a'.charCodeAt(0);
        let length = column.length;
        let result = 0;
        for (let i = 0; i < length; i++) {
            result = 26 ** i * result + column.charCodeAt(i) - aCharCode + 1;
        }
        return result;
    }

}


export { AbstractParser, CharacterSheetsAppspotParser, SeerSuckerV4CsvParser };

