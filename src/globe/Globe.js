import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Axis from "./Axis.js";
import Sectors4 from "../space/Sectors4.js";
import BalanceAxis from "../space/BalanceAxis.js";
import CelestialAxis from "../space/CelestialAxis.js";
import GanGonAxis from "../space/GanGonAxis.js";
import NaturalFlow from "../space/NaturalFlow.js";
import WonsangEngine from "../core/WonsangEngine.js";
export default class Globe{

    constructor(){ 

                console.log("=== GLOBE CONSTRUCTOR START ===");

        this.wonsangEngine =
            new WonsangEngine();

        const jin =
            this.wonsangEngine.createTaijiState(
                "震"
            );

        this.wonsangEngine.applyEncounter(
            jin,
            "離"
        );
        
        this.wonsangEngine.applyEncounter(
            jin,
           "兌"
        );

        this.wonsangEngine.applyEncounter(
            jin,
           "巽"
        );

      console.log(
            "=== 震 → 離 → 兌 → 巽 TEST ==="
        );

        console.log(
            jin
        );
        this.scene=new THREE.Scene();
 
        this.earthGroup =
    new THREE.Group();

this.scene.add(
    this.earthGroup
);

this.earthGroup.rotation.z =
    THREE.MathUtils.degToRad(23.44);

console.log(
    "EarthTilt:",
    THREE.MathUtils.radToDeg(
        this.earthGroup.rotation.z
    ).toFixed(3),
    "deg"
);
    THREE.MathUtils.degToRad(23.44);
    console.log(
    "EarthTilt:",
    THREE.MathUtils.radToDeg(
        this.earthGroup.rotation.z
    ).toFixed(3),
    "deg"
);
        this.camera=new THREE.PerspectiveCamera(
            60,
            window.innerWidth/window.innerHeight,
            0.1,
            1000
        );

        this.camera.position.set(0,0,3);

        this.renderer=new THREE.WebGLRenderer({
            antialias:true
        });

        this.renderer.setSize(window.innerWidth,window.innerHeight);

        document.body.appendChild(this.renderer.domElement);
         window.addEventListener(
    "resize",
 
    this.onResize
 ); 
        this.controls=new OrbitControls(
            this.camera,
            this.renderer.domElement
        );

        this.controls.enableDamping=true;

        const geometry=new THREE.SphereGeometry(1,64,64);

        const material=new THREE.MeshBasicMaterial({

            color:0x00ffff,

            wireframe:true

        });

        this.sphere=new THREE.Mesh(
            geometry,
            material
        );

        this.earthGroup.add(
    this.sphere
);

       new Axis(
    this.earthGroup
);

this.balanceAxis =
    new BalanceAxis(
        this.earthGroup
    );
this.ganGonAxis =
    new GanGonAxis(
        this.earthGroup
    );
        this.naturalFlow =
    new NaturalFlow();

this.naturalFlow.testFlow();
this.wonsangEngine =
    new WonsangEngine();

this.naturalFlow =
    new NaturalFlow();

this.wonsangEngine
    .registerMeasurementModule(
        "NaturalFlow",
        this.naturalFlow
    );

const naturalResult =
    this.naturalFlow.testFlow();

const measurement =
    this.wonsangEngine
        .receiveSixDirectionMeasurement(
            "乾候補-北風",
            naturalResult
        );

this.wonsangEngine
    .analyzeWonsang(
        measurement
    );
this.balanceAxis.setMoonLongitude(0);

new CelestialAxis(this.scene);
       
        this.animate();

    }
onResize = () => {

    this.camera.aspect =
        window.innerWidth / window.innerHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

}
    animate=()=>{

        requestAnimationFrame(this.animate);

        this.controls.update();

       // this.sphere.rotation.y += 0.002;
        
        const time =
    performance.now() / 1000;

const moonLongitude =
    (time * 13.176) % 360;

this.balanceAxis.setMoonLongitude(
    moonLongitude
); 
        this.balanceAxis.update(0.016);

        const comparison =
    this.balanceAxis.getComparison();

    const eclipticAngle =
    this.balanceAxis.getEclipticAngle();



console.log(
    "B:",
    comparison.B.toFixed(3),
    "deg | dB:",
    comparison.difference.toFixed(3),
    "deg | EclipticAngle:",
    eclipticAngle.toFixed(3),
    "deg"
);

this.renderer.render(
    this.scene,
    this.camera
);

}

}