var express = require('express');
var path=require('path');
var app=express();
var proxy = require('express-http-proxy');
var url=require('url');
var bodyParser=require('body-parser');
var data=require('./data.json');
var fs=require('fs');

var unWin=data;
var win=[];
var winTypes={}

// app.use(bodyParser.json())

app.use(express.static(path.join(__dirname,'dist')));
app.use('/index.php', proxy('http://lottery.3ktest.com:8080'));
// app.get('/index.php',function(req,res){
// 	var urlParsed=url.parse(req.url,true);
// 	luck[urlParsed.query.ac](req,res,urlParsed.query)
// })
app.post('/create/json',function(req,res){
	var wrSteam=fs.createWriteStream(path.join(__dirname,'/pic.txt'));
	req.on('data',function(chunk){
		wrSteam.write(chunk);
	});
	req.on('end',function(){
		wrSteam.end();

	})


	res.end('233')
})
app.listen(6450);

var luck={
	prize_list(req,res){
		res.json({
			code:0,
			error:'ok',
			data:[{
				id:1,
				name:'一等奖'
			},{
				id:2,
				name:'二等奖'
			},{
				id:3,
				name:'三等奖'
			}]
		})
	},
	count(req,res){
		res.json({
			code:0,
			"data": {
				"data_num": data.length,
				"winners_num": win.length
			}
		})
	},
	start(req,res,query){
		let type=query
	}
}