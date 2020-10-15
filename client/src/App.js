/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
    };
  }

  componentDidMount() {
    fetch('http://localhost:3000/test')
      .then((res) => res.text())
      .then((data) => this.setState({ title: data }));
  }

  render() {
    const { title } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit
            {' '}
            <code>src/App.js</code>
            {' '}
            and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            {(title) || 'Loading...'}
          </a>
        </header>
      </div>
    );
  }
}

export default App;
