function Elementer(arr) {
    var self = this;
    arr.forEach(function(item) {
        var type = item[0];
        var name = item.substr(1);
        if (type === '#') {
            self[name] = document.getElementById(name);
        }
    })
}

Elementer.prototype.addAttr = function(obj) {
    for (var attr in obj) {
        this[attr] = obj[attr]
    }
    return this;
}

Elementer.prototype.addItem = function(k, v) {
    this[k] = v;
}

var el = new Elementer([
    '#uploaderBox',
    '#uploader',
    '#aSide',
    '#aSideContent',
    '#main'
]);
el.addAttr({
    reader: new FileReader(),
    masterMap: new Image(),
    normalMap: document.createElement('canvas'),
    renderer: document.createElement('canvas'),
    mainOutput: document.createElement('canvas')
});


var ctx = {
    renderer: el.renderer.getContext('webgl')||el.renderer.getContext('experimental-webgl'),
    normalMap: el.normalMap.getContext('2d'),
    mainOutput: el.mainOutput.getContext('2d')
}
if(!ctx.renderer){
    alert('你的浏览器不支持webgl，请使用比较牛逼的chrome谷歌浏览器或者edge浏览器');
}

var light = {
    x: 0.5,
    y: 1.0,
    z: 0.1,
}

el.uploader.addEventListener('change', readFileData);
el.reader.addEventListener('load', setMasterMap)
el.masterMap.addEventListener('load', loadNormalMapShaders);
el.mainOutput.addEventListener('mousemove', atv_MainOuptMove);
el.mainOutput.addEventListener('wheel', atv_MainOuptWheel);
el.mainOutput.addEventListener('touchmove', atv_MainOuptTouchMove);

function atv_MainOuptMove(e) {
    light.x = e.offsetX / el.mainOutput.offsetWidth;
    light.y = e.offsetY / el.mainOutput.offsetHeight;
    var gl = ctx.renderer;
    bindRendererUniform(gl, el.renderer.width, el.renderer.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    el.mainOutput.width = el.renderer.width;
    el.mainOutput.height = el.renderer.height;
    ctx.mainOutput.drawImage(el.renderer, 0, 0);
}

function atv_MainOuptTouchMove(e) {}

function atv_MainOuptWheel(e) {
    e.preventDefault()
    var z = light.z + 0.01;
    var gl = ctx.renderer;
    if (e.deltaY > 0) {
        z = light.z - 0.01;
    }
    if (z > 1.0) z = 1.0;
    if (z < 0.0) z = 0.0;
    light.z = z;

    bindRendererUniform(gl, el.renderer.width, el.renderer.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    el.mainOutput.width = el.renderer.width;
    el.mainOutput.height = el.renderer.height;
    ctx.mainOutput.drawImage(el.renderer, 0, 0);
}


function readFileData(e) {
    var file = this.files[0];
    if (/image\/\w+/.test(file.type)) {
        el.reader.readAsDataURL(file);
    }
}

function setMasterMap() {
    el.masterMap.src = this.result;
    el.uploaderBox.classList.add('z-hide');
}

function loadNormalMapShaders() {
    var w = el.masterMap.width;
    var h = el.masterMap.height;
    el.normalMap.width = el.renderer.width = w;
    el.normalMap.height = el.renderer.height = h;
    ctx.renderer.viewport(0, 0, w, h);
    reqUseProgram(ctx.renderer, './index/shader/nmo_v.glsl', './index/shader/nmo_f.glsl', renderNormalMap);
}

function renderNormalMap(gl) {
    createVerticesBuffer(gl);

    gl.activeTexture(gl.TEXTURE0);
    createTexByImage(gl, el.masterMap);

    gl.uniform1i(gl.getUniformLocation(program, 'u_Sampler'), 0);
    gl.uniform2f(gl.getUniformLocation(program, 'u_step'), 1.0 / el.masterMap.width, 1.0 / el.masterMap.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    ctx.normalMap.drawImage(el.renderer, 0, 0);
    reqUseProgram(gl, './index/shader/nmo_v.glsl', './index/shader/light_f.glsl', renderLight)

}


function renderLight(gl) {
    createVerticesBuffer(gl);

    gl.activeTexture(gl.TEXTURE1);
    createTexByImage(gl, el.normalMap);

    bindRendererUniform(gl, el.masterMap.width, el.masterMap.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    el.mainOutput.width = el.renderer.width;
    el.mainOutput.height = el.renderer.height;
    ctx.mainOutput.drawImage(el.renderer, 0, 0);

    updateRenderer2Page();
}

function updateRenderer2Page() {
    el.aSideContent.appendChild(
        createMiniMapSection(
            h(el.masterMap, '.mini-map__img'),
            '原图'
        )
    );

    el.aSideContent.appendChild(
        createMiniMapSection(
            h(el.normalMap, '.mini-map__img'),
            '法线贴图'
        )
    );

    el.aSideContent.appendChild(
        createMiniMapSection(
            h(el.renderer, '.mini-map__img'),
            '效果图'
        )
    );


    el.main.appendChild(el.mainOutput)

}

function createMiniMapSection(image, text) {
    return h('section', '.mini-map', null, [
        h('div', '.mini-map__box', null, [image]),
        h('p', '.mini-map__txt', null, [text])
    ])
}

function reqUseProgram(webgl, vUrl, fUrl, callback) {
    program = webgl.createProgram();
    var isFin = 0;
    req(vUrl, webgl.VERTEX_SHADER);
    req(fUrl, webgl.FRAGMENT_SHADER);

    function req(url, shaderType) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.onload = function() {
            var shader = webgl.createShader(shaderType);
            webgl.shaderSource(shader, xhr.responseText);
            webgl.compileShader(shader);
            webgl.attachShader(program, shader);
            isFin++;
            if (isFin === 2) {
                webgl.linkProgram(program);
                webgl.useProgram(program);
                callback(webgl)
            }
        };
        xhr.send();
    }
}

function createVerticesBuffer(webgl) {
    var vertices = [1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0];
    var verticesBuffer = new Float32Array(vertices);

    var buffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, verticesBuffer, webgl.STATIC_DRAW);

    var vec4Position = null;
    webgl.bindAttribLocation(program, vec4Position, 'a_Position');
    webgl.enableVertexAttribArray(vec4Position);
    webgl.vertexAttribPointer(vec4Position, 2, webgl.FLOAT, false, 0, 0);
    return buffer;
}

function createTexByImage(webgl, image) {
    var texture = webgl.createTexture();
    webgl.bindTexture(webgl.TEXTURE_2D, texture);
    webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, image);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);
    return texture
}

function bindRendererUniform(gl, w, h) {
    gl.uniform1i(gl.getUniformLocation(program, 'u_Sampler_0'), 0);
    gl.uniform1i(gl.getUniformLocation(program, 'u_Sampler_1'), 1);
    gl.uniform2f(gl.getUniformLocation(program, 'u_step'), 1.0 / w, 1.0 / h);
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), w, h)
    gl.uniform3f(gl.getUniformLocation(program, 'u_light'), light.x, 1.0 - light.y, light.z);
}

function h() {
    var arg = arguments;
    var attr = arg[1];
    var node = arg[0];
    if (typeof arg[0] === 'string') {
        node = document.createElement(node)
    }

    if (typeof attr === 'string') {
        var id = attr.match(/#[\w\-]/);
        if ((id instanceof Array) && typeof id[1] === 'string') {
            node.id = id[1].replace('#')
        }
        var classList = attr.match(/(?:\.)[\w\-]+/g);
        if (classList instanceof Array) {
            node.className = classList.join(' ').replace(/\./g, '');
        }
        var attrs = attr.match(/\[[\w=]+\]/g);
        if (attrs instanceof Array) {
            attrs.forEach(function(item) {
                item = item.replace(/(\[|\])/g, '').split('=');
                node.setAttribute(item[0], item[1]);
            })
        }
    }
    if (typeof arg[2] === 'object') {
        for (var attr in arg[2]) {
            node.addEventListener(attr, arg[2][attr]);
        }
    }

    if (arg[3] instanceof Array) {
        arg[3].forEach(function(item) {
            if (item instanceof Node) return node.appendChild(item);
            if (typeof item === 'string') {
                return node.appendChild(document.createTextNode(item));
            }
            node.appendChild(h(item))
        })
    }

    return node;
}