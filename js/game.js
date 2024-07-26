var config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
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

var game = new Phaser.Game(config);

var score = 0;
var lifeline = 10;
var walletBalance = 1000; // Example wallet balance
var ethAddress = "0xc87a86671E0590C2CC7e729FDb96d61550C122F5"; // Provided ETH address
var scoreText;
var lifelineText;
var walletButton;
var superman;
var basketHitbox;
var cursors;
var gameOver = false;
var modal;
var gameTime = 0; // Track the game time to adjust difficulty

function preload() {
  this.load.image('atmosphere', 'assets/atmosphere.png');
  this.load.image('coin', 'assets/coin.png');
  this.load.image('bumb', 'assets/bumb.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('superman', 'assets/superman.png');
  this.load.image('wallet', 'assets/wallet.png'); // Wallet button image
}

function create() {
  this.add.image(211, 320, 'atmosphere');

  superman = this.physics.add.image(180, 550, 'superman').setCollideWorldBounds(true);
  superman.setDisplaySize(superman.width * (150 / superman.height), 150); // Scale Superman to max height of 150

  // Enable input and drag for Superman
  superman.setInteractive();
  this.input.setDraggable(superman);

  this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
    gameObject.x = dragX;
  });

  // Create an invisible hitbox for the basket
  basketHitbox = this.physics.add.image(superman.x, superman.y - 35, null).setOrigin(0.63, 0.5);
  basketHitbox.setDisplaySize(superman.displayWidth * 0.9, 20);
  basketHitbox.body.allowGravity = false; // Disable gravity for the hitbox
  basketHitbox.setVisible(false); // Hide the hitbox

  // Create gaming font style for score and lifeline text
  var textStyle = { fontSize: '16px', fill: '#00ff00', fontFamily: '"Press Start 2P"' }; // Example gaming font and color
  scoreText = this.add.text(16, 16, 'Score: 0', textStyle);
  lifelineText = this.add.text(160, 16, 'Lifeline: 10', textStyle); // Adjusted position to align on the same row

  // Create wallet button
  walletButton = this.add.image(330, 20, 'wallet').setInteractive();
  walletButton.setDisplaySize(30, 30); // Scale wallet button to fit

  walletButton.on('pointerdown', () => {
    this.scene.pause(); // Pause the game
    document.getElementById('wallet-modal').style.display = 'block';
  });

  cursors = this.input.keyboard.createCursorKeys();

  this.time.addEvent({
    delay: 1000,
    callback: increaseDifficulty,
    callbackScope: this,
    loop: true
  });

  this.time.addEvent({
    delay: 200,
    callback: spawnObject,
    callbackScope: this,
    loop: true
  });

  // Create a div element for the game over modal and hide it initially
  var gameOverModalHtml = `
    <div id="game-over-modal" class="modal">
      <h2>Game Over</h2>
      <p id="final-score"></p>
      <button id="play-again-button">Play Again</button>
    </div>
  `;
  var gameOverModalContainer = document.createElement('div');
  gameOverModalContainer.innerHTML = gameOverModalHtml;
  document.body.appendChild(gameOverModalContainer);

  // Create a div element for the wallet modal and hide it initially
  var walletModalHtml = `
    <div id="wallet-modal" class="modal">
      <h2>Wallet</h2>
      <p id="wallet-balance">Balance: $${walletBalance}</p>
      <button id="deposit-button">Deposit</button>
      <button id="withdraw-button">Withdraw</button>
      <button id="close-wallet-button">Close</button>
      <div id="deposit-instructions" style="display: none; margin-top: 10px;">
        <p>Send ETH to the following address on the Base network:</p>
        <p id="eth-address">${ethAddress}</p>
        <button id="copy-address-button">Copy Address</button>
      </div>
    </div>
  `;
  var walletModalContainer = document.createElement('div');
  walletModalContainer.innerHTML = walletModalHtml;
  document.body.appendChild(walletModalContainer);

  // Create a div element for the withdrawal modal and hide it initially
  var withdrawalModalHtml = `
    <div id="withdrawal-modal" class="modal">
      <h2>Withdraw Funds</h2>
      <form id="withdrawal-form">
        <div class="form-group">
          <label for="withdraw-wallet-address">Wallet Address:</label>
          <input type="text" id="withdraw-wallet-address" name="walletAddress" required>
        </div>
        <div class="form-group">
          <label for="withdraw-amount">Amount:</label>
          <input type="number" id="withdraw-amount" name="amount" required>
        </div>
        <button type="submit">Submit</button>
        <button type="button" id="cancel-withdrawal-button">Cancel</button>
      </form>
    </div>
  `;
  var withdrawalModalContainer = document.createElement('div');
  withdrawalModalContainer.innerHTML = withdrawalModalHtml;
  document.body.appendChild(withdrawalModalContainer);

  // Add event listeners for wallet modal buttons
  var closeWalletButton = document.getElementById('close-wallet-button');
  closeWalletButton.addEventListener('click', () => {
    document.getElementById('wallet-modal').style.display = 'none';
    game.scene.keys.default.scene.resume(); // Correctly resume the game scene
  });

  var depositButton = document.getElementById('deposit-button');
  depositButton.addEventListener('click', () => {
    document.getElementById('deposit-instructions').style.display = 'block';
  });

  var copyAddressButton = document.getElementById('copy-address-button');
  copyAddressButton.addEventListener('click', () => {
    navigator.clipboard.writeText(ethAddress).then(() => {
      alert('Address copied to clipboard');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  });

  var withdrawButton = document.getElementById('withdraw-button');
  withdrawButton.addEventListener('click', () => {
    document.getElementById('withdrawal-modal').style.display = 'block';
  });

  var cancelWithdrawalButton = document.getElementById('cancel-withdrawal-button');
  cancelWithdrawalButton.addEventListener('click', () => {
    document.getElementById('withdrawal-modal').style.display = 'none';
  });

  var withdrawalForm = document.getElementById('withdrawal-form');
  withdrawalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    var walletAddress = document.getElementById('withdraw-wallet-address').value;
    var amount = parseFloat(document.getElementById('withdraw-amount').value);
    if (walletAddress && amount > 0 && walletBalance >= amount) {
      walletBalance -= amount;
      document.getElementById('wallet-balance').innerText = 'Balance: $' + walletBalance;
      alert(`Sent $${amount} to ${walletAddress}`);
      document.getElementById('withdrawal-modal').style.display = 'none';
    } else {
      alert('Invalid wallet address or amount, or insufficient balance');
    }
  });

  // Add event listener to play again button
  var playAgainButton = document.getElementById('play-again-button');
  playAgainButton.addEventListener('click', () => {
    document.getElementById('game-over-modal').style.display = 'none';
    restartGame(this.scene);
  });

  modal = document.getElementById('game-over-modal');
}

function update() {
  if (cursors.left.isDown) {
    superman.setVelocityX(-200);
  } else if (cursors.right.isDown) {
    superman.setVelocityX(200);
  } else {
    superman.setVelocityX(0);
  }

  // Update basket hitbox position to follow Superman
  basketHitbox.setPosition(superman.x + 10, superman.y - 35);
}

function spawnObject() {
  if (gameOver) {
    return;
  }

  var x = Phaser.Math.Between(50, 310);
  var objectType = Phaser.Math.Between(0, 100);
  var object;

  if (objectType < 60) {
    object = this.physics.add.image(x, 10, 'star');
    object.scoreValue = 30;
    object.isBomb = false;
  } else if (objectType < 90) {
    object = this.physics.add.image(x, 10, 'coin');
    object.scoreValue = 50;
    object.isBomb = false;
  } else {
    object = this.physics.add.image(x, 10, 'bumb');
    object.isBomb = true;
  }

  var baseSpeed = 200 + gameTime * 5; // Increase base speed over time
  object.setDisplaySize(50, object.height * (50 / object.width)); // Scale falling objects to max width of 50
  object.setVelocityY(baseSpeed);

  this.physics.add.overlap(basketHitbox, object, catchObject, null, this);
}

function catchObject(basketHitbox, object) {
  if (object.isBomb) {
    lifeline -= 1;
    lifelineText.setText('Lifeline: ' + lifeline);
    if (lifeline === 0) {
      gameOver = true;
      this.physics.pause();
      superman.setTint(0xff0000);
      showGameOverModal();
    }
  } else {
    score += object.scoreValue;
    scoreText.setText('Score: ' + score);
  }

  object.destroy();
}

function increaseDifficulty() {
  gameTime += 1; // Increase game time
}

function showGameOverModal() {
  var finalScoreText = document.getElementById('final-score');
  finalScoreText.innerText = 'Your final score is: ' + score;
  modal.style.display = 'block';
}

function restartGame(scene) {
  score = 0;
  lifeline = 10;
  gameOver = false;
  gameTime = 0; // Reset game time

  scoreText.setText('Score: 0');
  lifelineText.setText('Lifeline: 10');
  superman.clearTint();

  scene.restart();
}
