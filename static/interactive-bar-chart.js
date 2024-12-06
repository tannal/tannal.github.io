import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export class InteractiveBarChart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['data'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data') {
            this.data = JSON.parse(newValue);
            this.render();
        }
    }

    connectedCallback() {
        if (!this.data) {
            this.data = [10, 20, 30, 40, 50];
        }
        this.render();
    }
    render() {
        const width = 500;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // 创建SVG
        const svg = d3.create("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("class", "chart");

        // 创建比例尺
        const xScale = d3.scaleBand()
            .domain(d3.range(this.data.length))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(this.data)])
            .range([height - margin.bottom, margin.top]);

        // 创建坐标轴
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        // 添加坐标轴
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(xAxis)
            .call(g => g.select(".domain").remove()); // 移除轴线

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line")
                .clone()
                .attr("x2", innerWidth)
                .attr("stroke-opacity", 0.1)); // 添加网格线

        // 添加柱状图
        const bars = svg.append("g")
            .selectAll("rect")
            .data(this.data)
            .join("rect")
            .attr("x", (d, i) => xScale(i))
            .attr("y", d => yScale(d))
            .attr("width", xScale.bandwidth())
            .attr("height", d => yScale(0) - yScale(d))
            .attr("fill", "steelblue")
            .attr("rx", 4) // 圆角
            .on("mouseover", (event, d) => this.showTooltip(event, d))
            .on("mouseout", () => this.hideTooltip())
            .on("click", (event, d, i) => {
                this.dispatchEvent(new CustomEvent('bar-click', {
                    detail: { value: d, index: i }
                }));
            });

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .chart {
                width: 100%;
                height: 100%;
                font-family: -apple-system, system-ui, BlinkMacSystemFont;
            }
            rect {
                transition: all 0.3s ease;
            }
            rect:hover {
                fill: #ff7f0e;
                transform: translateY(-5px);
            }
            .tooltip {
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                pointer-events: none;
                transform: translate(-50%, -100%);
                transition: all 0.2s ease;
                z-index: 100;
            }
            .tick line {
                stroke: #ddd;
            }
            .tick text {
                font-size: 12px;
                color: #666;
            }
        `;

        // ... existing tooltip code ...

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(svg.node());
        this.shadowRoot.appendChild(tooltip);
    }

    showTooltip(event, value) {
        const tooltip = this.shadowRoot.querySelector('.tooltip');
        tooltip.style.display = 'block';
        tooltip.style.left = `${event.pageX}px`;
        tooltip.style.top = `${event.pageY - 10}px`;
        tooltip.textContent = value;
        tooltip.style.opacity = 1;
    }

    hideTooltip() {
        const tooltip = this.shadowRoot.querySelector('.tooltip');
        tooltip.style.opacity = 0;
        setTimeout(() => tooltip.style.display = 'none', 200);
    }
}

// 注册自定义元素
customElements.define('interactive-bar-chart', InteractiveBarChart);