import {renderComponent} from '../react-dom/render.js';
export default class Component{
    constructor(props = {}){
        this.state = {};
        this.props = props;
    }
    setState(newState){
        Object.assign(this.state, newState);
        renderComponent(this);
    }
}