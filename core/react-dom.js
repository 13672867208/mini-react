import reactRender from "./react.js"

const ReactDom = {
     createRoot(continer){
        return{ 
            render(dom){
              reactRender.render(dom,continer)
             }
        }
     }
}

export default ReactDom