import React, { Component } from 'react';
import './App.css';
import Worksheet from './components/Worksheet'
import Flex from './components/Flex'


class App extends Component {
  render() {
    return (
      <div className="App">
        <Worksheet> </Worksheet>

        {/*  <Flex /> */}

      </div>
    );
  }
}

export default App;
