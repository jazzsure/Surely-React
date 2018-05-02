const ReactDOM = {
    render(vnode, container){
        container.innerHTML = "";
        render(vnode, container);
    }
};
function render(vnode, container){
    if(typeof vnode == "string"){
        let textNode = document.createTextNode(vnode);
        return container.appendChild(textNode);
    }
    const dom = document.createElement(vnode.tag);
    if(vnode.attrs){
       Object.keys(vnode.attrs).forEach(key => {
           setAttribute(dom, key, vnode.attrs[key]);
       });
    }
    vnode.children.forEach(child => render(child, dom));
    return container.appendChild(dom);
}

function setAttribute(dom, name, value){
    if(name == 'className') name = 'class';
    if(/on\w+/.test(name)){
        name = name.toLowerCase();
        dom[name] = value || '';
    } else if(name == 'style'){
        if(!value || typeof style == 'string'){
            dom.style.cssText = value || '';
        } else if(value && typeof value == "object"){
            for(let name in value){
                dom.style[name] = typeof value[name] == 'number' ? value[name] + 'px' : value[name];
            }
        }
    } else {
        if(name in dom){
            dom.setAttribute(name, value || '');
        }
    }
}
module.exports = ReactDOM;