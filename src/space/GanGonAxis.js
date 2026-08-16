import * as THREE from "three";

export default class GanGonAxis {

    constructor(
        scene,
        radius = 1.08
    ) {

        this.scene = scene;
        this.radius = radius;

        // ====================================
        // 艮位 1차 시험좌표
        // 안산-본계 자철광 집중대 중심 후보
        //
        // 41.14° N
        // 123.57° E
        // ====================================

        this.ganLatitude =
            THREE.MathUtils.degToRad(
                41.14
            );

        this.ganLongitude =
            THREE.MathUtils.degToRad(
                123.57
            );

        this.createAxis();
        this.createGanGonOrthogonalCircle();
        this.createSunCandidate();
        this.createSunCandidate2();  
        this.measureAngles();
    }


    // ====================================
    // 위도 / 경도 -> 3D 위치
    // ====================================

    getPosition(
        latitude,
        longitude
    ) {

        const r =
            this.radius;

        const x =
            r *
            Math.cos(latitude) *
            Math.sin(longitude);

        const y =
            r *
            Math.sin(latitude);

        const z =
            r *
            Math.cos(latitude) *
            Math.cos(longitude);

        return new THREE.Vector3(
            x,
            y,
            z
        );
    }


    // ====================================
    // 艮 - 坤 축 생성
    // ====================================

    createAxis() {

        const ganPosition =
            this.getPosition(
                this.ganLatitude,
                this.ganLongitude
            );

        // 坤은 艮의 정확한 대척점
        const gonPosition =
            ganPosition
                .clone()
                .multiplyScalar(-1);


        // --------------------------------
        // 축
        // --------------------------------

        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints([
                    ganPosition,
                    gonPosition
                ]);

        const material =
            new THREE.LineBasicMaterial({
                color: 0x00ffff
            });

        this.axis =
            new THREE.Line(
                geometry,
                material
            );

        this.scene.add(
            this.axis
        );


        // --------------------------------
        // 艮 / 坤 점
        // --------------------------------

        const markerGeometry =
            new THREE.SphereGeometry(
                0.045,
                16,
                16
            );

        const ganMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x00ffff
            });

        const gonMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x00ffff
            });


        this.ganPoint =
            new THREE.Mesh(
                markerGeometry,
                ganMaterial
            );

        this.ganPoint.position.copy(
            ganPosition
        );

        this.scene.add(
            this.ganPoint
        );


        this.gonPoint =
            new THREE.Mesh(
                markerGeometry,
                gonMaterial
            );

        this.gonPoint.position.copy(
            gonPosition
        );

        this.scene.add(
            this.gonPoint
        );
        
        this.createPointLabel(
    "艮",
    ganPosition
);

this.createPointLabel(
    "坤",
    gonPosition
);
    }
     // ====================================
// 艮과 6정위의 공간각 측정
// ====================================
// ====================================
// 艮坤축 90° 직교대원
// 巽乾 후보 탐색용
// ====================================

createGanGonOrthogonalCircle() {

    // 自然艮位 방향
    const gan =
        this.getPosition(
            this.ganLatitude,
            this.ganLongitude
        ).normalize();

    // --------------------------------
    // gan과 평행하지 않은 임시 벡터
    // --------------------------------

    let helper =
        new THREE.Vector3(
            0,
            1,
            0
        );

    // 혹시 너무 평행할 경우 대비
    if (
        Math.abs(
            gan.dot(helper)
        ) > 0.95
    ) {

        helper.set(
            1,
            0,
            0
        );
    }


    // --------------------------------
    // 艮에 수직인 첫 번째 방향
    // --------------------------------

    const u =
        new THREE.Vector3()
            .crossVectors(
                gan,
                helper
            )
            .normalize();


    // --------------------------------
    // 艮과 u 모두에 수직인 방향
    // --------------------------------

    const v =
        new THREE.Vector3()
            .crossVectors(
                gan,
                u
            )
            .normalize();


    // --------------------------------
    // 직교대원 생성
    // --------------------------------

    const points = [];

    const segments = 256;

    const r =
        this.radius * 1.015;

    for (
        let i = 0;
        i <= segments;
        i++
    ) {

        const angle =
            (Math.PI * 2 * i)
            / segments;

        const point =
            u.clone()
                .multiplyScalar(
                    Math.cos(angle)
                )
                .add(
                    v.clone()
                        .multiplyScalar(
                            Math.sin(angle)
                        )
                )
                .multiplyScalar(r);

        points.push(point);
    }


    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(points);

    const material =
        new THREE.LineBasicMaterial({
            color: 0xff00aa
        });


    this.ganGonOrthogonalCircle =
        new THREE.Line(
            geometry,
            material
        );

    this.scene.add(
        this.ganGonOrthogonalCircle
    );
}

// ====================================
// 自然巽位 1차 후보
//
// 前-卯 사이의 중간방향을
// 艮坤 90도 직교대원에 투영
// ====================================

createSunCandidate() {

    const gan =
        this.getPosition(
            this.ganLatitude,
            this.ganLongitude
        ).normalize();


    // --------------------------------
    // 前 = -63°
// 卯 = -153°
// 두 방향의 중간 = -108°
// --------------------------------

    const targetLongitude =
        THREE.MathUtils.degToRad(
            -108
        );

    const target =
        new THREE.Vector3(
            Math.sin(targetLongitude),
            0,
            Math.cos(targetLongitude)
        ).normalize();


    // --------------------------------
    // target을 艮에 수직인 평면으로 투영
    // --------------------------------

    const projection =
        target.clone()
            .sub(
                gan.clone()
                    .multiplyScalar(
                        target.dot(gan)
                    )
            )
            .normalize();


    // --------------------------------
    // 후보점
    // --------------------------------

    const position =
        projection.clone()
            .multiplyScalar(
                this.radius + 0.04
            );


    const geometry =
        new THREE.SphereGeometry(
            0.05,
            16,
            16
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: 0x00ff88
        });

    this.sunCandidate =
        new THREE.Mesh(
            geometry,
            material
        );

    this.sunCandidate.position.copy(
        position
    );

    this.scene.add(
        this.sunCandidate
    );


    // --------------------------------
    // 위도 / 경도 계산
    // --------------------------------

    const latitude =
        THREE.MathUtils.radToDeg(
            Math.asin(
                projection.y
            )
        );

    const longitude =
        THREE.MathUtils.radToDeg(
            Math.atan2(
                projection.x,
                projection.z
            )
        );


    console.log(
        "=== 自然巽位 후보1 ==="
    );

    console.log(
        "latitude:",
        latitude.toFixed(3),
        "deg"
    );

    console.log(
        "longitude:",
        longitude.toFixed(3),
        "deg"
    );


    // --------------------------------
    // 艮과 실제 각도 검증
    // --------------------------------

    const angleGan =
        THREE.MathUtils.radToDeg(
            Math.acos(
                THREE.MathUtils.clamp(
                    gan.dot(
                        projection
                    ),
                    -1,
                    1
                )
            )
        );

    console.log(
        "艮 ↔ 巽候補:",
        angleGan.toFixed(3),
        "deg"
    );


    this.createPointLabel(
        "巽?",
        position
    );
}

// ====================================
// 自然巽位 후보2
//
// 조건:
// 1) 卯와 後 사이
// 2) 午 방향으로 치우침
// 3) 艮坤축과 정확히 90°
// ====================================

createSunCandidate2() {

    const gan =
        this.getPosition(
            this.ganLatitude,
            this.ganLongitude
        ).normalize();

    // --------------------------------
    // 卯 = 153°W
    // 後 = 117°E
    // --------------------------------

    const myoLongitude =
        THREE.MathUtils.degToRad(
            -153
        );

    const backLongitude =
        THREE.MathUtils.degToRad(
            117
        );

    const myo =
        new THREE.Vector3(
            Math.sin(myoLongitude),
            0,
            Math.cos(myoLongitude)
        ).normalize();

    const back =
        new THREE.Vector3(
            Math.sin(backLongitude),
            0,
            Math.cos(backLongitude)
        ).normalize();


    // --------------------------------
    // 卯와 後의 구면 중간 방향
    // --------------------------------

    const mid =
        myo.clone()
            .add(back)
            .normalize();


    // --------------------------------
    // 午 방향(-Y)을 섞어서
    // "묘-후 아래쪽"으로 이동
    //
    // 0.55는 현재 시험값
    // 나중에 자연자료로 조정 가능
    // --------------------------------

    const south =
        new THREE.Vector3(
            0,
            -1,
            0
        );

    const target =
        mid.clone()
            .add(
                south.clone()
                    .multiplyScalar(
                        0.55
                    )
            )
            .normalize();


    // --------------------------------
    // 艮에 수직인 평면으로 투영
    // → 艮坤축과 정확히 90°
    // --------------------------------

    const projection =
        target.clone()
            .sub(
                gan.clone()
                    .multiplyScalar(
                        target.dot(gan)
                    )
            )
            .normalize();


    // --------------------------------
    // 화면 표시
    // --------------------------------

    const position =
        projection.clone()
            .multiplyScalar(
                this.radius + 0.055
            );

    const geometry =
        new THREE.SphereGeometry(
            0.055,
            16,
            16
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: 0xff4444
        });

    this.sunCandidate2 =
        new THREE.Mesh(
            geometry,
            material
        );

    this.sunCandidate2.position.copy(
        position
    );

    this.scene.add(
        this.sunCandidate2
    );


    // --------------------------------
    // 위도 / 경도
    // --------------------------------

    const latitude =
        THREE.MathUtils.radToDeg(
            Math.asin(
                projection.y
            )
        );

    const longitude =
        THREE.MathUtils.radToDeg(
            Math.atan2(
                projection.x,
                projection.z
            )
        );


    // --------------------------------
    // 艮과 각도 검증
    // --------------------------------

    const angleGan =
        THREE.MathUtils.radToDeg(
            Math.acos(
                THREE.MathUtils.clamp(
                    gan.dot(projection),
                    -1,
                    1
                )
            )
        );


    console.log(
        "=== 自然巽位 후보2 ==="
    );

    console.log(
        "latitude:",
        latitude.toFixed(3),
        "deg"
    );

    console.log(
        "longitude:",
        longitude.toFixed(3),
        "deg"
    );

    console.log(
        "艮 ↔ 巽候補2:",
        angleGan.toFixed(3),
        "deg"
    );


    this.createPointLabel(
        "巽2?",
        position
    );
}
measureAngles() {

    const gan =
        this.getPosition(
            this.ganLatitude,
            this.ganLongitude
        ).normalize();


    // 子 / 午
    const ja =
        new THREE.Vector3(
            0,
            1,
            0
        );

    const o =
        new THREE.Vector3(
            0,
            -1,
            0
        );


    // --------------------------------
    // 卯酉 기준축
    // 酉 = 27°E
    // 卯 = 153°W = 정확한 대척점
    // --------------------------------

    const yuLongitude =
        THREE.MathUtils.degToRad(
            27
        );

    const yu =
        new THREE.Vector3(
            Math.sin(yuLongitude),
            0,
            Math.cos(yuLongitude)
        ).normalize();

    const myo =
        yu.clone()
            .multiplyScalar(-1);


    // --------------------------------
    // 前後축
    // 前 = 63°W = -63°
    // 後 = 117°E
    // --------------------------------

    const frontLongitude =
        THREE.MathUtils.degToRad(
            -63
        );

    const front =
        new THREE.Vector3(
            Math.sin(frontLongitude),
            0,
            Math.cos(frontLongitude)
        ).normalize();

    const back =
        front.clone()
            .multiplyScalar(-1);


    // --------------------------------
    // 각도 계산 함수
    // --------------------------------

    const angleDeg =
        (a, b) => {

            const dot =
                THREE.MathUtils.clamp(
                    a.dot(b),
                    -1,
                    1
                );

            return THREE.MathUtils.radToDeg(
                Math.acos(dot)
            );
        };


    const result = {

        ja:
            angleDeg(
                gan,
                ja
            ),

        o:
            angleDeg(
                gan,
                o
            ),

        myo:
            angleDeg(
                gan,
                myo
            ),

        yu:
            angleDeg(
                gan,
                yu
            ),

        front:
            angleDeg(
                gan,
                front
            ),

        back:
            angleDeg(
                gan,
                back
            )
    };


    console.log(
        "=== 艮位 공간각 검증 ==="
    );

    console.log(
        "艮 ↔ 子:",
        result.ja.toFixed(3),
        "deg"
    );

    console.log(
        "艮 ↔ 午:",
        result.o.toFixed(3),
        "deg"
    );

    console.log(
        "艮 ↔ 卯:",
        result.myo.toFixed(3),
        "deg"
    );

    console.log(
        "艮 ↔ 酉:",
        result.yu.toFixed(3),
        "deg"
    );

    console.log(
        "艮 ↔ 前:",
        result.front.toFixed(3),
        "deg"
    );

    console.log(
        "艮 ↔ 後:",
        result.back.toFixed(3),
        "deg"
    );
    console.warn(
    "GAN ANGLES:",
    result
    );
    return result;
}

    // ====================================
    // 라벨
    // ====================================

    createPointLabel(
        text,
        position
    ) {

        const canvas =
            document.createElement(
                "canvas"
            );

        canvas.width = 256;
        canvas.height = 128;

        const context =
            canvas.getContext("2d");

        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        context.fillStyle =
            "white";

        context.font =
            "bold 64px sans-serif";

        context.textAlign =
            "center";

        context.textBaseline =
            "middle";

        context.fillText(
            text,
            canvas.width / 2,
            canvas.height / 2
        );

        const texture =
            new THREE.CanvasTexture(
                canvas
            );

        const material =
            new THREE.SpriteMaterial({
                map: texture,
                transparent: true
            });

        const sprite =
            new THREE.Sprite(
                material
            );

        sprite.position.copy(
            position
        );

        sprite.position.multiplyScalar(
            1.10
        );

        sprite.scale.set(
            0.22,
            0.11,
            1
        );

        this.scene.add(
            sprite
        );
    }

}
