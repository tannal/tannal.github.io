class PianoKeyboard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      
      // 定义钢琴键
      this.keys = [
        { note: 'C', type: 'white', key: 'a' },
        { note: 'C#', type: 'black', key: 'w' },
        { note: 'D', type: 'white', key: 's' },
        { note: 'D#', type: 'black', key: 'e' },
        { note: 'E', type: 'white', key: 'd' },
        { note: 'F', type: 'white', key: 'f' },
        { note: 'F#', type: 'black', key: 't' },
        { note: 'G', type: 'white', key: 'g' },
        { note: 'G#', type: 'black', key: 'y' },
        { note: 'A', type: 'white', key: 'h' },
        { note: 'A#', type: 'black', key: 'u' },
        { note: 'B', type: 'white', key: 'j' }
      ];
    }
  
    connectedCallback() {
      this.render();
      this.setupEventListeners();
    }
  
    render() {
      const style = `
        <style>
          :host {
            display: block;
            width: 100%;
            max-width: 600px;
          }
          
          .piano {
            position: relative;
            height: 200px;
            background: #141414;
            padding: 20px;
            border-radius: 8px;
          }
          
          .key {
            position: absolute;
            cursor: pointer;
            transition: all 0.1s ease;
          }
          
          .white-key {
            background: white;
            width: 14.28%;
            height: 100%;
            border: 1px solid #ccc;
            border-radius: 0 0 4px 4px;
          }
          
          .black-key {
            background: black;
            width: 8%;
            height: 60%;
            margin-left: -4%;
            border-radius: 0 0 4px 4px;
            z-index: 2;
          }
          
          .key.active {
            background: #e6e6e6;
            transform: translateY(2px);
          }
          
          .black-key.active {
            background: #333;
          }
          
          .key-label {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            color: #666;
          }
        </style>
      `;
  
      const whiteKeyWidth = 100 / 7; // 7个白键的宽度百分比
      let currentWhiteKeyIndex = 0;
      
      const template = `
        <div class="piano">
          ${this.keys.map((key, index) => {
            const isWhite = key.type === 'white';
            let position;
            
            if (isWhite) {
              position = currentWhiteKeyIndex * whiteKeyWidth;
              currentWhiteKeyIndex++;
            } else {
              position = (currentWhiteKeyIndex - 0.5) * whiteKeyWidth;
            }
  
            return `
              <div class="key ${key.type}-key" 
                   data-note="${key.note}"
                   data-key="${key.key}"
                   style="left: ${position}%">
                <span class="key-label">${key.key.toUpperCase()}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
  
      this.shadowRoot.innerHTML = style + template;
    }
  
    setupEventListeners() {
      // 鼠标事件
      this.shadowRoot.querySelectorAll('.key').forEach(key => {
        key.addEventListener('mousedown', () => this.playNote(key));
        key.addEventListener('mouseup', () => this.stopNote(key));
        key.addEventListener('mouseleave', () => this.stopNote(key));
      });
  
      // 键盘事件
      document.addEventListener('keydown', (e) => {
        if (e.repeat) return; // 防止长按重复触发
        const key = this.shadowRoot.querySelector(`[data-key="${e.key}"]`);
        if (key) this.playNote(key);
      });
  
      document.addEventListener('keyup', (e) => {
        const key = this.shadowRoot.querySelector(`[data-key="${e.key}"]`);
        if (key) this.stopNote(key);
      });
    }
  
    playNote(key) {
      if (key.classList.contains('active')) return;
      
      key.classList.add('active');
      const note = key.dataset.note;
      
      // 触发自定义事件
      this.dispatchEvent(new CustomEvent('note-play', {
        detail: { note },
        bubbles: true,
        composed: true
      }));
  
      // 可以在这里添加声音播放逻辑
      this.playSound(note);
    }
  
    stopNote(key) {
      if (!key.classList.contains('active')) return;
      
      key.classList.remove('active');
      const note = key.dataset.note;
      
      this.dispatchEvent(new CustomEvent('note-stop', {
        detail: { note },
        bubbles: true,
        composed: true
      }));
  
      // 可以在这里添加声音停止逻辑
      this.stopSound(note);
    }
  
    // 简单的声音实现（使用 Web Audio API）
    playSound(note) {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
  
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // 简单的音符到频率的映射
      const frequencies = {
        'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
        'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
        'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
      };
  
      oscillator.frequency.value = frequencies[note];
      gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
      
      oscillator.start();
      this.activeNotes = this.activeNotes || new Map();
      this.activeNotes.set(note, { oscillator, gainNode });
    }
  
    stopSound(note) {
      if (!this.activeNotes?.has(note)) return;
      
      const { oscillator, gainNode } = this.activeNotes.get(note);
      gainNode.gain.setValueAtTime(gainNode.gain.value, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
      oscillator.stop(this.audioContext.currentTime + 0.1);
      
      this.activeNotes.delete(note);
    }
  }
  
  // 注册组件
  customElements.define('piano-keyboard', PianoKeyboard);