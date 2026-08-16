import * as THREE from "three";

export default class NaturalFlow {

    constructor() {

        // ====================================
        // 주천학 6방 기준축
        // ====================================

        this.up =
            new THREE.Vector3(
                0,
                1,
                0
            );

        this.down =
            new THREE.Vector3(
                0,
                -1,
                0
            );


        // 卯酉 기준
        // 酉 = 27°E
        // 卯 = 153°W
        // ====================================

        const yuLongitude =
            THREE.MathUtils.degToRad(
                27
            );

        this.right =
            new THREE.Vector3(
                Math.sin(yuLongitude),
                0,
                Math.cos(yuLongitude)
            ).normalize();

        this.left =
            this.right.clone()
                .multiplyScalar(-1);


        // ====================================
        // 前後 기준
        // 前 = 63°W
        // 後 = 117°E
        // ====================================

        const frontLongitude =
            THREE.MathUtils.degToRad(
                -63
            );

        this.front =
            new THREE.Vector3(
                Math.sin(frontLongitude),
                0,
                Math.cos(frontLongitude)
            ).normalize();

        this.back =
            this.front.clone()
                .multiplyScalar(-1);
    }


    // ====================================
    // 위도·경도 -> 지구표면 위치벡터
    // ====================================

    getPositionVector(
        latitudeDeg,
        longitudeDeg
    ) {

        const lat =
            THREE.MathUtils.degToRad(
                latitudeDeg
            );

        const lon =
            THREE.MathUtils.degToRad(
                longitudeDeg
            );

        return new THREE.Vector3(

            Math.cos(lat) *
            Math.sin(lon),

            Math.sin(lat),

            Math.cos(lat) *
            Math.cos(lon)

        ).normalize();
    }


    // ====================================
    // 해당 지점의 동쪽 접선벡터
    // ====================================

    getEastVector(
        longitudeDeg
    ) {

        const lon =
            THREE.MathUtils.degToRad(
                longitudeDeg
            );

        return new THREE.Vector3(

            Math.cos(lon),

            0,

            -Math.sin(lon)

        ).normalize();
    }


    // ====================================
    // 해당 지점의 북쪽 접선벡터
    // ====================================

    getNorthVector(
        latitudeDeg,
        longitudeDeg
    ) {

        const position =
            this.getPositionVector(
                latitudeDeg,
                longitudeDeg
            );

        const east =
            this.getEastVector(
                longitudeDeg
            );

        return new THREE.Vector3()
            .crossVectors(
                position,
                east
            )
            .normalize();
    }


    // ====================================
    // 풍향·풍속 -> 3D 자연벡터
    //
    // eastSpeed  : 동(+), 서(-)
    // northSpeed : 북(+), 남(-)
    // ====================================

    createHorizontalFlow(
        latitudeDeg,
        longitudeDeg,
        eastSpeed,
        northSpeed
    ) {

        const east =
            this.getEastVector(
                longitudeDeg
            );

        const north =
            this.getNorthVector(
                latitudeDeg,
                longitudeDeg
            );

        const flow =
            east.clone()
                .multiplyScalar(
                    eastSpeed
                )
                .add(
                    north.clone()
                        .multiplyScalar(
                            northSpeed
                        )
                );

        return flow;
    }


    // ====================================
    // 자연벡터를 6방으로 분해
    // ====================================

    projectToSixDirections(
        flow
    ) {

        const magnitude =
            flow.length();

        if (magnitude === 0) {

            return {

                magnitude: 0,

                up: 0,
                down: 0,

                left: 0,
                right: 0,

                front: 0,
                back: 0
            };
        }

        const f =
            flow.clone()
                .normalize();


        const upValue =
            f.dot(this.up);

        const leftValue =
            f.dot(this.left);

        const frontValue =
            f.dot(this.front);


        return {

            magnitude,

            up:
                Math.max(
                    0,
                    upValue
                ),

            down:
                Math.max(
                    0,
                    -upValue
                ),

            left:
                Math.max(
                    0,
                    leftValue
                ),

            right:
                Math.max(
                    0,
                    -leftValue
                ),

            front:
                Math.max(
                    0,
                    frontValue
                ),

            back:
                Math.max(
                    0,
                    -frontValue
                )
        };
    }


    // ====================================
    // 시험용 출력
    // ====================================

    testFlow() {

        // 현재 乾候補
        // 38.759°N
        // 10.966°W

        const latitude =
            38.759;

        const longitude =
            -10.966;


        // 시험 자연벡터
        //
        // 동쪽 3
        // 북쪽 5
        //
        // 아직 실측값 아님
        // 엔진 검사용
        // ====================================

        const flow =
            this.createHorizontalFlow(

                latitude,
                longitude,

                0,
                -1
            );


        const result =
            this.projectToSixDirections(
                flow
            );


        console.log(
            "=== 乾候補 장기 북풍 방향 TEST ==="
        );

        console.log(
            "magnitude:",
            result.magnitude.toFixed(3)
        );

        console.log(
            "上:",
            result.up.toFixed(3)
        );

        console.log(
            "下:",
            result.down.toFixed(3)
        );

        console.log(
            "左:",
            result.left.toFixed(3)
        );

        console.log(
            "右:",
            result.right.toFixed(3)
        );

        console.log(
            "前:",
            result.front.toFixed(3)
        );

        console.log(
            "後:",
            result.back.toFixed(3)
        );

        return result;
    }

}