import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Axis from "./Axis.js";

export default class Globe{

    constructor(){

        this.scene=new THREE.Scene();

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

        this.scene.add(this.sphere);

        new Axis(this.scene);

        this.animate();

    }

    animate=()=>{

        requestAnimationFrame(this.animate);

        this.controls.update();

        this.sphere.rotation.y+=0.002;

        this.renderer.render(
            this.scene,
            this.camera
        );

    }

}