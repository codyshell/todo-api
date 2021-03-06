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
	var queryParams = req.query;
	var filteredTodos = todos;
	
	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed: false});
	}
	
	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
		filteredTodos = _.filter(filteredTodos, function(todo){
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}
	res.json(filteredTodos);
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

app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	if(!matchedTodo){
		res.status(404).send("Error: Not found");
	} else{
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});

app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};
	
	if(!matchedTodo){
		console.log('Error');
		return res.status(404).send();
	}
	
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}
	
	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length >0) {
		validAttributes.description = body.description;
	} else if(body.hasOwnProperty('description')){
		return res.status(400).send();
	}
	
	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);	
});

app.listen(PORT, function(){
	console.log('Express running at port:' + PORT);
});