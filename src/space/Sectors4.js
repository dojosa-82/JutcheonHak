import * as THREE from "three";

export default class Sectors4 {

    constructor(scene) {

        // 지구본보다 아주 조금 크게
        const radius = 1.03;

        const material = new THREE.LineBasicMaterial({
            color: 0xffffff
        });

        // =====================================
        // 前 ↔ 後 : Z축
        // =====================================

        const frontBackGeometry =
            new THREE.BufferGeometry().setFromPoints([

                new THREE.Vector3(
                    0,
                    0,
                    -radius
                ),

                new THREE.Vector3(
                    0,
                    0,
                    radius
                )

            ]);

        const frontBackLine =
            new THREE.Line(
                frontBackGeometry,
                material
            );

        scene.add(frontBackLine);


        // =====================================
        // 左 ↔ 右 : X축
        // =====================================

        const leftRightGeometry =
            new THREE.BufferGeometry().setFromPoints([

                new THREE.Vector3(
                    -radius,
                    0,
                    0
                ),

                new THREE.Vector3(
                    radius,
                    0,
                    0
                )

            ]);

        const leftRightLine =
            new THREE.Line(
                leftRightGeometry,
                material
            );

        scene.add(leftRightLine);

    }

}