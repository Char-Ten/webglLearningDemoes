var webpackServer=require('webpack-dev-server');
var webpackConfig=require('./webpack.dev.conf');
var webpack=require('webpack')

const server=new webpackServer(webpack(webpackConfig));
server.listen(6543);