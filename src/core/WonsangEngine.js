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
            this.measurementHistory = [];

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