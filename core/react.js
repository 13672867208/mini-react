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
               return typeof e==='string'||typeof e==='number'?createElementText(e):e
            })
        }
        
    }
}
let root = null
// 容器
function render(el,continer){
    console.log(continer,'123')
     nextWorkToUnit ={
        dom:continer,
        props:{
            children:[el]
        }
      
    }
    root = nextWorkToUnit

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
// 生成链表
function initChildren(children,fiber){
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
}

// 更新function组件
function updateFunctionCompoent(fiber){
   console.log(fiber.type(fiber.props),'asdasdasd') 
   const children = fiber.type(fiber.props)
   initChildren([children],fiber)
   console.log(fiber,'udadasdasd')

}


// 更新非function 组件

function updateHostComponent(fiber){
    if(!fiber.dom){
        //  1.创建dom  
        const dom =fiber.dom =  createDom(fiber.type)
  
        // 2.创建dom 的属性  
        createProps(dom,fiber.props)   
      }
  
      // 3.变成链表   
          // parent
          // subling
          // child
          const children = fiber.props.children
          initChildren(children,fiber)
}




// fiber 是个链表对象
/**
 * 
 * @param {type:类型,props:属性,parent:父亲,subling:null,child:null,dom:null} fiber 
 * @returns 
 */
function performWorkofUnit(fiber){
    console.log(fiber,fiber.type,'123123')
    // fiber.
    typeof fiber.type==='function'?updateFunctionCompoent(fiber):updateHostComponent(fiber)
      
    // 4.返回内容
        // 有儿子先返回儿子
        if(fiber.child) return fiber.child
        // 没有儿子的情况下返回兄弟层级的
        // if(fiber.subling) return fiber.subling
        // // 没有儿子也没有兄弟的情况下返回父子的兄弟 递归防止是function component 的时候又一层是空
        let nextFiber = fiber
        while(nextFiber){
            if(nextFiber.subling){ return nextFiber.subling}
            nextFiber = nextFiber.parent
        }
    
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

    if(!nextWorkToUnit && root){
        commitRoot()
    }

}
function commitRoot(){
    console.log('commitRoot',root)
    commitWork(root.child)
    console.log(root,'455')
    // root = null
}

// 添加到子节点
function commitWork(fiber){
        // fiber.parent.dom.append(fiber.dom)
    let parentFiber = fiber.parent
    while(!parentFiber.dom){
        parentFiber = parentFiber.parent
    }
    if(fiber.dom){
        parentFiber.dom.append(fiber.dom)
    }
    // console.log(fiber.child,'---')
    // 疯狂递归儿子
    if(fiber.child){
        commitWork(fiber.child)
    }
     // 疯狂递归兄弟
    if(fiber.subling){
        commitWork(fiber.subling)
    }
}

requestIdleCallback(wookloop)




export default {render,createElement}
