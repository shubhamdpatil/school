import React, { Component } from 'react';

class Arrow extends Component {

    constructor(props) {
        super(props);
        //this.property = props.property;
    }

    line(x1, y1, x2, y2, w, color, svgNode) {
        var aLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        aLine.setAttribute('x1', x1);
        aLine.setAttribute('y1', y1);
        aLine.setAttribute('x2', x2);
        aLine.setAttribute('y2', y2);
        aLine.setAttribute('stroke', color);
        aLine.setAttribute('stroke-width', w);

        if (svgNode) {
            svgNode.appendChild(aLine);
        }

        return aLine;
    }
    /* 
        createSVG(elemToAppend) {
            //console.log("SW SVG: creating new svg Canvas");
            var d = new Date();
            svgCanvasId = "svgCanvas_" + d.getTime();
    
            var e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            e.setAttribute('width', 1000);
            e.setAttribute('height', 1000);
    
            e.id = svgCanvasId;
    
            if (typeof elemToAppend !== typeof undefined) {
                //e.setAttribute('style', 'border: 1px solid black');
                elemToAppend.appendChild(e);
            }
    
            return e;
        }
    
     */
    distanceBetweenPoints(p1, p2) {
        // console.log("lineDistnce point" + p1.x + "," + p1.y + "," + p2.x + "," + p2.y);
        return Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2));
    }

    pointAtLineDistance(p1, p2, atperpLineDist) {
        var len = this.distanceBetweenPoints(p1, p2);
        var ratio = atperpLineDist / len;

        if (ratio < 0 || ratio > 1) {
            console.log("perpLineDistance is not on line ");
            return null;
        }

        //	console.log("perpLineDistance is on line : Line length :"+ len +", ratio "+ratio);
        var pt = { x: (1 - ratio) * p1.x + ratio * p2.x, y: (1 - ratio) * p1.y + ratio * p2.y };

        return pt;
    }

    render() {
        return this.arrow();
    }

    arrow() {
        const property = {
            startPt: { x: 30, y: 10 },
            endPt: { x: 100, y: 10 },
            width: 2,
            headSide: "START", //"END", "BOTH"
            shaftColor: "green",
            headColor: "red",
            headMinHeight: 8,
        }
        console.log('property ' + JSON.stringify(property))
        /* property = {
             startPt: { x: 300, y: 10 },
             endPt: { x: 400, y: 10 },
             width: 2,
             headSide: "START", //"END", "BOTH"
             shaftColor: "green",
             headColor: "red",
             headMinHeight: 8,
         };*/

        if (typeof property === typeof undefined) {
            console.log("Arrow properties are not given");
            return null;
        }

        var startX = property.startPt.x,
            startY = property.startPt.y,
            endX = property.endPt.x,
            endY = property.endPt.y,
            width = property.width;


        var side = "BOTH"; // "START", END"
        var arrowHeadMinHeight = 8;
        var width = 1;
        var shaftColor = "black",
            arrowHeadcolor = "black";

        if (typeof property.headSide !== typeof undefined) {
            side = property.headSide;
        }

        if (typeof property.width !== typeof undefined) {
            width = property.width;
        }

        if (typeof property.shaftColor !== typeof undefined) {
            shaftColor = property.shaftColor;

        }

        if (typeof property.headColor !== typeof undefined) {
            arrowHeadcolor = property.headColor;
        }


        if (typeof property.headMinHeight !== typeof undefined) {
            arrowHeadMinHeight = property.headMinHeight;
        }


        var p1 = { x: startX, y: startY };
        var p2 = { x: endX, y: endY };

        var lineDist = this.distanceBetweenPoints(p1, p2);
        var arrowHeadHeight = width <= arrowHeadMinHeight / 2 ? arrowHeadMinHeight : width * 2;
        var halfPerpLineDist = width / 2 + width / 4 + 5;

        //console.log ("distanceBetweenPoints" + distanceBetweenPoints(p1, p2));

        var angle = Math.atan2(endY - startY, endX - startX);

        var centrePointX = ((startX + endX) / 2);
        var centrePointY = ((startY + endY) / 2);

        var perpStartX_START = (Math.sin(angle) * halfPerpLineDist + centrePointX);
        var perpStartY_START = (-Math.cos(angle) * halfPerpLineDist + centrePointY);
        var perpEndX_START = (-Math.sin(angle) * halfPerpLineDist + centrePointX);
        var perpEndY_START = (Math.cos(angle) * halfPerpLineDist + centrePointY);

        var perpCentrePointX_START = ((perpStartX_START + perpEndX_START) / 2);
        var perpCentrePointY_START = ((perpStartY_START + perpEndY_START) / 2);

        var perpStartX_END = (Math.sin(angle) * halfPerpLineDist + centrePointX);
        var perpStartY_END = (-Math.cos(angle) * halfPerpLineDist + centrePointY);
        var perpEndX_END = (-Math.sin(angle) * halfPerpLineDist + centrePointX);
        var perpEndY_END = (Math.cos(angle) * halfPerpLineDist + centrePointY);

        var perpCentrePointX_END = ((perpStartX_END + perpEndX_END) / 2);
        var perpCentrePointY_END = ((perpStartY_END + perpEndY_END) / 2);

        var d1_START = "", d1_END = "";
        var myLine = "";
        //if arrow is small than arrowHeadHeight*2 then then 50% arrowHead and 50% line
        //otherwise
        if (lineDist > arrowHeadHeight * 2) {

            var pt_START = this.pointAtLineDistance(p2, p1, lineDist - arrowHeadHeight);
            var pt_END = this.pointAtLineDistance(p1, p2, lineDist - arrowHeadHeight);

            perpStartX_START = (Math.sin(angle) * halfPerpLineDist + pt_START.x);
            perpStartY_START = (-Math.cos(angle) * halfPerpLineDist + pt_START.y);
            perpEndX_START = (-Math.sin(angle) * halfPerpLineDist + pt_START.x);
            perpEndY_START = (Math.cos(angle) * halfPerpLineDist + pt_START.y);

            perpCentrePointX_START = ((perpStartX_START + perpEndX_START) / 2);
            perpCentrePointY_START = ((perpStartY_START + perpEndY_START) / 2);

            var perpStartX_END = (Math.sin(angle) * halfPerpLineDist + pt_END.x);
            var perpStartY_END = (-Math.cos(angle) * halfPerpLineDist + pt_END.y);
            var perpEndX_END = (-Math.sin(angle) * halfPerpLineDist + pt_END.x);
            var perpEndY_END = (Math.cos(angle) * halfPerpLineDist + pt_END.y);

            var perpCentrePointX_END = ((perpStartX_END + perpEndX_END) / 2);
            var perpCentrePointY_END = ((perpStartY_END + perpEndY_END) / 2);

        }



        if (side == "START") {
            myLine = this.line(perpCentrePointX_START, perpCentrePointY_START, endX, endY, width, shaftColor);
            d1_START = "M" + Math.round(perpStartX_START) + " " + Math.round(perpStartY_START) + " L" + Math.round(perpEndX_START) + "," + Math.round(perpEndY_START) +
                " L" + Math.round(startX) + "," + Math.round(startY) + " L" + Math.round(perpStartX_START) + "," + Math.round(perpStartY_START);
        }
        else if (side == "END") {

            myLine = this.line(startX, startY, perpCentrePointX_END, perpCentrePointY_END, width, shaftColor);
            d1_END = "M" + Math.round(perpStartX_END) + " " + Math.round(perpStartY_END) + " L" + Math.round(perpEndX_END) + "," + Math.round(perpEndY_END) +
                " L" + Math.round(endX) + "," + Math.round(endY) + " L" + Math.round(perpStartX_END) + "," + Math.round(perpStartY_END);
        }
        else {
            myLine = this.line(perpCentrePointX_START, perpCentrePointY_START, perpCentrePointX_END, perpCentrePointY_END, width, shaftColor);
            var d1_START = "M" + Math.round(perpStartX_START) + " " + Math.round(perpStartY_START) + " L" + Math.round(perpEndX_START) + "," + Math.round(perpEndY_START) +
                " L" + Math.round(startX) + "," + Math.round(startY) + " L" + Math.round(perpStartX_START) + "," + Math.round(perpStartY_START);

            var d1_END = "M" + Math.round(perpStartX_END) + " " + Math.round(perpStartY_END) + " L" + Math.round(perpEndX_END) + "," + Math.round(perpEndY_END) +
                " L" + Math.round(endX) + "," + Math.round(endY) + " L" + Math.round(perpStartX_END) + "," + Math.round(perpStartY_END);

        }


        var xmlns = "http://www.w3.org/2000/svg";
        var arrow_g = document.createElementNS(xmlns, "g");

        arrow_g.appendChild(myLine);

        if (d1_START != "") {

            var newpath = document.createElementNS(xmlns, "path");
            newpath.setAttributeNS(null, "d", d1_START);
            newpath.setAttribute('fill', arrowHeadcolor);
            arrow_g.appendChild(newpath);
        }

        if (d1_END != "") {

            var newpath = document.createElementNS(xmlns, "path");
            newpath.setAttributeNS(null, "d", d1_END);
            newpath.setAttribute('fill', arrowHeadcolor);
            arrow_g.appendChild(newpath);
        }

        const points = `${this.props.x1},${this.props.y1} ${this.props.x2},${this.props.y2}`;
        const color = this.props.color;
        return (
            <g>
                <defs>
                    <marker id="Triangle" viewBox="0 0 10 10" refX="1" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto" style={{ fill: `${color}`}}>
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                    </marker>
                </defs>

                {
                    <polyline points={points} style={{
                        fill: "none", stroke: `${ color }`,
                    strokeWidth: "2", markerEnd: "url(#Triangle)"
                }} />
                }
            </g>
        )
        /* 
        return
        (<g> <path d={d1_START} style={{ fill: arrowHeadcolor }} > </path>
           
        </g>) */
        //return (arrow_g);
    }

    drawArrow() {

        /*  var arrowProperty = {
             startPt: { x: 300, y: 10 },
             endPt: { x: 380, y: 25 },
             //    width: 2,
             //    headSide: "BOTH", //END, START
             //    shaftColor: "green",
             //    headColor: "red",
             //    headMinHeight: 8,
         };
 
         var myArrow = arrow(arrowProperty);
 
         var elementToAppend = document.body;
         var svg = createSVG();
         svg.appendChild(myArrow);
         elementToAppend.appendChild(svg); */
    }
}

export default Arrow;