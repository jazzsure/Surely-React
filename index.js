import ReactDOM from './src/react-dom/index.js';
import React from './src/react/react.js';

class Welcome extends React.Component {
    render() {
        return <div><h1 onClick={this.click}>Hello, {this.props.name}</h1></div>;
    }
    click(){
        console.log('click')
    }
}
ReactDOM.render(
    <Welcome name="sarah"/>,
    document.getElementById( 'root' )
);