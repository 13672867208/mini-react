/*
  diff:节点删除案例
*/
import React from '../core/react.js';
let shouldRemove = false;
export function RemoveChild() {
  console.log('remove child');
  const update = React.update();
  
  const handleClick = () => {
    shouldRemove = !shouldRemove;
    update();
  };

  const Counter = function(){
    return <div></div>
  }

  
  return (
    <div>
      <div>
        {shouldRemove ? (
          <div>啊是吧</div>
        ) : (
          <div>
            value
            <div>pengyuiyan</div>
            <div>3</div>
          </div>
        )}
      </div>
      <button onClick={handleClick}>{shouldRemove ? 'reset' : 'remove'}</button>
    </div>
  );
}