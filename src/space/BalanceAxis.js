import * as THREE from "three";

export default class BalanceAxis {

    constructor(scene, radius = 1.03) {
        this.moonLongitude = 0;
        this.scene = scene;
        this.radius = radius;

        // --------------------------------
        // B축의 비교 기준값
        // 27°E ↔ 153°W
        //
        // 주의:
        // 27°E를 불변축으로 확정하지 않는다.
        // 현재의 관측 비교 기준값일 뿐이다.
        // --------------------------------
        this.referenceLongitude =
            THREE.MathUtils.degToRad(27);

        // --------------------------------
        // 현재 B축
        // B(t) = 기준값 + 변화량
        // --------------------------------
        this.longitude =
            this.referenceLongitude;

        // --------------------------------
        // 용(用)의 반응값
        // 현재는 연구용 입력값
        // --------------------------------
        this.response = {
            ocean: 0,
            atmosphere: 0,
            crust: 0,
            rotation: 0,
            tidal: 0
        };

        this.createReferenceAxis();
        this.createFrontBackAxis();
        this.createPointLabel(
    "酉",
    this.p1.position
);
        this.createAxis();

        this.createPointLabel(
    "卯",
    this.p2.position
);
        this.createLabels();
    }


    // ====================================
    // B축 생성
    // ====================================
    // ====================================
// 묘유 기준축
// 27°E ↔ 153°W
// 고정축
// ====================================

createReferenceAxis() {

    const material =
        new THREE.LineBasicMaterial({
            color: 0xff00ff
        });

    const longitude =
        this.referenceLongitude;

    const r =
        this.radius + 0.02;

    const x =
        r * Math.sin(longitude);

    const z =
        r * Math.cos(longitude);

    const points = [

        new THREE.Vector3(
            x,
            0,
            z
        ),

        new THREE.Vector3(
            -x,
            0,
            -z
        )

    ];

    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(points);

    this.referenceAxis =
        new THREE.Line(
            geometry,
            material
        );

    this.scene.add(
        this.referenceAxis
    );
    // ====================================
// 묘유 후보축 양 끝점 표시
// P1 = 27°E
// P2 = 153°W
// ====================================

const markerGeometry =
    new THREE.SphereGeometry(
        0.035,
        16,
        16
    );

const markerMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xff00ff
    });

this.p1 =
    new THREE.Mesh(
        markerGeometry,
        markerMaterial
    );

this.p1.position.set(
    x,
    0,
    z
);

this.scene.add(
    this.p1
);

this.p2 =
    new THREE.Mesh(
        markerGeometry,
        markerMaterial.clone()
    );

this.p2.position.set(
    -x,
    0,
    -z
);

this.scene.add(
    this.p2
);
}

createPointLabel(text, position) {

    const canvas =
        document.createElement("canvas");

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

    context.fillStyle = "white";

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
        1.12
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
    createAxis() {

        const material =
            new THREE.LineBasicMaterial({
                color: 0xffffff
            });

        const points = [];

        const longitude =
            this.longitude;

        const r =
            this.radius;

        const latitudes = [0, 0];

        const latitude1 = 0;
        const latitude2 = 0;

        const x1 =
            r * Math.cos(latitude1) *
            Math.sin(longitude);

        const z1 =
            r * Math.cos(latitude1) *
            Math.cos(longitude);

        const x2 =
            -x1;

        const z2 =
            -z1;

        points.push(
            new THREE.Vector3(
                x1,
                0,
                z1
            )
        );

        points.push(
            new THREE.Vector3(
                x2,
                0,
                z2
            )
        );

        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints(points);

        this.axis =
            new THREE.Line(
                geometry,
                material
            );

        this.scene.add(this.axis);
    }

// ====================================
// 前後 기준축
// 卯酉축과 정확히 90도 직교
// 前 = 63°W
// 後 = 117°E
// ====================================

createFrontBackAxis() {

    const material =
        new THREE.LineBasicMaterial({
            color: 0xff8800
        });

    const frontLongitude =
        this.referenceLongitude -
        THREE.MathUtils.degToRad(90);

    const r =
        this.radius + 0.03;

    const x =
        r * Math.sin(frontLongitude);

    const z =
        r * Math.cos(frontLongitude);

    const points = [
        new THREE.Vector3(x, 0, z),
        new THREE.Vector3(-x, 0, -z)
    ];

    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(points);

    this.frontBackAxis =
        new THREE.Line(
            geometry,
            material
        );

    this.scene.add(
        this.frontBackAxis
    );

    const markerGeometry =
        new THREE.SphereGeometry(
            0.035,
            16,
            16
        );

    const markerMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xff8800
        });

    this.frontPoint =
        new THREE.Mesh(
            markerGeometry,
            markerMaterial
        );

    this.frontPoint.position.set(
        x,
        0,
        z
    );

    this.scene.add(
        this.frontPoint
    );

    this.backPoint =
        new THREE.Mesh(
            markerGeometry,
            markerMaterial.clone()
        );

    this.backPoint.position.set(
        -x,
        0,
        -z
    );

    this.scene.add(
        this.backPoint
    );

    this.createPointLabel(
        "前",
        this.frontPoint.position
    );

    this.createPointLabel(
        "後",
        this.backPoint.position
    );
}


    // ====================================
    // B축 위치 갱신
    // ====================================

    updateAxis() {

        if (!this.axis) return;

        const longitude =
            this.longitude;

        const r =
            this.radius;

        const x =
            r * Math.sin(longitude);

        const z =
            r * Math.cos(longitude);

        const positions =
            this.axis.geometry.attributes.position;

        positions.setXYZ(
            0,
            x,
            0,
            z
        );

        positions.setXYZ(
            1,
            -x,
            0,
            -z
        );

        positions.needsUpdate = true;
    }


    // ====================================
    // 용의 반응값 입력
    // ====================================

    setResponse({

        ocean = 0,
        atmosphere = 0,
        crust = 0,
        rotation = 0,
        tidal = 0

    }) {

        this.response.ocean =
            ocean;

        this.response.atmosphere =
            atmosphere;

        this.response.crust =
            crust;

        this.response.rotation =
            rotation;

        this.response.tidal =
            tidal;

        this.updateFromResponse();
    }


    // ====================================
    // 반응값으로 B(t) 계산
    //
    // 현재는 연구용 골격.
    // 실제 조석/해양 자료가 들어오면
    // 이 부분의 계산식을 교체한다.
    // ====================================

    updateFromResponse() {

        const variation =
            this.response.ocean +
            this.response.atmosphere +
            this.response.crust +
            this.response.rotation +
            this.response.tidal;

        this.longitude =
            this.referenceLongitude +
            THREE.MathUtils.degToRad(
                variation
            );

        this.updateAxis();
    }


    // ====================================
    // 시간에 따른 B축 변화
    // ====================================

    update(deltaTime) {

        if (!Number.isFinite(deltaTime)) {
            return;
        }

   // --------------------------------
    // 시험용 B(t) 변화
    //
    // 실제 조석·해양 관측자료가
    // 들어오기 전의 시각화 시험이다.
    // --------------------------------
const moonEffect =
    2.0 *
    Math.sin(this.moonLongitude);

this.longitude =
    this.referenceLongitude +
    THREE.MathUtils.degToRad(
        moonEffect
    );

this.updateAxis();

    }
  
    // ====================================
    // 현재 B축 경도
    // ====================================
    setMoonLongitude(longitude) {

    this.moonLongitude =
        THREE.MathUtils.degToRad(longitude);

}
 getLongitudeDegrees() {

    return THREE.MathUtils.radToDeg(
        this.longitude
    );
}


// ====================================
// 기준축과 B축의 각도 차이
// ====================================

getDifferenceFrom(referenceDegrees) {

    const bDegrees =
        this.getLongitudeDegrees();

    let difference =
        bDegrees - referenceDegrees;

    while (difference > 180) {
        difference -= 360;
    }

    while (difference < -180) {
        difference += 360;
    }

    return difference;
}

// ====================================
// B축 3D 방향벡터
// ====================================

getAxisVector() {

    const longitude =
        this.longitude;

    return new THREE.Vector3(
        Math.sin(longitude),
        0,
        Math.cos(longitude)
    ).normalize();
}
// ====================================
// B축과 황도면의 공간각
// ====================================

getEclipticAngle() {

    const b =
        this.getAxisVector();

    const e =
        THREE.MathUtils.degToRad(23.44);

    const normal =
        new THREE.Vector3(
            0,
            Math.cos(e),
            Math.sin(e)
        ).normalize();

    const dot =
        THREE.MathUtils.clamp(
            b.dot(normal),
            -1,
            1
        );

    const angleToNormal =
        Math.acos(dot);

    const angleToPlane =
        Math.PI / 2 -
        angleToNormal;

    return THREE.MathUtils.radToDeg(
        angleToPlane
    );
}

// ====================================
// B축 비교 상태
// ====================================

getComparison() {

    const bDegrees =
        this.getLongitudeDegrees();

    const referenceDegrees =
        THREE.MathUtils.radToDeg(
            this.referenceLongitude
        );

    return {

        B: bDegrees,

        reference:
            referenceDegrees,

        difference:
            this.getDifferenceFrom(
                referenceDegrees
            )
    };
}


// ====================================
// 상태 확인
// ====================================

getState() {

    return {
            longitude:
                this.getLongitudeDegrees(),

            referenceLongitude:
                THREE.MathUtils.radToDeg(
                    this.referenceLongitude
                ),

            response: {
                ...this.response
            }
        };
    }


    // ====================================
    // 라벨
    // ====================================

    createLabels() {

        // 현재 단계에서는
        // 축의 실제 라벨을 별도 UI에서 표시한다.
        // 이후 27°E / 153°W 및 B(t)를
        // 지구본에 직접 표시할 수 있다.

    }

}
