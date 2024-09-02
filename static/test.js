console.log("This works");

// webcompoent counter
class Counter extends HTMLElement {
  constructor() {
    super();
    this.count = 0;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <button id="increment">Increment</button>
      <span>${this.count}</span>
    `;
    this.shadowRoot
      .getElementById("increment")
      .addEventListener("click", () => {
        this.count++;
        this.shadowRoot.querySelector("span").textContent = this.count;
      });
  }
}
customElements.define("my-counter", Counter);

// animation web component
class Animation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }
        div {
          width: 100px;
          height: 100px;
          background-color: red;
          animation: slide 2s infinite;
        }
      </style>
      <div></div>
    `;
  }
}

customElements.define("my-animation", Animation);

class GameOfLife extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        canvas {
          width: 100%;
          height: 100%;
        }
      </style>
      <canvas></canvas>
    `;
    this.canvas = this.shadowRoot.querySelector("canvas");
    this.gl = this.canvas.getContext("webgl2");
    this.width = 512;
    this.height = 512;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.initShaders();
    this.initBuffers();
    this.initTextures();
    this.setupRendering();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initShaders() {
    const vertexShaderSource = `#version 300 es
      in vec4 a_position;
      out vec2 v_texCoord;
      void main() {
        gl_Position = a_position;
        v_texCoord = a_position.xy * 0.5 + 0.5;
      }
    `;

    const fragmentShaderSource = `#version 300 es
      precision highp float;
      uniform sampler2D u_state;
      in vec2 v_texCoord;
      out vec4 outColor;
      void main() {
        float state = texture(u_state, v_texCoord).r;
        outColor = vec4(state, state, state, 1.0);
      }
    `;

    const updateShaderSource = `#version 300 es
      precision highp float;
      uniform sampler2D u_state;
      in vec2 v_texCoord;
      out vec4 outColor;

      void main() {
        ivec2 texSize = textureSize(u_state, 0);
        float state = texture(u_state, v_texCoord).r;
        int count = 0;

        for (int y = -1; y <= 1; y++) {
          for (int x = -1; x <= 1; x++) {
            if (x == 0 && y == 0) continue;
            vec2 neighborCoord = v_texCoord + vec2(float(x) / float(texSize.x), float(y) / float(texSize.y));
            float neighborState = texture(u_state, neighborCoord).r;
            count += int(neighborState > 0.5);
          }
        }

        float newState = (state > 0.5 && (count == 2 || count == 3)) || (state < 0.5 && count == 3) ? 1.0 : 0.0;
        outColor = vec4(newState, newState, newState, 1.0);
      }
    `;

    this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
    this.updateProgram = this.createProgram(
      vertexShaderSource,
      updateShaderSource,
    );
  }

  createShader(type, source) {
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

  createProgram(vertexShaderSource, fragmentShaderSource) {
    const vertexShader = this.createShader(
      this.gl.VERTEX_SHADER,
      vertexShaderSource,
    );
    const fragmentShader = this.createShader(
      this.gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error(
        "Unable to initialize the shader program: " +
          this.gl.getProgramInfoLog(program),
      );
      return null;
    }
    return program;
  }

  initBuffers() {
    const positions = new Float32Array([
      -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0,
    ]);
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
  }

  initTextures() {
    this.textures = [this.createTexture(), this.createTexture()];
    this.framebuffers = [
      this.gl.createFramebuffer(),
      this.gl.createFramebuffer(),
    ];

    for (let i = 0; i < 2; i++) {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffers[i]);
      this.gl.framebufferTexture2D(
        this.gl.FRAMEBUFFER,
        this.gl.COLOR_ATTACHMENT0,
        this.gl.TEXTURE_2D,
        this.textures[i],
        0,
      );
    }

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.initializeState();
  }

  createTexture() {
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA8,
      this.width,
      this.height,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      null,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.REPEAT,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.REPEAT,
    );
    return texture;
  }

  initializeState() {
    const state = new Uint8Array(this.width * this.height * 4);
    for (let i = 0; i < state.length; i += 4) {
      const value = Math.random() > 0.5 ? 255 : 0;
      state[i] = state[i + 1] = state[i + 2] = value;
      state[i + 3] = 255;
    }
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[0]);
    this.gl.texSubImage2D(
      this.gl.TEXTURE_2D,
      0,
      0,
      0,
      this.width,
      this.height,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      state,
    );
  }

  setupRendering() {
    this.gl.useProgram(this.program);
    const positionAttributeLocation = this.gl.getAttribLocation(
      this.program,
      "a_position",
    );
    this.gl.enableVertexAttribArray(positionAttributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.vertexAttribPointer(
      positionAttributeLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0,
    );
  }

  animate() {
    this.updateState();
    this.render();
    requestAnimationFrame(this.animate);
  }

  updateState() {
    this.gl.useProgram(this.updateProgram);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffers[1]);
    this.gl.viewport(0, 0, this.width, this.height);

    const positionAttributeLocation = this.gl.getAttribLocation(
      this.updateProgram,
      "a_position",
    );
    this.gl.enableVertexAttribArray(positionAttributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.vertexAttribPointer(
      positionAttributeLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0,
    );

    this.gl.uniform1i(
      this.gl.getUniformLocation(this.updateProgram, "u_state"),
      0,
    );
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[0]);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    [this.textures[0], this.textures[1]] = [this.textures[1], this.textures[0]];
    [this.framebuffers[0], this.framebuffers[1]] = [
      this.framebuffers[1],
      this.framebuffers[0],
    ];
  }

  render() {
    this.gl.useProgram(this.program);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    const positionAttributeLocation = this.gl.getAttribLocation(
      this.program,
      "a_position",
    );
    this.gl.enableVertexAttribArray(positionAttributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.vertexAttribPointer(
      positionAttributeLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0,
    );

    this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_state"), 0);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[0]);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}

customElements.define("game-of-life", GameOfLife);
