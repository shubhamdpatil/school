import React, { Component } from 'react';
import styles from './../styles/Globals.css'
import Division from './../store/Division'
import correctAnswer from './check3.png'
import wrongAnswer from './wrong-answer.png'
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { randomNumber } from './../store/Utils'
import * as CSS from './../config/styles'
import $ from 'jquery';
import MultiplicationC from './Multiplication'
import Multiplication from './../store/Multiplication'
import Label from './Labels'

let data1 = {
    dividend: '860445',
    divisor: '15',
    result: [
        {
            quotent: '5',
            remainder: '11',
            operand1: '86',
            operand2: '75'
        },
        {
            quotent: '57',
            remainder: '9',
            operand1: '114',
            operand2: '105'
        },
        {
            quotent: '576',
            remainder: '1',
            operand1: '90',
            operand2: '90'
        }
    ]
}

//193

const Arrow = (props) => {
    return (<svg width="600px" height="100px">
        <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#f00" />
            </marker>
        </defs>

        <line x1="50" y1="50" x2="250" y2="50" stroke="#000" strokeWidth="5" markerEnd="url(#arrow)" />
    </svg>)
}

class DetailedAnswer extends Component {

    constructor(props) {
        super(props);
        this.colors = ['YellowGreen',
            'Violet',
            'Tomato',
            'RoyalBlue',
            'GoldenRod',
            'DarkCyan',
            'DarkOrchid',
            'IndianRed',
            'ForestGreen',
            'OrangeRed',
            'OliveDrab'];
        this.steps = 0;
    }

    componentDidMount() {
        this.setCss();
    }

    setHeight() {
        for (let i = 0; i < this.steps; i++) {
            const el = findDOMNode(this.refs['sum' + i]);
            let sumHeight = ((3 + (i + 2)) * CSS.BOX_SIZE) + 'px';
            el.style.setProperty('--sum-height', sumHeight);
        }
    }

    setWidth() {
        for (let i = 0; i < this.steps; i++) {
            const el = findDOMNode(this.refs['sum' + i]);
            let sumWidth = (CSS.BOX_SIZE * (this.props.problem.length + 1)) + 'px';
            el.style.setProperty('--sum-width', sumWidth);
        }
    }

    setCss() {
        this.setWidth();
        this.setHeight();
    }

    render() {
        let props = this.props;
        let colors = this.colors;
        let end = props.result.divisor.length + props.result.dividend.length + 1;
        let start = props.result.divisor.length + 1;
        let formattedRows = props.result.result.map((e, i) => {
            if (i == 0) {
                let operand22 = '-'.repeat(1) + e.operand2;
                let operand1 = <Row color={colors[i]} row={operand22} start={start - 1} spaces={e.operand1.length} end={end} bottomBorder={true} />  /* start, end, row */
                let operand2 = <Row color={colors[i]} row={e.remainder} start={start} spaces={e.operand1.length} end={end} />  /* start, end, row */
                start += e.operand1.length - e.remainder.length;
                return <div key={i} > {operand1}  {operand2} </div>
            }
            if (i > 0) {
                let operand22 = '-'.repeat(1) + e.operand2;
                let operand1 = <Row color={colors[i]} row={e.operand1} start={start} end={end} spaces={e.operand1.length} />  /* start, end, row, spaces */
                let operand2 = <Row color={colors[i]} row={operand22} start={start - 1} end={end} spaces={e.operand1.length} bottomBorder={true} />  /* start, end, row */
                let remainder = <Row color={colors[i]} row={e.remainder} start={start} end={end} spaces={e.operand1.length} border={true} />  /* start, end, row */
                start += e.operand1.length - e.remainder.length;
                return < div key={i} > {operand1}  {operand2} {remainder} </div >
            }
        })

        start = props.result.divisor.length + 1;
        let WithRemainder = props.result.result.map((e, i) => {
            if (i == 0) {
                let operand22 = '-'.repeat(1) + e.operand2;
                let operand1 = <Row color={colors[i]} row={operand22} start={start - 1} end={end} bottomBorder={true} />  /* start, end, row */
                start += e.operand1.length - e.remainder.length;
                return <div key={i} > {operand1}   </div>
            }
            if (i > 0) {
                let operand1 = <Row color={colors[i]} row={e.operand1} start={start} end={end} spaces={e.operand1.length} />  /* start, end, row, spaces */
                let operand22 = '-'.repeat(1) + e.operand2;
                let operand2 = <Row color={colors[i]} row={operand22} start={start - 1} end={end} spaces={e.operand1.length} bottomBorder={true} />  /* start, end, row */
                start += e.operand1.length - e.remainder.length;
                return < div key={i} > {operand1}  {operand2}  </div >
            }
        })

        let sums = [];
        let sumWithoutRemainder = [];
        sumWithoutRemainder.push(<div> <Problem index={1} problem={props.problem} /> {formattedRows[0]} </div>);
        for (let i = 0; i < formattedRows.length; i++) {
            let arrowX = (props.result.divisor.length + 2) * CSS.BOX_SIZE + (i * CSS.BOX_SIZE) + (i * 1.5)
            let arrowY1 = 80;
            let arrowY2 = arrowY1 + (((i - 1) * 2) + 1) * 35;
            if (i == 0) {
                sums.push(<div className={classNames('sum', 'blackBorder')} ref={'sum' + i} key={i}>
                    <Row colors={colors} row={props.result.result[i].quotent} start={props.result.divisor.length + 1} end={end} spaces={props.result.result[0].operand1.length} /> {sumWithoutRemainder[0]}  </div>)
                sumWithoutRemainder[0] = (<div>  {WithRemainder[0]} </div>);
            } else {
                sums.push(
                    <div
                        className={classNames('sum', 'blackBorder')} ref={'sum' + i} key={i}>
                        <Arrow x1={arrowX} y1={arrowY1} x2={arrowX} y2={arrowY2} />
                        <Row colors={colors} row={props.result.result[i].quotent} start={props.result.divisor.length + props.result.result[0].operand1.length} end={end} spaces={props.result.result[0].operand1.length} />   <Problem index={i + 1} problem={props.problem} /> {sumWithoutRemainder[i - 1]}
                        {formattedRows[i]}
                    </div>)
                sumWithoutRemainder.push(<div key={i}> {sumWithoutRemainder[i - 1]} {WithRemainder[i]} </div>)
            }
        }
        this.steps = sums.length;
        return <div> {sums} </div>;
    }
}

function Problem(props) {
    let row = <Row row={props.problem} key={0} index={0} />
    return <div> <Index index={props.index} /> {row}  </div>
}

function Index(props) {
    return <div className="circle"> {props.index} </div>
}


class Row extends Component { /* start, end, row, spaces */

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        let props = this.props;
        let row = props.row.split('');
        let style = ''
        let dividend = false;
        let preEmptyBoxes = [];
        let postEmptyBoxes = [];
        let key = 0;
        for (let i = 0; i < props.start; i++) {
            preEmptyBoxes.push(<div className="box" key={key++}>  </div >)
        }
        for (let i = 0; i < props.spaces - row.length; i++) {
            preEmptyBoxes.push(<div className={classNames({ 'box': true, bottomBorder: props.bottomBorder })} key={key++} >  </div >)
        }
        let startAddingTopBorder = false;
        let boxes = row.map((e, i) => {
            if (e === ')') {
                startAddingTopBorder = true;
            }
            let result = <div className={classNames({ 'box': true, topBorder: startAddingTopBorder, bottomBorder: props.bottomBorder })} style={{ color: props.colors ? props.colors[i] : props.color }} key={key++} > {e} </div >
            return result;
        })
        for (let i = preEmptyBoxes.length + row.length; i < props.end; i++) {
            postEmptyBoxes.push(<div className="box" key={key++} >  </div >)
        }
        let classes = classNames('row', props.classNames)
        let result = <div className={classes} key={props.index}> {preEmptyBoxes} {boxes} {postEmptyBoxes}</div>
        return result;
    }
}

class DivisionC extends Component {

    constructor(props) {
        super(props);
        this.formDivisionOperation();
        this.problem = this.data.divisor + ')'.repeat(1) + this.data.dividend;
    }

    getDivisionStepsNew(dividend, divisor, remainder, result) {

        let dividendN = +dividend, divisorN = +divisor, remainderN = +remainder;

        if (dividend.length === 0) {
            return;
        }

        let quotent, quotentN;
        let newDividendN = +(remainder + dividend[0]);
        if (newDividendN < divisorN) {
            quotent = '0';
            quotentN = 0;
        } else {
            quotent = Math.floor(+newDividendN / divisorN).toString();
            quotentN = Math.floor(+newDividendN / divisorN);
        }
        let newRemainder = newDividendN % divisorN;
        let operand1 = newDividendN.toString();
        let operand2 = (quotentN * divisor).toString();
        operand2 = '0'.repeat(operand1.length - operand2.length) + operand2;

        if (result.length > 0) {
            quotent = result[result.length - 1].quotent + quotent;
        }
        result.push({
            quotent: quotent, remainder: newRemainder.toString(), operand1: operand1,
            operand2: operand2
        });

        if (dividend.length > 1) {
            this.getDivisionStepsNew(dividend.slice(1), divisor, newRemainder, result)
        }
    }

    formDivisionOperation() {
        this.data = {}
        this.data.dividend = '14326'//randomNumber(parseInt(this.props.dividend)).toString();
        this.data.divisor = '32'//randomNumber(parseInt(this.props.divisor)).toString();
        this.data.result = [];
        this.getDivisionStepsNew(this.data.dividend, this.data.divisor, '', this.data.result)
        let verified = (+this.data.result[this.data.result.length - 1].quotent * +this.data.divisor) + +this.data.result[this.data.result.length - 1].remainder

        if (parseInt(this.data.dividend) === verified) {
            console.log('CORRECT:.... this.data.dividend: ' + this.data.dividend + ' verified: ' + verified.toString())
        } else {
            console.log('WRONG:.... this.data.dividend: ' + this.data.dividend + ' verified: ' + verified.toString())
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.check) {
            this.onCheck();
        }
    }

    columns() {
        this.maxColumns = this.data.dividend.toString().length + this.data.divisor.toString().length + 1;
    }

    onCheck() {
        this.tried = true;
        this.setState({ tried: true });
    }

    render() {
        var row = classNames('row');
        var bottom = classNames('row', 'bottom');
        let show_answer = {
            show: this.tried,
            hide: !this.tried
        };

        let answerImage = classNames({
            'answer-image': true,
            ...show_answer,
        });

        let answerNumber = classNames({
            'back': true,
            row: true,
            ...show_answer,
            'answer-number': true
        });
        let verifiedMultiplication = new Multiplication();
        verifiedMultiplication.operands.push(parseInt(this.data.result[this.data.result.length - 1].quotent));
        verifiedMultiplication.operands.push(parseInt(this.data.divisor));
        verifiedMultiplication.multiply();
        return (
            <div>
                <div className="container" style={{ flexDirection: 'row' }}>
                    <DetailedAnswer result={this.data} problem={this.problem} />
                    <MultiplicationC displayOnly={true} newSum={false} sum={verifiedMultiplication} digits={2} size={2} />
                </div>
            

                <div style={{ borderStyle: 'solid', borderColor: 'black' }}>
                    
                    <svg width="600px" height="500px">
                        <defs>
                            <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                                <path d="M0,0 L0,6 L9,3 z" fill="#f00" />
                            </marker>
                        </defs>

                        <line x2="50" y2="380" x1="250" y1="0" stroke="#000" strokeWidth="20" markerEnd="url(#arrow)" />
                    </svg>
                </div>

            </div>
        )
    }
}

export default DivisionC;