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
    return <div>
        <button onclick={handleClick}>点我</button>
        <Counter  num={counts}></Counter>
    </div>
}
function App() {
    return (
      <div id="app">
        app
        <div {...obg}>123</div>
        {/* <Counter num={34}></Counter> */}
        <SecondCount num={20}></SecondCount>
        <RemoveChild></RemoveChild>
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