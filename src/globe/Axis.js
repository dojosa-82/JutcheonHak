import * as THREE from "three";

export default class Axis {

    constructor(scene) {

        const axisLength = 2;
        const jawuLength = 1.15;

        // ====================================
        // 子午축 : Y축
        // ====================================

        const geoJawu =
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(
                    0,
                    -jawuLength,
                    0
                ),
                new THREE.Vector3(
                    0,
                    jawuLength,
                    0
                )
            ]);

        const matJawu =
            new THREE.LineBasicMaterial({
                color: 0x0088ff
            });

        const jawu =
            new THREE.Line(
                geoJawu,
                matJawu
            );

        scene.add(jawu);


        // ====================================
        // 子午 양 끝점
        // ====================================

        const poleGeometry =
            new THREE.SphereGeometry(
                0.045,
                16,
                16
            );

        const poleMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x0088ff
            });


        // 子

        const n1 =
            new THREE.Mesh(
                poleGeometry,
                poleMaterial
            );

        n1.position.set(
            0,
            1.08,
            0
        );

        scene.add(n1);

        this.createPointLabel(
            "子",
            n1.position,
            scene
        );


        // 午

        const n2 =
            new THREE.Mesh(
                poleGeometry,
                poleMaterial.clone()
            );

        n2.position.set(
            0,
            -1.08,
            0
        );

        scene.add(n2);

        this.createPointLabel(
            "午",
            n2.position,
            scene
        );


        // ====================================
        // 左右 개발축
        // 현재 화면에서는 숨김
        // ====================================

        const geoLeftRight =
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(
                    -axisLength,
                    0,
                    0
                ),
                new THREE.Vector3(
                    axisLength,
                    0,
                    0
                )
            ]);

        const matLeftRight =
            new THREE.LineBasicMaterial({
                color: 0xff0000
            });

        const leftRight =
            new THREE.Line(
                geoLeftRight,
                matLeftRight
            );

        // scene.add(leftRight);


        // ====================================
        // 기본 Z 개발축
        // 실제 前後축은 BalanceAxis에서 생성
        // 현재 숨김
        // ====================================

        const geoFrontBack =
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(
                    0,
                    0,
                    -axisLength
                ),
                new THREE.Vector3(
                    0,
                    0,
                    axisLength
                )
            ]);

        const matFrontBack =
            new THREE.LineBasicMaterial({
                color: 0xff8800
            });

        const frontBack =
            new THREE.Line(
                geoFrontBack,
                matFrontBack
            );

        // scene.add(frontBack);


        // ====================================
        // 적도 원
        // ====================================

        const equatorPoints = [];

        const segments = 128;
        const radius = 1.03;

        for (
            let i = 0;
            i <= segments;
            i++
        ) {

            const angle =
                (Math.PI * 2 * i) /
                segments;

            equatorPoints.push(
                new THREE.Vector3(
                    radius *
                        Math.cos(angle),
                    0,
                    radius *
                        Math.sin(angle)
                )
            );
        }

        const equatorGeometry =
            new THREE.BufferGeometry()
                .setFromPoints(
                    equatorPoints
                );

        const equatorMaterial =
            new THREE.LineBasicMaterial({
                color: 0x00ff00
            });

        const equator =
            new THREE.Line(
                equatorGeometry,
                equatorMaterial
            );

        scene.add(equator);
    }


    // ====================================
    // 子午 글자 표시
    // ====================================

    createPointLabel(
        text,
        position,
        scene
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
            1.08
        );

        sprite.scale.set(
            0.22,
            0.11,
            1
        );

        scene.add(sprite);
    }

}