import React from 'react';
import './App.css';
import {InputSnilsMask} from "../inputSnilsMask/inputSnilsMask";


function App() {
    const updateData = (value) => {
        console.log(value.replace(/\D/g, ''))
    }
  return (
    <div className="App">
      <InputSnilsMask updateData={updateData} mask={'--9(99)99'}/>
    </div>
  );
}

export default App;
