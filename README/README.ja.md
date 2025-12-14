# Shinobigami Importer

[jp](README/README.ja.md)|[kr](README.md)|[en](README/README.en.md)

シノビガミインポーターは、他の場所で作成したキャラクターを[「foundryVTT シノビガミシステム」](https://foundryvtt.com/packages/shinobigami)に読み込むのに役立つモジュールです。

現在サポートしているデータソースは次のとおりです。

- [character-sheets.appspot.com](https://character-sheets.appspot.com/shinobigami/)
- [시노비가미 자동화 시트 4.0 By 시어서커(Seersucker_f)](https://www.postype.com/@dice-horizon/post/20481765)

## caution

Sinobigami システムは現在、公式 v12 のサポートを持っていません。 v11 でも動作するように作成しましたが、バグが発生することがありますので、バグが発生した場合は issue 発行をお願いいたします。
seersucker_f の自動化シートの場合、セルのマージが変更されるとデータが破損する可能性があるため、元の内容のみを書き込んで使用してください。

## Installation

次のリンクを FoundryVTT モジュールのインストール項目に貼り付けてください。

https://github.com/park-se-jun/shinobigami-importer/releases/latest/download/module.json

## usage

1. [Actor]タブの[忍者のインポート]ボタンを押します。
2. 読み込むデータソースを選択してください。
3. 適切な値を入力してください。
4. [忍者のインポート]を押します。

https://github.com/user-attachments/assets/88abaddd-112c-47f2-a020-3d2890f9deec

### character-sheets.appsot.com

key に対応する部分だけを url に作成すればよい。

[character-sheets.appspot.com](https://character-sheets.appspot.com/shinobigami/)から読み込む内容は次のとおりです。

- 名前
- 性別
- 年齢
- 上位流派
- 階級
- 流儀
- 表の顔
- 信念
- 特技
- 功績
- 設定
- 忍法
- 人物
- 背景
- タイプ

### 시노비가미 자동화 시트 4.0 By 시어서커(Seersucker_f)

スプレッドシート ->ファイル - >共有 ->シートの選択 -> ウェブに公開 -> .csv ->公開ボタンを押してから URL を貼り付けます。

[시노비가미 자동화 시트 4.0 By 시어서커(Seersucker_f)](https://www.postype.com/@dice-horizon/post/20481765)から読み込む内容は次のとおりです。

- 名前
- 性別
- 年齢
- 上位流派
- 階級
- 流儀
- 表の顔
- 信念
- 特技
- 功績
- 設定
- 忍法
- 背景
- 奥義
- 忍具

## bug report/fix

このリポジトリにプルリクエストを開くか、issue を生成してください。
