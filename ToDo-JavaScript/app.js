// 山寨的jQuery中的DOM结构获取
function g(keyword){
	return document.querySelectorAll(keyword);
}

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

var arrTodos = [];

// 默认情况下是显示所有 todos
arrTodos.keyStatus = 'All';

reDraw();

// 输入框监听事件
addEvent(g('#input_original')[0], 'keydown', function(event){
	if(event.keyCode !== 13 || this.value.trim() === '') return;
	var todoObject = {
		text : this.value,
		status : 0
	};
	arrTodos.push(todoObject);
	this.value = '';
	reDraw(arrTodos.keyStatus);
	itemsCountChange();
});

bindStatusChange();

// 三个状态按钮点击事件
function bindStatusChange(){
	for(var i = 0; i < g('.status_wrap a').length; i++){
		+function(a){
			addEvent(g('.status_wrap a')[a], 'click', function(event){
				for(var k in g('.status_wrap a')){
					g('.status_wrap a')[k].className = '';
				}
				this.className = 'selected'; 
				arrTodos.keyStatus = this.innerHTML;
				reDraw(this.innerHTML);
			});
		}(i);
	}
}

// 勾选按钮点击事件
 function bindFinish(node){
 	addEvent(node, 'click', function(event){
 		var a = 0;
 		for(var i = 0, length = g('.items_wrap')[0].children.length; i < length; i++){
 			if(this == g('.items_wrap')[0].children[i].children[0]){
 				a = i;
 				break;
 			}
 		}
		if(this.className == 'need_to_do'){
			this.className += ' to_do_finished';
			this.nextSibling.className += ' to_do_line_through';
			arrTodos[a].status = 1;
		}else{
			this.className = 'need_to_do';
			arrTodos[a].status = 0;
			this.nextSibling.className = 'todo_text';
		}
		itemsCountChange();
		reDraw(arrTodos.keyStatus);
	});
 }

// × 按钮点击事件
function bindDel(node){
	addEvent(node, 'click', function(event){
		var a = 0;
 		for(var i = 0, length = g('.items_wrap')[0].children.length; i < length; i++){
 			if(this == g('.items_wrap')[0].children[i].children[2]){
 				a = i;
 				break;
 			}
 		}
		g('.items_wrap')[0].removeChild(this.parentElement);
		arrTodos.splice(a, 1);
		// if(arrTodos.length == 0){
		// 	g('.todos_detail')[0].style.display = 'none';
		// }
		itemsCountChange();
		reDraw(arrTodos.keyStatus);
	});
}

// todoitem 双击事件
function binddblClick(node){
	addEvent(node, 'dblclick', function(event){
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
	});
}

// todos 列表计数函数
function itemsCountChange(){
	var countUnFinished = arrTodos.length;
	for(var i = 0; i < arrTodos.length; i++){
		if(arrTodos[i].status == 1){
			countUnFinished --;
		}
	}
	if(countUnFinished != 0){
		g('.todos_count')[0].innerHTML = countUnFinished;
		if(countUnFinished != 1 && g('.todos_items')[0].innerHTML[5] != 's'){
			g('.todos_items')[0].innerHTML += 's';
		}else if(countUnFinished == 1){
			g('.todos_items')[0].innerHTML = ' item';
		}
	}else{
		g('.todos_count')[0].innerHTML = '0';
		g('.todos_items')[0].innerHTML = ' item';
	}
}

// 对页面画面进行重绘
function reDraw(keyStatus){
	if(arrTodos.length == 0){
		g('.todos_detail')[0].style.display = 'none';
	}else{
		g('.todos_detail')[0].style.display = 'block';
		// g('.items_wrap')[0].innerHTML = '';
		var length = g('.items_wrap')[0].children.length;
		if(length < arrTodos.length){
			// 添加了新的 TodoItem
			var li_wrap = document.createElement('li');
			var button_NTD = document.createElement('button');
			var label_text = document.createElement('label');
			var button_del = document.createElement('button');
			li_wrap.appendChild(button_NTD);
			li_wrap.appendChild(label_text);
			li_wrap.appendChild(button_del);

			button_NTD.innerHTML = '✔';
			button_NTD.className = 'need_to_do';
			
			label_text.innerHTML = arrTodos[arrTodos.length - 1].text;
			label_text.className = 'todo_text';

			button_del.innerHTML = '×';
			button_del.className = 'btn_del';

			bindFinish(button_NTD);
			bindDel(button_del);
			binddblClick(label_text);

			if(keyStatus == 'All' || keyStatus == undefined){
				g('.items_wrap')[0].appendChild(li_wrap);
			}else if(keyStatus == 'Active' && arrTodos[arrTodos.length - 1].status == 0){
				g('.items_wrap')[0].appendChild(li_wrap);
			}else if(keyStatus == 'Completed' && arrTodos[arrTodos.length - 1].status == 1){
				g('.items_wrap')[0].appendChild(li_wrap);
			}else{
				li_wrap.style.display = 'none';
				g('.items_wrap')[0].appendChild(li_wrap);
			}
		}else{
			for(var i = 0; i < length; i++){
				var li_wrap = g('.items_wrap')[0].children[i];

				if(keyStatus == 'All' || keyStatus == undefined){
					li_wrap.style.display = 'block';
				}else if(keyStatus == 'Active' && arrTodos[i].status == 0){
					li_wrap.style.display = 'block';
				}else if(keyStatus == 'Completed' && arrTodos[i].status == 1){
					li_wrap.style.display = 'block';
				}else{
					li_wrap.style.display = 'none';
				}
			}
		}
	}
}