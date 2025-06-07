// ---- Library ----
const React = {
    createElement: (tag, props, ...children) => {
        if (typeof tag === 'function') {
            return tag(props, ...children)
        }


        const el = {
            tag,
            props,
            children
        }
        console.log(el);
        return el;
    }
};

const render = (el, container) => {
    let domEl;
    // 0. el의 유형을 확인합니다.
    // 문자열인 경우 텍스트 노드처럼 처리해야 합니다.
    if (typeof el === 'string') {
        domEl = document.createTextNode(el);
        container.appendChild(domEl);
        // 텍스트에 대한 자식이 없으므로 반환합니다.
        return;
    }


    // 1. 먼저 el에 해당하는 문서 노드를 만듭니다.
    domEl = document.createElement(el.tag);

    // 2. domEl에 속성 설정
    let elProps = el.props ? Object.keys(el.props) : null;
    if (elProps && elProps.length > 0) {
        elProps.forEach(prop => domEl[prop] = el.props[prop])
    }

    // 3. 자식 생성을 처리합니다.
    if (el.children && el.children.length > 0) {
        // 자식이 렌더링되면 컨테이너는 여기서 생성한 domEl이 된다.

        el.children.forEach((node) => render(node, domEl))
    }

    // 4. 컨테이너에 DOM 노드를 추가한다.
    container.appendChild(domEl);
}

// ---- Application ----

const App = () => {
    const myName = 'changwoo';
    return (
        <div draggable>
            <h2>hi {myName}!</h2>
            <p>i'm paragraph</p>
            <input type="text" />
        </div>)
}

render(<App />, document.getElementById('myapp'))