// console.log('hello  mini-react')
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
                // console.log(e, '66555', typeof e)
                return typeof e === 'string' || typeof e === 'number' ? createElementText(e) : e
            })
        }

    }
}
let workRoot = null // 最新的树
let curentRoot = null // 保留旧的树
// 容器
function render(el, continer) {

    workRoot = {
        dom: continer,
        props: {
            children: [el]
        },
        // altermate:null

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
                    dom.removeEventListener(eventName, prevProps[key])
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
    // console.log(children,'====================',)
   let oldFiber = fiber.altermate?.child
    children?.forEach((child, index) => {
        const isSameType = oldFiber && child.type === oldFiber.type
        // console.l.log(oldFiber,isSameType,child,'reconcilechildren')
        let newFiber
        if (isSameType) { // 相同标签不需要更新本身dom
            newFiber = {
                type: child.type,
                props: child.props,
                parent: fiber,
                subling: null,
                child: null,
                dom: oldFiber.dom,
                effectTag: 'update',
                altermate: oldFiber
            }
        } else {
            if(child){
                newFiber = {
                    type: child.type,
                    props: child.props,
                    parent: fiber,
                    subling: null,
                    child: null,
                    dom: null,
                    effectTag: 'placement',
                    altermate: oldFiber
                }
            }
            
        }
        if (oldFiber) { oldFiber = oldFiber.subling }
        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevChild.subling = newFiber
        }
        if (newFiber) {
            prevChild = newFiber;
          }
    })
}

// 更新function组件
function updateFunctionCompoent(fiber) {
    const children = fiber.type(fiber.props)
    reconcileChildren([children], fiber)
}


// 更新非function 组件
function updateHostComponent(fiber) {

    if (!fiber.dom) {
        //  1.创建dom  
        const dom = fiber.dom = createDom(fiber.type)

        // 2.创建dom 的属性  
        console.log(dom,'123')
        updateProps(dom, fiber.props,{})
    }

    // 3.变成链表   
    // parent
    // subling
    // child
    const children = fiber.props.children
    reconcileChildren(children, fiber)
}


// fiber 是个链表对象
/**
 * 
 * @param {type:类型,props:属性,parent:父亲,subling:null,child:null,dom:null} fiber 
 * @returns 
 */
function performWorkofUnit(fiber) {
    // console.log(fiber, fiber.type, '123123')
    // fiber.
    typeof fiber.type === 'function' ? updateFunctionCompoent(fiber) : updateHostComponent(fiber)
    // 有儿子先返回儿子
    if (fiber.child) return fiber.child
    // 没有儿子的情况下返回兄弟层级的
    // if(fiber.subling) return fiber.subling
    // // 没有儿子也没有兄弟的情况下返回父子的兄弟 递归防止是function component 的时候又一层是空
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.subling) { return nextFiber.subling }
        nextFiber = nextFiber.parent
    }

}

let nextWorkToUnit = null
function wookloop(IdleDeadline) {
    let timer = false
    while (!timer && nextWorkToUnit) {
        nextWorkToUnit = performWorkofUnit(nextWorkToUnit)
        timer = IdleDeadline.timeRemaining() < 1
    }

    if (!nextWorkToUnit && workRoot) {
        commitRoot()
    }
    requestIdleCallback(wookloop)
}
function commitRoot() {
    commitWork(workRoot.child)
    // console.log(workRoot,'----------------')
    curentRoot = workRoot
    workRoot = null
}

// 添加到子节点
function commitWork(fiber) {
    // fiber.parent.dom.append(fiber.dom)
    if (!fiber) return
    let parentFiber = fiber.parent
    while (!parentFiber.dom) {
        parentFiber = parentFiber.parent
    }
    if(fiber.dom){
        // if (fiber.effectTag === 'update') { // 更新属性
        //     updateProps(fiber.dom, fiber.props, fiber.altermate?.props)
        // } else if() {
        //     parentFiber.dom.append(fiber.dom)
        // }
        switch(fiber.effectTag){
            case 'update':
                updateProps(fiber.dom, fiber.props, fiber.altermate?.props)
                break;
            case 'placement':
                updateProps(fiber.dom, fiber.props, fiber.altermate?.props)
                break;    
        }
    }
   

    // // console.log(fiber.child,'---')
    // 疯狂递归儿子
    if (fiber.child) {
        commitWork(fiber.child)
    }
    // 疯狂递归兄弟
    if (fiber.subling) {
        commitWork(fiber.subling)
    }
}

requestIdleCallback(wookloop)
function update() {
    // console.log(curentRoot,123132123)
    workRoot = {
        dom: curentRoot.dom,
        props: curentRoot.props,
        altermate: curentRoot

    }
    nextWorkToUnit = workRoot

}



export default { render, createElement,update }
