function createElement(tag, attrs, ...children){
    return {
        tag,
        attrs,
        children
    }
}
module.exports = createElement;