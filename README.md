### 这是一个用javascript 实现的目录树  

**2019-6-19 修改**
> 1. 绑定事件 this重定向到对应数据
> 2. 数据体关键字可以使用dom标签中key指定修改
> 3. 让展开时间和收缩速度根据大小改变
> 4. nameKey 可以用.的方式指定对象里的东西

**DirectoryTreeTest.html** 是一个演示  
**DirectoryTree.js** 实现整个树的生成和事件绑定  
通过立即函数将**DirectoryTree**实例添加到**windows**对象里，外部直接通过条用**DirectoryTree**原型链上的**createTree**进行树的创建
**createTree**这个函数需要两个参数，一个包裹标签（dom），这个标签可以是各种能有子元素的标签，一个是树的数据（treeData）。
**treeData**的结构如下
```
[
    // 一个树节点信息
    {
        // name是必须要的
        name : "节点的名字" ,
        // action是节点的事件响应，为一个数组，可以有多个事件响应，这不是一个必须参数
        action : [
            // 对象键值为事件名，值为方法
            {click : function(){}}
        ] ，
        // 字节点信息，里面放置一个正确的树节点信息，不是必须参数
        children : [
        ]
    }
]
```
DirectoryTree.css放置树的控制样式


