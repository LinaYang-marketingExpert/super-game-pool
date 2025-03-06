import React from 'react';
import './layout.scss';

const Layout = ({ children }: any) => {
  const gameLinks = [
    { name: '2048-game', path: '/2048-game' },
    { name: 'tic-tac-toe', path: '/tic-tac-toe' },
    { name: 'snake', path: '/snake' },
    { name: 'memory', path: '/memory' },
    { name: 'minesweeper', path: '/minesweeper' },
    { name: 'sudoku', path: '/sudoku' },
    { name: 'puzzle', path: '/puzzle' },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="header__logo">
          <h1>GameZone</h1>
        </div>
        <nav className="header__nav">
          {gameLinks.map((link) => (
            <a key={link.path} href={link.path} className="header__nav-link">
              {link.name}
            </a>
          ))}
        </nav>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 