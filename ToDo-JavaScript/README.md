# 基于 JavaScript 的 ToDos 实现

### 其中值得注意的知识点

#### 兼容性的事件绑定

在事件监听的情况处理中，主要需要考虑的是IE的兼容性。在其他浏览器中使用的主要是 addEventListener，而IE中却是 attachEvent。

```javascript
.addEventListener('click', handler, false);
.attachEvent('onclick', handler); // only for IE
```
它们两个的主要区别如下：

1. 两者所指定的参数不同。很明显 addEventListener 多了一个参数。IE中添加的事件处理程序只能发生在冒泡阶段，而 addEventListener 第三个参数可以决定添加的事件处理程序是在捕获阶段还是冒泡阶段处理（为了兼容，一般都设置为 false ，即为冒泡阶段处理该事件；

2. 第一个参数意义不同。前者是事件类型，后者是事件处理函数名称；

3. __事件处理的作用域不同__。这个还是比较重要的，前者的作用域就是是元素本身，就是我们日常对 this 理解的一样，而后者事件处理程序会在全局变量内部执行（被调用），所以它的 this 指向的是 window；

4. 为一个事件添加多个事件处理程序，执行顺序不同。前者会按照添加顺序来执行，而后者没有一定的规律（如果有需要控制函数执行的顺序，还是自己手动控制比较好）；

例子中使用的兼容事件绑定方法：

```javascript
// IE兼容的事件处理函数
function addEvent(node, type, handler){
	if(!node) return false;
	if(node.addEventListener){
		node.addEventListener(type, handler, false);
		return true;
	}else if(node.attachEvent){
		node.attachEvent('on' + type, function(){handler.apply(node)});
		return true;
	}
	return false;
}
```

下面贴个 jQuery 例子中使用的兼容事件绑定方法：

```javascript
function addEvent(node, type, handler) {
    if (!node) return false;
    if (node.addEventListener) {
        node.addEventListener(type, handler, false);
        return true;
    }
    else if (node.attachEvent) {
        node['e' + type + handler] = handler;
        node[type + handler] = function() {
            node['e' + type + handler](window.event); // window.event 是指在 IE 中真正触发事件的对象
        };
        node.attachEvent('on' + type, node[type + handler]);
        return true;
    }
    return false;
}
```

#### for in 和传统 for(var i = 0; i < length; i++) 的区别

[博客园关于for-in和for的简单介绍和比较](http://www.cnblogs.com/WitNesS/p/4792916.html)

#### 闭包的应用

#### 存疑

双击编辑的情况下，一直无法实现默认光标的效果 __已解决，.focus()函数执行位置必须在元素被添加到DOM中之后__