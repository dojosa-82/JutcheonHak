export default class Mountain24 {

    constructor() {

        this.items = [];

    }

    generate() {

        // 이미 생성되어 있으면 중복 생성하지 않음
        if (this.items.length > 0) {
            return this.items;
        }

        const names = [
            "子", "癸", "丑",
            "艮", "寅", "甲",
            "卯", "乙", "辰",
            "巽", "巳", "丙",
            "午", "丁", "未",
            "坤", "申", "庚",
            "酉", "辛", "戌",
            "乾", "亥", "壬"
        ];

        const radius = 1;

        for (let i = 0; i < 24; i++) {

            const angle = i * 15;
            const rad = angle * Math.PI / 180;

            this.items.push({

                id: i,

                name: names[i],

                angle: angle,

                x: Math.cos(rad) * radius,

                y: 0,

                z: Math.sin(rad) * radius

            });

        }

        return this.items;
    }
}