export default class Gyeol {

    constructor(id, space, time) {

        this.id = id;

        this.space = space;

        this.time = time;

        this.yinyang = "";

        this.element = "";

        this.energy = 0;

        this.links = [];

        this.position = {

            x: 0,
            y: 0,
            z: 0

        };

        this.type = "";

        this.index = null;

    }

    connect(gyeol) {

        this.links.push(gyeol);

    }

}