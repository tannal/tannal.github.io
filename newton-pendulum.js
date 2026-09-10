class NewtonPendulum extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isRecording = false;
        this.chunks = [];
        this.recorder = null;
    }

    connectedCallback() {
        this.render();
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
                .newton-cradle {
                    width: 400px;
                    height: 400px;
                    background: #f5f5f5;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    perspective: 1000px;
                }
                .frame {
                    width: 300px;
                    height: 300px;
                    position: relative;
                    transform-style: preserve-3d;
                }
                .top-bar {
                    width: 100%;
                    height: 10px;
                    background: #333;
                    position: absolute;
                    top: 0;
                }
                .ball-container {
                    display: flex;
                    justify-content: center;
                    gap: 5px;
                    position: absolute;
                    top: 10px;
                    width: 100%;
                }
                .pendulum {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .string {
                    width: 2px;
                    height: 150px;
                    background: #666;
                    transform-origin: top;
                }
                .ball {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(145deg, #silver, #999);
                    border-radius: 50%;
                    box-shadow: 
                        inset -2px -2px 6px rgba(0,0,0,0.3),
                        inset 2px 2px 6px rgba(255,255,255,0.8);
                }
                .pendulum:first-child {
                    animation: swing-left 1.4s ease-in-out infinite;
                }
                .pendulum:last-child {
                    animation: swing-right 1.4s ease-in-out infinite;
                }
                @keyframes swing-left {
                    0%, 50% { transform: rotate(-30deg); }
                    25%, 75%, 100% { transform: rotate(0deg); }
                }
                @keyframes swing-right {
                    0%, 50%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(30deg); }
                    75% { transform: rotate(30deg); }
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
                .paused * {
                    animation-play-state: paused !important;
                }
            </style>
            <div class="container">
                <div class="newton-cradle">
                    <div class="frame">
                        <div class="top-bar"></div>
                        <div class="ball-container">
                            <div class="pendulum">
                                <div class="string"></div>
                                <div class="ball"></div>
                            </div>
                            <div class="pendulum">
                                <div class="string"></div>
                                <div class="ball"></div>
                            </div>
                            <div class="pendulum">
                                <div class="string"></div>
                                <div class="ball"></div>
                            </div>
                            <div class="pendulum">
                                <div class="string"></div>
                                <div class="ball"></div>
                            </div>
                            <div class="pendulum">
                                <div class="string"></div>
                                <div class="ball"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="controls">
                    <button id="toggleBtn">暂停</button>
                    <button id="recordBtn">开始录制</button>
                </div>
            </div>
        `;
    }

    setupControls() {
        const toggleBtn = this.shadowRoot.getElementById('toggleBtn');
        const recordBtn = this.shadowRoot.getElementById('recordBtn');
        const cradle = this.shadowRoot.querySelector('.newton-cradle');

        toggleBtn.addEventListener('click', () => {
            cradle.classList.toggle('paused');
            toggleBtn.textContent = cradle.classList.contains('paused') ? '继续' : '暂停';
        });

        recordBtn.addEventListener('click', () => this.toggleRecording());
    }

    setupRecorder() {
        // 使用 MediaRecorder API 录制 DOM 内容
        const stream = this.shadowRoot.querySelector('.newton-cradle').animate(
            [
                { transform: 'scale(1)' },
                { transform: 'scale(1)' }
            ],
            {
                duration: 1,
                fill: 'forwards'
            }
        ).effect.target.getAnimations()[0].timeline.play();

        this.recorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9'
        });

        this.recorder.ondataavailable = e => this.chunks.push(e.data);
        this.recorder.onstop = () => {
            const blob = new Blob(this.chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'newton-pendulum.webm';
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
}

customElements.define('newton-pendulum', NewtonPendulum);