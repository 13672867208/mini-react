import ReactDom from './core/react-dom.js'
import React from './core/react.js'
// const App = React.creatElement('div',{id:'app'},'hiwq','mini-react')
import App  from './App.jsx'
console.log(123,ReactDom,App)
ReactDom.createRoot(document.getElementById('app')).render(App)
