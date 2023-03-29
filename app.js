const result = document.getElementById ('blackjack-result');
const wins = document.getElementById ('wins');
const loses = document.getElementById ('loses');
const draws = document.getElementById ('draws');

//this object stores all the variables and selectors we need
const blackjack = {
  you: {div: '.your-box', scoreSpan: '#your-result', score: 0, bust: false},
  dealer: {
    div: '.dealer-box',
    scoreSpan: '#dealer-result',
    score: 0,
    bust: false,
  },
  cards: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'K', 'Q'],
  cardsMap: {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    A: [1, 11],
    J: 10,
    K: 10,
    Q: 10,
  },
  //keep tracks of button states
  isStand: false,
  turnsOver: false,
  isHit: false,
};
const you = blackjack['you'];
const dealer = blackjack['dealer'];
let myWins = 0;
let myLose = 0;
let myDraws = 0;
//buttons
const hitBtn = document.getElementById ('hit-btn');
const standBtn = document.getElementById ('stand-btn');
const dealBtn = document.getElementById ('deal-btn');

//audios
const addSound = new Audio ('/sounds/swish.m4a');
const lostSound = new Audio ('/sounds/aww.mp3');
const winSound = new Audio ('/sounds/cash.mp3');

//hit button
hitBtn.addEventListener ('click', blackjackHit);

//deal button
dealBtn.addEventListener ('click', blackjackDeal);

// stand button
standBtn.addEventListener ('click', blackjackStand);

//this function handles click event on hit button
function blackjackHit () {
  if (blackjack['isStand'] === false) {
    blackjack['isHit'] = true;
    let card = randomCard ();
    showCard (card, you);
    //play add sound
    addSound.play ();
    calculateScore (card, you);
    showScore (you);
  }
  if (you['bust'] === true) {
    result.textContent = 'You Lost!';
    result.style.color = '#DF2E38';
    lostSound.play ();
    myLose++;
    loses.textContent = myLose;
  }
}

//this function show card each time you clicked hit button
const showCard = (card, activePlayer) => {
  if (activePlayer['score'] <= 21) {
    const element = document.createElement ('img');
    element.src = `/images/${card}.png`;
    document.querySelector (activePlayer['div']).appendChild (element);
  }
};
//randomly selects a card
const randomCard = () => {
  const random = Math.floor (Math.random () * blackjack['cards'].length);
  return blackjack['cards'][random];
};

//calculates card score
const calculateScore = (card, activePlayer) => {
  //if card == Ace then check if score + 11 is less or equal to 21 then take ace value as 11
  if (card === 'A') {
    if (activePlayer['score'] + blackjack['cardsMap'][card][1] <= 21) {
      activePlayer['score'] += blackjack['cardsMap'][card][1];
    } else {
      //else take ace value as 1
      activePlayer['score'] += blackjack['cardsMap'][card][0];
    }
  } else {
    activePlayer['score'] += blackjack['cardsMap'][card];
  }
};

//shows score on the dom
const showScore = activePlayer => {
  // if score is greater than 21 then display bust
  if (activePlayer['score'] > 21) {
    document.querySelector (activePlayer['scoreSpan']).textContent = 'Bust!';
    document.querySelector (activePlayer['scoreSpan']).style.color = '#DF2E38';
    activePlayer['bust'] = true;
  } else {
    //else display score
    document.querySelector (activePlayer['scoreSpan']).textContent =
      activePlayer['score'];
  }
};

const sleep = ms => {
  return new Promise (resolve => setTimeout (resolve, ms));
};

//this function handles click event on stand button
async function blackjackStand () {
  if (blackjack['isHit'] === true) {
    blackjack['isStand'] = true;
    blackjack['isHit'] = false;
    while (dealer['score'] <= 16 && dealer['bust'] === false) {
      let card = randomCard ();
      showCard (card, dealer);
      //play add sound
      addSound.play ();
      calculateScore (card, dealer);
      showScore (dealer);
      await sleep (1000);
    }

    blackjack['turnsOver'] = true;
    displayResult ();
  }
}

//this displays who won by comparing results
const displayResult = () => {
  if (dealer['score'] < you['score'] || dealer['bust'] === true) {
    result.textContent = 'You Won!';
    result.style.color = '#FC7300';

    //play wining sound
    winSound.play ();
    myWins++;
    wins.textContent = myWins;
  } else if (dealer['score'] === you['score']) {
    result.textContent = 'Draw!';
    result.style.color = '#00425A';
    myDraws++;
    draws.textContent = myDraws;
  } else {
    result.textContent = 'You Lost!';
    result.style.color = '#DF2E38';
    //play lost sound
    lostSound.play ();
    myLose++;
    loses.textContent = myLose;
  }
};

// this function handles click event on deal button
function blackjackDeal () {
  blackjack['isStand'] = false;
  let yourImages = document.querySelector (you['div']).querySelectorAll ('img');
  let dealerImages = document
    .querySelector (dealer['div'])
    .querySelectorAll ('img');
  //removes all dynamically added image elements
  for (let img of yourImages) {
    img.remove ();
  }
  for (let img of dealerImages) {
    img.remove ();
  }
  //following will be setted to their default values
  document.querySelector (you['scoreSpan']).textContent = 0;
  document.querySelector (dealer['scoreSpan']).textContent = 0;
  document.querySelector (you['scoreSpan']).style.color = 'white';
  document.querySelector (dealer['scoreSpan']).style.color = 'white';
  result.style.color = '#f2cd5c';
  result.textContent = "Let's play!";
  you['score'] = 0;
  dealer['score'] = 0;
  you['bust'] = false;
  dealer['bust'] = false;
}
