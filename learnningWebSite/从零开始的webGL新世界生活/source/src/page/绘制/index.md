```javascript
// 设置视口
gl.viewport(0, 0, 400, 300);

// 设置清除颜色
gl.clearColor(0, 0, 0, 0);

// 清除画布
gl.clear(gl.COLOR_BUFFER_BIT);

// 更新画布
gl.drawArrays(gl.TRIANGLES, 0, 6);
```
> webGL的API设计得如此别扭，主要还是为了保持跟其他环境一致导致的。如果你去看`c++`的`OpenGL`的例子，`gl.drawArrays`在`c++`里面写成`glDrawArrays`，函数参数什么的都一样。  
不管是使用`java`开发安卓下的`OpenGL ES`还是使用`oc/swift`开发`ios`下的`OpenGL ES`，API都大同小异。  