webpackJsonp([4],{PjUn:function(r,n){},uNwa:function(r,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=t("ud8m"),e=t.n(a),s={data:function(){return{md:marked(e.a)}}},i={render:function(){var r=this.$createElement,n=this._self._c||r;return n("div",{staticClass:"page",attrs:{id:"PPage5"}},[n("h2",[this._v("绘制")]),this._v(" "),n("div",{staticClass:"markdown",domProps:{innerHTML:this._s(this.md)}}),this._v(" "),n("router-link",{staticClass:"nextPage",attrs:{to:"/page7"}},[this._v("下一页>>")])],1)},staticRenderFns:[]};var l=t("VU/8")(s,i,!1,function(r){t("PjUn")},null,null);n.default=l.exports},ud8m:function(r,n){r.exports="```javascript\r\n// 设置视口\r\ngl.viewport(0, 0, 400, 300);\r\n\r\n// 设置清除颜色\r\ngl.clearColor(0, 0, 0, 0);\r\n\r\n// 清除画布\r\ngl.clear(gl.COLOR_BUFFER_BIT);\r\n\r\n// 更新画布\r\ngl.drawArrays(gl.TRIANGLES, 0, 6);\r\n```\r\n> webGL的API设计得如此别扭，主要还是为了保持跟其他环境一致导致的。如果你去看`c++`的`OpenGL`的例子，`gl.drawArrays`在`c++`里面写成`glDrawArrays`，函数参数什么的都一样。  \r\n不管是使用`java`开发安卓下的`OpenGL ES`还是使用`oc/swift`开发`ios`下的`OpenGL ES`，API都大同小异。  "}});
//# sourceMappingURL=4.a6a34ff8d10404aaf2d6.js.map