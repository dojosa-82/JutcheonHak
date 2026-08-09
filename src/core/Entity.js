export default class Entity{

    constructor(name){

        this.name = name;

        this.network = null;

    }

    setMang(mang){

        this.network = mang;

    }

}