import React from "./core/react";
import {RemoveChild} from './components/Remove.jsx'
let counts = 100
let obg= {id:100}
function Counter({num}){
    return  <div>{num}</div>
}
function SecondCount({num}){

    function handleClick(){
       
        counts++
        console.log(counts)
        obg={}
        React.update()
    }
    React.update()
    return <div>
        <button onclick={handleClick}>点我</button>
        <Counter  num={counts}></Counter>
    </div>
}
function Foo(){
    const [count, setCount] = React.useState(10);
    const [show, setShow] = React.useState('bar');
    function handleOk(){
        setCount(()=>{
            return count+1
        })
        setShow((val)=>val+'asdb')
    }
    return <div>
        <button onclick={handleOk}>点11231我</button>
        <div>{count}</div>
        <div>{show}</div>
    </div>
}
function App() {
    return (
      <div id="app">
        app
        <div {...obg}>123</div>
        {/* <Counter num={34}></Counter> */}
        {/*<SecondCount num={20}></SecondCount>*/}
        {/*<RemoveChild></RemoveChild>*/}
          <Foo></Foo>
      </div>
    );
  }



// const App = <div>
//  {/* 123123 */}
//  <div {...obg}>123</div>
//  {/* <Counter num={34}></Counter> */}
//  <SecondCount num={20}></SecondCount>
//  <RemoveChild></RemoveChild>
//     </div> 
// console.log(App)
export default App