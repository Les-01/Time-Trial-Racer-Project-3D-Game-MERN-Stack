// game.js

// This imports 'React' from 'react'.
import React from 'react';
// This imports the variable 'ThreeGame' from the file 'gameLogic' within the 'components' folder.
import ThreeGame from '../components/gameLogic';

// This is the functional component 'Game'.
const Game = () => {
  // This logs a message to the console when the Game component is rendered for debugging.
  console.log('Game component rendered');
  // This returns the JSX that defines the structure of the Game component.
  return (
    <div className="game-background">
      <div className="game">     
        <ThreeGame />      
      </div>
    </div>
  );
};
// This exports the functional component 'Game' as the default export of this module.
export default Game;
