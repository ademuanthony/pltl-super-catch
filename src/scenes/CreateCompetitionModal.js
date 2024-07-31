function createCompetitionModal(scene) {
  const competitionModalHtml = `
    <div id="competition-modal" class="modal flyout" style="display: none;">
      <h4>Select Competition Type</h4>
      <div class="button-container">
        <button id="compete-friend-button">Compete with new Friend</button>
        <button id="compete-random-button">Random User</button>
      </div>
      <div id="competition-code-check">
        <input type="checkbox" id="has-code-checkbox" />
        <label for="has-code-checkbox">I already have a code</label>
      </div>
      <div id="code-input-container" style="display: none;">
        <h4>Enter Competition Code</h4>
        <input type="text" id="code-input" placeholder="Enter your code here" />
      </div>
      <div id="friend-code-container" style="display: none;">
        <h4>Invite a Friend</h4>
        <p>Share this code to compete with your friend:</p>
        <div id="friend-code"></div>
        <button id="copy-code-button">Copy Code</button>
      </div>
      <button id="competition-modal-play-button" style="display: none;">Play</button>
      <button id="competition-modal-close-button">Close</button>
    </div>
  `;
  appendToBody(competitionModalHtml);

  setupCompetitionModalEventListeners(scene);
}

function appendToBody(html) {
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
}

function setupCompetitionModalEventListeners(scene) {
  document
    .getElementById('compete-friend-button')
    .addEventListener('click', () => {
      scene.showFriendCode();
    });
  document
    .getElementById('compete-random-button')
    .addEventListener('click', () => {
      scene.competeRandom();
    });
  document.getElementById('copy-code-button').addEventListener('click', () => {
    scene.copyCodeToClipboard();
  });
  document
    .getElementById('competition-modal-close-button')
    .addEventListener('click', () => {
      scene.closeCompetitionModal();
    });
  document
    .getElementById('has-code-checkbox')
    .addEventListener('change', (event) => {
      const isChecked = event.target.checked;
      document.getElementById('code-input-container').style.display = isChecked
        ? 'block'
        : 'none';
      document.getElementById('competition-modal-play-button').style.display =
        isChecked ? 'inline' : 'none';
    });
  document
    .getElementById('competition-modal-play-button')
    .addEventListener('click', () => {
      scene.startCompetitionWithCode();
    });
}

export default createCompetitionModal;
