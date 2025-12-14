# Shinobigami Importer

[jp](README/README.ja.md)|[kr](README.md)|[en](README/README.en.md)

The Shinobigami Importer module allows you to import characters created elsewhere into the [foundryVTT Shinobigami System](https://foundryvtt.com/packages/shinobigami).

Currently supported data sources include:

- [character-sheets.appspot.com](https://character-sheets.appspot.com/shinobigami/)
- [시노비가미 자동화 시트 4.0 By 시어서커(Seersucker_f)](https://docs.google.com/spreadsheets/d/1bjkyWRSlkEWw2xM_YuzlLXJbcFOq_2r3zyY-Mk-Jo20/edit?gid=2029654248#gid=2029654248)

## caution

The Shinobigami system currently does not officially support v12. While it was written to work with v11, bugs may occur, so please create an issue if you encounter any. For Seersucker's automated sheet, data may become corrupted if cell merging changes, so please use only the original content.

## Installation

Please paste the following link into the FoundryVTT module installation section.

https://github.com/park-se-jun/shinobigami-importer/releases/latest/download/module.json

## usage

1. Click the "Import Shinobi" button in the Actor tab.
2. Select the data source you want to import.
3. Enter the appropriate values.
4. Click "Import Shinobi".

https://github.com/user-attachments/assets/88abaddd-112c-47f2-a020-3d2890f9deec

### character-sheets.appsot.com

You only need to write the part corresponding to the key in the url.

The following is taken from [character-sheets.appspot.com](https://character-sheets.appspot.com/shinobigami/):

- Name
- Gender
- Age
- Clan
- Rank
- Clan Goal
- Cover
- Conviction
- Skill
- Exp
- Memo
- Ninpo
- People
- Background
- Type

### 시노비가미 자동화 시트 4.0 By 시어서커(Seersucker_f)

[Google Spreadsheet -> File -> Share -> Publish to web -> select sheet -> .csv -> publish]

And Just enter the generated url.

The following is taken from [시노비가미 자동화 시트 4.0 By 시어서커 (Seersucker_f)](https://docs.google.com/spreadsheets/d/1bjkyWRSlkEWw2xM_YuzlLXJbcFOq_2r3zyY-Mk-Jo20/edit?gid=2029654248#gid=2029654248).

- Name
- Gender
- Age
- Clan
- Rank
- Clan Goal
- Cover
- Conviction
- Skill
- Exp
- Memo
- Ninpo
- Background
- Ohgi
- Ninja Gear

## bug report/fix

Please open a pull request or create an issue in this repository.
