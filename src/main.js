import Taegeuk from "./core/Taegeuk.js";
import Engine from "./core/Engine.js";
import Globe from "./globe/Globe.js";

const taegeuk = new Taegeuk();

const engine = new Engine(taegeuk);

engine.initialize();

new Globe();

console.log("주천학 엔진:", engine);

console.log("24산:", taegeuk.gyeol);