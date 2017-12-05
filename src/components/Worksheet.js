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
import Lcm from './Lcm'
import WholeFraction from './WholeFraction'
import FractionCompare from './FractionCompare'
import AddFractions from './AddFractions'

const util = require('util')

function Index(props) {
    return <div className="circle"> {props.index} </div>
}


class Worksheet extends Component {

    constructor(props) {
        super(props);
        this.newOperation = this.selectedOperation = 'addFraction';
        this.state = {}
        this.checkCallback = this.checkCallback.bind(this);
        this.newSumCallback = this.newSumCallback.bind(this);
        this.showAnswer = this.showAnswer.bind(this);
        this.change = this.change.bind(this);
        this.new = true;
        this.check = false;
        this.answer = false;
        this.sums = [];
        this.g = 0;
    }

    checkCallback() {
        if (!this.check) {
            this.check = true;
            this.answer = false;
            this.setState({})
        }
    }

    showAnswer() {
        if (!this.answer) {
            this.answer = true;
            this.check = false;
            this.setState({})
        }
    }

    newSumCallback() {
        this.new = true;
        this.check = false;
        this.answer = false;
        this.setState({})
    }

    componentDidUpdate(prevProps, prevState) {
        this.resetState();
    }

    resetState() {
        this.check = false;
        this.new = false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentDidMount() {
        this.resetState();
    }

    getSums() {
        let result = [];
        const operation = this.selectedOperation;
        let columns = this.refs.columns ? parseInt(this.refs.columns.value) : 5;
        let rows = this.refs.rows ? parseInt(this.refs.rows.value) : 2;
        let count = this.refs.count ? parseInt(this.refs.count.value) : 10;
        const key = this.new ? ++this.g : this.g

        if (operation === 'multiplication') {
            for (let i = 0; i < 10; i++) {
                result.push(<div key={i} style={{ borderStyle: 'solid', borderColor: 'gray', margin: '10px 40px 10px 10px', position: 'relative' }} >
                    {<Index index={i + 1} />}
                    <Mult key={i} check={this.state.check} new={this.state.new} /> </div>);
            }
        } else if (operation === 'division') {
            for (let i = 0; i < 1; i++) {
                result.push(<div key={i} style={{ borderStyle: 'solid', borderColor: 'gray', margin: '10px 40px 10px 10px', position: 'relative' }} >
                    {<Index index={i + 1} />}
                    <Div key={i} check={this.state.check} new={this.state.new} /> </div>);
            }
        } else if (operation === 'addition') {
            for (let i = 0; i < count; i++) {
                result.push(<div key={i} style={{ borderStyle: 'solid', borderColor: 'gray', margin: '10px 40px 10px 10px', position: 'relative' }} >
                    {<Index index={i + 1} />}
                    <Add key={i} check={this.state.check} new={this.state.new} /> </div>);
            }
        } else if (operation === 'subtraction') {
            for (let i = 0; i < 4; i++) {
                result.push(<div key={i} style={{ borderStyle: 'solid', borderColor: 'gray', margin: '10px 40px 10px 10px', position: 'relative' }} >
                    {<Index index={i} />}
                    <Sub key={i} check={this.state.check} new={this.state.new} /> </div>);
            }
        }
        else if (operation === 'fraction') {
            for (let i = 0; i < 1; i++) {
                result.push(<div key={i} style={{ borderStyle: 'solid', borderColor: 'gray', margin: '10px 40px 10px 10px', position: 'relative' }} >
                    {<Index index={i + 1} />}
                    <Fraction key={i} check={this.state.check} new={this.state.new} />
                </div>
                );
            }
        }
        else if (operation === 'fraction2') {
            for (let i = 0; i < 1; i++) {
                result.push(<div key={this.g++} style={{
                    borderStyle: 'solid', borderColor: 'gray', margin: '10px 40px 10px 10px', position: 'relative'
                }} >
                    {<Index index={i + 1} />}
                    <PieFraction check={this.check} new={this.new} /> </div>);
            }
        }
        else if (operation === 'indices') {
            result.push(<Indices key={1} base="5" />)
        } else if (operation === 'lcm') {
            result.push(<Lcm key={key} check={this.check} new={this.new} />)
        } else if (operation === 'wholeFraction' || operation === 'improperFraction') {
            const improper = operation === 'improperFraction' ? true : false;
            result.push(<WholeFraction key={key} check={this.check} new={this.new} improper={improper} />)
        } else if (operation === 'compareFraction') {
            result.push(<FractionCompare key={key} check={this.check} new={this.new} answer={this.answer} />)
        } else if (operation === 'addFraction') {
            result.push(<AddFractions key={key} check={this.check} new={this.new} answer={this.answer} />)
        }
        
        return result;
    }

    change(event) {
        this.newOperation = event.target.value;
        if (this.selectedOperation !== this.newOperation) {
            this.selectedOperation = this.newOperation;
            this.new = true;
            this.check = false;
            this.setState({});
        }
    }

    render() {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <select onChange={this.change} defaultValue={this.selectedOperation} >
                        <option value="addition" >Addition</option>
                        <option value="subtraction">Subtraction</option>
                        <option value="multiplication">Multiplication</option>
                        <option value="division">Division</option>
                        <option value="fraction">Fraction</option>
                        <option value="fraction2">Fraction2</option>
                        <option value="indices">Indices</option>
                        <option value="lcm">LCM</option>
                        <option value="wholeFraction">wholeFraction</option>
                        <option value="improperFraction">ImproperFraction</option>
                        <option value="compareFraction">Compare Fractions</option>
                        <option value="addFraction">Add Fractions</option>
                    </select>{/* 
                    <label> Columns </label>
                    <input type="text" ref="columns" defaultValue={3} placeholder="3" />
                    <label> Rows </label>
                    <input type="text" ref="rows" defaultValue={3} placeholder="3" />
                    <label> Count </label>
                    <input type="text" ref="count" defaultValue={10} placeholder="3" /> */}
                    <button onClick={this.checkCallback}> Steps </button>
                    <button onClick={this.showAnswer}> Answers </button>
                    <button onClick={this.newSumCallback}> New </button>
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