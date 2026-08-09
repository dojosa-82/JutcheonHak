import * as THREE from "three";

export default class Axis {

    constructor(scene){

        // 주축(공간축) - 파랑
        const geo1 = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0,-2,0),
            new THREE.Vector3(0,2,0)
        ]);

        const mat1 = new THREE.LineBasicMaterial({
            color:0x0088ff
        });

        const ju = new THREE.Line(geo1,mat1);

        scene.add(ju);


        // 후축(시간축) - 빨강
        const geo2 = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-2,0,0),
            new THREE.Vector3(2,0,0)
        ]);

        const mat2 = new THREE.LineBasicMaterial({
            color:0xff0000
        });

        const hu = new THREE.Line(geo2,mat2);

        scene.add(hu);

    }

}