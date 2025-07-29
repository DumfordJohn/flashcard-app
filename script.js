let currentDeck = null;
let studyIndex = 0;
let isFlipped = false;
let decks = {};

console.log('script.js loaded');

async function loadCards(deckName) {
    const res = await fetch(`https://script.google.com/macros/s/AKfycbxG_bPRCatkgyApQJEt7AclixScDIH1Dbirhj4MM9rSYqUBon0a7O-NgJaciGdMKWNH/exec?deck=${encodeURIComponent(deckName)}`);
    const cards = await res.json();
    renderCardList(cards);
}

async function createDeck() {
    console.log('create deck clicked');
    const nameInput = document.getElementById('deck-name');
    const name = nameInput.value.trim();
    if (!name) return alert('Deck name is required');

    const url = `https://script.google.com/macros/s/AKfycbxG_bPRCatkgyApQJEt7AclixScDIH1Dbirhj4MM9rSYqUBon0a7O-NgJaciGdMKWNH/exec?action=addCard&deck=${encodeURIComponent(name)}&front=Placeholder&back=Placeholder`;
    await fetch(url)

    nameInput.value = '';
    await renderDeckList();
}

async function renderDeckList() {
    const res = await fetch('https://script.google.com/macros/s/AKfycbxG_bPRCatkgyApQJEt7AclixScDIH1Dbirhj4MM9rSYqUBon0a7O-NgJaciGdMKWNH/exec');
    const decks = await res.json();

    const list = document.getElementById('deck-list');
    list.innerHTML = '<h2>Your Decks:</h2>';

    decks.forEach(deckObj => {
        const deckName = deckObj.deck || deckObj;
        const btn = document.createElement('button');
        btn.textContent = deckName;
        btn.onclick = () => openDeck(deckName);
        list.appendChild(btn);
    });
}

async function openDeck(name) {
    currentDeck = name;
    document.getElementById('deck-title').textContent = name;
    document.getElementById('card-editor').style.display = 'block';
    document.getElementById('study-mode').style.display = 'none';
    await loadCards(name);
}

async function addCard() {
    console.log('add card clicked')
    const front = document.getElementById('front-text').value.trim();
    const back = document.getElementById('back-text').value.trim();
    if (!front || !back) return alert('Both sides of the card are required.');


    const url = `https://script.google.com/macros/s/AKfycbxG_bPRCatkgyApQJEt7AclixScDIH1Dbirhj4MM9rSYqUBon0a7O-NgJaciGdMKWNH/exec?action=addCard&deck=${encodeURIComponent(currentDeck)}&front=${encodeURIComponent(front)}&back=${encodeURIComponent(back)}`;
    await fetch(url);

    document.getElementById('front-text').value = '';
    document.getElementById('back-text').value = '';
    await loadCards(currentDeck);
}

function renderCardList(cards) {
    const list = document.getElementById('card-list');
    list.innerHTML = '<h3>Cards:</h3>';
    cards.forEach((card, i) => {
        const div = document.createElement('div');
        div.textContent = `${i + 1}. ${card.front} -> ${card.back}`;
        list.appendChild(div);
    });

    decks[currentDeck] = cards;
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