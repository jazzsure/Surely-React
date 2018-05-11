import {renderComponent} from '../react-dom/render.js';
import {enqueState} from './batch-update.js';


export default class Component{
    constructor(props = {}){
        this.state = {};
        this.props = props;
    }
    setState(newState){
        enqueState(newState, this);
    }
}