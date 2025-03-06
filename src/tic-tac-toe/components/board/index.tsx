import React from 'react';
import TicTacToe from './tic-tac-toe';
import { NavLink } from 'react-router-dom';

// function Menu() {
//     return (
//       <div className="menu">
//         <NavLink to="easy">
//           Easy
//         </NavLink>
//         <NavLink to="impossible">Impossible</NavLink>
//       </div>
//     );
// }

const TicTacToeBoard = () => {
  return (
    <div>
      {/* <Menu /> */}
      <TicTacToe difficulty="easy" />
    </div>
  );
};

export default TicTacToeBoard;
