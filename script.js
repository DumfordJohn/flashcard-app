let decks = JSON.parse(localStorage.getItem('flashcardDecks')) || {};
let currentDeck = null;
let studyIndex = 0;
let isFlipped = false;

function saveDecks() {
    localStorage.setItem('flashcardDecks', JSON.stringify(decks));
}

function createDeck() {
    const nameInput = document.getElementById('deck-name');
    const name = nameInput.value.trim();
    if (!name || decks[name]) return alert ('Deck name is invalid or already exists');

    decks[name] = [];
    saveDecks();
    nameInput.value = '';
    renderDeckList();
}

function renderDeckList() {
    const list = document.getElementById('deck-list');
    list.innerHTML = '<h2>Your Decks:</h2>';
    for (const name in decks) {
        const btn = document.createElement('button');
        btn.textContent = name;
        btn.onclick = () => openDeck(name);
        list.appendChild(btn);
    }
}

function openDeck(name) {
    currentDeck = name;
    document.getElementById('deck-title').textContent = name;
    document.getElementById('card-editor').style.display = 'block';
    document.getElementById('study-mode').style.display = 'none';
    renderCardList();
}

function addCard() {
    const front = document.getElementById('front-text').value.trim();
    const back = document.getElementById('back-text').value.trim();
    if (!front || !back) return alert('Both sides of the card are required.');

    decks[currentDeck].push({ front, back });
    saveDecks;
    document.getElementById('front-text').value = '';
    document.getElementById('back-text').value = '';
    renderCardList();
}

function renderCardList() {
    const list = document.getElementById('card-list');
    list.innerHTML = '<h3>Cards:</h3>';
    decks[currentDeck].forEach((card, i) => {
        const div = document.getElement('div');
        div.textContent = `${i + 1}. ${card.front} -> ${card.back}`;
        list.appendChild(div);
    });
}

function startStudy() {
    if (decks[currentDeck].length === 0) return alert('No cards to study');
    studyIndex = 0;
    isFlipped = false;
    document.getElementById('card-editor').style.display = 'none';
    document.getElementById('study-mode').style.display = 'block';
    showStudyCard();
}

function showStudyCard() {
    const card = decks[currentDeck][studyIndex];
    const box = document.getElementById('study-card');
    box.textContent = isFlipped ? card.back : card.front;
}

function flipCard() {
    isFlipped = !isFlipped;
    showStudyCard();
}

function nextCard() {
    studyIndex = (studyIndex + 1) % decks[currentDeck].length;
    isFlipped = false;
    showStudyCard();
}

function exitStudy() {
    document.getElementById('study-mode').style.display = 'none';
    document.getElementById('card-editor').style.display = 'block';
}

renderDeckList();