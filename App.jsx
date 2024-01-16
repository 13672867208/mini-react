import React from "./core/react";

function Counter({num}){
    return  <div>{num}</div>
}
function SecondCount({num}){
    return <Counter num={num}></Counter>
}

const App = <div>
 123123
 <div>123</div>
 <Counter num={34}></Counter>
 <SecondCount num={20}></SecondCount>
 
    </div> 
console.log(App)
export default App