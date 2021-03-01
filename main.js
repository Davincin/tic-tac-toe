'use strict'
var $fields;

var $11, $12, $13, $21, $22, $23, $31, $32, $33;

var $w1, $w2, $w3, $k1, $k2, $k3, $x1, $x2, $all;

var $playerOneResult, $playerTwoResult, $playerOneName, $playerTwoName;

var $popup, $popupTitle, $playerOneInput, $playerTwoInput, $popupInfo, $popupStartBtn;

var $winPopup, $winPopupTitle, $newGameBtn, $nextRoundBtn;

var $activeBox;

let wasChecked = 0;
let $anyWin;


function prepareDOMElements() {
    $fields = document.querySelectorAll('.game-field');

    $11 = document.querySelector('.game-field__11');
    $12 = document.querySelector('.game-field__12');
    $13 = document.querySelector('.game-field__13');
    $21 = document.querySelector('.game-field__21');
    $22 = document.querySelector('.game-field__22');
    $23 = document.querySelector('.game-field__23');
    $31 = document.querySelector('.game-field__31');
    $32 = document.querySelector('.game-field__32');
    $33 = document.querySelector('.game-field__33');

    $playerOneResult = document.querySelector('.player-one__result');
    $playerTwoResult = document.querySelector('.player-two__result');
    $playerOneName = document.querySelector('.player-one__name');
    $playerTwoName = document.querySelector('.player-two__name');

    $popup = document.querySelector('.popup');
    $popupTitle = document.querySelector('.popup__title');
    $playerOneInput = document.querySelector('.popup__player-one-input');
    $playerTwoInput = document.querySelector('.popup__player-two-input');
    $popupInfo = document.querySelector('.popup__info');
    $popupStartBtn = document.querySelector('.popup__start-button');
    
    $winPopup = document.querySelector('.win-popup');
    $winPopupTitle = document.querySelector('.win-popup__title');
    $newGameBtn = document.querySelector('.win-popup__btn-new-game');
    $nextRoundBtn = document.querySelector('.win-popup__btn-next-round');
    
    $activeBox = document.querySelector('.active-info');
    
    $w1 = [$11, $12, $13];
    $w2 = [$21, $22, $23];
    $w3 = [$31, $32, $33];
    $k1 = [$11, $21, $31];
    $k2 = [$12, $22, $32];
    $k3 = [$13, $23, $33];
    $x1 = [$11, $22, $33];
    $x2 = [$13, $22, $31];
    $all = [$w1, $w2, $w3, $k1, $k2, $k3, $x1, $x2];
};


function prepareDOMEvents() {
    $popupStartBtn.addEventListener('click', startGame);
    $newGameBtn.addEventListener('click', newGame);
    $nextRoundBtn.addEventListener('click', nextRound);
    whosActive();
    write();
};

const player1 = {
    name: '',
    score: 0,
    active: true,
    key: 'O',
    winColor: '#0AC4F5'
    
};

const player2 = {
    name: '',
    score: 0,
    active: false,
    key: 'X',
    winColor: '#1AE581'
  
};

function checkWin() {
    $anyWin = false;
    let winValue = 0;
    for(let arr of $all) {
        for (let field of arr) {
            if(field.innerText !== '' && field.innerText === this.key) {
                winValue++;
            };
            if (winValue === 3) {
                this.score++;
                winValue = 0;
                wasChecked = 0;
                $anyWin = true;
                $playerOneResult.innerText = player1.score;
                $playerTwoResult.innerText = player2.score;
                for (let el of arr) {
                    el.style.color = "#fff"
                    el.style.backgroundColor = `${this.winColor}`
                };
                afterRound(this);
                return 0;
            };
        };
        winValue = 0;
    };
    if(wasChecked === 9) {
        afterRound(this);
        wasChecked = 0;
    };
};

function write() {
    for(let field of $fields) {
        field.addEventListener('click', () => {
            if(field.innerText === '') {
                wasChecked++;
                if(player1.active === true) {
                    field.innerText = player1.key;
                    field.style.color = `${player1.winColor}`
                    player1.active = false;
                    player2.active = true;
                    checkWin.bind(player1)();
                    whosActive();
                } else if (player2.active === true) {
                    field.innerText = player2.key;
                    field.style.color = `${player2.winColor}`
                    player2.active = false;
                    player1.active = true;
                    checkWin.bind(player2)();
                    whosActive();
                };
            };    
        });
    };
};

function startGame() {
    if($playerOneInput.value !== '' && $playerTwoInput.value !== '') {
        if($playerOneInput.value.includes(' ') || $playerTwoInput.value.includes(' ')) {
            $popupInfo.innerText = 'Nazwa gracza nie może zawierać spacji.'
        } else {
            $playerOneName.innerText = $playerOneInput.value;
            $playerTwoName.innerText = $playerTwoInput.value;
            player1.name = $playerOneInput.value;
            player2.name = $playerTwoInput.value;
            $popup.classList.add('popup--hidden');
            $playerOneInput.value = '';
            $playerTwoInput.value = '';
            $popupInfo.innerText = '';
        }
    }  else {
        $popupInfo.innerText = 'Musisz podać nazwy graczy.'
    }
};

function afterRound(winner) {
    if ($anyWin) {
        $winPopupTitle.innerHTML = `Rundę wygrywa:  <span style="color: ${winner.winColor};">${winner.name}</span>`;
    } else {
        $winPopupTitle.innerText = `Remis`;
    };
    $winPopup.classList.remove('win-popup--hidden');
};
    
function nextRound() {
    for(let field of $fields) {
        field.innerText = '';
        field.removeAttribute('style');
    };
    $winPopup.classList.add('win-popup--hidden');
}
    
function newGame() {
    player1.score = 0;
    player2.score = 0;
    player1.name = '';
    player2.name = '';
    player1.active = true;
    player2.active = false;
    $playerOneName.innerText = player1.name;
    $playerTwoName.innerText = player2.name;
    $playerOneResult.innerText = player1.score;
    $playerTwoResult.innerText = player2.score;
    whosActive();
    for(let field of $fields) {
        field.innerText = '';
        field.removeAttribute('style');
    };
    $winPopup.classList.add('win-popup--hidden');
    $popup.classList.remove('popup--hidden');
};

function whosActive() {
    if(player1.active) {
        $activeBox.innerText = 'O';
        $activeBox.style.color = player1.winColor;
        
    } else {
        $activeBox.innerText = 'X';
        $activeBox.style.color = player2.winColor;
    };
};

function main() {
    prepareDOMElements();
    prepareDOMEvents();
};

document.addEventListener('DOMContentLoaded', main);
