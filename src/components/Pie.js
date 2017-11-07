/*global d3*/
/*global MathJax*/


import React, { Component } from 'react';

function abc() {

}
class Pie extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {
        return <div ref={(el => { this.el = el; this.renderPie(el) })}> </div>
    }

    componentWillReceiveProps(nextProps) {
    }

    componentDidUpdate() {
    }

    componentDidMount() {
    }

    toDegrees(angle) {
        return angle * (180 / Math.PI);
    }

    renderPie(el) {
        //Width and height
        var w = this.props.width;//300;
        var h = this.props.height//300;

        const dataset = this.props.data;
        console.log('dataset ' + JSON.stringify(dataset))
        var outerRadius = w / 2.5;
        var innerRadius = 0;
        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        var pie = d3.pie().value((d) => d.value).sort(null).startAngle(0)

        //Easy colors accessible via a 10-step ordinal scale
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        //Create SVG element
        var svg = d3.select(el)
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        const translateX = 1.2 * outerRadius;
        const translateY = translateX;


        svg.append("circle")
            .attr("r", outerRadius)
            .style("stroke", "black")
            .style("stroke-width", "3")
            .style("fill", "white")
            .attr("transform", "translate(" + translateX + "," + translateY + ")")
            .style("opacity", 1)


        var arcs = svg.selectAll("g.arc")
            .data(pie(dataset))
            .enter()
            .append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + translateX + "," + translateY + ")")

        let linesDelay = 1000;
        if (dataset.length > 1) {
            const lines = arcs.append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", -outerRadius)
                .style("stroke", "rgb(0, 0, 0)")
                .style("stroke-width", 2)
                .attr("transform", (d) => "rotate(" + this.toDegrees(d.endAngle) + ")")
                .style("opacity", 0);

            d3.selectAll("line")
                .style("opacity", 0)
                .transition()
                .delay((d, i) => { return linesDelay / (i + 1); })
                .style("opacity", 1)
            /*  .on("end", function () {
                 let s = d3.select(this)
                 s.transition()
                     .style("opacity", 1);
             }) */
        }

        //Draw arc paths
        arcs.append("path")
            .attr("fill", function (d, i) {
                return d.data.color;
            })
            .attr("id", function (d, i) { return "arc_" + i; })
            .attr("d", arc)
            .style("opacity", 0)
            .transition()
            .delay(linesDelay + 200)
            .duration(1000)
            .style("opacity", 0.5)

        arcs.append("g")
            .append("text")
            .attr("x", function (d, i) {
                const angle = (d.startAngle + d.endAngle) / 2
                let factor = 1.1
                /* if ((angle > 0 && angle < (Math.PI / 4)))
                    factor = 1.1;
                else if ((angle > (Math.PI / 4) && angle < (Math.PI / 2)))
                    factor = 1.15;
                else if ((angle > (Math.PI / 2) && angle < (3 / 4 * Math.PI)))
                    factor = 1.3;
                else if ((angle > (3 / 4 * Math.PI) && angle < (2 * Math.PI)))
                    factor = 1.1; */
                return factor * outerRadius * Math.cos(angle - (Math.PI / 2))
            })
            .attr("y", function (d, i) {
                const angle = (d.startAngle + d.endAngle) / 2
                let factor = 1.1
                /*  if ((angle > 0 && angle < (Math.PI / 4)))
                     factor = 1.1
                 else if ((angle > (Math.PI / 4) && angle < (Math.PI / 2)))
                     factor = 1.15;
                 else if ((angle > (Math.PI / 2) && angle < (3 / 4 * Math.PI)))
                     factor = 1.3;
                 else if ((angle > (3 / 4 * Math.PI) && angle < (2 * Math.PI)))
                     factor = 1.1; */
                return factor * outerRadius * Math.sin(angle - (Math.PI / 2))
            })
            .attr("visibility", (d, i) => (i + 1) % 2 ? 'hidden' : 'hidden')
            .text(function (d, i) {
                return i + 1;
            });



        arcs.append("g")
            .attr("transform", function (d, i) {
                //  return "translate(" + arc.centroid(d) + ")";
                const d1 = [];
                const angle = (d.startAngle + (d.endAngle - d.startAngle) / 2) - (Math.PI / 2)
                const scale = 0.7
                d1[0] = scale * outerRadius * Math.cos(angle)
                d1[1] = scale * outerRadius * Math.sin(angle)
                return "translate(" + d1 + ")";
            })
            .attr("class", "jax")
            .append("text")
            .text(function (d, i) {
                return d.data.label;
            });


        MathJax.Hub.Register.StartupHook("End", function () {
            arcs.selectAll('.jax').each(function () {
                const self = d3.select(this);
                const g = self.select('text>span>svg');
                if (g.node()) {
                    g.remove();
                    self.append(function () {
                        return g.node();
                    });
                }
            });
        });
    }
}

export default Pie;