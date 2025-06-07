- [1장 VirtualDOM & Renderer](https://geekpaul.medium.com/lets-build-a-react-from-scratch-part-1-virtualdom-and-renderer-14f4f716de62)
- [2장 State Management & Hooks](https://geekpaul.medium.com/lets-build-a-react-from-scratch-part-2-state-management-and-react-hooks-e771c5c06066)
- [3장 React Suspence & Concurrent Mode](https://geekpaul.medium.com/lets-build-a-react-from-scratch-part-3-react-suspense-and-concurrent-mode-5da8c12aed3f)
- [4장 Server Side Rendering](https://geekpaul.medium.com/lets-build-a-react-from-scratch-part-4-server-side-rendering-and-its-challenges-b7b87c84bbf)


# Part1 - VirtualDom and Renderer
## Overview
### 1. JSX와 React.createElement
JSX는 실제로 React.createElemnt() 함수 호출로 변환된다.
```javascript
<div>Hello</div> 
// ↓ 컴파일 후
React.createElement('div', null, 'Hello')
```

createElement 함수는 다음 매개변수를 받는다.
- 태그 이름 또는 컴포넌트 함수
- 속성(props) 객체
- 자식 요소들(children)

### 2. 가상 DOM(Virtual DOM)
가상 DOM은 실제 DOM 구조를 표현하는 JS 객체이다.
```javascript
const el = {
  tag: 'div',  // HTML 태그 이름
  props: { draggable: true },  // 요소의 속성들
  children: []  // 자식 요소들
};
```

### 3. React 컴포넌트
두 가지 형태의 React 요소가 있다.
- ReactElement : 직접적인 DOM 트리(정적)
- ReactComponent : DOM을 반환하는 함수(동적)
```javascript
// 컴포넌트 함수 처리
if (typeof tag === 'function') {
  return tag(props, ...children);
}
```

### 4. Renderer 구현
```javascript
const render = (el, container) => {
  // 텍스트 노드 처리
  if (typeof el === 'string') {
    domEl = document.createTextNode(el);
    container.appendChild(domEl);
    return;
  }
  
  // 1. 요소 노드 생성
  domEl = document.createElement(el.tag);
  
  // 2. 속성 설정
  if (elProps && elProps.length > 0) {
    elProps.forEach(prop => domEl[prop] = el.props[prop]);
  }
  
  // 3. 자식 요소 재귀적 처리
  if (el.children && el.children.length > 0) {
    el.children.forEach(node => render(node, domEl));
  }
  
  // 4. 컨테이너에 추가
  container.appendChild(domEl);
};
```
이 Render Function은 가상DOM(JSX로 정의된 구조)을 실제DOM(브라우저가 그리는 요소)로 변환하는 과정이다. 실제 React에서는 이 과정이 훨씬 복잡하며, 최적화를 위한 여러 단계가 있다.
Render Function을 사용하는 이유는 React에서 구현하는 가상 DOM은 브라우저가 해석할 수 없기 때문에, 이를 실제 DOM에 반영하기 위해서이다.


## What I Learned
- HTML문서에서 el 노드와 text 노드가 나눠지는 것으로 알고 있는데, react의 renderer에서도 이 부분을 고려하고 있다는 것을 알 수 있었다. 텍스트 노드의 경우 태그 이름과 속성이 없는 단순 문자열이며 그 생성 방법이 일반 노드와 다르기에, renderer에서도 이 부분을 고려하고 있는 것 같다.
- React 구현이라곤 하지만 실제론 JSX가 하는 역할이 매우 크며, 사실상 JSX/TSX를 사용하는 순간부터 이미 리액트 노드로 완성되어 있다고 보는 것이 좋을 것 같다. renderer는 단순히 이를 실제 DOM에 그려줄 뿐, React를 더 자세히 알고 싶다면 결국은 JSX를 뜯어 봐야겠다.
- React가 Virtual DOM을 사용하는 이유는 결국 Reconiliation(Diffing)을 효율적으로 하기 위함이라고 생각하는데, 이 부분에 대한 내용이 없어서 조금 아쉬웠다. 현재는 레거시가 되었지만 클래스형 컴포넌트에 대한 내용도 설명이 없었던 게 아쉬워서 이 부분은 따로 더 찾아봐야 할 것 같다.