/**
 * @fileoverview
 */

/**
 * @typedef {object} CharacterSheetAppspotData
 * @property {string} autoresize
 * @property {object[]} background
 * @property {string} background.effect
 * @property {string} background.name
 * @property {null} background.page
 * @property {string} background.point
 * @property {string} background.type
 * @property {object} base
 * @property {string} base.age
 * @property {string} base.belief
 * @property {string} base.cover
 * @property {string} base.exp
 * @property {null} base.expnormal
 * @property {null} base.foe
 * @property {string} base.level
 * @property {string} base.memo
 * @property {string} base.name
 * @property {null} base.nameKana
 * @property {string} base.player
 * @property {string} base.race
 * @property {null} base.regulation
 * @property {null} base.secretCount
 * @property {string} base.sex
 * @property {null} base.stylerule
 * @property {string} base.substyle
 * @property {string} base.upperstyle
 * @property {null} includeTargetSkill
 * @property {object} judge
 * @property {object} judge.skill
 * @property {string} judge.skill.id
 * @property {object[]} learned
 * @property {null} learned.hiddenSkill
 * @property {null|string} learned.id
 * @property {null} learned.judge
 * @property {object[]} ninpou
 * @property {null} ninpou.awaken
 * @property {string|null} ninpou.cost
 * @property {string|null} ninpou.effect
 * @property {string} ninpou.name
 * @property {string|null} ninpou.page
 * @property {string|null} ninpou.range
 * @property {null} ninpou.secret
 * @property {string|null} ninpou.targetSkill
 * @property {string} ninpou.type
 * @property {object[]} personalities
 * @property {string} personalities.direction
 * @property {string} personalities.emotion
 * @property {null} personalities.name
 * @property {null} personalities.place
 * @property {null} personalities.secret
 * @property {null} personalities.specialEffect
 * @property {string} [editlang]
 */


/**
  * @typedef ShinobiActorData
  * @type {object}
  * @property {string} [name="닌자"]
  * @property {"character"|"commoner"} type
  * @property {ShinobiData} [data] v11 지원
  * @property {ShinobiData} [system] v12 지원
  * 
  * 
 */
/**
 * @typedef ShinobiItemData
 * @type {object}
 * @property {string} name
 * @property {"ability"|"background"|"bond"|"item"|"finish"} type
 * @property {object} [data] v11 지원
 * @property {object} [system] v12 지원
 */
/**
  * @typedef ShinobiData
  * @type {object}
  * @property {Talent} talent
  * @property {Details} details 닌자의 정보
 */
/** 
  * @typedef {object} Talent
  * @property {Gap} gap 갭(1,2,3,4,5,6 중 2개를 )
  * @property {number} curiosity 주력 분야(1~6 사이의 정수)
  * @property {SkillTable} table 특기 테이블
 */
/** 
  * @typedef {object} Gap 1,2,3,4,5,6을 key로 가지는 오브젝트. 그중 2개만 true
 */

/** 
  * @typedef {SkillRow[]} SkillTable
  * 
  * @typedef {Skill[]} SkillRow
  * 
  * @typedef {object} Skill
  * @property {boolean} state 해당 특기를 습득했습니까?
  * @property {number} num 목표 값
  * @property {boolean} stop 해당 특기를 사용할 수 있습니까?
 */
/**
  * @typedef {object} Details
  * @property {string} age 나이
  * @property {string} sex 성별
  * @property {string} purpose 목적(유의)
  * @property {string} identify 사회적 신분
  * @property {string} belief 신념
  * @property {number|string} exp 공적점
  * @property {string} expContent 공적 내역
  * @property {string} biography 백그라운드 스토리
  * @property {string} agency 소속
  * @property {string} grade  계급
 */