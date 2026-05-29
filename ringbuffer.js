class RingBufferAnimation extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.bufferSize = 16; // 默认缓冲区大小
        this.currentPosition = 0;
        this.data = new Array(this.bufferSize).fill(null);
        this.isRecording = false;
        this.chunks = [];
        this.recorder = null;
    }

    connectedCallback() {
        this.render();
        this.setupCanvas();
        this.setupControls();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 20px;
                }
                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }
                canvas {
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                .controls {
                    display: flex;
                    gap: 10px;
                }
                button {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    background: #4CAF50;
                    color: white;
                    cursor: pointer;
                }
                button:hover {
                    background: #45a049;
                }
            </style>
            <div class="container">
                <canvas width="400" height="400"></canvas>
                <div class="controls">
                    <button id="addBtn">添加数据</button>
                    <button id="recordBtn">开始录制</button>
                </div>
            </div>
        `;
    }

    setupCanvas() {
        this.canvas = this.shadowRoot.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.draw();
    }

    setupControls() {
        const addBtn = this.shadowRoot.getElementById('addBtn');
        const recordBtn = this.shadowRoot.getElementById('recordBtn');

        addBtn.addEventListener('click', () => this.addData());
        recordBtn.addEventListener('click', () => this.toggleRecording());
    }

    setupRecorder() {
        const stream = this.canvas.captureStream(60);
        this.recorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9'
        });

        this.recorder.ondataavailable = e => this.chunks.push(e.data);
        this.recorder.onstop = () => {
            const blob = new Blob(this.chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ring-buffer-animation.webm';
            a.click();
            this.chunks = [];
        };
    }

    toggleRecording() {
        if (!this.recorder) {
            this.setupRecorder();
        }

        const recordBtn = this.shadowRoot.getElementById('recordBtn');
        
        if (!this.isRecording) {
            this.recorder.start();
            this.isRecording = true;
            recordBtn.textContent = '停止录制';
            recordBtn.style.background = '#f44336';
        } else {
            this.recorder.stop();
            this.isRecording = false;
            recordBtn.textContent = '开始录制';
            recordBtn.style.background = '#4CAF50';
        }
    }

    addData() {
        const value = Math.floor(Math.random() * 100);
        this.data[this.currentPosition] = value;
        this.currentPosition = (this.currentPosition + 1) % this.bufferSize;
        this.animateInsertion();
    }

    animateInsertion() {
        let frame = 0;
        const animate = () => {
            if (frame >= 30) return; // 动画持续30帧

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.draw(frame / 30);
            frame++;
            requestAnimationFrame(animate);
        };

        animate();
    }

    draw(progress = 1) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = 150;

        // 绘制环形缓冲区的圆
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // 绘制数据槽位
        for (let i = 0; i < this.bufferSize; i++) {
            const angle = (i * 2 * Math.PI) / this.bufferSize;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            // 绘制槽位圆
            this.ctx.beginPath();
            this.ctx.arc(x, y, 20, 0, Math.PI * 2);
            this.ctx.fillStyle = i === this.currentPosition ? '#4CAF50' : '#fff';
            this.ctx.fill();
            this.ctx.stroke();

            // 绘制数据
            if (this.data[i] !== null) {
                this.ctx.fillStyle = '#000';
                this.ctx.font = '16px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(this.data[i], x, y);
            }
        }

        // 绘制当前位置指示器
        const currentAngle = (this.currentPosition * 2 * Math.PI) / this.bufferSize;
        const indicatorX = centerX + (radius + 40) * Math.cos(currentAngle);
        const indicatorY = centerY + (radius + 40) * Math.sin(currentAngle);
        
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(indicatorX, indicatorY);
        this.ctx.strokeStyle = '#4CAF50';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
}

customElements.define('ring-buffer-animation', RingBufferAnimation);