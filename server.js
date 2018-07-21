var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;
var _=require('underscore');

app.use(bodyParser.json());
/* var todos = [{
	id: 1,
	description: 'Lunch meet',
	completed: false
}, {
	id: 2,
	description: 'Go Shopping',
	completed: false
}, {
	id: 3,
	description: 'Pet supplies',
	completed: true
}]; */
var todos = [];
var todoNextId = 1;

app.get('/', function(req, res){
	res.send('To do API root');
});

app.get('/todos', function(req, res){
	res.json(todos);
});
//GET /todos/:id without using underscorejs
/* app.get('/todos/:id', function(req, res){
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
}); */ 
//GET /todos/:id using underscorejs
app.get('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});
		if(matchedTodo){
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
})
//POST /todos without using underscorejs
/* app.post('/todos', function(req, res){
	var body = req.body;
	body.id = todoNextId++;
	todos.push(body);
	//console.log(body);
	res.json(body);
}); */
//POST /todos using underscorejs for validations
app.post('/todos', function(req, res){
	var body = _.pick(req.body, 'description', 'completed');
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send();
	}
	body.description = body.description.trim();
	body.id = todoNextId++;
	todos.push(body);
	//console.log(body);
	res.json(body);
});
app.listen(PORT, function(){
	console.log('Express running at port:' + PORT);
});