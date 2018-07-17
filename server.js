var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: 'Lunch meet',
	completed: false
}, {
	id: 2,
	description: 'Shopping',
	completed: false
}, {
	id: 3,
	description: 'Pet supplies',
	completed: true
}];

app.get('/', function(req, res){
	res.send('To do API root');
});

app.get('/todos', function(req, res){
	res.json(todos);
});

app.get('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id);
	var matchedTodo;
	todos.forEach(function(todo){
		if(todoId === todo.id){
			matchedTodo = todo;
		}
	});
	if(matchedTodo){
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
	res.send('Asking for todo id: ' + req.params.id);
}); 

app.listen(PORT, function(){
	console.log('Express running at port:' + PORT);
});