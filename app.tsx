// ---- Library ----
let myAppState = [];
let myAppStateCursor = 0;

const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      return tag(props, ...children);
    }

    const el = {
      tag,
      props,
      children,
    };
    return el;
  },
};

const render = (el, container) => {
  let domEl;
  // 0. el의 유형을 확인합니다.
  // 문자열인 경우 텍스트 노드처럼 처리해야 합니다.
  if (typeof el === "string" || typeof el === "number") {
    domEl = document.createTextNode(String(el));
    container.appendChild(domEl);
    // 텍스트에 대한 자식이 없으므로 반환합니다.
    return;
  }

  // 1. 먼저 el에 해당하는 문서 노드를 만듭니다.
  domEl = document.createElement(el.tag);

  // 2. domEl에 속성 설정
  let elProps = el.props ? Object.keys(el.props) : null;
  if (elProps && elProps.length > 0) {
    elProps.forEach((prop) => (domEl[prop] = el.props[prop]));
  }

  // 3. 자식 생성을 처리합니다.
  if (el.children && el.children.length > 0) {
    // 자식이 렌더링되면 컨테이너는 여기서 생성한 domEl이 된다.

    el.children.forEach((node) => render(node, domEl));
  }

  // 4. 컨테이너에 DOM 노드를 추가한다.
  container.appendChild(domEl);
};

const useState = (initState) => {
  // 이 useState에 대한 커서를 가져온다.
  const stateCursor = myAppStateCursor;

  // AppState를 initState로 설정하기 전에 확인(reRender)
  myAppState[stateCursor] = myAppState[stateCursor] || initState;

  console.log(
    `useState는 커서 ${stateCursor}에서 값으로 초기화됩니다:`,
    myAppState
  );

  const setState = (newState) => {
    console.log(
      `setState는 커서 ${stateCursor}에서 newState 값으로 
        호출됩니다 :`,
      newState
    );
    myAppState[stateCursor] = newState;

    // 상태가 변경되면 UI를 리렌더링한다.
    reRender();
  };
  // 다음 상태를 위해 커서를 준비한다.
  myAppStateCursor++;
  console.log(`stateDump`, myAppState);

  return [myAppState[stateCursor], setState];
};

const reRender = () => {
  console.log("reRender-ing");
  const rootNode = document.getElementById("myapp");

  // 이미 렌더링 된 내용을 초기화
  rootNode.innerHTML = "";

  // 전역 상태 커서를 재설정
  myAppStateCursor = 0;

  // 그 후 렌더러 실행
  render(<App />, rootNode);
};

// ---- Application ----

const App = () => {
  const [name, setName] = useState("Arindam");
  const [count, setCount] = useState(0);
  return (
    <div draggable>
      <p>i'm {name}</p>
      <input
        type="text"
        value={name}
        onchange={(e) => setName(e.target.value)}
      />
      <h2>카운터 값 : {count}</h2>
      <button onclick={() => setCount(count + 1)}>+1</button>
      <button onclick={() => setCount(count - 1)}>-1</button>
    </div>
  );
};

render(<App />, document.getElementById("myapp"));
