import ReactDOM from './src/react-dom/reactdom.js';
import React from './src/react/react.js';

const element = (
    <div>
        <h1>Hello, Myreact</h1>
    </div>
);
ReactDOM.render(
    element,
    document.getElementById( 'root' )
);