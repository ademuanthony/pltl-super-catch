import Phaser from 'phaser';

let gameDifficulty = 'easy';
let baseSpeed = 200;
let gameMode = 'solo';

export default class ModeSelectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ModeSelectionScene' });
  }

  preload() {
    this.load.image('wallet', 'assets/wallet.png');
    this.load.image('atmosphere', 'assets/atmosphere.png');
  }

  create() {
    this.add.image(211, 320, 'atmosphere');

    // Create the modal HTML and append it to the DOM
    const gameDifficultyModalHtml = `
      <div id="game-difficulty-modal" class="modal">
        <h4>Select Game Difficulty</h4>
        <div class="button-container">
          <button id="easy-difficulty-button">Easy</button>
          <button id="medium-difficulty-button">Medium</button>
          <button id="hard-difficulty-button">Hard</button>
        </div>

        <h3>Select Game Mode</h3>
        <div class="button-container">
          <button id="solo-mode-button">Solo</button>
          <button id="1-on-1-mode-button">One on One</button>
          <button id="group-mode-button">Group</button>
        </div>
      </div>
    `;
    const gameDifficultyModalContainer = document.createElement('div');
    gameDifficultyModalContainer.innerHTML = gameDifficultyModalHtml;
    document.body.appendChild(gameDifficultyModalContainer);

    // Display the modal
    document.getElementById('game-difficulty-modal').style.display = 'block';

    // Add event listeners for the buttons
    document
      .getElementById('easy-difficulty-button')
      .addEventListener('click', () => {
        this.selectGameDifficulty('easy');
      });

    document
      .getElementById('medium-difficulty-button')
      .addEventListener('click', () => {
        this.selectGameDifficulty('medium');
      });

    document
      .getElementById('hard-difficulty-button')
      .addEventListener('click', () => {
        this.selectGameDifficulty('hard');
      });

      // game mode
      document
      .getElementById('solo-mode-button')
      .addEventListener('click', () => {
        this.selectGameDifficulty('solo');
      });

    document
      .getElementById('1-on-1-mode-button')
      .addEventListener('click', () => {
        this.selectGameDifficulty('1on1');
      });

    document
      .getElementById('group-mode-button')
      .addEventListener('click', () => {
        this.selectGameDifficulty('group');
      });
  }

  selectGameDifficulty(difficulty) {
    gameDifficulty = difficulty;
    switch (difficulty) {
      case 'easy':
        baseSpeed = 200;
        break;
      case 'medium':
        baseSpeed = 300;
        break;
      case 'hard':
        baseSpeed = 400;
        break;
    }
    document.getElementById('game-difficulty-modal').style.display = 'none';
    this.scene.start('GameScene', { gameDifficulty, baseSpeed });
  }

  selectGameMode(mode) {

  }
}
