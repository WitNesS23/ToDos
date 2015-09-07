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
	reDraw();
});

bindStatusChange();

function bindStatusChange(){
	for(var i = 0; i < g('.status_wrap a').length; i++){
		+function(a){
			addEvent(g('.status_wrap a')[a], 'click', function(event){
				for(var k in g('.status_wrap a')){
					g('.status_wrap a')[k].className = '';
				}
				this.className = 'selected'; 
				reDraw(this.innerText);
			});
		}(i);
	}
}

// 勾选按钮点击事件
function bindFinish(){
	for(var i = 0; i < g('.need_to_do').length; i++){
		+function(a){
			addEvent(g('.need_to_do')[a], 'click', function(event){
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
			});
		}(i);
	}
}

// × 按钮点击事件
function bindDel(){
	for(var i = 0; i < g('.btn_del').length; i++){
		+function(a){
			addEvent(g('.btn_del')[a], 'click', function(event){
				//console.log(this);
				g('.items_wrap')[0].removeChild(this.parentElement);
				arrTodos.splice(a, 1);
				if(arrTodos.length == 0){
					g('.todos_detail')[0].style.display = 'none';
				}
				itemsCountChange();
			});
		}(i);
	}
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
		g('.todos_count')[0].innerText = countUnFinished;
		if(countUnFinished != 1 && g('.todos_items')[0].innerText[5] != 's'){
			g('.todos_items')[0].innerText += 's';
		}else if(countUnFinished == 1){
			g('.todos_items')[0].innerText = ' item';
		}
	}else{
		g('.todos_count')[0].innerText = '0';
		g('.todos_items')[0].innerText = ' item';
	}
}

// 对页面画面进行重绘
function reDraw(keyStatus){
	if(arrTodos.length == 0){
		g('.todos_detail')[0].style.display = 'none';
	}else{
		g('.todos_detail')[0].style.display = 'block';
		g('.items_wrap')[0].innerHTML = '';
		for(var i = 0; i < arrTodos.length; i++){
			var li_wrap = document.createElement('li');

			
			var button_NTD = document.createElement('button');
			button_NTD.innerText = '✔';
			button_NTD.className = 'need_to_do';

			var label_text = document.createElement('label');
			label_text.innerText = arrTodos[i].text;
			label_text.className = 'todo_text';

			if(arrTodos[i].status == 1){
				button_NTD.className += ' to_do_finished';
				label_text.className += ' to_do_line_through';
			}

			var button_del = document.createElement('button');
			button_del.innerText = '×';
			button_del.className = 'btn_del';

			var input_edit = document.createElement('input');
			input_edit.className = 'todo_edit';


			li_wrap.appendChild(button_NTD);
			li_wrap.appendChild(label_text);
			li_wrap.appendChild(button_del);
			li_wrap.appendChild(input_edit);

			if(keyStatus == 'All' || keyStatus == undefined){
				g('.items_wrap')[0].appendChild(li_wrap);
			}else if(keyStatus == 'Active' && arrTodos[i].status == 0){
				g('.items_wrap')[0].appendChild(li_wrap);
			}else if(keyStatus == 'Completed' && arrTodos[i].status == 1){
				g('.items_wrap')[0].appendChild(li_wrap);
			}
		}
		bindDel();
		bindFinish();
		itemsCountChange();
	}
}