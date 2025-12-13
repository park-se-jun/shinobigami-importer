# Shinobigami Importer

시노비가미 임포터는 다른 곳에서 작성한 캐릭터를 [foundryVTT 시노비가미 시스템](https://foundryvtt.com/packages/shinobigami)에 불러올 수 있도록 도와주는 모듈입니다.

현재 지원하고 있는 데이터 소스는 다음과 같습니다.

- [character-sheets.appspot.com](https://character-sheets.appspot.com/shinobigami/)
- [시노비가미 자동화 시트 4.0 By 시어서커(Seersucker_f)](https://www.postype.com/@dice-horizon/post/20481765)

## caution

시노비가미 시스템은 현재 공식적인 v12 지원이 없습니다. v11에서도 동작하도록 작성하긴 했으나 버그가 발생할 수 있으니 버그가 발생한다면 이슈 발행 부탁드립니다.
시어서커님 자동화시트의 경우 셀 병합이 달라지면 데이터가 깨질 수 있으니 되도록 원본에서 내용만 채워서 사용해 주세요

## Installation

다음의 링크를 FoundryVTT 모듈 설치 항복에 붙여넣어주세요.

https://github.com/park-se-jun/shinobigami-importer/releases/latest/download/module.json

## usage

1. Actor 탭의 '닌자 가져오기(import shinobi)' 버튼을 누르세요
2. 불러오려는 데이터 소스를 고르세요
3. 해당하는 값을 입력하세요.
4. 가져오기를 누르세요

### character-sheets.appsot.com

[character-sheets.appspot.com](https://character-sheets.appspot.com/shinobigami/)에서 불러오는 내용은 다음과 같습니다.

- 이름
- 성별
- 유파
- 계급
- 법식
- 사회적 신분
- 신념
- 특기, 특기분야
- 공적점
- 백스토리
- 인법
- 인물
- 배경
- 공적 내역
- 일반인 여부

### 시노비가미 자동화 시트 4.0 By 시어서커(Seersucker_f)

[시노비가미 자동화 시트 4.0 By 시어서커(Seersucker_f)](https://www.postype.com/@dice-horizon/post/20481765)에서 불러오는 내용은 다음과 같습니다.

- 이름
- 성별
- 유파
- 계급
- 법식
- 사회적 신분
- 신념
- 특기, 특기분야
- 공적점
- 백스토리
- 인법
- 인물
- 배경
- 오의
- 닌구

## bug report/fix

본 저장소에 풀리퀘스트를 열거나 이슈를 생성해 주세요
