import ReactDOM from './src/react-dom/index.js';
import React from './src/react/react.js';

class Welcome extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: 'a'
        };
        //['click'].forEach(fn => this[fn] = this[fn].bind(this));
    }
    render() {
        return <div>
            <h1>Hello, {this.props.name}</h1>
            <h1 onClick={this.click}>Hello, {this.state.name}</h1>
        </div>;
    }
    // click(){
    //     this.setState({name: "shirly"}); 
    // }
    componentDidMount(){
        //console.log('Welcome did mount');
    }
    componentWillMount(){
        //console.log('componentWillMount')
    }
    componentWillReceiveProps(){
        //console.log('componentWillReceiveProps')
    }
    componentWillUpdate(){
        //console.log('componentWillUpdate')
    }
    componentDidUpdate(){
        //console.log('componentDidUpdate')
    }
}
class Hi extends React.Component {
    constructor(props){
        super(props);
        this.state = {name: 'sarah'};
        ['click'].forEach(fn => this[fn] = this[fn].bind(this));
    }
    click(){
        this.setState({name: "shirly"}); 
    }
    componentDidMount(){
        //console.log('Hi did mount');
    }

    render() {
        return <div onClick={this.click}>
             <Welcome name={this.state.name}/>
        </div>;
    }
    
}
ReactDOM.render(
    <Hi/>,
    document.getElementById( 'root' )
);