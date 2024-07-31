import Phaser from 'phaser';
import createCompetitionModal from './CreateCompetitionModal';

let gameDifficulty = 'easy';
let baseSpeed = 200;
let gameMode = 'solo';
let competitionCode = '';

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

    const gameDifficultyModalHtml = `
      <div id="game-difficulty-modal" class="modal">
        <h4>Select Game Difficulty</h4>
        <div id="difficulty-container" class="button-container">
          <button id="easy-difficulty-button">Easy</button>
          <button id="medium-difficulty-button">Medium</button>
          <button id="hard-difficulty-button">Hard</button>
        </div>
        
        <h4>Select Game Mode</h4>
        <div id="mode-container" class="button-container">
          <button id="solo-mode-button">Solo</button>
          <button id="1-on-1-mode-button">One on One</button>
          <button id="group-mode-button">Group</button>
        </div>
        <button id="play-button" disabled>Play</button>
      </div>
    `;
    const gameDifficultyModalContainer = document.createElement('div');
    gameDifficultyModalContainer.innerHTML = gameDifficultyModalHtml;
    document.body.appendChild(gameDifficultyModalContainer);

    // Display the game difficulty modal
    document.getElementById('game-difficulty-modal').style.display = 'block';

    // Add event listeners for difficulty buttons
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

    // Add event listeners for mode buttons
    document
      .getElementById('solo-mode-button')
      .addEventListener('click', () => {
        this.selectGameMode('solo');
      });

    document
      .getElementById('1-on-1-mode-button')
      .addEventListener('click', () => {
        this.selectGameMode('1on1');
        this.openCompetitionModal(); // Open competition modal for 1-on-1 mode
      });

    document
      .getElementById('group-mode-button')
      .addEventListener('click', () => {
        this.selectGameMode('group');
      });

    // Initialize competition modal
    createCompetitionModal(this);

    document.getElementById('play-button').addEventListener('click', () => {
      this.startGame();
    });
  }

  openCompetitionModal() {
    document.getElementById('competition-modal').style.display = 'block';
  }

  showFriendCode() {
    competitionCode = this.generateUniqueCode();
    document.getElementById('friend-code').innerText = competitionCode;
    document.getElementById('friend-code-container').style.display = 'block';
  }

  generateUniqueCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  copyCodeToClipboard() {
    const code = document.getElementById('friend-code').innerText;
    navigator.clipboard.writeText(code).then(
      () => {
        alert('Code copied to clipboard!');
      },
      (err) => {
        console.error('Could not copy code: ', err);
      }
    );
  }

  competeRandom() {
    // Logic for competing with a random user goes here
    alert('Competing with a random user!');
  }

  closeCompetitionModal() {
    document.getElementById('competition-modal').style.display = 'none';
  }

  startCompetitionWithCode() {
    competitionCode = document.getElementById('code-input').value;
    if (competitionCode) {
      // Logic for starting the competition with the entered code goes here
      alert('Starting competition with code: ' + competitionCode);
      this.closeCompetitionModal();
    } else {
      alert('Please enter a valid code.');
    }
  }

  selectGameDifficulty(difficulty) {
    gameDifficulty = difficulty;
    baseSpeed = this.getSpeedByDifficulty(difficulty);

    this.updateSelection('difficulty', difficulty);
    this.checkReadyToPlay();
  }

  selectGameMode(mode) {
    gameMode = mode;

    this.updateSelection('mode', mode);
    this.checkReadyToPlay();
  }

  getSpeedByDifficulty(difficulty) {
    switch (difficulty) {
      case 'easy':
        return 200;
      case 'medium':
        return 300;
      case 'hard':
        return 400;
      default:
        return 200;
    }
  }

  updateSelection(type, selectedValue) {
    if (type === 'difficulty') {
      document
        .querySelectorAll('#difficulty-container button')
        .forEach((button) => {
          button.classList.remove('selected');
        });

      const selectedButton = document.getElementById(
        `${selectedValue}-difficulty-button`
      );
      if (selectedButton) {
        selectedButton.classList.add('selected');
      }
    } else if (type === 'mode') {
      document.querySelectorAll('#mode-container button').forEach((button) => {
        button.classList.remove('selected');
      });

      const selectedButton = document.getElementById(
        `${selectedValue}-mode-button`
      );
      if (selectedButton) {
        selectedButton.classList.add('selected');
      }
    }
  }

  checkReadyToPlay() {
    if (gameDifficulty && gameMode) {
      document.getElementById('play-button').disabled = false;
    }
  }

  startGame() {
    document.getElementById('game-difficulty-modal').style.display = 'none';
    this.scene.start('GameScene', { gameDifficulty, baseSpeed, gameMode });
  }
}
