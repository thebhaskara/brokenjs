var TodoApp = function() {
    var self = this;
    self.set('todos', []);
    self.watch('addEvent', function() {

        var item = new TodoItemViewModel();

        var todos = self.get('todos');
        todos.push(item);
        self.set('todos', todos);
    })
}

var app = broken.ViewModel.create({
    html: `
<div>
	<h1>Todo app</h1>
	<button bind-click="addEvent">Add</button>
	<div bind-components="todos"></div>
</div>`,

}, TodoApp);

broken.Dom.appendAll(app._elements);


var TodoItem = function() {

}

var TodoItemViewModel = broken.ViewModel.make({
    html: `
<div >
	<input type="checkbox" bind-value="checked">
	<input type="text" bind-value="text">
	<span bind-show="checked">(done)</span>
	<span bind-hide="checked">(pending)</span>
	<span bind-text="text"></span>
	<i bind-hide="text">Provide some text!</i>
</div>
`,
	name: 'todo-item',
	css: '.todo-item{padding-top:10px;}',

}, TodoItem);