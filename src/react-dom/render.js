import setAttribute from './dom';

function createComponent(component, props){
    let inst;
    //如果是类定义组件，则直接返回实例
    if(component.prototype && component.prototype.render){
        inst = new component(props);
    //如果是函数定义组件，则将其扩展为类定义组件// todo觉得有点问题，要找case调试下
    } else {
        inst = new component(props);
        inst.constructor = component;
        inst.render = function(){
            return this.constructor(props);
        }
    }
    return inst;
}

function setComponentProps(component, props){
    if ( !component.base ) {
        if ( component.componentWillMount ) component.componentWillMount();
    } else if ( component.componentWillReceiveProps ) {
        component.componentWillReceiveProps( props );
    }
    component.props = props;
    renderComponent( component );
}

function diff(dom, vnode){ 
    //console.log('diff', dom, vnode)
    let out = dom;
    if ( vnode === undefined || vnode === null || typeof vnode === 'boolean' ) vnode = '';
    if ( typeof vnode === 'number' ) vnode = String( vnode );
    // diff text node
    if ( typeof vnode === 'string' ) {
        // 如果当前的DOM就是文本节点，则直接更新内容
        if ( dom && dom.nodeType === 3 ) {    // nodeType: https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
            if ( dom.textContent !== vnode ) {
                dom.textContent = vnode;
            }
        // 如果DOM不是文本节点，则新建一个文本节点DOM，并移除掉原来的
        } else {
            out = document.createTextNode( vnode );
            if ( dom && dom.parentNode ) {
                dom.parentNode.replaceChild( out, dom );
            }
        }
        //return out;
    }
    
    if ( typeof vnode.tag === 'function' ) {
       diffComponent(dom, vnode);
    }

     //
    if ( !dom || !isSameNodeType( dom, vnode ) ) {
        out = document.createElement( vnode.tag );

        if ( dom ) {
            [ ...dom.childNodes ].map( out.appendChild );    // 将原来的子节点移到新节点下

            if ( dom.parentNode ) {
                dom.parentNode.replaceChild( out, dom );    // 移除掉原来的DOM对象
            }
        }
    }

    if ( (vnode.children && vnode.children.length) || (out.childNodes && out.childNodes.length) ) {
        diffChildren( out, vnode.children );
    }

    //diffAttributes( out, vnode );
}

function diffComponent( dom, vnode ) {

    let c = dom && dom._component;
    let oldDom = dom;

    // 如果组件类型没有变化，则重新set props
    if ( c && c.constructor === vnode.tag ) {
        setComponentProps( c, vnode.attrs );
        //dom = c.base;
    // 如果组件类型变化，则移除掉原来组件，并渲染新的组件
    } else {

        if ( c ) {
            unmountComponent( c );
            oldDom = null;
        }

        c = _render( vnode );

        setComponentProps( c, vnode.attrs );
        //dom = c.base;

        if ( oldDom && dom !== oldDom ) {
            oldDom._component = null;
            removeNode( oldDom );
        }

    }

}

function diffChildren( dom, vchildren ) {

    const domChildren = dom.childNodes;
    const children = [];

    const keyed = {};

    if ( domChildren.length > 0 ) {
        for ( let i = 0; i < domChildren.length; i++ ) {
            const child = domChildren[ i ];
            const key = child.key;
            if ( key ) {
                keyed[ key ] = child;
            } else {
                children.push( child );
            }
        }
    }

    if ( vchildren && vchildren.length > 0 ) {

        let min = 0;
        let childrenLen = children.length;

        for ( let i = 0; i < vchildren.length; i++ ) {

            const vchild = vchildren[ i ];
            const key = vchild.key;
            let child;

            if ( key ) {

                if ( keyed[ key ] ) {
                    child = keyed[ key ];
                    keyed[ key ] = undefined;
                }

            } else if ( min < childrenLen ) {

                for ( let j = min; j < childrenLen; j++ ) {

                    let c = children[ j ];

                    if ( c && isSameNodeType( c, vchild ) ) {

                        child = c;
                        children[ j ] = undefined;

                        if ( j === childrenLen - 1 ) childrenLen--;
                        if ( j === min ) min++;
                        break;

                    }
                }
            }

            child = diff( child, vchild );

            const f = domChildren[ i ];
            if ( child && child !== dom && child !== f ) {
                if ( !f ) {
                    dom.appendChild(child);
                } else if ( child === f.nextSibling ) {
                    removeNode( f );
                } else {
                    dom.insertBefore( child, f );
                }
            }

        }
    }

}

function isSameNodeType( dom, vnode ) {
    if ( typeof vnode === 'string' || typeof vnode === 'number' ) {
        return dom.nodeType === 3;
    }

    if ( typeof vnode.tag === 'string' ) {
        return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase();
    }

    return dom && dom._component && dom._component.constructor === vnode.tag;
}

function unmountComponent( component ) {
    if ( component.componentWillUnmount ) component.componentWillUnmount();
    removeNode( component.base);
}

function removeNode( dom ) {

    if ( dom && dom.parentNode ) {
        dom.parentNode.removeChild( dom );
    }

}

export function renderComponent(component){
    if(component.base){ 
        diff(component.base, component.render()); 
    } else {
        let base;
        const renderer = component.render();
        if(component.base && component.componentWillUpdate){
            component.componentWillUpdate();
        }
        base = _render(renderer);
        if(component.base){
            if(component.componentDidUpdate) component.componentDidUpdate();
        } else if(component.componentDidMount){
            Promise.resolve().then(()=>{component.componentDidMount()});
        }
        if ( component.base && component.base.parentNode ) {
            component.base.parentNode.replaceChild( base, component.base );
        } 
        component.base = base;
        base._component = component;
    }
}

function _render(vnode, container, oldDom){
    if(vnode && typeof vnode.tag == 'function'){
        const component = createComponent(vnode.tag, vnode.attrs);
        setComponentProps(component, vnode.attrs);
        return container ? container.appendChild(component.base) : component.base ;
    }
    if ( vnode === undefined || vnode === null || typeof vnode === 'boolean' ) vnode = '';
    if ( typeof vnode === 'number' ) vnode = String( vnode );
    if(typeof vnode == "string"){
        let textNode = document.createTextNode(vnode);
        return container ? container.appendChild(textNode) : textNode;
    }
    const dom = document.createElement(vnode.tag);
    if(vnode.attrs){
       Object.keys(vnode.attrs).forEach(key => {
           setAttribute(dom, key, vnode.attrs[key]);
       });
    }
    vnode.children.forEach(child => _render(child, dom));
    return container ? container.append(dom) : dom;
}

export function render(vnode, container){
    container.innerHTML = "";
    container.appendChild(_render(vnode));
}
