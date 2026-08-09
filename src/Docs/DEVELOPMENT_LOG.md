# 주천학 4D 지구본 마스터 시스템 개발 기록

## 2026-08-09 — 4D 지구본 실행 복구

### 1. 개발 환경 확인

* OS: Windows
* Node.js: v24.19.0
* npm: v11.17.0
* Vite: v8.2.1
* Three.js: v0.185.1
* 프로젝트: `JutcheonHak`

Vite 개발 서버가 정상적으로 실행됨.

```text
VITE v8.2.1 ready
Local: http://localhost:5173/
```

---

## 2. 최초 문제

Vite 서버는 정상적으로 실행되었으나 브라우저에서 주천학 4D 지구본이 표시되지 않고 빈 화면이 나타남.

초기에는 `Globe.js`의 Three.js 렌더링 구조를 조사함.

### Globe.js의 기본 구조

```text
Scene
Camera
WebGLRenderer
OrbitControls
SphereGeometry
Mesh
Axis
Animation
renderer.render()
```

위 구성은 정상적으로 존재했음.

---

## 3. 실제 실행 오류 발견

브라우저 Console에서 다음 오류를 확인함.

```text
Taegeuk.js:33
Uncaught ReferenceError: Gyeol is not defined
```

실행 경로:

```text
main.js
  ↓
Engine.initialize()
  ↓
Taegeuk.initialize()
  ↓
Gyeol is not defined
```

이 때문에 `new Globe()`까지 실행되지 않아 빈 화면이 발생했음.

---

## 4. Gyeol 연결 복구

`src/core` 폴더에 이미 다음 파일이 존재했음.

```text
Gyeol.js
```

그러나 `Taegeuk.js`에서 이를 import하지 않고 있었음.

다음 import를 추가하여 연결함.

```js
import Gyeol from "./Gyeol.js";
```

---

## 5. Mang 연결

`src/core`에 다음 파일도 존재함.

```text
mang.js
```

`Taegeuk.js`에서 `Mang`을 사용하고 있으므로 다음 연결을 추가함.

```js
import Mang from "./mang.js";
```

---

## 6. Entity 연결

Gyeol 연결 후 다음 오류가 발생함.

```text
Taegeuk.js:50
Uncaught ReferenceError: Entity is not defined
```

`src/core/Entity.js`가 이미 존재했으므로 새 파일을 만들지 않고 기존 파일을 연결함.

```js
import Entity from "./Entity.js";
```

---

## 7. 최종적인 Taegeuk.js 모듈 연결

현재 `Taegeuk.js`의 핵심 import 구조:

```js
import Gyeol from "./Gyeol.js";
import Mang from "./mang.js";
import Entity from "./Entity.js";
```

이를 통해 기존 주천학 객체 구조를 유지하면서 모듈 간 연결을 복구함.

---

## 8. 4D 지구본 실행 성공

오류 수정 후 다음 실행 구조가 정상적으로 작동함.

```text
Taegeuk
   ↓
Engine
   ↓
Taegeuk.initialize()
   ↓
Gyeol
   ↓
Mang
   ↓
Entity
   ↓
Globe
   ↓
Three.js Renderer
   ↓
3D 지구본 표시
```

따라서 **주천학 4D 지구본의 최초 실행 기반이 정상적으로 복구됨.**

---

## 9. 화면 크기 문제 조사

실행 후 지구본의 화면 크기가 작게 보이는 현상을 조사함.

`Globe.js`에는 이미 다음 코드가 존재함.

```js
this.renderer.setSize(
    window.innerWidth,
    window.innerHeight
);
```

브라우저 Console에서 확인한 결과 개발자 도구가 열린 상태에서는 `window.innerWidth`가 약 387~419px까지 감소함.

개발자 도구를 닫으면 지구본 화면이 정상적인 크기로 표시됨.

따라서 이 현상은 Three.js 지구본 자체의 렌더링 오류가 아니라 **개발자 도구가 브라우저 viewport를 좁혀 발생하는 현상**으로 판단함.

---

## 10. 현재 정상 상태

현재 확인된 상태:

```text
Node.js              정상
npm                  정상
Vite                 정상
Three.js              정상
Taegeuk              정상
Gyeol                정상
Mang                 정상
Entity               정상
Engine               정상
Globe                정상
Three.js Sphere      정상
Animation            정상
지구본 표시          성공
```

---

## 11. 향후 개발 방향

현재의 3D 지구본은 주천학 4D 지구본 마스터 시스템의 **시각적 기반 엔진**으로 사용한다.

향후 다음 요소를 단계적으로 통합한다.

### 공간 좌표

* 3D 구면좌표
* 천·지·인
* 24산
* 72룡
* 방위
* 풍수 좌표

### 시간 좌표

* 24절기
* 60갑자
* 60년 주기
* 120년 변화
* 360년 대주천

### 주천학 핵심 구조

```text
태극
 ↓
결
 ↓
망
 ↓
현상
 ↓
공간과 시간의 전개
```

### 통합 대상

```text
사주
풍수
주역
절기
오행
신살
24산
24절기
60갑자
괘
천·지·인
```

이 모든 요소를 하나의 **주천학 4D 지구본 좌표계** 안에서 통합하는 것을 장기적인 목표로 한다.

---

## 12. 개발 원칙

주천학 4D 지구본 마스터 시스템은 한 번에 모든 기능을 구현하지 않는다.

다음 순서로 발전시킨다.

```text
1. 실행 기반 안정화
2. 객체 구조 정리
3. 좌표계 정의
4. 시간축 정의
5. 태극·결·망 구조 구현
6. 24산·24절기 구현
7. 60갑자·괘 구현
8. 사주·풍수·주역 통합
9. 4D 시각화
10. 주천학 마스터 시스템 완성
```

**기록 원칙:** 기존의 개념과 코드를 임의로 삭제하지 않고, 발견 → 검증 → 수정 → 기록의 순서로 발전시킨다.

---

## 13. 현재의 의미

이번 작업을 통해 `JutcheonHak` 프로젝트는 단순한 화면 제작을 넘어,

**주천학의 이론 구조를 실제 소프트웨어 객체와 공간·시간 좌표계로 구현하는 단계**

에 들어섰다.

2026-08-09
주천학 4D 지구본 마스터 시스템 개발 기록

