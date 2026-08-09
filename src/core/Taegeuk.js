import Gyeol from "./Gyeol.js";
import Mang from "./mang.js";
import Entity from "./Entity.js";
export default class Taegeuk {

    constructor() {

        this.name = "주천태극도";

        // 공간축(주)
        this.ju = [];

        // 시간축(후)
        this.hu = [];

        // 결
        this.gyeol = [];

        // 망
        this.mang = [];

        // 존재
        this.entities = [];

        // 중심
        this.origin = {
            x: 0,
            y: 0,
            z: 0
        };
    }

    initialize() {

        const g1 = new Gyeol("갑", 0, 0);
        const g2 = new Gyeol("자", 15, 0);

        g1.connect(g2);

        this.addGyeol(g1);
        this.addGyeol(g2);

        const mang = new Mang("갑자");

        mang.add(g1);
        mang.add(g2);

        this.addMang(mang);

        const entity = new Entity("갑자");

        entity.setMang(mang);

        this.addEntity(entity);

        console.log(this);
        console.log("주천태극도 초기화");
    }

    addJu(item) {
        this.ju.push(item);
    }

    addHu(item) {
        this.hu.push(item);
    }

    addGyeol(g) {
        this.gyeol.push(g);
    }

    addMang(m) {
        this.mang.push(m);
    }

    addEntity(e) {
        this.entities.push(e);
    }
}
