/**
 * @jest-environment jsdom
 */

import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import * as fs from 'node:fs';
import path from 'node:path';
import * as Parser from '../src/shinobiParser';
import * as expectedCharacterSheetsDataV11 from './data/characterSheetsAppspot/expectedV11Data';
import * as expectedSeersucerV4DataV11 from './data/seersuckerV4/expectedV11Data';

import * as expectedCharacterSheetsDataV12 from './data/characterSheetsAppspot/expectedV12Data';
import * as expectedSeersucerV4DataV12 from './data/seersuckerV4/expectedV12Data';



const getPath = (subPath) => path.join(__dirname, subPath);


describe('추상클래스 테스트', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'game', {
            writable: true,
            value: { version: "12.331" }
        })
    })

    afterAll(() => {
        delete window["game"];
    });
    test('추상클래스를 인스턴스화 하면 안된다', () => {
        //[실행, 검증]
        expect(() => {
            const shinobiParser = new Parser.AbstractParser();
        }).toThrow("추상클래스 입니다");

    })
    test('추상클래스의 추상 메소드는 구현해야 한다', () => {
        //[준비]
        class DummyParser extends Parser.AbstractParser {
            constructor() {
                super()
            }
        };
        const dummyParser = new DummyParser();
        //[실행,검증]
        expect(() => {
            dummyParser._getShinobiActorData()
        }).toThrow(Error);
        expect(() => {
            dummyParser._getShinobiItemData();
        }).toThrow(Error);
    })
})
describe('싱글톤 테스트', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'game', {
            writable: true,
            value: { version: "12.331" }
        })
    })
    afterAll(() => {
        delete window["game"];
        Parser.SeerSuckerV4CsvParser.instance = undefined;
        Parser.CharacterSheetsAppspotParser.instance = undefined;
    });
    test("두번 생성된 객체는 서로 같은 객체를 가르키고 있어야 한다.", () => {
        // [준비, 실행]
        const v4ParserA = new Parser.SeerSuckerV4CsvParser();
        const v4ParserB = new Parser.SeerSuckerV4CsvParser();

        const appspotParserA = new Parser.CharacterSheetsAppspotParser();
        const appspotParserB = new Parser.CharacterSheetsAppspotParser();

        //[검증]
        expect(v4ParserA === v4ParserB).toBe(true);
        expect(appspotParserA === appspotParserB).toBe(true);
    })
})
describe('파서 테스트 v11', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'game', {
            writable: true,
            value: { version: "11.331" }
        })
    })


    afterAll(() => {
        delete window["game"];
        Parser.SeerSuckerV4CsvParser.instance = undefined;
        Parser.CharacterSheetsAppspotParser.instance = undefined;
    });


    test("game 버전 설정이 올바르게 되었는가", () => {
        expect(Number(game.version.split(".")[0])).toBeLessThanOrEqual(11);
    })


    test('게임 버전 v11에서 생성되는 객체의 property가 data다', () => {
        //[준비]
        const filePathSeersucker = getPath("./data/seersuckerV4/샘플캐릭터 - 시시로 토우지.csv");
        const filePathCharacterSheets = getPath("./data/characterSheetsAppspot/샘플캐릭터 - 시시로 토우지 json");


        const dataForV4 = fs.readFileSync(filePathSeersucker).toString();
        const dataForCharacterSheets = JSON.parse(fs.readFileSync(filePathCharacterSheets).toString());

        const v4Parser = new Parser.SeerSuckerV4CsvParser();
        const characterSheetsParser = new Parser.CharacterSheetsAppspotParser();

        //[실행]
        const [shinobiActorDataForV4, shinobiItemDatasForV4] = v4Parser.parse(dataForV4);
        const [shinobiActorDataForCharacterSheets, shinobiItemDatasForCharacterSheets] = characterSheetsParser.parse(dataForCharacterSheets);


        //[검증]
        expect(shinobiActorDataForV4).toHaveProperty("data");
        expect(shinobiActorDataForV4).not.toHaveProperty("system");
        for (let element of shinobiItemDatasForV4) {
            expect(element).toHaveProperty("data")
            expect(element).not.toHaveProperty("system");
        }

        expect(shinobiActorDataForCharacterSheets).toHaveProperty("data");
        expect(shinobiItemDatasForCharacterSheets).not.toHaveProperty("system");
        for (let element of shinobiItemDatasForV4) {
            expect(element).toHaveProperty("data")
            expect(element).not.toHaveProperty("system");
        }

    })


    test('character-sheet-appspot 으로부터 가져온 데이터 직렬화에 성공한다.', () => {
        // [준비]
        const filePath1 = getPath("./data/characterSheetsAppspot/샘플캐릭터 - 시시로 토우지 json");
        const filePath2 = getPath("./data/characterSheetsAppspot/샘플캐릭터 - 후유가 레이나.json");
        /**@type {CharacterSheetAppspotData} */
        const data1 = JSON.parse(fs.readFileSync(filePath1).toString());
        const data2 = JSON.parse(fs.readFileSync(filePath2).toString());
        const parser = new Parser.CharacterSheetsAppspotParser();


        // [실행]
        const [shinobiActorData1, shinobiItemDatas1] = parser.parse(data1);
        const [shinobiActorData2, shinobiItemDatas2] = parser.parse(data2);

        //[검증]
        expect(shinobiActorData1).toEqual(expectedCharacterSheetsDataV11.시시로토우지);
        expect(shinobiItemDatas1).toEqual(expectedCharacterSheetsDataV11.시시로토우지_아이템);

        expect(shinobiActorData2).toEqual(expectedCharacterSheetsDataV11.후유가레이나);
        expect(shinobiItemDatas2).toEqual(expectedCharacterSheetsDataV11.후유가레이나_아이템);

    })

    // test('character-sheet-appspot 으로부터 가져온 데이터 직렬화에 실패한다.', () => { })


    test('seer_sucker_V4 의 csv로부터 가저온 데이터 직렬화에 성공한다.', () => {
        //[준비]
        const filePath1 = getPath("./data/seersuckerV4/샘플캐릭터 - 시시로 토우지.csv");
        const filePath2 = getPath("./data/seersuckerV4/샘플캐릭터 - 후유가 레이나.csv")
        const data1 = fs.readFileSync(filePath1).toString();
        const data2 = fs.readFileSync(filePath2).toString();

        const expectedData1 = expectedSeersucerV4DataV11.시시로토우지;
        const expectedItemData1 = expectedSeersucerV4DataV11.시시로토우지_아이템;
        const expectedData2 = expectedSeersucerV4DataV11.후유가레이나;
        const expectedItemData2 = expectedSeersucerV4DataV11.후유가레이나_아이템;


        const parser = new Parser.SeerSuckerV4CsvParser();

        //[실행]
        const [shinobiActorData1, shinobiItemDatas1] = parser.parse(data1);
        const [shinobiActorData2, shinobiItemDatas2] = parser.parse(data2);


        //[검증]
        expect(shinobiActorData1).toEqual(expectedData1);
        expect(shinobiItemDatas1).toEqual(expectedItemData1);

        expect(shinobiActorData2).toEqual(expectedData2);
        expect(shinobiItemDatas2).toEqual(expectedItemData2);


    })
    // test('seer_sucker_V4 의 csv로부터 가저온 데이터 직렬화에 실패한다.', () => { })
})

describe('파서 테스트 v12보다 높은 버전', () => {

    beforeAll(() => {
        Object.defineProperty(window, 'game', {
            writable: true,
            value: { version: "12.331" }
        })
    })


    afterAll(() => {
        delete window["game"];
        Parser.SeerSuckerV4CsvParser.instance = undefined;
        Parser.CharacterSheetsAppspotParser.instance = undefined;
    });


    test("game 버전 설정이 올바르게 되었는가", () => {
        expect(Number(game.version.split(".")[0])).toBeGreaterThanOrEqual(12);
    })

    test('게임 버전 v12 이상에서 생성되는 객체의 property가 system이다', () => {
        //[준비]
        const filePathSeersucker = getPath("./data/seersuckerV4/샘플캐릭터 - 시시로 토우지.csv");
        const filePathCharacterSheets = getPath("./data/characterSheetsAppspot/샘플캐릭터 - 시시로 토우지 json");


        const dataForV4 = fs.readFileSync(filePathSeersucker).toString();
        const dataForCharacterSheets = JSON.parse(fs.readFileSync(filePathCharacterSheets).toString());

        const v4Parser = new Parser.SeerSuckerV4CsvParser();
        const characterSheetsParser = new Parser.CharacterSheetsAppspotParser();

        //[실행]
        const [shinobiActorDataForV4, shinobiItemDatasForV4] = v4Parser.parse(dataForV4);
        const [shinobiActorDataForCharacterSheets, shinobiItemDatasForCharacterSheets] = characterSheetsParser.parse(dataForCharacterSheets);


        //[검증]
        expect(shinobiActorDataForV4).toHaveProperty("system");
        expect(shinobiActorDataForV4).not.toHaveProperty("data");
        for (let element of shinobiItemDatasForV4) {
            expect(element).toHaveProperty("system")
            expect(element).not.toHaveProperty("data");
        }

        expect(shinobiActorDataForCharacterSheets).toHaveProperty("system");
        expect(shinobiItemDatasForCharacterSheets).not.toHaveProperty("data");
        for (let element of shinobiItemDatasForV4) {
            expect(element).toHaveProperty("system")
            expect(element).not.toHaveProperty("data");
        }

    })

    test('character-sheet-appspot 으로부터 가져온 데이터 직렬화에 성공한다.', () => {
        // [준비]
        const filePath1 = getPath("./data/characterSheetsAppspot/샘플캐릭터 - 시시로 토우지 json");
        const filePath2 = getPath("./data/characterSheetsAppspot/샘플캐릭터 - 후유가 레이나.json");
        /**@type {CharacterSheetAppspotData} */
        const data1 = JSON.parse(fs.readFileSync(filePath1).toString());
        const data2 = JSON.parse(fs.readFileSync(filePath2).toString());
        const parser = new Parser.CharacterSheetsAppspotParser();


        // [실행]
        const [shinobiActorData1, shinobiItemDatas1] = parser.parse(data1);
        const [shinobiActorData2, shinobiItemDatas2] = parser.parse(data2);

        //[검증]
        expect(shinobiActorData1).toEqual(expectedCharacterSheetsDataV12.시시로토우지);
        expect(shinobiItemDatas1).toEqual(expectedCharacterSheetsDataV12.시시로토우지_아이템);

        expect(shinobiActorData2).toEqual(expectedCharacterSheetsDataV12.후유가레이나);
        expect(shinobiItemDatas2).toEqual(expectedCharacterSheetsDataV12.후유가레이나_아이템);

    })
    // test('character-sheet-appspot 으로부터 가져온 데이터 직렬화에 실패한다.', () => { })

    test('seer_sucker_V4 의 csv로부터 가저온 데이터 직렬화에 성공한다.', () => {
        //[준비]
        const filePath1 = getPath("./data/seersuckerV4/샘플캐릭터 - 시시로 토우지.csv");
        const filePath2 = getPath("./data/seersuckerV4/샘플캐릭터 - 후유가 레이나.csv")
        const data1 = fs.readFileSync(filePath1).toString();
        const data2 = fs.readFileSync(filePath2).toString();

        const expectedData1 = expectedSeersucerV4DataV12.시시로토우지;
        const expectedItemData1 = expectedSeersucerV4DataV12.시시로토우지_아이템;
        const expectedData2 = expectedSeersucerV4DataV12.후유가레이나;
        const expectedItemData2 = expectedSeersucerV4DataV12.후유가레이나_아이템;


        const parser = new Parser.SeerSuckerV4CsvParser();

        //[실행]
        const [shinobiActorData1, shinobiItemDatas1] = parser.parse(data1);
        const [shinobiActorData2, shinobiItemDatas2] = parser.parse(data2);


        //[검증]
        expect(shinobiActorData1).toEqual(expectedData1);
        expect(shinobiItemDatas1).toEqual(expectedItemData1);

        expect(shinobiActorData2).toEqual(expectedData2);
        expect(shinobiItemDatas2).toEqual(expectedItemData2);

    })
    // test('seer_sucker_V4 의 csv로부터 가저온 데이터 직렬화에 실패한다.', () => { })
})