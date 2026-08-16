import * as THREE from 'three';

export default class CelestialAxis {

    constructor(scene, radius = 1.03) {

        this.scene = scene;
        this.radius = radius;

        // --------------------------------
        // 자오축 : 기준축
        // 子 ↔ 午
        // --------------------------------
        this.jaoAxis = {
            longitude: 0
        };

        // --------------------------------
        // 황도 경사각
        // 지구 적도면 기준 약 23.44°
        // --------------------------------
        this.obliquity =
            THREE.MathUtils.degToRad(23.44);

        // --------------------------------
        // 태양 : 體
        // --------------------------------
        this.sun = {
            longitude: 0,
            latitude: 0
        };

        // --------------------------------
        // 달 : 體
        // --------------------------------
        this.moon = {

            longitude: 0,
            latitude: 0
        };
        // --------------------------------
// 황도선
// --------------------------------

const points = [];

const segments = 128;

for (let i = 0; i <= segments; i++) {

    const longitude =
        (i / segments) *
        Math.PI * 2;

    const x =
    this.radius *
    Math.cos(longitude);

const y = 0;

const z =
    this.radius *
    Math.sin(longitude);

    points.push(
        new THREE.Vector3(
            x,
            y,
            z
        )
    );
}

const geometry =
    new THREE.BufferGeometry()
        .setFromPoints(points);

const material =
    new THREE.LineBasicMaterial({
        color: 0xffff00
    });

this.ecliptic =
    new THREE.Line(
        geometry,
        material
    );

this.scene.add(
    this.ecliptic
);
    }

    setSun(longitude, latitude = 0) {

        this.sun.longitude =
            THREE.MathUtils.degToRad(longitude);

        this.sun.latitude =
            THREE.MathUtils.degToRad(latitude);
    }

    setMoon(longitude, latitude = 0) {

        this.moon.longitude =
            THREE.MathUtils.degToRad(longitude);

        this.moon.latitude =
            THREE.MathUtils.degToRad(latitude);
    }

    getEclipticDifference(bLongitude) {

    const b =
        THREE.MathUtils.radToDeg(
            bLongitude
        );

    const ecliptic =
        THREE.MathUtils.radToDeg(
            this.obliquity
        );

    let difference =
        b - ecliptic;

    while (difference > 180) {
        difference -= 360;
    }

    while (difference < -180) {
        difference += 360;
    }

    return difference;
}
    getState() {

        return {
            sun: { ...this.sun },
            moon: { ...this.moon },

            jaoAxis:
                this.jaoAxis.longitude,

            obliquity:
                this.obliquity
        };
    }
}
