import { renderComponent } from '../react-dom/render';

const stateQueue = [];
const renderQueue = [];

function defer( fn ) {
    return Promise.resolve().then( fn );
}

export function enqueState(newState, component){
    if(stateQueue.length == 0){
        defer(flush);
    }
    stateQueue.push({
        newState,
        component
    });
    if(!renderQueue.some(item => item === component)){
        renderQueue.push(component);
    }
}

function flush(){
    let item, component;
    while(item = stateQueue.shift()){
        const { newState, component} = item;
        if(!component.prevState){
            component.prevState = Object.assign({}, component.state);
        }
        Object.assign(component.state, newState);
        component.prevState = component.state;
    }
    while(component = renderQueue.shift()){
        renderComponent(component);
    }
}