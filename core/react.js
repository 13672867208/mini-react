console.log('hello  mini-react')
// const obj = {
//     type:,
//     props:{
//         children:[]
//     }
// }
function createElementText(text){
    return {
        type:'TEXT_CONTENT',
        props:{
            nodeValue:text,
            children:[]  
        }
        
    }
}

function createElement(type,props,...children){
    return {
        type,
        props:{
            ...props,
            children:children.map(e=>{
                console.log(e,'66555',typeof e)
               return typeof e==='string'?createElementText(e):e
            })
        }
        
    }
}
// 容器
function render(e,continer){
    const dom = e.type==='TEXT_CONTENT'?document.createTextNode(''):document.createElement(e.type)
    Object.keys(e.props).forEach(item=>{
        if(item!=='children'){
            dom[item]=e.props[item]
        }
    })
    const children = e.props.children.map(child=>{
        console.log(child,dom,'++++')
        render(child,dom)
    })
    console.log(continer,dom)
    continer.append(dom)
}
// const textEl = createElementText('app')
// console.log(textEl,document.getElementById('root'),'根部')
// const App = createElement('div',{id:'app'},'hiwq','mini-react')
// render(App,document.getElementById('app'))

export default {render,createElement}
