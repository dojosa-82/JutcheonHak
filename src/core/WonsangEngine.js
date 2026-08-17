export default class WonsangEngine {

    constructor() {

        // ====================================
        // 周天原象法 Engine
        //
        // 原理는 유지하고
        // 測定法은 version별로 발전시킨다.
        // ====================================

        this.name =
            "Jutcheon Wonsang Engine";

        this.methodVersion =
            "v1";

        // --------------------------------
        // 측정 모듈 저장소
        // --------------------------------

        this.measurementModules =
            new Map();

        // --------------------------------
        // 최근 측정 결과
        // --------------------------------

        this.lastMeasurement =
            null;
        this.measurementHistory = 
            [];

        this.persistenceThreshold =
            0.000001;
    }


    // ====================================
    // 측정 모듈 등록
    // ====================================

    registerMeasurementModule(
        name,
        module
    ) {

        this.measurementModules.set(
            name,
            module
        );

        console.log(
            "[WonsangEngine] module registered:",
            name
        );
    }


    // ====================================
    // 측정법 version 변경
    // ====================================

    setMethodVersion(
        version
    ) {

        this.methodVersion =
            version;

        console.log(
            "[WonsangEngine] method:",
            this.methodVersion
        );
    }


    // ====================================
    // 六方 측정
    //
    // NaturalFlow 같은 모듈에서
    // 계산된 결과를 받아들인다.
    // ====================================

    receiveSixDirectionMeasurement(
        sourceName,
        sixDirectionData
    ) {

        const measurement = {

            method:
                this.methodVersion,

            source:
                sourceName,

            timestamp:
                Date.now(),

            sixDirections: {
                ...sixDirectionData
            }
        };

        this.lastMeasurement =
            measurement;
        this.measurementHistory.push(
    measurement
);
        console.log(
            "=== 周天原象法 測定 ==="
        );

        console.log(
            measurement
        );

        return measurement;
    }


    // ====================================
    // 行 측정 1차 판정
    //
    // v1:
    // 값이 0보다 크면
    // 해당 방향에 行이 있다고 본다.
    //
    // 나중에 지속시간·강도·분야수 등을
    // 포함하도록 업그레이드 가능.
    // ====================================

    evaluateHaeng(
        sixDirections
    ) {

        const directions = [
            "up",
            "down",
            "left",
            "right",
            "front",
            "back"
        ];

        const result = {};

        for (
            const direction
            of directions
        ) {

            const value =
                sixDirections[
                    direction
                ] ?? 0;

            result[
                direction
            ] = {

                value,

                haeng:
                    value > 0
            };
        }

        return result;
    }

// ====================================
// 六方 行 지속률 계산
// ====================================

calculateHaengPersistence() {

    const directions = [
        "up",
        "down",
        "left",
        "right",
        "front",
        "back"
    ];

    const total =
        this.measurementHistory.length;

    if (total === 0) {

        return null;
    }

    const result = {};

    for (
        const direction
        of directions
    ) {

        let activeCount = 0;

        let valueSum = 0;

        for (
            const measurement
            of this.measurementHistory
        ) {

            const value =
                measurement
                    .sixDirections[
                        direction
                    ] ?? 0;

            valueSum += value;

            if (
                value >
                this.persistenceThreshold
            ) {

                activeCount++;
            }
        }

        result[direction] = {

            activeCount,

            totalCount:
                total,

            persistence:
                activeCount /
                total,

            averageValue:
                valueSum /
                total
        };
    }

    console.log(
        "=== 六方 行 지속률 ==="
    );

    console.log(
        result
    );

    return result;
}
    // ====================================
    // 三品 방향 규칙
    //
    // 精 = 左右
    // 氣 = 進退
    // 神 = 順逆
    //
    // 陽 / 陰은
    // 爻의 位에 따라 서로 다른 방향을 가진다.
    // ====================================

    getSampumDirection(
        sampum,
        yinYang
    ) {

        const rules = {

            jing: {
                yang: {
                    direction: "left",
                    directionKo: "左",
                    position: "卯",
                    phase: "木"
                },

                yin: {
                    direction: "right",
                    directionKo: "右",
                    position: "酉",
                    phase: "金"
                }
            },

            qi: {
                yang: {
                    direction: "front",
                    directionKo: "進",
                    position: "前"
                },

                yin: {
                    direction: "back",
                    directionKo: "退",
                    position: "背"
                }
            },

            shen: {
                yang: {
                    mode: "逆",
                    will: "有志",
                    target: true
                },

                yin: {
                    mode: "順",
                    will: "虛志",
                    target: false
                }
            }
        };

        return (
            rules[sampum]?.[yinYang] ??
            null
        );
    }


    // ====================================
    // 八卦 三品 원상 정의
    //
    // 아래에서 위로:
    // 1효 = 精
    // 2효 = 氣
    // 3효 = 神
    // ====================================

    getTrigramSampum(
        guaName
    ) {

        const trigrams = {

            "乾": [
                "yang",
                "yang",
                "yang"
            ],

            "兌": [
                "yang",
                "yang",
                "yin"
            ],

            "離": [
                "yang",
                "yin",
                "yang"
            ],

            "震": [
                "yang",
                "yin",
                "yin"
            ],

            "巽": [
                "yin",
                "yang",
                "yang"
            ],

            "坎": [
                "yin",
                "yang",
                "yin"
            ],

            "艮": [
                "yin",
                "yin",
                "yang"
            ],

            "坤": [
                "yin",
                "yin",
                "yin"
            ]
        };

        const yao =
            trigrams[guaName];

        if (!yao) {

            return null;
        }

        return {

            gua:
                guaName,

            jing: {
                yinYang:
                    yao[0],

                ...this.getSampumDirection(
                    "jing",
                    yao[0]
                )
            },

            qi: {
                yinYang:
                    yao[1],

                ...this.getSampumDirection(
                    "qi",
                    yao[1]
                )
            },

            shen: {
                yinYang:
                    yao[2],

                ...this.getSampumDirection(
                    "shen",
                    yao[2]
                )
            }
        };
    }
        // ====================================
    // 八卦 原象 TEST
    // ====================================

    testTrigramSampum(
        guaName
    ) {

        const result =
            this.getTrigramSampum(
                guaName
            );

        console.log(
            `=== ${guaName} 三品 原象 ===`
        );

        console.log(
            result
        );

        return result;
    }
        // ====================================
    // 陰陽의 有 / 虛 판정
    // ====================================

    getYouHeo(
        yinYang
    ) {

        if (
            yinYang === "yang"
        ) {

            return {
                state: "有",
                seek: false
            };
        }

        return {
            state: "虛",
            seek: true
        };
    }


    // ====================================
    // 한 三品의 主客 結判定
    //
    // 아직 완전 규칙이 아니다.
    // v1 기본 골격:
    //
    // 主陽 = 이미 有 → 不求
    // 主陰 = 虛 → 求
    //
    // 결과값과 象態를
    // 따로 저장한다.
    // ====================================

    evaluateSampumEncounter(
        hostPart,
        guestPart,
        sampumName
    ) {

        const hostState =
            this.getYouHeo(
                hostPart.yinYang
            );

        const guestState =
            this.getYouHeo(
                guestPart.yinYang
            );

        const result = {

            sampum:
                sampumName,

            host: {
                ...hostPart,
                ...hostState
            },

            guest: {
                ...guestPart,
                ...guestState
            },

            value:
                null,

            state:
                "UNRESOLVED",

            reason:
                ""
        };


        // -------------------------------
        // 主가 有이면 기본적으로 不求
        // -------------------------------

        if (
            hostState.state === "有"
        ) {

            result.reason =
                "主有 → 不求";

            // 主有 + 客有
            if (
                guestState.state === "有"
            ) {

                result.value =
                    0;

                result.state =
                    "有持";

                result.reason +=
                    " / 客有";
            }

            // 主有 + 客虛
            else {

                result.value =
                    0;

                result.state =
                    "有而受";

                result.reason +=
                    " / 客虛";
            }
        }


        // -------------------------------
        // 主가 虛이면 求
        // -------------------------------

        else {

            result.reason =
                "主虛 → 求";

            // 主虛 + 客有
            if (
                guestState.state === "有"
            ) {

                result.value =
                    1;

                result.state =
                    "得候補";

                result.reason +=
                    " / 客有";
            }

            // 主虛 + 客虛
            else {

                result.value =
                    0;

                result.state =
                    "不足";

                result.reason +=
                    " / 客亦虛";
            }
        }

        return result;
    }
        // ====================================
    // 卦와 卦의 三品 主客 結
    // ====================================

    encounterTrigrams(
        hostGua,
        guestGua
    ) {

        const host =
            this.getTrigramSampum(
                hostGua
            );

        const guest =
            this.getTrigramSampum(
                guestGua
            );

        if (
            !host ||
            !guest
        ) {

            return null;
        }

        const jing =
            this.evaluateSampumEncounter(
                host.jing,
                guest.jing,
                "精"
            );

        const qi =
            this.evaluateSampumEncounter(
                host.qi,
                guest.qi,
                "氣"
            );

        const shen =
            this.evaluateSampumEncounter(
                host.shen,
                guest.shen,
                "神"
            );

        const result = {

            host:
                hostGua,

            guest:
                guestGua,

            jing,

            qi,

            shen
        };

        console.log(
            `=== ${hostGua} 主 × ${guestGua} 客 ===`
        );

        console.log(
            result
        );

        return result;
    }

        // ====================================
    // 太極 초기 상태 생성
    //
    // 괘의 三品 원상을 바탕으로
    // 현재 상태와 변화이력을 만든다.
    // ====================================

    createTaijiState(
        guaName
    ) {

        const sampum =
            this.getTrigramSampum(
                guaName
            );

        if (!sampum) {

            return null;
        }

        const state = {

            gua:
                guaName,

            jing: {

                yinYang:
                    sampum.jing.yinYang,

                level:
                    1,

                value:
                    0,
                state:
                    "始",

                direction:
                    sampum.jing.direction,

                position:
                    sampum.jing.position
            },

            qi: {

                yinYang:
                    sampum.qi.yinYang,

                value:
                    sampum.qi.yinYang
                        === "yang"
                        ? 1
                        : -1,

                state:
                    sampum.qi.yinYang
                        === "yang"
                        ? "進"
                        : "退",

                direction:
                    sampum.qi.direction
            },

            shen: {

                yinYang:
                    sampum.shen.yinYang,

                value:
                    0,

                state:
                    sampum.shen.yinYang
                        === "yang"
                        ? "有志"
                        : "虛",

                mode:
                    sampum.shen.mode
            },

            history: []
        };

        console.log(
            `=== ${guaName} 太極 初期狀態 ===`
        );

        console.log(
            state
        );

        return state;
    }

        // ====================================
    // 太極에 客을 적용
    //
    // 현재 상태 + 客의 三品을 받아
    // 변화 후보와 history를 기록한다.
    // ====================================

    applyEncounter(
        hostState,
        guestGua
    ) {

        if (
            !hostState ||
            !guestGua
        ) {

            return null;
        }

        const guest =
            this.getTrigramSampum(
                guestGua
            );

        if (!guest) {

            return null;
        }

        const encounter = {

            step:
                hostState.history.length + 1,

            host:
                hostState.gua,

            guest:
                guestGua,

            before: {
                jing: {
                    ...hostState.jing
                },

                qi: {
                    ...hostState.qi
                },

                shen: {
                    ...hostState.shen
                }
            },

            guestSampum: {
                jing: {
                    ...guest.jing
                },

                qi: {
                    ...guest.qi
                },

                shen: {
                    ...guest.shen
                }
            },

            timestamp:
                Date.now()
        };
 
                // ====================================
        // v1 첫 실험 규칙
        // 震 × 離
        //
        // 精 : +  → 精 level 상승
        // 氣 : 0_定
        // 神 : 0_定
        // ====================================

        if (
            hostState.gua === "震" &&
            guestGua === "離"
        ) {

            // 精
            hostState.jing.level += 1;
            hostState.jing.value = 1;
            hostState.jing.state = "鍊";

            // 氣
            hostState.qi.value = 0;
            hostState.qi.state = "定";

            // 神
            hostState.shen.value = 0;
            hostState.shen.state = "定";

            encounter.result = {
                jing: "+",
                qi: "0_定",
                shen: "0_定"
            };

            encounter.after = {
                jing: {
                    ...hostState.jing
                },

                qi: {
                    ...hostState.qi
                },

                shen: {
                    ...hostState.shen
                }
            };
        }
                // ====================================
        // v1 두 번째 실험 규칙
        // 震精2 × 兌
        //
        // 精 : 精2 → 精3 / 豊
        // 氣 : 0_復
        // 神 : 虛·不足·애닯음
        // ====================================

        if (
            hostState.gua === "震" &&
            guestGua === "兌" &&
            hostState.jing.level === 2
        ) {

            // 精
            hostState.jing.level = 3;
            hostState.jing.value = 1;
            hostState.jing.state = "豊";

            // 氣
            hostState.qi.value = 0;
            hostState.qi.state = "復";

            // 神
            hostState.shen.value = 0;
            hostState.shen.state = "不足";
            hostState.shen.feeling = "애닯음";

            encounter.result = {
                jing: "+",
                qi: "0_復",
                shen: "0_不足"
            };

            encounter.after = {
                jing: {
                    ...hostState.jing
                },

                qi: {
                    ...hostState.qi
                },

                shen: {
                    ...hostState.shen
                }
            };
        }

                // ====================================
        // v1 세 번째 실험 규칙
        // 震精3 × 巽
        //
        // 현재 主震:
        // 精 = 豊
        // 氣 = 復
        // 神 = 不足 / 求
        //
        // 客巽:
        // 精陰 = 虛
        // 氣陽 = 進
        // 神陽 = 有志
        //
        // 결과:
        // 精 = ++
        // 氣 = +
        // 神 = +
        // → +++
        // → 脫殼
        // → 鍊精化氣
        // ====================================

        if (
            hostState.gua === "震" &&
            guestGua === "巽" &&
            hostState.jing.level === 3 &&
            hostState.jing.state === "豊" &&
            hostState.qi.state === "復" &&
            hostState.shen.state === "不足"
        ) {

            // 精
            // 震의 풍족한 有와
            // 巽의 精陰 虛가 맞잡는다.
            hostState.jing.value = 2;
            hostState.jing.state = "結豊";
            hostState.jing.completion = "++";

            // 氣
            // 0_復에서 巽氣陽을 만나
            // 실제 進으로 넘어간다.
            hostState.qi.value = 1;
            hostState.qi.state = "進";

            // 神
            // 求하던 神陰이
            // 巽神陽의 有志를 만난다.
            hostState.shen.value = 1;
            hostState.shen.state = "得志";

            // 이전의 애닯음은 해소
            delete hostState.shen.feeling;

            // 三品 완전 결착
            hostState.gyeol = "+++";

            // 첫 층위 변화 후보
            hostState.transition = "脫殼";
            hostState.nextStage = "鍊精化氣";

            encounter.result = {
                jing: "++",
                qi: "+",
                shen: "+",
                gyeol: "+++",
                transition: "脫殼",
                nextStage: "鍊精化氣"
            };

            encounter.after = {
                jing: {
                    ...hostState.jing
                },

                qi: {
                    ...hostState.qi
                },

                shen: {
                    ...hostState.shen
                },

                gyeol:
                    hostState.gyeol,

                transition:
                    hostState.transition,

                nextStage:
                    hostState.nextStage
            };
        }
        
        hostState.history.push(
            encounter
        );

        console.log(
            `=== ${hostState.gua} × ${guestGua} 結 ===`
        );

        console.log(
            encounter
        );

        return hostState;
    }

    //====================================
    // 原象 분석
    // ====================================

    analyzeWonsang(
        measurement
    ) {

        if (
            !measurement ||
            !measurement.sixDirections
        ) {

            return null;
        }

        const haeng =
            this.evaluateHaeng(
                measurement.sixDirections
            );
         const persistence =
    this.calculateHaengPersistence(); 
        const result = {
            
            method:
                measurement.method,

            source:
                measurement.source,

            haeng,
            persistence,
            // 아직 虛는 미정
            // 0을 陰으로 처리하지 않는다.
            heo:
                "NOT_DEFINED_YET",

            yinYang:
                "NOT_DEFINED_YET",

            yao:
                "NOT_DEFINED_YET",

            gua:
                "NOT_DEFINED_YET"
        };

        console.log(
            "=== 原象 분석 v1 ==="
        );

        console.log(
            result
        );

        return result;
    }


    // ====================================
    // 상태 확인
    // ====================================

    getState() {

        return {

            name:
                this.name,

            methodVersion:
                this.methodVersion,

            modules:
                Array.from(
                    this.measurementModules.keys()
                ),

            lastMeasurement:
                this.lastMeasurement,
                historyCount:
    this.measurementHistory.length,
        };
    }

}