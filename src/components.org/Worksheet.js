import React, { Component } from 'react';
import styles from './Worksheet.css';
import AdditionC from './Addition'

import Addition from './../store/Addition';
import MultiplicationC from './Multiplication';
import DivisionC from './Division';


class Worksheet extends Component {

    constructor(props) {
        super(props);
        this.state = { new: false, check: false, sums: [] }
        this.keys = [];
        this.check = this.check.bind(this);
        this.newSum = this.newSum.bind(this);
    }

    check() {
        let a = new Addition(3, 3);
        //  a.getNumbersForAddition();
        this.setState({ check: true })
    }

    newSum() {
        this.setState({ new: true })
    }

    componentDidUpdate(prevProps, prevState) {
        this.setState({ new: false, check: false })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.new || nextState.check) {
            return true;
        } else {
            return false;
        }
    }

    componentDidMount() {
        // let mul = new Multiplication(2, 2);
    }

    sums() {
        if (!this.keys.length) {
            let start = 0;
            for (let i = 0; i < 10; i++) {
                this.keys.push(++start);
            }
        }
        if (this.state.new) {
            let start = this.keys[this.keys.length - 1];
            this.keys = [];
            for (let i = 0; i < 10; i++) {
                this.keys.push(++start);
            }
        }
        let result = [];
        let operation = this.refs.operation ? this.refs.operation.value : "division";
        let digits = this.refs.digits ? parseInt(this.refs.digits.value) : 5;
        let length = this.refs.length ? parseInt(this.refs.length.value) : 2;
        let count = this.refs.count ? parseInt(this.refs.count.value) : 10;
        console.log('operation : ' + operation);
        if (operation === 'multiplication') {
            for (let i = 0; i < count; i++) {
                result.push(<MultiplicationC key={this.keys[i]} digits={2} size={2} check={this.state.check} index={i + 1} />)
            }
        } else  if(operation === 'division') {
            for (let i = 0; i < 1; i++) {
                result.push(<DivisionC key={this.keys[i]} dividend={digits} divisor={length} check={this.state.check} index={i + 1} />)
            }
        } else  {
            for (let i = 0; i < count; i++) {
                result.push(<AdditionC key={this.keys[i]} operation={operation} digits={digits} size={length} check={this.state.check} index={i + 1} />)
            }
        }
        return result;
    }

    render() {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <select ref="operation" defaultValue="division" >
                        <option value="addition" >Addition</option>
                        <option value="subtraction">Subtraction</option>
                        <option value="multiplication">Multiplication</option>
                        <option value="division">Division</option>
                    </select>
                    <label> Columns </label>
                    <input type="text" ref="digits" defaultValue={3} placeholder="3" />
                    <label> Rows </label>
                    <input type="text" ref="length" defaultValue={3} placeholder="3" />
                    <label> Count </label>
                    <input type="text" ref="count" defaultValue={10} placeholder="3" />
                    <button onClick={this.check}> Check </button>
                    <button onClick={this.newSum}> New </button>
                </div>
                <div className="container" style={{ marginTop: '20px' }}>
                    {this.sums()}
                </div>
            </div >)
    }
}

export default Worksheet;