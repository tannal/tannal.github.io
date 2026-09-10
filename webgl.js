

// Shader sources
const vertexShaderSource = `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

const fragmentShaderSource = `
            precision mediump float;
            
            uniform vec2 u_resolution;
            uniform vec4 u_color;
            uniform int u_shapeType;
            uniform vec4 u_shapeData;

            float distanceToLine(vec2 p, vec2 a, vec2 b) {
                vec2 pa = p - a;
                vec2 ba = b - a;
                float t = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
                return length(pa - ba * t);
            }

            float rectSDF(vec2 p, vec2 b) {
                vec2 d = abs(p) - b;
                return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
            }

            float circleSDF(vec2 p, float r) {
                return length(p) - r;
            }

            void main() {
                vec2 pixelCoords = gl_FragCoord.xy;
                float dist;

                if (u_shapeType == 0) { // Line
                    dist = distanceToLine(pixelCoords, u_shapeData.xy, u_shapeData.zw);
                    float alpha = 1.0 - smoothstep(u_shapeData.w / 2.0 - 1.0, u_shapeData.w / 2.0 + 1.0, dist);
                    gl_FragColor = vec4(u_color.rgb, u_color.a * alpha);
                } else if (u_shapeType == 1) { // Rectangle
                    vec2 halfSize = u_shapeData.zw / 2.0;
                    vec2 center = u_shapeData.xy + halfSize;
                    dist = rectSDF(pixelCoords - center, halfSize);
                    float alpha = 1.0 - smoothstep(-1.0, 1.0, dist);
                    gl_FragColor = vec4(u_color.rgb, u_color.a * alpha);
                } else if (u_shapeType == 2) { // Circle
                    dist = circleSDF(pixelCoords - u_shapeData.xy, u_shapeData.z);
                    float alpha = 1.0 - smoothstep(-1.0, 1.0, dist);
                    gl_FragColor = vec4(u_color.rgb, u_color.a * alpha);
                }
            }
        `;

class Canvas2D extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const width = this.getAttribute('width') || 300;
        const height = this.getAttribute('height') || 150;

        this.shadowRoot.innerHTML = `
                    <canvas width="${width}" height="${height}"></canvas>
                `;

        this.canvas = this.shadowRoot.querySelector('canvas');
        this.gl = this.canvas.getContext('webgl');

        if (!this.gl) {
            console.error('Unable to initialize WebGL. Your browser may not support it.');
            return;
        }

        this.setupWebGL();
        this.render();
    }

    setupWebGL() {
        const gl = this.gl;

        // Create shaders
        const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        // Create program
        this.program = this.createProgram(gl, vertexShader, fragmentShader);

        // Get attribute and uniform locations
        this.positionAttributeLocation = gl.getAttribLocation(this.program, 'a_position');
        this.resolutionUniformLocation = gl.getUniformLocation(this.program, 'u_resolution');
        this.colorUniformLocation = gl.getUniformLocation(this.program, 'u_color');
        this.shapeTypeUniformLocation = gl.getUniformLocation(this.program, 'u_shapeType');
        this.shapeDataUniformLocation = gl.getUniformLocation(this.program, 'u_shapeData');

        // Create buffer
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        // Set the full canvas as drawing area
        const positions = [
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    }

    createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
            return null;
        }
        return program;
    }

    render() {
        const gl = this.gl;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(this.program);

        gl.enableVertexAttribArray(this.positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniform2f(this.resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        this.querySelectorAll('*').forEach(child => {
            if (child.render) {
                child.render(gl, this);
            }
        });
    }
}

class Line2D extends HTMLElement {
    render(gl, canvas) {
        const x1 = parseFloat(this.getAttribute('x1'));
        const y1 = parseFloat(this.getAttribute('y1'));
        const x2 = parseFloat(this.getAttribute('x2'));
        const y2 = parseFloat(this.getAttribute('y2'));
        const color = this.getAttribute('color') || '#000000';
        const width = parseFloat(this.getAttribute('width')) || 1;

        gl.uniform1i(canvas.shapeTypeUniformLocation, 0);
        gl.uniform4f(canvas.shapeDataUniformLocation, x1, y1, x2, y2);
        gl.uniform4f(canvas.colorUniformLocation, ...this.hexToRgb(color), 1);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return [r, g, b];
    }
}

class Rect2D extends HTMLElement {
    render(gl, canvas) {
        const x = parseFloat(this.getAttribute('x'));
        const y = parseFloat(this.getAttribute('y'));
        const width = parseFloat(this.getAttribute('width'));
        const height = parseFloat(this.getAttribute('height'));
        const color = this.getAttribute('color') || '#000000';

        gl.uniform1i(canvas.shapeTypeUniformLocation, 1);
        gl.uniform4f(canvas.shapeDataUniformLocation, x, y, width, height);
        gl.uniform4f(canvas.colorUniformLocation, ...this.hexToRgb(color), 1);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return [r, g, b];
    }
}

class Circle2D extends HTMLElement {
    render(gl, canvas) {
        const cx = parseFloat(this.getAttribute('cx'));
        const cy = parseFloat(this.getAttribute('cy'));
        const radius = parseFloat(this.getAttribute('radius'));
        const color = this.getAttribute('color') || '#000000';

        gl.uniform1i(canvas.shapeTypeUniformLocation, 2);
        gl.uniform4f(canvas.shapeDataUniformLocation, cx, cy, radius, 0);
        gl.uniform4f(canvas.colorUniformLocation, ...this.hexToRgb(color), 1);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return [r, g, b];
    }
}

customElements.define('canvas-2d', Canvas2D);
customElements.define('line-2d', Line2D);
customElements.define('rect-2d', Rect2D);
customElements.define('circle-2d', Circle2D);