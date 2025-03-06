import React from 'react';
import Layout from './components/layout';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TicTacToeBoard from './tic-tac-toe/components/board';
import BoardView from './game2048/components/board';

// App component that wraps around the routes
const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/2048-game" element={<BoardView />} />
          <Route path="/tic-tac-toe" element={<TicTacToeBoard />} />
          <Route path="/" element={<BoardView />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;