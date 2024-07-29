import Phaser from 'phaser';
import './styles.css';  // Import styles.css
import ModeSelectionScene from './scenes/ModeSelectionScene';
import GameScene from './scenes/GameScene';

const config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  scene: [ModeSelectionScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  }
};

const game = new Phaser.Game(config);
