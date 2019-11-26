let MemoryGame = {};
MemoryGame.level = 'easy';
MemoryGame.numberOfCards = 12;
MemoryGame.wrongCounter = 0;
MemoryGame.cards = document.getElementsByClassName('card');
MemoryGame.wrong = document.getElementById('wrong-answers');
MemoryGame.cardContainer = document.getElementById('card-container');
MemoryGame.playMatchMusic = document.getElementById('match-music');
MemoryGame.startMusic = document.getElementById('player');
document.getElementById('mute').addEventListener('click', () => MemoryGame.startMusic.pause());
selectedCards = () => {
    let selected = 0;
    for (let i = 0; i < MemoryGame.cards.length; i++) {
        if (MemoryGame.cards[i].classList.contains('selected')) {
            selected++;
        }
    }
    return selected;
}
userWon = () => {
    for (let i = 0; i < MemoryGame.cards.length; i++) {
        if (!MemoryGame.cards[i].classList.contains('correct')) {
            return false;
        }
    }
    return true;
}
removeSelections = () => {
    for (let i = 0; i < MemoryGame.cards.length; i++) {
        MemoryGame.cards[i].classList.remove('selected');
    }
}
checkMatch = (e) => {
    for (let i = 0; i < MemoryGame.numberOfCards; i++) {
        if (MemoryGame.cards[i].classList.contains('selected') && i != e.target.index) {
            removeSelections()
            if (e.target.style.backgroundImage != MemoryGame.cards[i].style.backgroundImage) {
                e.target.style.cssText = `background-image: url(./img/nba_card.png)`;
                MemoryGame.cards[i].style.cssText = `background-image: url(./img/nba_card.png)`;
                MemoryGame.wrong.innerText = `Wrong guesses: ${++MemoryGame.wrongCounter}`;
            } else {
                if(!MemoryGame.startMusic.paused){
                    MemoryGame.playMatchMusic.play();
                }
                e.target.classList.add('correct');
                MemoryGame.cards[i].classList.add('correct');
                if (userWon()) {
                    MemoryGame.wrong.innerText = "";
                    MemoryGame.startButton.innerText = "restart";
                    MemoryGame.winGif.style.display = "block";
                    MemoryGame.winTextTop.innerText = 'You Won!';
                    MemoryGame.winTextBottom.innerText = `you had ${MemoryGame.wrongCounter} wrong guesses!`;
                    deleteCards();
                }
            }
        }
    }
}
handleSelection = (e) => {
    if (!e.target.classList.contains('correct')) {
        let selected = selectedCards();
        if (selected == 1) {
            e.target.style.cssText = `background-image: url(./img/${e.target.num}.png); background-size: contain`;
            e.target.classList.add('selected');
            setTimeout(() => {
                checkMatch(e);
            }, 700);
        } else if (selected == 0) {
            e.target.style.cssText = `background-image: url(./img/${e.target.num}.png); background-size: contain`;
            e.target.classList.add('selected');
        }
    }
}
getImages = () => {
    let cardImages = new Array(MemoryGame.numberOfCards / 2);
    let imageIndex = 0;
    while (cardImages.includes(undefined)) {
        let num = Math.floor(Math.random() * 30);
        if (!cardImages.includes(num)) {
            cardImages[imageIndex] = num;
            imageIndex++;
        }
    }
    return cardImages;
}
randomCards = () => {
    let cardImages = getImages();
    let cardNum = new Array(MemoryGame.numberOfCards / 2).fill(0);
    let cardsOnBoard = 0;
    let i = 0;
    let num;
    while (cardsOnBoard < MemoryGame.numberOfCards) {
        let randNum = Math.floor(Math.random() * (MemoryGame.numberOfCards / 2));
        while (cardNum[randNum] == 2) {
            randNum = Math.floor(Math.random() * (MemoryGame.numberOfCards / 2));
        }
        num = cardImages[randNum];
        MemoryGame.cards[i].num = num;
        MemoryGame.cards[i].index = i;
        MemoryGame.cards[i].style.cssText = `background-image: url(./img/nba_card.png)`;
        MemoryGame.cards[i].addEventListener('click', handleSelection)
        i++;
        ++cardNum[randNum];
        cardsOnBoard++;
    }
}
createCards = () => {
    for (let i = 0; i < 4; i++) {
        let rowCard = document.createElement('div');
        rowCard.classList.add('row');
        rowCard.classList.add('card-row');
        MemoryGame.cardContainer.append(rowCard);
        for (let j = 0; j < MemoryGame.numberOfCards / 4; j++) {
            let divCard = document.createElement('div');
            divCard.classList.add('card');
            rowCard.append(divCard);
        }
    }
}
removeSelectedLevel = () => {
    for (let i = 0; i < MemoryGame.levels.length; i++) {
        MemoryGame.levels[i].classList.remove('level-selected');
    }
}
selectLevel = (e) => {
    removeSelectedLevel();
    e.target.classList.add('level-selected');
    switch (e.target.attributes[0].value) {
        case "rookie": MemoryGame.numberOfCards = 12;
            break;
        case "advanced": MemoryGame.numberOfCards = 16;
            break;
        case "pro": MemoryGame.numberOfCards = 20;
            break;
    }
}
enterModal = () => {
    deleteCards();
    MemoryGame.wrongCounter = 0;
    MemoryGame.startButton.innerText = "restart";
    MemoryGame.winTextBottom.innerText = "";
    MemoryGame.winTextTop.innerText = "";
    MemoryGame.winGif.style.display = "none";
    MemoryGame.startMusic.play();
    MemoryGame.modal.style.display = 'block';
}
closeModal = () => {
    MemoryGame.startButton.innerText = "Start";
    MemoryGame.modal.style.display = 'none';
}
beginGame = () => {
    MemoryGame.modal.style.display = 'none';
    MemoryGame.wrong.style.visibility = 'visible';
    createCards();
    randomCards();
}
createModal = () => {
    MemoryGame.modal = document.getElementsByClassName('modal')[0];
    MemoryGame.closeModal = document.getElementsByClassName('close')[0];
    MemoryGame.muteButton = document.getElementsByClassName('btn-secondary')[0];
    MemoryGame.beginGameButton = document.getElementsByClassName('btn-primary')[0];
    MemoryGame.levels = document.getElementsByClassName('level');
    MemoryGame.startButton.addEventListener('click', enterModal);
    MemoryGame.closeModal.addEventListener('click', closeModal);
    MemoryGame.muteButton.addEventListener('click', () => MemoryGame.startMusic.pause());
    for (let i = 0; i < MemoryGame.levels.length; i++) {
        MemoryGame.levels[i].addEventListener('click', selectLevel);
    }
    MemoryGame.beginGameButton.addEventListener('click', beginGame)
}
deleteCards = () => {
    document.querySelectorAll('.card').forEach(card => card.remove());
}
start = () => {
    MemoryGame.startButton = document.getElementById('start-button');
    MemoryGame.winGif = document.getElementById('win');
    MemoryGame.winTextTop = document.getElementById('win-text-top');
    MemoryGame.winTextBottom = document.getElementById('win-text-bottom');
    createModal();
}
start();

