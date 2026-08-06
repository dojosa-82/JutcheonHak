# 周天學 (JutcheonHak)

## The Official Research Repository of JutcheonHak

**Founder:** 도조사

---

## Philosophy

주천학은 공간(주)과 시간(후)의 순환 원리를 연구하는 통합 학문이다.

주천은 행(行)이다.

행은 억지로 이루어지는 것이 아니라, 본성에 따라 자연스럽게 이루어진다.

행은 공간과 시간을 만들고,

공간과 시간의 만남은 결(結)을 만든다.

결은 화합과 불화를 이루며,

화합은 존속과 성장을,

불화는 새로운 순환을 만든다.

---

## Objectives

주천학은 다음의 모든 체계를 하나의 시공간 좌표계 위에서 통합하는 것을 목표로 한다.

- 24주
- 24절기
- 72룡
- 72후
- 60갑자
- 64괘
- 6효
- 사주
- 풍수
- 오행
- 신살

---

## Vision

One Coordinate.

One Principle.

One Universe.

Version 0.1.0

<img width="1536" height="1024" alt="주천학 대통합 대주천도 마스터 다이어그램" src="https://github.com/user-attachments/assets/f2510094-265e-4b45-b019-1629d0c01f73" />
index.html

                주천태극도
             (Core Principle)

                    │
─────────────────────────────────

            4D Coordinate Engine

        주(공간)     후(시간)

─────────────────────────────────

              결 Engine

─────────────────────────────────

              망 Engine

─────────────────────────────────

        Rendering Engine (Three.js)

─────────────────────────────────

       사주
       풍수
       절기
       72후
       72룡
       주역
       신살
css/
    style.css

js/

core/
    taegeuk.js
    juEngine.js
    huEngine.js
    gyeolEngine.js
    mangEngine.js

globe/
    globe.js
    grid.js
    sphere.js

systems/
    saju.js
    pungsu.js
    iching.js
    solar24.js
    dragon72.js
    husi72.js
    sinsal.js

data/
    gapja.json
    solar24.json
    dragon72.json
    husi72.json

    class Taegeuk{

    constructor(){

        this.gyeol=[];

        this.mang=[];

    }
}

class Taegeuk{

    constructor(){

        this.gyeol=[];

        this.mang=[];

    }
}

class Gyeol{

    constructor(ju,hu){

        this.ju=ju;

        this.hu=hu;

        this.mang=[];

    }
}

class Mang{

    constructor(){

        this.entities=[];

    }
}

let universe=new Taegeuk();

for(let i=0;i<24;i++){

    universe.ju.push(i);

}
for(let i=0;i<24;i++){

    universe.hu.push(i);

}
for(let j of universe.ju){

    for(let h of universe.hu){

        universe.gyeol.push(new Gyeol(j,h));

    }

}
const sphere=new THREE.Mesh(

    new THREE.SphereGeometry(10,128,128),

    material

);

scene.add(sphere);
for(let g of universe.gyeol){

    createNode(g);

}
click

↓

결 선택

↓

망 생성

↓

사주 출력

↓

풍수 출력

↓

주역 출력

↓

절기 출력
