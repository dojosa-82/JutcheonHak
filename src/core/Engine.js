import Gyeol from "./Gyeol.js";
import Mang from "./Mang.js";
import Entity from "./Entity.js";
import Mountain24 from "../space/Mountain24.js";

export default class Engine {

    constructor(taegeuk) {

        this.taegeuk = taegeuk;

        this.mountain24 = new Mountain24();
    }

    initialize() {

        console.log("Engine 시작");

        this.taegeuk.initialize();

        this.load24Mountain();

        this.load24Solar();

        this.load72Dragon();

        this.load72Hou();

        this.load60Ganji();
    }

    // =========================
    // 결 생성
    // =========================

    createGyeol(id, space, time) {

        const g = new Gyeol(id, space, time);

        this.taegeuk.addGyeol(g);

        return g;
    }

    // =========================
    // 망 생성
    // =========================

    createMang(name, gyeols) {

        const mang = new Mang(name);

        for (const g of gyeols) {

            mang.add(g);
        }

        this.taegeuk.addMang(mang);

        return mang;
    }

    // =========================
    // 존재 생성
    // =========================

    createEntity(name, mang) {

        const entity = new Entity(name);

        entity.setMang(mang);

        this.taegeuk.addEntity(entity);

        return entity;
    }

    // =========================
    // 24산
    // =========================

    load24Mountain() {

        const mountains = this.mountain24.generate();

        console.log("24산 생성");

        for (const m of mountains) {

            const g = this.createGyeol(
                m.name,
                m.angle,
                0
            );

            g.position = {

                x: m.x,
                y: m.y,
                z: m.z

            };

            g.type = "24산";

            g.index = m.id;
        }

        console.table(mountains);

        return mountains;
    }

    // =========================
    // 24절기
    // =========================

    load24Solar() {

        console.log("24절기 생성");
    }

    // =========================
    // 72룡
    // =========================

    load72Dragon() {

        console.log("72룡 생성");
    }

    // =========================
    // 72후
    // =========================

    load72Hou() {

        console.log("72후 생성");
    }

    // =========================
    // 60갑자
    // =========================

    load60Ganji() {

        console.log("60갑자 생성");
    }
}