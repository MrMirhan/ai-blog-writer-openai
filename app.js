var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { spawn } = require('child_process');

function runPython() {
    var dataToSend;

    const python = spawn('/opt/homebrew/bin/python3', ['/Users/mirhanmac/Desktop/Projects/ai-blog-writer-openai/apiServer/app.py']);

    python.stdout.on('data', function(data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
        console.log(dataToSend)
    });

    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        console.log(dataToSend)
    });
}

runPython()


var indexRouter = require('./routes/index');
var documentsRouter = require('./routes/documents');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/documents', documentsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;