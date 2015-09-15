// 使用面向对象的写法来重写Todos
function Todo(id){
	this.ref = document.getElementById(id);
	this.todosWrap = document.getElementsByClassName('items_wrap')[0];
	this.leftNum = document.getElementsByClassName('todos_count')[0];
	this.showStatus = 'All';

	this.todoItems = [];
	this.index = 0;

	this.init();
}

// 初始化函数
Todo.prototype.init = function(){
	// 保存this局部变量
	var _this = this;

	// 给ref绑定输入事件
	addEvent(this.ref, 'keydown', function(event){
		if(event.keyCode !== 13 || this.value.trim() === '') return;
		_this.add(this.value);
		this.value = '';
	});

	// 给状态切换按钮绑定点击事件
	var changeStateLi = document.getElementsByClassName('status_wrap')[0].children;
	for(var i = 0, length = changeStateLi.length; i < length; i++){
		+function(key){
			addEvent(changeStateLi[key], 'click', function(event){
				_this.showStatus = this.firstChild.innerHTML;
				for(var i = 0, length = this.parentElement.children.length; i < length; i++){
					if(key == i){
						this.parentElement.children[i].children[0].className = 'selected';
					}else{
						this.parentElement.children[i].children[0].className = '';
					}
				}

				_this.refresh();
			});
		}(i);
	}
	
}

// 添加新的todoItem
Todo.prototype.add = function(text){
	this.index ++;
	var newTodoItem = new TodoItem('todoItem_' + this.index, text, this);
	this.todoItems.push(newTodoItem);
	this.refresh();
};

// 删除todoItem
Todo.prototype.remove = function(todoItem){
	this.todosWrap.removeChild(document.getElementById(todoItem.id));
	this.todoItems.splice(this.todoItems.indexOf(todoItem), 1);
	this.refresh();
};

// 刷新显示效果
Todo.prototype.refresh = function(){
	this.todosWrap.parentElement.style.display = this.todoItems.length > 0 ? 'block' : 'none';
	var countUnfinished = 0;
	for(var i = 0, length = this.todoItems.length; i < length; i++){
		var _todoItem = this.todoItems[i];
		_todoItem.changeState(this.showStatus);
		if(_todoItem.status == 'need_to_do'){
			countUnfinished ++;
		}
	}

	if(countUnfinished > 1){
		this.leftNum.nextSibling.innerHTML = ' items';
	}else{
		this.leftNum.nextSibling.innerHTML = ' item';
	}
	this.leftNum.innerHTML = countUnfinished;
};

function TodoItem(id, text, app){
	this.id = id;
	this.text = text;
	// app保存todoItems的父元素Todo的this
	this._todo = app;
	this.status = 'need_to_do';
	this.ref = null;

	this.init();
}

TodoItem.prototype.init = function(){
	var _this = this;
	// 将产生的todo元素添加到DOM中去
	var li_wrap = document.createElement('li');
	li_wrap.id = this.id;
	var button_needtodo = document.createElement('button');
	var label_text = document.createElement('label');
	var button_del = document.createElement('button');
	li_wrap.appendChild(button_needtodo);
	li_wrap.appendChild(label_text);
	li_wrap.appendChild(button_del);

	button_needtodo.innerHTML = '✔';
	button_needtodo.className = 'need_to_do';
	
	label_text.innerHTML = this.text;
	label_text.className = 'todo_text';

	button_del.innerHTML = '×';
	button_del.className = 'btn_del';

	this._todo.todosWrap.appendChild(li_wrap);
	this.ref = li_wrap;

	// 绑定双击事件
	addEvent(label_text, 'dblclick', function(){
		this.style.display = 'none';
		var input_edit = document.createElement('input');
		input_edit.value = this.innerHTML;
		input_edit.className = 'todo_edit';
		input_edit.type = 'text';
		this.parentElement.appendChild(input_edit);
		input_edit.focus();
		

		addEvent(input_edit, 'blur', function(event){
			var label_edit = this.previousSibling.previousSibling;
			label_edit.innerHTML = this.value;
			label_edit.style.display = 'block';
			var parentNode = this.parentElement;
			parentNode.removeChild(this);
		});

		addEvent(input_edit, 'keydown', function(event){
			if(event.keyCode !== 13 || this.value.trim() === '') return;
			var label_edit = this.previousSibling.previousSibling;
			label_edit.innerHTML = this.value;
			label_edit.style.display = 'block';
			var parentNode = this.parentElement;
			parentNode.removeChild(this);
		})
	});

	// 绑定删除事件
	addEvent(button_del, 'click', function(){
		_this._todo.remove(_this);
	});

	// 绑定完成事件
	addEvent(button_needtodo, 'click', function(){
		if(_this.status == 'need_to_do'){
			_this.status = 'finished';
			this.className += ' to_do_finished';
			this.nextSibling.className += ' to_do_line_through'
		}else{
			_this.status = 'need_to_do';
			this.className = 'need_to_do';
			this.nextSibling.className = 'todo_text'
		}
		_this._todo.refresh();
	});
};

// 根据显示属性变化，是否显示
TodoItem.prototype.changeState = function(){
	if(this._todo.showStatus == 'Active' && this.status == 'finished' || this._todo.showStatus == 'Completed' && this.status == 'need_to_do'){
		this.ref.style.display = 'none';
	}else{
		this.ref.style.display = 'block';
	}
};

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

var TodoExample = new Todo('input_original');