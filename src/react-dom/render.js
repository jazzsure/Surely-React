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

export function renderComponent(component){
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

function _render(vnode, container){
    if(typeof vnode.tag == 'function'){
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
