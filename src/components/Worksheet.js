import React, { Component } from 'react';
import styles from './../styles/Globals.css';
import Add from './Add'
import Sub from './Sub'
import Addition from './../store/Addition';
import Mult from './Mult';
import DivisionC from './Division';
import getAdditionSum from './../sums/addition'
const util = require('util')

let sums = [{
    index: 1,
    inputs: 4,
    problem: {
        steps: [
            {
                type: 'carryover',
                value: 'xxx'
            },
            {
                type: 'number',
                value: '123'
            },
            {
                type: 'number',
                operation: '+',
                value: '498'
            },
            {
                type: 'number',
                operation: '+',
                value: '888'
            },
            {
                type: 'line'
            },
            {

                type: 'inputs',
                length: 5
            }
        ]
    },
    answer: {
        answer: 'x458',
        steps: [
            {
                type: 'carryover',
                value: '1x3'
            },
            {
                type: 'number',
                value: '123'
            },
            {
                type: 'number',
                operation: '+',
                value: '498'
            },
            {
                type: 'number',
                operation: '+',
                value: '888'
            },
            {
                type: 'line'
            },
            {
                type: 'answer',
                value: 'x458'
            }
        ]
    }
}, {
    index: 2,
    inputs: 4,
    problem: {
        steps: [
            {
                type: 'carryover',
                value: 'xxx'
            },
            {
                type: 'number',
                value: '123'
            },
            {
                type: 'number',
                operation: '+',
                value: '498'
            },
            {
                type: 'number',
                operation: '+',
                value: '888'
            },
            {
                type: 'line'
            },
            {

                type: 'inputs',
                length: 5
            }
        ]
    },
    answer: {
        answer: 'x458',
        steps: [
            {
                type: 'carryover',
                value: '1x3'
            },
            {
                type: 'number',
                value: '123'
            },
            {
                type: 'number',
                operation: '+',
                value: '498'
            },
            {
                type: 'number',
                operation: '+',
                value: '888'
            },
            {
                type: 'line'
            },
            {
                type: 'answer',
                value: 'x458'
            }
        ]
    }
}]

function Index(props) {
    return <div className="circle"> {props.index} </div>
}

class Worksheet extends Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.keys = [];
        this.check = this.check.bind(this);
        this.newSum = this.newSum.bind(this);
        this.selectedOperation = "multiplication";
        this.sums = [];
    }

    check() {
        this.setState({ check: true })
    }

    newSum() {
        this.setState({ new: true, check: false })
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
        this.setState({ new: false, check: false })
    }

    getSums() {
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
        let operation = this.refs.operation ? this.refs.operation.value : this.selectedOperation;
        let columns = this.refs.columns ? parseInt(this.refs.columns.value) : 5;
        let rows = this.refs.rows ? parseInt(this.refs.rows.value) : 2;
        let count = this.refs.count ? parseInt(this.refs.count.value) : 10;
        if (operation === 'multiplication') {
            this.selectedOperation = "multiplication"
            for (let i = 0; i < 10; i++) {
                result.push(<div key={i} style={{ borderStyle: 'solid', borderColor: 'gray', margin: '10px 40px 10px 10px', position: 'relative' }} >
                    {<Index index={i+1} />}
                    <Mult key={i} check={this.state.check} new={this.state.new} /> </div>);
            }
            
        } else if (operation === 'division') {
            this.selectedOperation = "division"
            for (let i = 0; i < 1; i++) {
                result.push(<DivisionC key={this.keys[i]} dividend={rows} divisor={columns} check={this.state.check} index={i + 1} />)
            }
        } else if (operation === 'addition') {
            this.selectedOperation = "addition"
            if (this.state.new) {
                this.sums = [];
                for (let i = 0; i < count; i++) {
                    this.sums.push(getAdditionSum(rows, columns));
                }
            }
            this.sums.map((e, i) => {
                result.push(<div key={i} style={{ borderStyle: 'solid', borderColor: 'gray', margin: '10px 40px 10px 10px', position: 'relative' }} >
                    {<Index index={i + 1} />}
                    <Add key={i} sum={e} check={this.state.check} /> </div>);
            })
            // for (let i = 0; i < 1; i++) {
            //     result.push(<Add key={this.keys[i]} sum={sum} operation={operation} digits={digits} size={length} check={this.state.check} index={i + 1} />)
            // }
        } else if (operation === 'subtraction') {
            this.selectedOperation = "subtraction"
            for (let i = 0; i < 4; i++) {
                result.push(<div key={i} style={{ borderStyle: 'solid', borderColor: 'gray', margin: '10px 40px 10px 10px', position: 'relative' }} >
                    {<Index index={i} />}
                    <Sub key={i} check={this.state.check} new={this.state.new} /> </div>);
            }
        }
        return result;
    }

    render() {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <select ref="operation" defaultValue={this.selectedOperation} >
                        <option value="addition" >Addition</option>
                        <option value="subtraction">Subtraction</option>
                        <option value="multiplication">Multiplication</option>
                        <option value="division">5Division</option>
                    </select>
                    <label> Columns </label>
                    <input type="text" ref="columns" defaultValue={3} placeholder="3" />
                    <label> Rows </label>
                    <input type="text" ref="rows" defaultValue={3} placeholder="3" />
                    <label> Count </label>
                    <input type="text" ref="count" defaultValue={10} placeholder="3" />
                    <button onClick={this.check}> Check </button>
                    <button onClick={this.newSum}> New </button>
                </div>
                <div className="container" style={{ margin: '10px' }}>
                    {this.getSums()}
                </div>
            </div >)
    }
}

export default Worksheet;