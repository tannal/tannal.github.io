class PacManGame extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
                    <style>
                        :host {
                            display: block;
                            width: 100%;
                            aspect-ratio: 1/1;
                        }
                        canvas {
                            width: 100%;
                            height: 100%;
                        }
                    </style>
                    <canvas></canvas>
                `;

    this.canvas = this.shadowRoot.querySelector("canvas");
    this.gl = this.canvas.getContext("webgl2");

    if (!this.gl) {
      console.error("WebGL 2 not supported");
      return;
    }

    this.initGame();
  }

  initGame() {
    // Set up WebGL
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);

    // Create shaders
    const vsSource = `#version 300 es
                    in vec4 aVertexPosition;
                    in vec2 aTextureCoord;

                    uniform mat4 uModelViewMatrix;
                    uniform mat4 uProjectionMatrix;

                    out vec2 vTextureCoord;

                    void main() {
                        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                        vTextureCoord = aTextureCoord;
                    }
                `;

    const fsSource = `#version 300 es
                    precision mediump float;

                    in vec2 vTextureCoord;
                    out vec4 fragColor;

                    uniform sampler2D uSampler;

                    void main() {
                        fragColor = texture(uSampler, vTextureCoord);
                    }
                `;

    const shaderProgram = this.initShaderProgram(vsSource, fsSource);

    this.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(
          shaderProgram,
          "aVertexPosition",
        ),
        textureCoord: this.gl.getAttribLocation(shaderProgram, "aTextureCoord"),
      },
      uniformLocations: {
        projectionMatrix: this.gl.getUniformLocation(
          shaderProgram,
          "uProjectionMatrix",
        ),
        modelViewMatrix: this.gl.getUniformLocation(
          shaderProgram,
          "uModelViewMatrix",
        ),
        uSampler: this.gl.getUniformLocation(shaderProgram, "uSampler"),
      },
    };

    // Initialize buffers and textures
    this.initBuffers();
    this.initTextures();

    // Start game loop
    this.lastTime = 0;
    requestAnimationFrame(this.render.bind(this));
  }

  initBuffers() {
    const positions = [-1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0];

    const textureCoordinates = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];

    const indices = [0, 1, 2, 0, 2, 3];

    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW,
    );

    const textureCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(textureCoordinates),
      this.gl.STATIC_DRAW,
    );

    const indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW,
    );

    this.buffers = {
      position: positionBuffer,
      textureCoord: textureCoordBuffer,
      indices: indexBuffer,
    };
  }

  initTextures() {
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = this.gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = this.gl.RGBA;
    const srcType = this.gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // Blue
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel,
    );

    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR,
    );

    this.texture = texture;
  }

  render(now) {
    now *= 0.001; // Convert to seconds
    const deltaTime = now - this.lastTime;
    this.lastTime = now;

    this.drawScene(deltaTime);

    requestAnimationFrame(this.render.bind(this));
  }

  drawScene(deltaTime) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    const projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix, -1, 1, -1, 1, 0.1, 100);

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -1.0]);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
    this.gl.vertexAttribPointer(
      this.programInfo.attribLocations.vertexPosition,
      2,
      this.gl.FLOAT,
      false,
      0,
      0,
    );
    this.gl.enableVertexAttribArray(
      this.programInfo.attribLocations.vertexPosition,
    );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.textureCoord);
    this.gl.vertexAttribPointer(
      this.programInfo.attribLocations.textureCoord,
      2,
      this.gl.FLOAT,
      false,
      0,
      0,
    );
    this.gl.enableVertexAttribArray(
      this.programInfo.attribLocations.textureCoord,
    );

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

    this.gl.useProgram(this.programInfo.program);

    this.gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix,
    );
    this.gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix,
    );

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 0);

    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
  }

  initShaderProgram(vsSource, fsSource) {
    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = this.gl.createProgram();
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      console.error(
        "Unable to initialize the shader program: " +
          this.gl.getProgramInfoLog(shaderProgram),
      );
      return null;
    }

    return shaderProgram;
  }

  loadShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(
        "An error occurred compiling the shaders: " +
          this.gl.getShaderInfoLog(shader),
      );
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }
}

customElements.define("pac-man-game", PacManGame);

// Simple matrix library (you might want to use a more robust library in a real project)
const mat4 = {
  create: function () {
    return new Float32Array(16);
  },
  ortho: function (out, left, right, bottom, top, near, far) {
    let lr = 1 / (left - right);
    let bt = 1 / (bottom - top);
    let nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  },
  translate: function (out, a, v) {
    let x = v[0],
      y = v[1],
      z = v[2];
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;

    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];

      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;

      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
  },
};
