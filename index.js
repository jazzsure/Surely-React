import ReactDOM from './src/react-dom/index.js';
import React from './src/react/react.js';

class Welcome extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: 'a'
        };
        ['click'].forEach(fn => this[fn] = this[fn].bind(this));
    }
    render() {
        return <div>
            <h1>Hello, {this.props.name}</h1>
            <h1 onClick={this.click}>Hello, {this.state.name}</h1>
        </div>;
    }
    click(){
        this.setState({name: "shirly"}); 
    }
}
ReactDOM.render(
    <Welcome name="sarah"/>,
    document.getElementById( 'root' )
);