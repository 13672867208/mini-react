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
function render(el,continer){
    console.log(continer,'123')
     nextWorkToUnit ={
        dom:continer,
        props:{
            children:[el]
        }
      
    }
    requestIdleCallback(wookloop)

}


function createDom(type){
    return  type==='TEXT_CONTENT'?document.createTextNode(''):document.createElement(type)
}
function createProps(dom,props){
    Object.keys(props).forEach(item=>{
        if(item!=='children'){
            dom[item]=props[item]
        }
    })
}
// fiber 是个链表对象
/**
 * 
 * @param {type:类型,props:属性,parent:父亲,subling:null,child:null,dom:null} fiber 
 * @returns 
 */
function performWorkofUnit(fiber){
    console.log(fiber,'asdas')
    if(!fiber.dom){
      //  1.创建dom  
      const dom =fiber.dom =  createDom(fiber.type)
      fiber.parent.dom.append(dom)
      // 2.创建dom 的属性  
      createProps(dom,fiber.props)   
    }

    // 3.变成链表   
        // parent
        // subling
        // child
        const children = fiber.props.children
        let prevChild =null // 记录上一个儿子
        children?.forEach((child,index)=>{
            const obj = {
                type:child.type,
                props:child.props,
                parent:fiber,
                subling:null,
                child:null,
                dom:null
            }
           if(index===0){
            fiber.child = obj
           }else{
            prevChild.subling = obj
           }
           prevChild = obj
        })
    // 4.返回内容
        // 有儿子先返回儿子
        if(fiber.child) return fiber.child
        // 没有儿子的情况下返回兄弟层级的
        if(fiber.subling) return fiber.subling
        // 没有儿子也没有兄弟的情况下返回父子的兄弟
        return fiber.parent?.subling
}



let nextWorkToUnit = null
function wookloop(IdleDeadline){
    let timer =false
    while(!timer&&nextWorkToUnit){
        if(!timer)
         nextWorkToUnit = performWorkofUnit(nextWorkToUnit)
        timer = IdleDeadline.timeRemaining()<1
        requestIdleCallback(wookloop)
    }

}
// requestIdleCallback(wookloop)






export default {render,createElement}
