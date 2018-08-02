```javascript
/**
* @name createProgram
* @desc 创建着色器程序
* @param {WebGLRenderingContext} gl - webGl的context
* @param {String} vsource - 顶点着色器源码字符串
* @param {String} fsource - 片元着色器源码字符串
* @return {WebGLProgram}  - 着色器程序对象
*/
function createProgram(gl,vsource,fsource){
  const program = gl.createProgram();

  const createShader = (source,type)=>{
    const shader = gl.createShader(type);
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    gl.attachShader(program,shader);
    return shader;
  }

  createShader(vsource,gl.VERTEX_SHADER);
  createShader(fsource,gl.FRAGMENT_SHADER);
  gl.linkProgram(program);
  return program ;
}

//使用
var cvs =document.createElement("canvas");
var gl = cvs.getContext("webgl");
var program = createProgram(
  gl,
  `假装是顶点着色器源码`,
  `假装是片元着色器源码`
)；
gl.useProgram(program)

```