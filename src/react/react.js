
function createElement(tag, attrs, ...children){
    return {
        tag,
        attrs,
        children
    }
}
const React = {
    createElement
}

module.exports = React;