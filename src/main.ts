import './style.css';
import { Game } from './game';

// Ensure the DOM is fully loaded before starting the game
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game('gameCanvas');
  game.start();
});
