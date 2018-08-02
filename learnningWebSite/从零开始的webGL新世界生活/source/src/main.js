// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";

import marked from "marked";
import "highlight.js/styles/solarized-dark.css"
import "./styles/markdown/index.css"

const routes = [
	{ path: "/", component: () => import("./page/Home/index.vue") },
	{ path: "/page1", component: () => import("./page/WebGL是什么/index.vue") },
	{ path: "/page2", component: () => import("./page/获取webGL的上下文/index.vue") },
	{ path: "/page3", component: () => import("./page/GLSL语言/index.vue") },
	{ path: "/page4", component: () => import("./page/编译GLSL语言/index.vue") },
	{ path: "/page5", component: () => import("./page/往里面传值/index.vue") },
	{ path: "/page6", component: () => import("./page/绘制/index.vue") },
	{ path: "/page7", component: () => import("./page/在我们公司项目的使用情况/index.vue") },
	{ path: "/end", component: () => import("./page/End/index.vue") },
];

const router = new VueRouter({
	routes
});

Vue.config.productionTip = false;

Vue.use(VueRouter);

marked.setOptions({
	renderer: new marked.Renderer(),
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: false,
	smartLists: true,
	smartypants: false,
	highlight: function(code) {
		return require('highlight.js').highlightAuto(code).value;
	} 
});

window.marked = marked;

// const getLocal = key => JSON.parse(localStorage.getItem(key) || '{}')
// const saveLocal = (key, value) => localStorage.setItem(key, JSON.stringify(value))

/* eslint-disable no-new */
new Vue({
	el: "#app",
	components: { App },
	template: "<App/>",
	router
});
