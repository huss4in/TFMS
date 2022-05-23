import React, { Component } from 'react';
import './App.css';

class Navbar extends Component {
  render() {
    return (
      <div className="navbar">
        <nav>
          <a href="https://www.tamkeen.bh">
            <img
              className="img"
              src="https://www.tamkeen.bh/yntbpszk/2022/01/Eng-Logo-Crop-white-30-sc.gif?v=81739"
              width="136"
              height="40"
            />
          </a>
        </nav>
      </div>
    );
  }
}

export default Navbar;
