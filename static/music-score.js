
import { Factory } from 'https://cdn.jsdelivr.net/npm/vexflow@5.0.0-alpha.4/build/esm/entry/vexflow.js';

class MusicScore extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    // 监听的属性
    static get observedAttributes() {
        return ['clef', 'time-signature', 'notes'];
    }

    // 组件连接到 DOM 时
    connectedCallback() {
        this.render();
    }

    // 属性变化时重新渲染
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    async render() {
        // 创建容器
        const container = document.createElement('div');
        container.id = 'score';

        // 清空 shadow DOM
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(container);

        try {
            const vf = new Factory({
                renderer: { elementId: container, width: 500, height: 200 }
            });

            // 获取属性
            const clef = this.getAttribute('clef') || 'treble';
            const timeSignature = this.getAttribute('time-signature') || '4/4';
            const notesAttr = this.getAttribute('notes') || '';
            const notes = notesAttr.split(',').map(n => n.trim());

            // 创建五线谱
            const score = vf.EasyScore();
            const system = vf.System();

            // 渲染乐谱
            system.addStave({
                voices: [
                    score.voice(score.notes(`${notes.join(', ')}`, { clef, time: timeSignature }))
                ]
            }).addClef(clef).addTimeSignature(timeSignature);

            vf.draw();
        } catch (error) {
            console.error('Error rendering music score:', error);
            this.shadowRoot.innerHTML = '<p>Error rendering music score</p>';
        }
    }
}

// 注册组件
customElements.define('music-score', MusicScore);