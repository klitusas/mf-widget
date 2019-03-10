import * as d3 from 'd3';

// Defining the template for the component
const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: inline-block;
    position: relative;
    margin: 10px;
  }
  .container {
    position: absolute;
  }
}
</style>
<div class="container">
    <div id="chart"></div>
</div>
`;
export default class MarfeelWidget extends HTMLElement {

    // Observe attributes
    static get observedAttributes() {
        return ['type'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.DONUT_HEIGHT = 200;
        this.DONUT_WIDTH = 300;

        this.GRAPH_WIDTH = 270;
        this.GRAPH_HEIGHT = 150;
        this.MARGINS = {
            top: 80,
            right: 20,
            bottom: 20,
            left: 30
        };
        this.widgetData = [];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (oldVal !== newVal) {
            this.type = newVal;
            switch (this.type) {
                case 'revenue':
                    this.myColors = ['#98d15d', '#467323'];
                    this.title = "Revenue"
                    break;
                case 'impressions':
                    this.myColors = ['#80d2e5', '#355c75'];
                    this.title = "Impressions"
                    break;
                case 'visits':
                    this.myColors = ['#ebc42b', '#c25f35'];
                    this.title = "Visits"
                    break;
                default:
                    break;
            }
        }
    }

    connectedCallback() {
        this._generateClipPath();
        this._generateDonut();
        this._generateLineGraph();
    }

    // draw the mask for the inner circle
    _generateClipPath() {
        const pathHolder = d3.select(this.shadowRoot).append("svg");
        pathHolder
            .append("clipPath")
            .attr("id", "ellipse-clip")
            .append("circle")
            .attr("cx", 150)
            .attr("cy", 5)
            .attr("r", 85);
    }

    // calculate sums for the inner circle
    calculateSum(){
        return this.widgetData.device.reduce((accum, curr) => accum + curr.value, 0);
    }

    // draw the donut
    _generateDonut() {
        const amount = this.widgetData.device.reverse().reduce((accum, curr) => accum + curr.value, 0);
        const totalRadius = Math.min(this.DONUT_WIDTH, this.DONUT_HEIGHT) / 2
        const donutHoleRadius = totalRadius * 0.5
        const svg = d3.select(this.shadowRoot.querySelector('#chart'))
            .append('svg')
            .attr('width', this.DONUT_WIDTH)
            .attr('height', this.DONUT_HEIGHT + 100)
            .append('g')
            .attr('transform', `translate(150, ${this.DONUT_HEIGHT})`)

        const arc = d3.arc().
            innerRadius(totalRadius - donutHoleRadius + 40).
            outerRadius(totalRadius)

        const pie = d3.pie()
            .value((d) => d.value)
            .sort(null)

        const path = svg.selectAll('path')
            .data(pie(this.widgetData.device))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => this.myColors[i]);

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", "1.1em")
            .attr("fill", "#a7a7a7")
            .attr("font-weight", "400")
            .attr("y", -20)
            .text(this.title.toUpperCase());

        svg.append("text").
            attr("text-anchor", "middle").
            attr("font-size", "1.4em").
            attr("fill", "#5c5c5c").
            attr("font-weight", "400").
            attr("y", 10).
            text(this.title === "Revenue" ? amount.toLocaleString('es-ES') + "€" : amount.toLocaleString('es-ES'));

        let degree = 0
        for (let index = 0; index < 4; index++) {
            this._generateDonutLine(degree, 3, svg);
            degree += 90;
        }
    }

    // draw 4 lines on top, right, bottom, left
    _generateDonutLine(angle, overlap, svg) {
        overlap = overlap || 0;
        angle = angle / (180 / Math.PI);
        const innerR = (90 - overlap);
        const outerR = (90 + overlap);
        const beginX = Math.sin(angle) * innerR
        const beginY = -Math.cos(angle) * innerR;
        const endX = Math.sin(angle) * outerR;
        const endY = -Math.cos(angle) * outerR;
        svg.append('path')
            .datum({})
            .style("fill", "#000")
            .attr('stroke', '#c1c5c1')
            .attr('stroke-width', 2)
            .attr('d', "M " + beginX + " " + beginY + " L " + endX + " " + endY);
    }

    // draw the line graph
    _generateLineGraph() {
        const svg = d3
            .select(this.shadowRoot.querySelector('#chart'))
            .append('svg')
            .attr('transform', `translate(0, -110)`)
            .attr('height', 190)
            .attr('width', 310)

        const xScale = d3.scaleLinear().range([this.MARGINS.left, this.GRAPH_WIDTH - this.MARGINS.right]).domain([0, 12]);
        const yScale = d3.scaleLinear().range([this.GRAPH_HEIGHT - this.MARGINS.top, this.MARGINS.bottom]).domain([0, 90]);

        const lineGen = d3.line()
            .x((d) => xScale(d.month))
            .y((d) => yScale(d.number))

        svg.append('svg:path')
            .attr('d', lineGen(this.widgetData.periods))
            .attr('stroke', (d, i) => this.myColors[i])
            .attr('stroke-width', 2)
            .attr("clip-path", "url(#ellipse-clip)")
            .attr('fill', 'none')
            .attr("opacity", .2);

        // filling the graph with som colors
        const area = d3.area()
            .x((d) => xScale(d.month))
            .y((d) => yScale(d.number))
            .y1((d) => 130)

        svg.append("path")
            .attr("fill", (d, i) => this.myColors[i])
            .attr("clip-path", "url(#ellipse-clip)")
            .attr("d", area(this.widgetData.periods))
            .attr("opacity", .1);

        svg.append("g")
            .attr("class", "legendOrdinal")
            .attr("transform", "translate(600,40)");

        this._drawLegend(svg)
    }

    // draw legend
    _drawLegend(svg) {
        const legendHolder = svg.append('g')
            .attr('transform', "translate(" + (0) + "," + (-10) + ")")
            .attr('class', 'legendHolder');

        const sum = this.calculateSum();
        // extracting data for the legend
        const widgetInfo = this.widgetData.device.map(x => {
            return {
                type: x.deviceType,
                value: x.value.toLocaleString('es-ES'),
                percent: (x.value * 100) / sum
            }
        });

        const legend = legendHolder.selectAll(".legend")
            .data(widgetInfo)
            .enter().append("g")
            .attr("class", "legend")

        legend.append("text")
            .attr("x", (d, i) => (0 + (225 * i)))
            .attr("y", 150)
            .attr("dy", ".35em")
            .attr("font-size", "0.9em")
            .attr("font-weight", "bold")
            .attr("fill", (d, i) => this.myColors[i])
            .text((d) => d.type);

        legend.append("text")
            .attr("x", (d, i) => (0 + (190 * i)))
            .attr("class", "info")
            .attr("y", 170)
            .attr("dy", ".35em")
            .attr("fill", "#868686")
            .attr("font-size", ".9em")
            .attr("alignment-baseline", "middle")
            .text((d) => d.percent + "%");

        legend.append("text")
            .attr("x", (d, i) => (40 + (190 * i)))
            .attr("text-anchor", "start")
            .attr("class", "info")
            .attr("y", 170)
            .attr("dy", ".35em")
            .attr("fill", "#bbbbbb")
            .attr("font-size", ".9em")
            .attr("alignment-baseline", "middle")
            .text((d) => this.widgetData.title === "Revenue" ? d.value + "€" : d.value)

        // appending underline
        legend.append("line")
            .style("stroke", "#e6e6e6")
            .attr('stroke-width', 2)
            .attr("x1", 0)
            .attr("y1", 200)
            .attr("x2", 310)
            .attr("y2", 200);
    }

}
window.customElements.define('marfeel-widget', MarfeelWidget);