
// const obj = {
//     type:,
//     props:{
//         children:[]
//     }
// }
function createElementText(text) {
    return {
        type: 'TEXT_CONTENT',
        props: {
            nodeValue: text,
            children: []
        }

    }
}

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(e => {
                return typeof e === 'string' || typeof e === 'number' ? createElementText(e) : e
            })
        }

    }
}
let workRoot = null // 最新的树
let currentRoot = null // 保留旧的树
let deleteList= [] // s收集将要清除的dom
let wipFiber = null // 记录当前更更新的fiber
// 容器
function render(el, continer) {
    workRoot = {
        dom: continer,
        props: {
            children: [el]
        },
    }
    nextWorkToUnit = workRoot

}


function createDom(type) {
    return type === 'TEXT_CONTENT' ? document.createTextNode('') : document.createElement(type)
}
function updateProps(dom, props, prevProps) {
    // 编辑旧节点，旧有新没有
    // if(!dom){return} // 暂时时候这个判断使程序运行
    if (prevProps) {
        Object.keys(prevProps).forEach(key => {
            if (key !== 'children') {
                if (!props[key]) {
                    dom.removeAttribute(key)
                }
            }
        })
    }
    Object.keys(props).forEach(key => {
        if (key !== 'children') {
            if (!prevProps||props[key] !== prevProps[key]) {
                if (key.startsWith('on')) {
                    const eventName = key.slice(2).toLocaleLowerCase()
                    if(prevProps){
                        dom.removeEventListener(eventName, prevProps[key])
                    }
                 
                    dom.addEventListener(eventName, props[key])
                } else {
                    dom[key] = props[key]
                }
            }
        }
    })
}
// 生成链表
function reconcileChildren(children, fiber) {
    let prevChild = null // 记录上一个儿子
   let oldFiber = fiber.alternate?.child
    children?.forEach((child, index) => {
        const isSameType = oldFiber && child.type === oldFiber.type
        let newFiber
        if (isSameType) { // 相同标签不需要更新本身dom
            newFiber = {
                type: child.type,
                props: child.props,
                parent: fiber,
                sibling: null,
                child: null,
                dom: oldFiber.dom,
                effectTag: 'update',
                alternate: oldFiber
            }
        } else {
            if(child){
                newFiber = {
                    type: child.type,
                    props: child.props,
                    parent: fiber,
                    sibling: null,
                    child: null,
                    dom: null,
                    effectTag: 'placement',
                    alternate: oldFiber
                }
            } 
        }
        if (oldFiber) { oldFiber = oldFiber.sibling }
        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevChild.sibling = newFiber
        }
        if (newFiber) {
            prevChild = newFiber;
        }
    })
    // 收集旧数据的dom
    while(oldFiber){
        deleteList.push(oldFiber)
        oldFiber = oldFiber.sibling
    }



}

// 更新function组件
function updateFunctionComponent(fiber) {
    wipFiber = fiber
    const children = fiber.type(fiber.props)
    reconcileChildren([children], fiber)
}


// 更新非function 组件
function updateHostComponent(fiber) {
    if (!fiber.dom) {
        //  1.创建dom  
        const dom = fiber.dom = createDom(fiber.type)

        // 2.创建dom 的属性
        updateProps(dom, fiber.props,{})
    }

    // 3.变成链表   
    const children = fiber.props.children
    reconcileChildren(children, fiber)
}


// fiber 是个链表对象
/**
 * 
 * @param {type:类型,props:属性,parent:父亲,sibling:null,child:null,dom:null} fiber 
 * @returns 
 */
function performWorkofUnit(fiber) {
    console.log(fiber,'更新的是谁啊啊')
    typeof fiber.type === 'function' ? updateFunctionComponent(fiber) : updateHostComponent(fiber)
    // 有儿子先返回儿子
    if (fiber.child) return fiber.child
    // 没有儿子的情况下返回兄弟层级的
    // if(fiber.sibling) return fiber.subliming
    // // 没有儿子也没有兄弟的情况下返回父子的兄弟 递归防止是function component 的时候又一层是空
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) { return nextFiber.sibling }
        nextFiber = nextFiber.parent
    }

}

let nextWorkToUnit = null
function workLoop(IdleDeadline) {
    let timer = false
    while (!timer && nextWorkToUnit) {
        nextWorkToUnit = performWorkofUnit(nextWorkToUnit)
        // console.log(nextWorkToUnit,wipFiber,wipFiber?.sibling?.type === nextWorkToUnit?.sibling?.type)
        if(wipFiber?.sibling?.type === nextWorkToUnit?.type){
            nextWorkToUnit = null
        }
        timer = IdleDeadline.timeRemaining() < 1
    }

    if (!nextWorkToUnit && workRoot) {
        commitRoot()
    }
    requestIdleCallback(workLoop)
}
function commitRoot() {
    commitWork(workRoot.child)
    commitDeletion()    
    currentRoot = workRoot
    workRoot = null
}
// 删除原本旧的dom
function commitDeletion(){
    deleteList.forEach(fiber=>{
        let parentFiber = fiber.parent
        while (!parentFiber.dom) {
            parentFiber = parentFiber.parent
        }
        parentFiber.dom.removeChild(fiber.dom)
    })
    deleteList= []
}
// 添加到子节点
function commitWork(fiber) {
    // fiber.parent.dom.append(fiber.dom)
    if (!fiber) return
    let parentFiber = fiber.parent
    while (!parentFiber.dom) {
        parentFiber = parentFiber.parent
    }
     if (fiber.effectTag === 'update') { // 更新属性
       fiber.dom&&updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
    } else if(fiber.effectTag === 'placement') {
      if(fiber.dom){
          parentFiber.dom.append(fiber.dom)
      }
    }

    // 疯狂递归儿子
    if (fiber.child) {
        commitWork(fiber.child)
    }
    // 疯狂递归兄弟
    if (fiber.sibling) {
        commitWork(fiber.sibling)
    }
}

requestIdleCallback(workLoop)
function update() {
    let currentFiber = wipFiber
    return ()=>{
        workRoot = {
           ...currentFiber,
            alternate: currentFiber
        }
        nextWorkToUnit = workRoot
    }
}



export default { render, createElement,update }
