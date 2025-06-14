# Part2 - State Management & React Hooks

## 1. React의 목적과 상태 관리

React는 UI 컴포넌트를 만들 뿐만 아니라, **동적인 상태(state)를 관리**하고, 상태가 바뀌면 UI를 자동으로 업데이트해주는 것이 핵심 목적이다.  
이 파트에서는 React의 핵심 기능인 **useState 훅**과 **상태 변화에 따른 리렌더링**의 원리를 직접 구현해본다.

---

## 2. useState 훅의 기본 구조

```javascript
const useState = (initialState) => {
  let state = initialState;
  const setState = (newState) => (state = newState);
  return [state, setState];
};
```

- `useState`는 초기값을 받아 `[상태, 상태변경함수]`를 반환한다.
- 실제 React에서는 여러 상태를 관리해야 하므로, **상태 배열과 커서**를 사용한다.

---

## 3. 상태 배열과 커서 방식

여러 개의 상태를 관리하기 위해, 전역 배열과 커서를 사용한다.

```javascript
const myAppState = [];
let myAppStateCursor = 0;

const useState = (initialState) => {
  const stateCursor = myAppStateCursor;
  myAppState[stateCursor] = myAppState[stateCursor] || initialState;
  const setState = (newState) => {
    myAppState[stateCursor] = newState;
    reRender();
  };
  myAppStateCursor++;
  return [myAppState[stateCursor], setState];
};
```

- 각 useState 호출마다 커서를 증가시켜, 여러 상태를 순서대로 관리한다.
- setter 함수는 클로저로 자신의 인덱스를 기억한다.

---

## 4. 리렌더링(reRender) 구현

상태가 바뀌면 전체 UI를 다시 그려야 한다.  
간단한 리렌더 함수는 다음과 같다.

```javascript
const reRender = () => {
  const rootNode = document.getElementById("myapp");
  rootNode.innerHTML = "";
  myAppStateCursor = 0;
  render(<App />, rootNode);
};
```

- 렌더 전 DOM을 비우고, 커서를 0으로 초기화하여 상태 배열을 올바르게 참조하게 한다.

---

## 5. 이벤트 핸들러와 상태 변화

컴포넌트에서 상태를 변경하는 예시:

```javascript
const App = () => {
  const [name, setName] = useState("Arindam");
  const [count, setCount] = useState(0);
  return (
    <div>
      <input value={name} onchange={(e) => setName(e.target.value)} />
      <button onclick={() => setCount(count + 1)}>+1</button>
      <button onclick={() => setCount(count - 1)}>-1</button>
      <h2>카운터 값: {count}</h2>
    </div>
  );
};
```

- 상태가 바뀌면 `setState`가 호출되고, `reRender`로 전체 UI가 갱신된다.

---

## 6. Hooks의 규칙이 필요한 이유

- useState를 조건문이나 반복문 안에서 사용하면, 커서와 상태 배열의 순서가 꼬여서 버그가 발생한다.
- **항상 컴포넌트 최상위에서만 호출**해야 한다.

---

### What I Learned

- React의 useState는 상태 배열 + 커서 조합으로 동작한다. 이전에 클로저를 이용해서 useState를 구현하는 예시를 봤는데, 실제론 클로저는 setter 부분에서만 동작할 뿐 상태 배열과 커서를 사용하는 방식으로 구현되어 있었다.

```javascript
function createState(initial) {
  let state = initial;
  return [
    () => state, // getter
    (newState) => {
      state = newState;
      console.log("클로저로 상태 변경:", state);
    },
  ];
}

const [getName, setName] = createState("Arindam");
console.log(getName()); // "Arindam"
setName("Paul");
console.log(getName()); // "Paul"
```
