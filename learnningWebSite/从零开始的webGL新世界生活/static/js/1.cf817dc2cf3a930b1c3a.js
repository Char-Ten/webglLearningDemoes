webpackJsonp([1],{"4V01":function(t,i,e){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var s=e("TPqk"),a=e.n(s),n=e("NNoH"),r=e.n(n),o=e("qctW"),m=e.n(o),g={data:function(){return{list:[],isShowImage1:!1,isShowImage2:!1,isShowImage3:!1,img1:a.a,img2:r.a,img3:m.a}},methods:{clickForm:function(t){t.preventDefault(),this.res.length?this.list.push(this.res.pop()):this.isShowImage1?this.isShowImage2?this.isShowImage3?this.$router.history.push("/page2"):this.isShowImage3=!0:this.isShowImage2=!0:this.isShowImage1=!0}},created:function(){this.res=["优化加速原理","浏览器底层API","OpenGL ES 2.0/3.0","光栅化引擎"]}},c={render:function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"page",attrs:{id:"PPage1"},on:{click:t.clickForm}},[e("h2",[t._v("WebGL是什么")]),t._v(" "),e("transition-group",{attrs:{name:"list",tag:"ul"}},t._l(t.list,function(i,s){return e("li",{key:s},[t._v(t._s(i))])})),t._v(" "),e("transition",{attrs:{name:"fade"}},[t.isShowImage1?e("img",{key:"1",attrs:{src:t.img1}}):t._e()]),t._v(" "),e("transition",{attrs:{name:"fade"}},[t.isShowImage2?e("img",{key:"1",staticStyle:{margin:"100px","margin-bottom":"0"},attrs:{src:t.img2}}):t._e()]),t._v(" "),e("transition",{attrs:{name:"fade"}},[t.isShowImage3?e("img",{key:"1",staticStyle:{margin:"200px","margin-bottom":"0"},attrs:{src:t.img3}}):t._e()])],1)},staticRenderFns:[]};var h=e("VU/8")(g,c,!1,function(t){e("AYKK")},null,null);i.default=h.exports},AYKK:function(t,i){},NNoH:function(t,i,e){t.exports=e.p+"static/img/01.f9b3e64.jpeg"},TPqk:function(t,i,e){t.exports=e.p+"static/img/00.f099690.jpeg"},qctW:function(t,i,e){t.exports=e.p+"static/img/02.f1dfa31.jpeg"}});
//# sourceMappingURL=1.cf817dc2cf3a930b1c3a.js.map