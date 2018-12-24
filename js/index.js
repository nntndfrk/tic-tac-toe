import Game from './game';

const gameInfo = document.querySelector('#game-info');
const board = document.querySelector('#game-board');
const restartButton = document.querySelector('#game-restart');

const game = new Game(board, gameInfo, restartButton);

game.init();