# mini-React
### 实现dom 与 虚拟dom


### filer优化递归dom

关键 使用了 requestIdleCallback 优化递归dom 减少大组件的情况下由于递归导致浏览器卡顿的问题 

1. 将虚拟dom树 变成链表 
// 
performWorkofUnit 方法 
1.创建dom  
2.创建dom 的属性  
3.变成链表   
4.返回内容
  
2. wookloop
循环调用requestIdleCallback

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          