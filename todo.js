const _inputField = "inputField";
const _add = "add";
const _deleteAll = "deleteAll";
const _emptyMessage = "emptyMessage";
const _progressBar = "progressBar";
const _progressText = "progressText";
const _progress = "progress";
const _itemsHeader = "itemsHeader";
const _doneItemsHeader = "doneItemsHeader";
const _doneItemsFeed = "doneItemsFeed";
var inputField = document.getElementById(_inputField);
var add = document.getElementById(_add);
var deleteAll = document.getElementById(_deleteAll);
var emptyMessage = document.getElementById(_emptyMessage);
var progressBar = document.getElementById(_progressBar);
var progress = document.getElementById(_progress);
var progressText = document.getElementById(_progressText);
var itemsHeader = document.getElementById(_itemsHeader);
var doneItemsHeader = document.getElementById(_doneItemsHeader);
var doneItemsFeed = document.getElementById(_doneItemsFeed);
const empty = "empty";
const noSelect = "noSelect";
const select = "select";
const done = "done";


function ItemCreator(index, content){
	this.index = index;
	this.content = content;
}

ItemCreator.prototype.addItem = function(){
	let newItem = document.createElement("div");
	newItem.setAttribute("id", this.index);
	newItem.setAttribute("class", "item");
	document.getElementById("itemsFeed").appendChild(newItem);
};

ItemCreator.prototype.addCheckbox = function(){
	let newCheckboxDiv = document.createElement("div");
	newCheckboxDiv.setAttribute("class", "item-checkbox");
	document.getElementById(this.index).appendChild(newCheckboxDiv);
	let newCheckbox = document.createElement("input");
	newCheckbox.setAttribute("type", "checkbox");
	newCheckbox.setAttribute("class", "checkbox");
	newCheckbox.setAttribute("data-icon", "Välj");
	newCheckboxDiv.appendChild(newCheckbox);
};

ItemCreator.prototype.addContent = function(){
	let newContent = document.createElement("div");
	newContent.setAttribute("id", this.index + "-content");
	newContent.setAttribute("class", "item-content");
	newContent.innerHTML = this.content;
	document.getElementById(this.index).appendChild(newContent);
};

ItemCreator.prototype.addDelDiv = function(){
	let newDelDiv = document.createElement("div");
	newDelDiv.setAttribute("id", this.index + "-del");
	newDelDiv.setAttribute("class", "item-del");
	document.getElementById(this.index).appendChild(newDelDiv);
};

ItemCreator.prototype.addDelUI = function(){
	let newDelUI = document.createElement("a");
	// newDelUI.setAttribute("id", this.index + "-del-icon");
	newDelUI.setAttribute("class", "del");
	newDelUI.setAttribute("data-icon", "Ta bort");
	document.getElementById(this.index + "-del").appendChild(newDelUI);
};

ItemCreator.prototype.addDoneDiv = function(){
	let newDoneDiv = document.createElement("div");
	newDoneDiv.setAttribute("id", this.index + "-done");
	newDoneDiv.setAttribute("class", "item-done");
	document.getElementById(this.index).appendChild(newDoneDiv);
};

ItemCreator.prototype.addDoneUI = function(){
	let newDoneUI = document.createElement("a");
	// newDoneUI.setAttribute("id", this.index + "-done-icon");
	newDoneUI.setAttribute("class", "done");
	newDoneUI.setAttribute("data-icon", "Avklarad");
	document.getElementById(this.index + "-done").appendChild(newDoneUI);
};

ItemCreator.prototype.addItemHandle = function(){
	let newHandle = document.createElement("div");
	newHandle.setAttribute("class", "item-handle");
	newHandle.innerHTML = "⋯";
	document.getElementById(this.index).appendChild(newHandle);
};

ItemCreator.prototype.addLine = function(){
	let newLine = document.createElement("div");
	newLine.setAttribute("class", "line");
};

ItemCreator.prototype.addDoneItems = function(){
	let newDoneItem = document.createElement("div");
	newDoneItem.setAttribute("class", "done-items");
	newDoneItem.innerHTML = this.content;
	doneItemsFeed.appendChild(newDoneItem);
}

var controller = {
	addItem: function(input){
		let index = model.getIndex();
		model.items.push(index);
		var item = new ItemCreator();
		item.index = index;
		item.content = input;
		view.createItem(item);
	},

	selectItem: function(index){
		model.selectedItem.push(index);
		view.displaySelectItem(index);
	},

	unSelectItem: function(index){
		model.selectedItem.pop();
		view.displayUnSelectItem(index);
	},

	deleteAll: function(){
		if (confirm("Är du säker på att du vill rensa hela listan? Du kommer inte längre ha något att göra!")){
			if (model.items.length > 0){
				for(i = model.items.length - 1;i >= 0;i--){
				model.selectedItem.pop();
				view.displayDeleteItem(i);
				model.items.pop();

			}
			view.refocus();
			} else if (model.items.length === 0) {
				window.location.reload();
			}
		}
	},

	doneItem: function(item){
		var doneItem = new ItemCreator();
		let content = model.content(item);
		doneItem.index = undefined;
		doneItem.content = content.innerHTML;
		model.doneItems.push(content.innerHTML);
		model.selectedItem.pop();
		let deletedIndex = item.getAttribute("id");
		view.displayDeleteItem(deletedIndex);
		controller.sortItems(deletedIndex);

		view.displayDoneItem(doneItem);
	},

	deleteItem: function(index){
		let deletedIndex = index;
		let item = document.getElementById(deletedIndex);
		let content = model.content(item).innerHTML;
		if (confirm(`Är du säker på att du inte längre vill göra följande: ${content}?`)){
			model.selectedItem.pop();
			view.displayDeleteItem(deletedIndex);
			controller.sortItems(deletedIndex);
		}
	},

	sortItems: function(deletedIndex){
		let items = model.getItems();
		for(i=deletedIndex;i < items.length;i++){
			var item = items[i];
			item.setAttribute("id", i);
			model.del(item).setAttribute("id", i + "-del");
			model.done(item).setAttribute("id", i + "-done");
		}
		model.items.pop();
		view.refocus();
	},

	getEventObjIndex: function(eventObj) {
		if (eventObj.target.getAttribute("type") === "checkbox"){
		let index = eventObj.target.parentElement.parentElement.getAttribute("id");
		return index;
		} else {
			let index = eventObj.target.parentElement.getAttribute("id");
			return index;
		}
	}
};

var model = {
	items: [],
	selectedItem: [],
	doneItems: [],

	//item-hierarchy
	checkbox: function(item){return item.firstChild.firstChild;},
	content: function(item){return item.firstChild.nextSibling;},
	del: function(item){return item.firstChild.nextSibling.nextSibling;},
	done: function(item){return item.firstChild.nextSibling.nextSibling.nextSibling;},
	handle: function(item){return item.lastChild;},

	isSelected: function(){
		return (this.selectedItem.length > 0);
	},
	
	isEmpty: function(){
		return (this.items.length === 0);
	},

	isDone: function(){
		return (this.doneItems.length > 0);
	},

	getIndex: function(){
		return this.items.length;
	},

	getEmptyMessage: function(){
		let p1 = "<p>";
		let p2 = "</p>";
		let messages = ["Du har inget att göra...", "Ja du, vad ska du göra?", "Phew, inget att göra. Dags att slappa!", "För du vill väl ändå göra nånting!?", "Du har säkert massor att uträtta. Sätt igång med listan! Marsch!", "Du är väl inte lat? Skriv, skriv, skriv...", "Jag vet! Slappa! Att-göra-lista: Slappa!", "Förslagsvis: mäkla fred på jorden...", "Äh, skit i listan. Fri improvisationsdans nu!"];
		let rand = Math.floor(Math.random() * messages.length);
		return p1 + messages[rand] + p2;
	},

	getDoneMessage: function(){
		let p1 = "<p>";
		let p2 = "</p>";
		let messages = ["Då var vi väl klara då!", "Grattis, allt är gjort", "När allt är sagt och gjort...", "Inget mer att göra?", "Men... Vad ska du nu göra då?", "Bra jobbat!", "Grymt jobbat!", "Du fick allt gjort, wow, vilken klippa!"];
		let rand = Math.floor(Math.random() * messages.length);
		return p1 + messages[rand] + p2;
	},

	getItems: function(){
		var items = document.querySelectorAll("div.item");
		return items;
	},

	getSelectedItem: function(){
		var selected = document.getElementById(model.selectedItem[0]);
		return selected;
	},

	getPercent: function(){
		let number = Math.floor((model.doneItems.length / (model.doneItems.length + model.items.length) ) * 100);
		return number;
	}
};

var view = {
	createItem: function(item) {
		item.addItem();
		item.addCheckbox();
		item.addContent();
		item.addDelDiv();
		item.addDelUI();
		item.addDoneDiv();
		item.addDoneUI();
		item.addItemHandle();
		item.addLine();
		view.refocus();
	},

	displaySelectItem: function(index){
		let item = document.getElementById(index);
		item.style.background = "var(--secondary-sel-clr";
		let checkbox = model.checkbox(item);
		let content = model.content(item);
		let del = model.del(item);
		let done = model.done(item);
		let handle = model.handle(item);
		checkbox.checked = true;
		del.style.display = "inline-flex";
		done.style.display = "inline-flex";
		handle.style.display = "none";
		view.refocus();
	},

	displayUnSelectItem: function(index){
		let item = document.getElementById(index);
		item.style.background = "var(--secondary-clr)";
		let checkbox = model.checkbox(item);
		let content = model.content(item);
		let del = model.del(item);
		let done = model.done(item);
		let handle = model.handle(item);
		checkbox.checked = false;
		del.style.display = "none";
		done.style.display = "none";
		handle.style.display = "inline-flex";
		view.refocus();
	},

	displayDoneItem: function(doneItem){
		if (doneItemsHeader.getAttribute("class") === "none"){
			doneItemsHeader.setAttribute("class", "block");
		}
		doneItem.addDoneItems();
	},

	displayDeleteItem: function(deletedIndex){
		let item = document.getElementById(deletedIndex);
		item.remove();
		view.refocus();
	},

	displayInput: function(isEmpty){
		if (isEmpty && !model.isDone()){
			deleteAll.style.transform = "translateX(+20px)";
			deleteAll.style.display = "none";
			progressBar.style.display = "none";
			itemsHeader.style.display = "none";
			emptyMessage.innerHTML = model.getEmptyMessage();
		} else if (isEmpty && model.isDone()) {
			let goodJob = "<inline class=goodJob>Du är klar! </inline>";
			emptyMessage.innerHTML = goodJob + model.getDoneMessage();
			deleteAll.style.display = "inline-flex";
			deleteAll.style.transform = "translateX(0px)";
			progressBar.style.display = "inline-flex";
			progressText.style.display = "none";
			itemsHeader.style.display = "block";
		} else{
			emptyMessage.innerHTML = "";
			deleteAll.style.display = "inline-flex";
			deleteAll.style.transform = "translateX(0px)";
			progressBar.style.display = "inline-flex";
			progressText.style.display = "block";
			itemsHeader.style.display = "block";
		}
	},

	progressShake: function(){
		progressBar.setAttribute("class", "anim");
		setTimeout(()=>{
			progressBar.setAttribute("class", "block");
		}, 500);
	},

	refocus: function(){
		inputField.value = "";
		inputField.focus();
		loadState.init();
	}
};

var loadState = {
	init: function() {
		let setPercent = function(){
			progress.style.width = model.getPercent() + "%";
			if (model.getPercent() === 100){
				setTimeout(()=>{
					view.progressShake();
				}, 150);
			}
			progressText.style.display = "inline-flex";
			progressText.innerHTML = model.getPercent() + "%";
		}
		setPercent();
		switch (loadState.getState()){
			case empty:
			view.displayInput(true);
			add.onclick = eventHandlers.addHandler;
			inputField.onkeypress = eventHandlers.returnHandler;
			deleteAll.removeEventListener("click", eventHandlers.deleteAllHandler);
			break;



			case noSelect:
			view.displayInput(false);
			deleteAll.addEventListener("click", eventHandlers.deleteAllHandler);
			var items = model.getItems();
			for (i=0;i<items.length;i++){
				var item = items[i];
				var checkbox = model.checkbox(items[i]);

				checkbox.onclick = eventHandlers.selectHandler;
				item.onclick = eventHandlers.selectHandler;

			}
			break;



			case select:
			view.displayInput(false);
			let sel = model.getSelectedItem();
			sel.onclick = eventHandlers.isSelectedHandler;
			break;


			case done:
			view.displayInput(true);
		}
		// console.log(loadState.getState());
	},

	getState: function(){
		if (model.isEmpty() && !model.isDone()) {
			return empty;
		} else if (!model.isEmpty() && !model.isSelected()) {
			return noSelect;
		} else if (!model.isEmpty() && model.isSelected()) {
			return select;
		} else if (model.isEmpty() && !model.isSelected() && model.isDone()) {
			return done;
		}
	}
};

var eventHandlers = {
	addHandler: function(){
		var input = inputField.value;

		if (input === "" || input === " "){
			view.refocus();
		} else {
			controller.addItem(input);
		}
	},

	deleteAllHandler: function(){
		controller.deleteAll();
	},

	selectHandler: function(eventObj){
		let index = controller.getEventObjIndex(eventObj);
		if (!model.isSelected()) {
			controller.selectItem(index);
		} else if (model.isSelected()){
			let selected = model.getSelectedItem();
			controller.unSelectItem(selected.getAttribute("id"));
			controller.selectItem(index);
		}
	},

	isSelectedHandler: function(eventObj){
		var isChecked;
		switch (eventObj.target.getAttribute("class")){

			case "checkbox":
			if (!this.isChecked){
				eventObj.target.checked = true;
				this.isChecked = true;
				break;
			} else if (this.isChecked){
				eventHandlers.unSelectHandler(eventObj);
				eventObj.target.checked = false;
				this.isChecked = false;
				break;
			}
			break;

			case "item-content":
			eventHandlers.unSelectHandler(eventObj);
			break;

			case "icon":
			eventObj.target.parentElement.click();
			return false;
			break;

			case "del":
			eventHandlers.deleteHandler();
			break;

			case "done":
			eventHandlers.doneHandler();
		}
	},

	unSelectHandler: function(eventObj){
		let index = controller.getEventObjIndex(eventObj);
		controller.unSelectItem(index);
	},

	deleteHandler: function(){
		let index = model.getSelectedItem().getAttribute("id");
		controller.deleteItem(index);
	},

	doneHandler: function(){
		let item = model.getSelectedItem();
		controller.doneItem(item);
	},

	returnHandler: function(e) {
		if (e.keyCode === 13) {
				add.click();
				return false;
		}
	}
};

window.onload = function(){
	loadState.init();
}