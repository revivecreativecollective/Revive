/* Lightweight, progressive-enhancement water motion. Real photos remain as
 * static fallbacks. The river mask leaves the banks and sky untouched.
 * Canvases render only while on screen, visible, and motion is enabled.
 */
(() => {
  'use strict';
  const fragmentSource = `
    precision mediump float;
    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform vec2 u_imageSize;
    uniform float u_time;
    uniform float u_river;
    void main() {
      vec2 screen = vec2(gl_FragCoord.x, u_resolution.y-gl_FragCoord.y) / u_resolution;
      float screenRatio = u_resolution.x/u_resolution.y;
      float imageRatio = u_imageSize.x/u_imageSize.y;
      vec2 scale = vec2(min(screenRatio/imageRatio,1.0),min(imageRatio/screenRatio,1.0));
      vec2 uv = (screen-0.5)*scale+0.5;
      if(u_river > 1.5) {
        // Cloud-only photo-space bands, fading before the mountains and trees.
        float wisps = smoothstep(0.36,0.39,uv.y)*(1.0-smoothstep(0.48,0.51,uv.y));
        float bank = smoothstep(0.54,0.565,uv.y)*(1.0-smoothstep(0.615,0.633,uv.y));
        float tree = smoothstep(0.84,0.94,uv.x)*smoothstep(0.58,0.61,uv.y);
        float cloudMask = max(wisps,bank)*(1.0-tree);
        vec2 drift = vec2(sin(u_time*0.085)*0.006, sin(u_time*0.065+uv.x*6.0)*0.0008)*cloudMask;
        gl_FragColor = vec4(texture2D(u_image,clamp(uv+drift,0.001,0.999)).rgb,1.0);
        return;
      }
      float mask = 1.0;
      if(u_river > 0.5) {
        // Image-space boundaries: a narrow channel opens into broad foreground water.
        float depth = smoothstep(0.61,0.87,uv.y);
        float center = mix(0.55,0.48,depth);
        float halfWidth = mix(0.018,0.49,depth);
        mask = smoothstep(0.615,0.655,uv.y)*(1.0-smoothstep(halfWidth-0.025,halfWidth,abs(uv.x-center)));
      }
      float w1 = sin(uv.y*130.0+uv.x*16.0-u_time*0.9);
      float w2 = sin(uv.y*210.0-uv.x*24.0+u_time*0.65);
      float amplitude = mix(0.0018,0.0010,u_river)*mask;
      vec2 offset = vec2(w1*0.7+w2*0.3, sin(uv.x*45.0+uv.y*90.0+u_time*0.6)*0.35)*amplitude;
      vec3 color = texture2D(u_image,clamp(uv+offset,0.001,0.999)).rgb;
      float luminance = dot(color,vec3(0.2126,0.7152,0.0722));
      float reflection = smoothstep(0.28,0.7,luminance);
      float shimmer = pow(max(0.0,w1*w2),5.0)*reflection*mask;
      color += vec3(1.0,0.91,0.73)*shimmer*mix(0.11,0.035,u_river);
      gl_FragColor = vec4(color,1.0);
    }
  `;
  const vertexSource = 'attribute vec2 a_position; void main(){gl_Position=vec4(a_position,0.0,1.0);}';
  let paused = document.documentElement.classList.contains('motion-paused');
  const scenes = [];
  let frame = 0, lastTime = 0, elapsed = 0;
  function stop() { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
  function start() { if (!frame && !paused && !document.hidden && scenes.some(s => s.visible && s.ready)) frame = requestAnimationFrame(tick); }
  function tick(now) {
    frame = 0;
    if (paused || document.hidden || !scenes.some(s => s.visible && s.ready)) { lastTime = 0; return; }
    if (!lastTime) lastTime = now;
    if (now-lastTime >= 32) {
      elapsed += Math.min(now-lastTime,100)/1000; lastTime = now;
      scenes.forEach(scene => { if(scene.visible && scene.ready) scene.draw(elapsed); });
    }
    frame = requestAnimationFrame(tick);
  }
  function setup(canvas) {
    let gl;
    try { gl = canvas.getContext('webgl', {alpha: false, antialias: false, powerPreference: 'low-power'}); } catch { return; }
    if (!gl) return;
    function shader(type, source) {
      const result = gl.createShader(type); gl.shaderSource(result,source); gl.compileShader(result);
      if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) { gl.deleteShader(result); throw new Error('Water shader unavailable'); }
      return result;
    }
    let program;
    try {
      program = gl.createProgram();
      gl.attachShader(program,shader(gl.VERTEX_SHADER,vertexSource)); gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragmentSource)); gl.linkProgram(program);
      if (!gl.getProgramParameter(program,gl.LINK_STATUS)) return;
    } catch { return; }
    gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program,'a_position'); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
    const uniforms = Object.fromEntries(['u_image','u_resolution','u_imageSize','u_time','u_river'].map(name => [name,gl.getUniformLocation(program,name)]));
    gl.uniform1i(uniforms.u_image,0); gl.uniform1f(uniforms.u_river,canvas.dataset.scene === 'desert' ? 2 : canvas.dataset.scene === 'river' ? 1 : 0);
    const scene = {canvas, ready: false, visible: false, draw(time) {
      const ratio = Math.min(devicePixelRatio || 1,1.25);
      const width = Math.max(1,Math.round(canvas.clientWidth*ratio)), height = Math.max(1,Math.round(canvas.clientHeight*ratio));
      if (canvas.width !== width || canvas.height !== height) { canvas.width=width; canvas.height=height; gl.viewport(0,0,width,height); }
      gl.uniform2f(uniforms.u_resolution,width,height); gl.uniform1f(uniforms.u_time,time); gl.drawArrays(gl.TRIANGLES,0,6);
    }};
    scenes.push(scene);
    const image = new Image(); image.decoding = 'async';
    image.onload = () => {
      if (gl.isContextLost()) return;
      const texture = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      try { gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image); } catch { return; }
      gl.uniform2f(uniforms.u_imageSize,image.naturalWidth,image.naturalHeight); scene.ready=true; scene.draw(0); canvas.classList.add('ready'); start();
    };
    image.src = canvas.dataset.image;
    new IntersectionObserver(entries => { scene.visible=entries[0].isIntersecting; start(); },{rootMargin:'100px'}).observe(canvas);
    new ResizeObserver(() => { if(scene.ready) scene.draw(elapsed); }).observe(canvas);
    canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); scene.ready=false; canvas.classList.remove('ready'); });
  }
  document.querySelectorAll('.water-canvas').forEach(setup);
  window.addEventListener('revive:motion', event => { paused=event.detail.paused; if(paused) stop(); else start(); });
  document.addEventListener('visibilitychange', () => { document.documentElement.classList.toggle('tab-hidden', document.hidden); if(document.hidden) stop(); else start(); });
})();
