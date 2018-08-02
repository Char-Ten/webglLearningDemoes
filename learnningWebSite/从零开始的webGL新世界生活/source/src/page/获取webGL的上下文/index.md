* 获取上下文的方式跟 2d 绘制时候的一样  
* 如果是旧版本的 IE 或者 edge 的话，要使用`getContext('experimental-webgl')`
* 最后判断一下浏览器到底支不支持，不支持也可以什么不做或者给用户一个友好的提示

```javascript
var cvs = document.createElement("canvas");
var gl = cvs.getContext("webgl") || cvs.getContext("experimental-webgl");
if (!gl) {
	//给用户一个友好的提示
	throw "CNM你的浏览器不支持webgl";
}
```
