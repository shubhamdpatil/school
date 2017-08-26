import React, { Component } from 'react';
import styles from './Division.css';
import Division from './../store/Division'
import correctAnswer from './check3.png'
import wrongAnswer from './wrong-answer.png'
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { randomNumber } from './../store/Utils'

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

function Arrow(props) {

    let pos = { position: 'absolute' }
    let stroke = { strokeWidth: '2', stroke: 'rgb(255,0,0)' };

    return <svg style={pos}>
        <line x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2} style={stroke} />
    </svg >
}

function D(props) {
    let colors = ['YellowGreen',
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
    let W = props.result.result.map((e, i) => {
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

    let C = [];
    let K = [];
    K.push(<div> <Problem problem={props.problem} /> {formattedRows[0]} </div>);
    let initialSpacesForQuotent = props.result.result[0].operand1.length
    for (let i = 0; i < formattedRows.length; i++) {
        let height = ((50 * (i + 5)) + 30) + 'px';
        let arrowX1 = 50 * (i + 1);
        let arrowY1 = 50 * (i + 1);
        let arrowX2 = 50 * (i + 3);
        let arrowY2 = 50 * (i + 3);
        let style = { height: height }
        if (i == 0) {
            C.push(<div style={style} className={classNames({ sum: true, black: true })} key={i}>  <Row colors={colors} row={props.result.result[i].quotent} start={props.result.divisor.length + 1} end={end} spaces={props.result.result[0].operand1.length} /> {K[0]}  </div>)
            K[0] = (<div>  <Problem problem={props.problem} /> {W[0]} </div>);
        } else {
            C.push(
                <div
                    style={style} className={classNames({ sum: true, black: true })} key={i}>
                    <Arrow x1={arrowX1} y1={arrowY1} x2={arrowX2} y2={arrowY2} />
                    <Row colors={colors} row={props.result.result[i].quotent} start={props.result.divisor.length + props.result.result[0].operand1.length} end={end} spaces={props.result.result[0].operand1.length} />  {K[i - 1]}
                    {formattedRows[i]}
                </div>)
            K.push(<div key={i}> {K[i - 1]} {W[i]} </div>)
        }
    }

    return <div> {C} </div>;

}

function Problem(props) {
    let row = <Row row={props.problem} key={0} index={0} />
    return <div> <Index index={props.index} /> {row}  </div>
}

function Index(props) {
    return <div className="circle"> {props.index} </div>
}

function Row(props) { /* start, end, row, spaces */
    let row = props.row.split('');
    let style = ''
    let dividend = false;
    let preEmptyBoxes = [];
    let postEmptyBoxes = [];
    let key = 0;
    for (let i = 0; i < props.start; i++) {
        preEmptyBoxes.push(<div className="box" key={key++} >  </div >)
    }
    for (let i = 0; i < props.spaces - row.length; i++) {
        preEmptyBoxes.push(<div className={classNames({ 'box': true, bottomBorder: props.bottomBorder })} key={key++} >  </div >)
    }
    let startAddingTopBorder = false;
    let boxes = row.map((e, i) => {
        if (e === ')') {
            startAddingTopBorder = true;
        }
        return <div className={classNames({ 'box': true, topBorder: startAddingTopBorder, bottomBorder: props.bottomBorder })} style={{ color: props.colors ? props.colors[i] : props.color }} key={key++} > {e} </div >
    })
    for (let i = preEmptyBoxes.length + row.length; i < props.end; i++) {
        postEmptyBoxes.push(<div className="box" key={key++} >  </div >)
    }
    let classes = classNames('row', props.classNames)
    return <div className={classes} key={props.index}> {preEmptyBoxes} {boxes} {postEmptyBoxes}</div>
}

class DivisionC extends Component {

    constructor(props) {
        super(props);
        this.formDivisionOperation();
        this.problem = this.data.divisor + ')'.repeat(1) + this.data.dividend;
    }




    getDivisionStepsNew(dividend, divisor, remainder, result) {

        console.log(' dividend: ' + dividend + ' divisor:' + divisor + ' remainder:  ' + remainder
            + ' result: ' + JSON.stringify(result));

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

        console.log('result: ' + JSON.stringify(result));

        if (dividend.length > 1) {
            this.getDivisionStepsNew(dividend.slice(1), divisor, newRemainder, result)
        }
    }


    getDivisionSteps(dividend, divisior, remainder, result) {

        console.log(' dividend, divisior, remainder, result ' + dividend + ' ' + divisior + ' ' +
            remainder + ' ' + JSON.stringify(result));

        let dividendString = dividend.toString();
        if (dividendString.length === 0) {
            return;
        }
        let i = 0;
        let operand1;
        if (remainder) {
            operand1 = remainder + dividendString[i++];
        } else {
            operand1 = dividendString[i++];
        }
        let quotent = '';
        while (+operand1 < divisior) {
            operand1 = operand1 + dividendString[i++].repeat(1);
            quotent = '0'.repeat(1) + quotent;
        }
        quotent += Math.floor(operand1 / divisior)

        /*    if (result.length > 0) {
               quotent = '0'.repeat(i - 1) + Math.floor(operand1 / divisior)
           } else {
               quotent = Math.floor(operand1 / divisior)
           } */

        let left = +operand1 % divisior;
        let newDividend = dividendString.slice(i);

        let operand2 = quotent * divisior;
        if (result.length > 0) {
            quotent = result[result.length - 1].quotent.toString() + quotent.toString();
        }
        result.push({
            quotent: quotent.toString(), remainder: left.toString(), operand1: operand1.toString(),
            operand2: operand2.toString()
        })

        console.log(' newDividend dividend, divisior, remainder, result ' + newDividend + ' ' + dividend + ' ' + divisior + ' ' +
            remainder + ' ' + JSON.stringify(result));


        if (newDividend.toString().length > 0) {
            this.getDivisionSteps(parseInt(newDividend), divisior, left, result)
        }


    }

    formDivisionOperation() {
        this.data = {}
        this.data.dividend = randomNumber(parseInt(this.props.dividend)).toString();
        this.data.divisor = randomNumber(parseInt(this.props.divisor)).toString();
        this.data.result = [];
        this.getDivisionStepsNew(this.data.dividend, this.data.divisor, '', this.data.result)
        /*   let quotent = this.data.result.reduce(function (q, e) {
              return q + e.quotent;
          }, '')
          console.log('final quotent: ' + JSON.stringify(quotent)); */
        let verified = (+this.data.result[this.data.result.length - 1].quotent * +this.data.divisor) + +this.data.result[this.data.result.length - 1].remainder

        if (parseInt(this.data.dividend) === verified) {
            console.log('CORRECT:.... this.data.dividend: ' + this.data.dividend + ' verified: ' + verified.toString())
        } else {
            console.log('WRONG:.... this.data.dividend: ' + this.data.dividend + ' verified: ' + verified.toString())
        }
    }

    componentDidMount() {
        //this.setCss();
    }

    setHeight() {
        const el = findDOMNode(this.refs.sum);
        let sumHeight;
        if (!this.tried) {
            sumHeight = (250 * (this.props.size + 1)) + 30 + 'px';
        } else {
            sumHeight = (250 * (this.props.size + 1 + this.operands.length)) + 30 + 'px';
        }
        el.style.setProperty('--sum-height', sumHeight);
    }

    setWidth() {
        const el = findDOMNode(this.refs.sum);
        let sumWidth = (50 * (this.props.digits + 1)) + 'px';
        el.style.setProperty('--sum-width', sumWidth);
    }

    setCss() {
        // this.setWidth();
        this.setHeight();
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
        return (
            <div>
                {<D result={this.data} problem={this.problem} />
                }            </div>
        )
    }
}

export default DivisionC;