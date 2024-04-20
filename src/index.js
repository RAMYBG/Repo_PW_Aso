import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import ReactDOM from 'react-dom'; 

import Timer from './Components/RegisterGoles/Timer';
import SelectGames from './Components/RegisterGoles/SelectGame';


const App = () => {
  return (
    <div >
      <Timer/>
      
    </div>
  );
};

const container = document.getElementById('root');
ReactDOM.render(<App />, container);
