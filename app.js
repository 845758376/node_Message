//引入模块
var fs = require('fs')
var url = require('url')
var http = require('http')
var querystring = require('querystring')

//创立留言数据类型
var msgs = [{
	name: '张六',
	content: "你好我是张六",
	create_at: '2017-11-14 10:30:32'
}, {
	name: '李四',
	content: "你好我是李四",
	create_at: '2017-11-14 10:30:33'
}, {
	name: '王五',
	content: "你好我是王五",
	create_at: '2017-11-14 10:30:40'
}]

//创立web服务器
var server = http.createServer();
server.on('request', function(req, res) {
	var currentUrl = req.url
	if (currentUrl == '/') {
		fs.readFile('./view/index.html', 'utf8', function(err, data) {
			if (err) res.end('404 Not Found');

			var html = '';
			msgs.forEach(function(item) {
				html +=
					`
				<li class='list-group-item'>
				${item.name}说：${item.content}
				<span class='pull-right'>${item.create_at}</span></li>	
				`
			})
			var data = data.replace('^_^', html)
			res.setHeader('Content-Type', 'text/html;charset=utf-8');
			res.write(data)
			res.end()
		})
	} else if (currentUrl == '/add') {
		fs.readFile('./view/add.html', 'utf8', function(err, data) {
			if (err) res.end('404 Not Found');
			res.setHeader('Content-Type', 'text/html;charset=utf-8');
			res.write(data)
			res.end()

		})
	} else if (currentUrl.indexOf('/public') === 0) {
		//响应静态资源
		fs.readFile('./' + currentUrl, 'utf8', function(err, data) {
			if (err) res.end('404 Not Found');
			//			res.setHeader('Content-Type', 'text/html;charset=utf-8');
			res.write(data)
			res.end()

		})
	} else if (currentUrl.indexOf('/doadd') == 0) {

		if (req.method == 'POST') {
			var postData = '';
			req.on('data', function(chunk) {
				postData += chunk;
			})
			req.on('end', function() {

				paramObj = querystring.parse(postData);
				console.log(paramObj)

				var d = new Date()
				var date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() +
					':' + d.getSeconds();
				var cont = paramObj.content;
				var msg = {
					name: paramObj.name,
					content: cont,
					create_at: date
				}
				msgs.push(msg)
				res.statusCode = 302;
				res.setHeader('Location', '/')
				res.end()
			})

		} else {
			var paramObj = url.parse(req.url, true).query
			console.log(paramObj)

			var d = new Date()
			var date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() +
				':' + d.getSeconds();
			var cont = paramObj.content;
			var msg = {
				name: paramObj.name,
				content: cont,
				create_at: date
			}
			msgs.push(msg)
			res.statusCode = 302;
			res.setHeader('Location', '/')
			res.end()
		}

	} else {
		//否则404
		fs.readFile('./view/404.html', 'utf8', function(err, data) {
			if (err) res.end('404 Not Found');
			res.setHeader('Content-Type', 'text/html;charset=utf-8');
			res.write(data)
			res.end()
		})
	}
})
server.listen(3000, function() {
	console.log('启动成功 ，访问：http://localhost:3000')
})
