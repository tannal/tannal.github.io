class PacManGame extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.pacmanX = 0;
    this.pacmanY = 0;
    this.pacmanDirection = 0; // 0: right, 1: down, 2: left, 3: up
    this.pacmanSpeed = 0.02;
    this.mouthAngle = 0;
    this.mouthSpeed = 5;
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 400px;
          height: 400px;
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

    this.canvas.width = 400;
    this.canvas.height = 400;

    this.initGame();
    this.setupKeyboardControls();
  }

  setupKeyboardControls() {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowRight":
          this.pacmanDirection = 0;
          break;
        case "ArrowDown":
          this.pacmanDirection = 1;
          break;
        case "ArrowLeft":
          this.pacmanDirection = 2;
          break;
        case "ArrowUp":
          this.pacmanDirection = 3;
          break;
      }
    });
  }

  initGame() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    const vsSource = `#version 300 es
      in vec2 aVertexPosition;
      uniform mat3 uModelViewMatrix;
      uniform mat3 uProjectionMatrix;

      void main() {
        vec3 position = uProjectionMatrix * uModelViewMatrix * vec3(aVertexPosition, 1.0);
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `;

    const fsSource = `#version 300 es
      precision mediump float;

      uniform vec4 uColor;
      out vec4 fragColor;

      void main() {
        fragColor = uColor;
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
        color: this.gl.getUniformLocation(shaderProgram, "uColor"),
      },
    };

    this.initBuffers();

    this.lastTime = 0;
    requestAnimationFrame(this.render.bind(this));
  }

  initBuffers() {
    const positions = new Float32Array([
      -0.05, -0.05, 0.05, -0.05, 0.05, 0.05, -0.05, 0.05,
    ]);

    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

    this.buffers = {
      position: positionBuffer,
    };
  }

  render(now) {
    now *= 0.001; // Convert to seconds
    const deltaTime = now - this.lastTime;
    this.lastTime = now;

    this.updateGame(deltaTime);
    this.drawScene();

    requestAnimationFrame(this.render.bind(this));
  }

  updateGame(deltaTime) {
    // Update Pac-Man position
    switch (this.pacmanDirection) {
      case 0: // right
        this.pacmanX += this.pacmanSpeed;
        break;
      case 1: // down
        this.pacmanY -= this.pacmanSpeed;
        break;
      case 2: // left
        this.pacmanX -= this.pacmanSpeed;
        break;
      case 3: // up
        this.pacmanY += this.pacmanSpeed;
        break;
    }

    // Keep Pac-Man within bounds
    this.pacmanX = Math.max(-0.95, Math.min(0.95, this.pacmanX));
    this.pacmanY = Math.max(-0.95, Math.min(0.95, this.pacmanY));

    // Update mouth animation
    this.mouthAngle += this.mouthSpeed * deltaTime;
    if (this.mouthAngle > Math.PI / 4 || this.mouthAngle < 0) {
      this.mouthSpeed = -this.mouthSpeed;
    }
  }

  drawScene() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    const projectionMatrix = mat3.projection(
      this.gl.canvas.clientWidth,
      this.gl.canvas.clientHeight,
    );

    // Draw Pac-Man
    const pacmanModelViewMatrix = mat3.translation(this.pacmanX, this.pacmanY);
    mat3.rotate(pacmanModelViewMatrix, (this.pacmanDirection * Math.PI) / 2);

    this.gl.useProgram(this.programInfo.program);

    this.gl.uniformMatrix3fv(
      this.programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix,
    );
    this.gl.uniformMatrix3fv(
      this.programInfo.uniformLocations.modelViewMatrix,
      false,
      pacmanModelViewMatrix,
    );

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

    // Draw Pac-Man body
    this.gl.uniform4fv(
      this.programInfo.uniformLocations.color,
      [1.0, 1.0, 0.0, 1.0],
    ); // Yellow
    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);

    // Draw Pac-Man mouth
    this.gl.uniform4fv(
      this.programInfo.uniformLocations.color,
      [0.0, 0.0, 0.0, 1.0],
    ); // Black
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
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

// Simple matrix library
const mat3 = {
  projection: function (width, height) {
    return new Float32Array([2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1]);
  },
  translation: function (tx, ty) {
    return new Float32Array([1, 0, 0, 0, 1, 0, tx, ty, 1]);
  },
  rotation: function (angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return new Float32Array([c, -s, 0, s, c, 0, 0, 0, 1]);
  },
  multiply: function (a, b) {
    const a00 = a[0 * 3 + 0];
    const a01 = a[0 * 3 + 1];
    const a02 = a[0 * 3 + 2];
    const a10 = a[1 * 3 + 0];
    const a11 = a[1 * 3 + 1];
    const a12 = a[1 * 3 + 2];
    const a20 = a[2 * 3 + 0];
    const a21 = a[2 * 3 + 1];
    const a22 = a[2 * 3 + 2];
    const b00 = b[0 * 3 + 0];
    const b01 = b[0 * 3 + 1];
    const b02 = b[0 * 3 + 2];
    const b10 = b[1 * 3 + 0];
    const b11 = b[1 * 3 + 1];
    const b12 = b[1 * 3 + 2];
    const b20 = b[2 * 3 + 0];
    const b21 = b[2 * 3 + 1];
    const b22 = b[2 * 3 + 2];
    return new Float32Array([
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ]);
  },
  rotate: function (m, angleInRadians) {
    return mat3.multiply(m, mat3.rotation(angleInRadians));
  },
};
