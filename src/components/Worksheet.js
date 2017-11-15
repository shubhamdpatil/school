/*global window*/

import React, { Component } from 'react';
import styles from './../styles/Globals.css';
import Add from './Add'
import Sub from './Sub'
import Addition from './../store/Addition';
import Mult from './Mult';
import Div from './Div';
import Fraction from './../mathjs/Fraction';
import PieFraction from './../mathjs/PieFraction';
import getAdditionSum from './../sums/addition'
import Indices from './Indices'



const util = require('util')

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
        this.selectedOperation = "fraction2";
        this.sums = [];
        this.g = 0;
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
        this.setState({ new: false, check: false })
        //window.scroll(0, 100);
        //  window.scroll(0, 0);
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
                    {<Index index={i + 1} />}
                    <Mult key={i} check={this.state.check} new={this.state.new} /> </div>);
            }
        } else if (operation === 'division') {
            this.selectedOperation = "division"
            for (let i = 0; i < 1; i++) {
                result.push(<div key={i} style={{ borderStyle: 'solid', borderColor: 'gray', margin: '10px 40px 10px 10px', position: 'relative' }} >
                    {<Index index={i + 1} />}
                    <Div key={i} check={this.state.check} new={this.state.new} /> </div>);
            }
        } else if (operation === 'addition') {
            this.selectedOperation = "addition"
            for (let i = 0; i < count; i++) {
                result.push(<div key={i} style={{ borderStyle: 'solid', borderColor: 'gray', margin: '10px 40px 10px 10px', position: 'relative' }} >
                    {<Index index={i + 1} />}
                    <Add key={i} check={this.state.check} new={this.state.new} /> </div>);
            }
        } else if (operation === 'subtraction') {
            this.selectedOperation = "subtraction"
            for (let i = 0; i < 4; i++) {
                result.push(<div key={i} style={{ borderStyle: 'solid', borderColor: 'gray', margin: '10px 40px 10px 10px', position: 'relative' }} >
                    {<Index index={i} />}
                    <Sub key={i} check={this.state.check} new={this.state.new} /> </div>);
            }
        }
        else if (operation === 'fraction') {
            this.selectedOperation = "fraction"
            for (let i = 0; i < 1; i++) {
                result.push(<div key={i} style={{ borderStyle: 'solid', borderColor: 'gray', margin: '10px 40px 10px 10px', position: 'relative' }} >
                    {<Index index={i + 1} />}
                    <Fraction key={i} check={this.state.check} new={this.state.new} />
                </div>
                );
            }
        }
        else if (operation === 'fraction2') {
            this.selectedOperation = "fraction2"
            for (let i = 0; i < 1; i++) {
                result.push(<div key={this.g++} style={{
                    borderStyle: 'solid', borderColor: 'gray', margin: '10px 40px 10px 10px', position: 'relative'
                }} >
                    {<Index index={i + 1} />}
                    <PieFraction check={this.state.check} new={this.state.new} /> </div>);
            }
        }
        else if (operation === 'indices') {
            this.selectedOperation = "indices";
            result.push(<Indices key={1} base="5" />)
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
                        <option value="division">Division</option>
                        <option value="fraction">Fraction</option>
                        <option value="fraction2">Fraction2</option>
                        <option value="indices">Indices</option>
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
                    <div>
                        {this.getSums()}
                    </div>
                </div>
            </div >)
    }
}

export default Worksheet;