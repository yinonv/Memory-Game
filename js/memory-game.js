let MemoryGame = {};
MemoryGame.highScoreName = "Yinon Vahab"
MemoryGame.highScore = 0;
MemoryGame.numberOfCards = 12;
MemoryGame.wrongCounter = 0;
MemoryGame.cards = document.getElementsByClassName('card');
MemoryGame.wrong = document.getElementById('wrong-answers');
MemoryGame.cardContainer = document.getElementById('card-container');
MemoryGame.playMatchMusic = document.getElementById('match-music');
MemoryGame.startMusic = document.getElementById('player');
MemoryGame.sound = true;
createMuteImage = () => {
    MemoryGame.muteImg = document.createElement('img');
    MemoryGame.muteImg.setAttribute("src", "./img/mute.png");
    MemoryGame.muteImg.id = "mute";
    MemoryGame.muteImg.addEventListener('click', () => MemoryGame.startMusic.pause());
    document.querySelector('.img-container').append(MemoryGame.muteImg);
}
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
                e.target.classList.add('card-background');
                MemoryGame.cards[i].classList.add('card-background');
                MemoryGame.wrong.innerText = `Wrong guesses: ${++MemoryGame.wrongCounter}`;
            } else {
                if (!MemoryGame.startMusic.paused) {
                    MemoryGame.playMatchMusic.play();
                }
                e.target.classList.add('correct');
                MemoryGame.cards[i].classList.add('correct');
                if (userWon()) {
                    MemoryGame.wrong.innerText = "";
                    MemoryGame.inputName.style.display = "block";
                    MemoryGame.saveButton.style.display = "block";
                    MemoryGame.saveQuestion.innerText = "Enter your name to save your score:"
                    MemoryGame.startButton.innerText = "restart";
                    MemoryGame.winGif.style.display = "block";
                    MemoryGame.winTextTop.innerText = 'You Won!';
                    MemoryGame.startButton.innerText = "New Game"
                    MemoryGame.startButton.style.cssText = "transform: translateX(-12%);"
                    MemoryGame.winTextBottom.innerText = `you had ${MemoryGame.wrongCounter} wrong guesses!`;
                    MemoryGame.numberOfCards = 0;
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
            e.target.style.cssText = `background-image: url(./img/${e.target.num}.png);`;
            e.target.classList.remove('card-background');
            e.target.classList.add('selected');
            setTimeout(() => {
                checkMatch(e);
            }, 700);
        } else if (selected == 0) {
            e.target.classList.remove('card-background');
            e.target.style.cssText = `background-image: url(./img/${e.target.num}.png);`;
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
        MemoryGame.cards[i].classList.add('card-background');
        MemoryGame.cards[i].addEventListener('click', handleSelection)
        i++;
        ++cardNum[randNum];
        cardsOnBoard++;
    }
}
createCards = () => {
    let rows = 0;
    let cols = 0;
    switch (MemoryGame.numberOfCards) {
        case 12: rows = 3; cols = 4;
            break;
        case 18: rows = 3; cols = 6;
            break;
        case 24: rows = 4; cols = 6;
            break;
    }
    for (let i = 0; i < rows; i++) {
        let rowCard = document.createElement('div');
        rowCard.classList.add('row');
        rowCard.classList.add('card-row');
        MemoryGame.cardContainer.append(rowCard);
        for (let j = 0; j < cols; j++) {
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
        case "rookie": MemoryGame.numberOfCards = 12; MemoryGame.level = "rookie";
            break;
        case "advanced": MemoryGame.numberOfCards = 18; MemoryGame.level = "advanced";
            break;
        case "pro": MemoryGame.numberOfCards = 24; MemoryGame.level = "pro";
            break;
    }
}
enterModal = () => {
    clearGame();
    deleteCards();
    removeSelectedLevel();
    if (MemoryGame.sound) {
        MemoryGame.startMusic.play();
        MemoryGame.sound = false;
    }
    MemoryGame.highScoreText.innerText = "";
}
closeModal = () => {
    setHighScores();
    MemoryGame.modal.style.display = 'none';
    MemoryGame.startButton.innerText = "Start";
}
clearGame = () => {
    MemoryGame.wrongCounter = 0;
    MemoryGame.wrong.innerText = "";
    MemoryGame.startButton.innerText = "restart";
    MemoryGame.winTextBottom.innerText = "";
    MemoryGame.winTextTop.innerText = "";
    MemoryGame.winGif.style.display = "none";
    MemoryGame.modal.style.display = 'block';
    MemoryGame.highScoreText.innerText = "High Scores";
    MemoryGame.inputName.style.display = "none";
    MemoryGame.saveButton.style.display = "none";
    MemoryGame.saveQuestion.innerText = "";
    MemoryGame.startButton.style.cssText = "transform: translateX(8%);"
    MemoryGame.modal.style.display = 'block';
    for (let i = 0; i < MemoryGame.highScoreNamesText.length; i++) {
        MemoryGame.highScoreNamesText[i].innerText = "";
    }
}
beginGame = () => {
    MemoryGame.modal.style.display = 'none';
    MemoryGame.wrong.innerText = `Wrong guesses: ${MemoryGame.wrongCounter}`;
    MemoryGame.wrong.style.visibility = 'visible';
    if (MemoryGame.muteImg == undefined && !MemoryGame.startMusic.paused) {
        createMuteImage();
    }
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
    MemoryGame.inputName = document.getElementById('input-name');
    MemoryGame.saveButton = document.getElementById('save-button');
    MemoryGame.saveButton.addEventListener('click', inputScore);
    MemoryGame.saveQuestion = document.getElementById('save-text');
    MemoryGame.winTextBottom = document.getElementById('win-text-bottom');
    MemoryGame.highScoreText = document.getElementById('high-score-text');
    MemoryGame.highScoreText.innerText = `High Scores`;
    MemoryGame.highScoreNamesText = document.getElementsByClassName('high-score');
    setHighScores();
    createModal();
}
inputScore = () => {
    let scoreObj = JSON.parse(localStorage.getItem(MemoryGame.level));
    scoreObj[MemoryGame.inputName.value] = MemoryGame.wrongCounter;
    localStorage.setItem(MemoryGame.level, JSON.stringify(scoreObj));
    let highScore = parseInt(localStorage.getItem(`${MemoryGame.level}HighScore`));
    if (MemoryGame.wrongCounter < highScore) {
        localStorage.setItem(`${MemoryGame.level}HighScore`, MemoryGame.wrongCounter);
    }
}
setStorage = () => {
    localStorage.clear();
    localStorage.setItem("rookie", JSON.stringify({}));
    localStorage.setItem("advanced", JSON.stringify({}));
    localStorage.setItem("pro", JSON.stringify({}));
    localStorage.setItem("rookieHighScore", 50);
    localStorage.setItem("advancedHighScore", 50);
    localStorage.setItem("proHighScore", 50);
    localStorage.setItem("rookieHighScoreName", "Yinon Vahab");
    localStorage.setItem("advancedHighScoreName", "Yinon Vahab");
    localStorage.setItem("proHighScoreName", "Yinon Vahab");
}
setHighScores = () => {
    let levels = ["rookie", "advanced", "pro"];
    let rookieScore = localStorage.getItem("rookieHighScore")
    let rookieName = localStorage.getItem("rookieHighScoreName");
    let advancedScore = localStorage.getItem("advancedHighScore")
    let advancedName = localStorage.getItem("advancedHighScoreName");
    let proScore = localStorage.getItem("proHighScore")
    let proName = localStorage.getItem("proHighScoreName");
    MemoryGame.highScoreNamesText[0].innerText = `${levels[0]}: ${rookieName} - ${rookieScore} wrong guesses`;
    MemoryGame.highScoreNamesText[1].innerText = `${levels[1]}: ${advancedName} - ${advancedScore} wrong guesses`;
    MemoryGame.highScoreNamesText[2].innerText = `${levels[2]}: ${proName} - ${proScore} wrong guesses`;
}
start();

