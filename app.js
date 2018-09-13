var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var engine = require('ejs-layout');
//set static path
var path = require('path');
app.use(express.static(path.join(__dirname,'public')));

// get router
 var indexRouter = require('./routes/index');
 var universityRouter = require('./routes/university');
 var facultyRouter = require('./routes/faculty');
 var departmentRouter = require('./routes/department');

// var userRouter = require('./routes/user');
app.use(indexRouter);
app.use(universityRouter);
app.use(facultyRouter);
app.use(departmentRouter);

// app.use(userRouter);

//view engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.engine('ejs',engine.__express);

//body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//set up server
app.listen(3000,function(){
    console.log("Server running on port 3000 ... ");
});
