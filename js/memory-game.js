let MemoryGame = {};
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
                e.target.classList.add(MemoryGame.cardBackgroundClass);
                MemoryGame.cards[i].classList.add(MemoryGame.cardBackgroundClass);
                MemoryGame.wrong.innerText = `Wrong guesses: ${++MemoryGame.wrongCounter}`;
            } else {
                if (!MemoryGame.startMusic.paused) {
                    MemoryGame.playMatchMusic.play();
                }
                e.target.classList.add('correct');
                MemoryGame.cards[i].classList.add('correct');
                if (userWon()) {
                    MemoryGame.saveButton.disabled = false;
                    MemoryGame.wrong.innerText = "";
                    MemoryGame.inputName.style.display = "block";
                    MemoryGame.saveButton.style.display = "block";
                    MemoryGame.saveQuestion.innerText = "Enter your name to save your score:"
                    MemoryGame.startButton.innerText = "restart";
                    MemoryGame.winGif.style.display = "block";
                    MemoryGame.winTextTop.innerText = 'You Won!';
                    MemoryGame.startButton.innerText = "New Game"
                    MemoryGame.startButton.style.cssText = "transform: translateX(-12%);"
                    MemoryGame.cardContainer.style.display = "none";
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
            e.target.style.cssText = `background-image: url(${e.target.url});`;
            e.target.classList.remove(MemoryGame.cardBackgroundClass);
            e.target.classList.add('selected');
            let time = 1200;
            if (MemoryGame.theme == 'dog') {
                time = 1600;
            }
            setTimeout(() => {
                checkMatch(e);
            }, time);
        } else if (selected == 0) {
            e.target.classList.remove(MemoryGame.cardBackgroundClass);
            e.target.style.cssText = `background-image: url(${e.target.url});`;
            e.target.classList.add('selected');
        }
    }
}
async function getDogImage() {
    try {
        const response = await fetch("https://dog.ceo/api/breeds/image/random");
        const responseJson = await response.json();
        return responseJson.message;
    } catch {
        alert("The dog theme isn't responding, please change theme");
    }
}
async function getAllDogImages() {
    let images = [];
    for (let i = 0; i < MemoryGame.numberOfCards / 2; i++) {
        images[i] = await getDogImage();
    }
    return images;
}
getImages = async () => {
    let cardImages = new Array(MemoryGame.numberOfCards / 2);
    let imageIndex = 0;
    if (MemoryGame.theme == "nba") {
        while (cardImages.includes(undefined)) {
            let num = Math.floor(Math.random() * 30);
            if (!cardImages.includes(num)) {
                cardImages[imageIndex] = num;
                imageIndex++;
            }
        }
    } else {
        cardImages = await getAllDogImages();
        removeLoader();
    }
    randomCards(cardImages);
}

randomCards = (cardImages) => {
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
        if (MemoryGame.theme == "dog") {
            MemoryGame.cards[i].url = num;
        } else {
            MemoryGame.cards[i].url = `./img/${num}.png`
        }
        MemoryGame.cards[i].index = i;
        MemoryGame.cards[i].classList.add(MemoryGame.cardBackgroundClass);
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
        case 12: rows = 4; cols = 3;
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
            if (MemoryGame.theme == 'dog') {
                divCard.classList.add('dog-image-card');
                divCard.classList.add('loader')
            }
            rowCard.append(divCard);
        }
    }
}
removeLoader = () => {
    for (let i = 0; i < MemoryGame.cards.length; i++) {
        MemoryGame.cards[i].classList.remove('loader');
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
    MemoryGame.themeButton.style.display = "none";
}
closeModal = () => {
    clearGame();
    setHighScores();
    MemoryGame.scoreTable.style.display = "flex";
    MemoryGame.modal.style.display = 'none';
    MemoryGame.startButton.innerText = "Start";
    MemoryGame.themeButton.style.display = "block";
}
clearGame = () => {
    MemoryGame.saveButton.disabled = "false";
    MemoryGame.wrongCounter = 0;
    MemoryGame.wrong.innerText = "";
    MemoryGame.startButton.innerText = "restart";
    MemoryGame.winTextBottom.innerText = "";
    MemoryGame.winTextTop.innerText = "";
    MemoryGame.winGif.style.display = "none";
    MemoryGame.modal.style.display = 'block';
    MemoryGame.inputName.style.display = "none";
    MemoryGame.inputName.value = "";
    MemoryGame.saveButton.style.display = "none";
    MemoryGame.saveQuestion.innerText = "";
    MemoryGame.startButton.style.cssText = "transform: translateX(8%);"
    MemoryGame.scoreTable.style.display = "none";
}
beginGame = () => {
    MemoryGame.cardContainer.style.display = "flex";
    MemoryGame.modal.style.display = 'none';
    MemoryGame.wrong.innerText = `Wrong guesses: ${MemoryGame.wrongCounter}`;
    MemoryGame.wrong.style.visibility = 'visible';
    if (MemoryGame.muteImg == undefined && !MemoryGame.startMusic.paused) {
        createMuteImage();
    }
    createCards();
    getImages();
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
    document.querySelectorAll('.card-row').forEach(row => row.remove());
    document.querySelectorAll('.card').forEach(card => card.remove());
}
start = () => {
    MemoryGame.body = document.getElementById('body');
    MemoryGame.startButton = document.getElementById('start-button');
    MemoryGame.winGif = document.getElementById('win');
    MemoryGame.winTextTop = document.getElementById('win-text-top');
    MemoryGame.inputName = document.getElementById('input-name');
    MemoryGame.saveButton = document.getElementById('save-button');
    MemoryGame.themeButton = document.getElementById('theme-button');
    MemoryGame.themeButton.addEventListener('click', changeTheme);
    MemoryGame.saveButton.addEventListener('click', inputScore);
    MemoryGame.saveQuestion = document.getElementById('save-text');
    MemoryGame.winTextBottom = document.getElementById('win-text-bottom');
    MemoryGame.highScoreText = document.getElementById('high-score-text');
    MemoryGame.highScoreText.innerText = `High Scores`;
    MemoryGame.scoreTable = document.getElementById('score-container');
    MemoryGame.highScoreNamesText = document.getElementsByClassName('high-score');
    MemoryGame.cardBackgroundClass = "card-background";
    MemoryGame.theme = "nba";
    if (localStorage.length == 0) {
        setStorage();
    }
    createModal();
    createScoreTable();
    setHighScores();
}
inputScore = () => {
    let scoreObj = JSON.parse(localStorage.getItem(MemoryGame.level));
    if (MemoryGame.wrongCounter > scoreObj[MemoryGame.inputName.value]) {
        MemoryGame.saveQuestion.innerText = "You have a better score already!"
        MemoryGame.saveButton.disabled = "true"
    }
    else {
        scoreObj[MemoryGame.inputName.value] = MemoryGame.wrongCounter;
        localStorage.setItem(MemoryGame.level, JSON.stringify(scoreObj));
        let highScore = parseInt(localStorage.getItem(`${MemoryGame.level}HighScore`));
        if (MemoryGame.wrongCounter < highScore) {
            localStorage.setItem(`${MemoryGame.level}HighScore`, MemoryGame.wrongCounter);
            localStorage.setItem(`${MemoryGame.level}HighScoreName`, MemoryGame.inputName.value);
        }
        MemoryGame.saveQuestion.innerText = "Your score has been saved!"
        MemoryGame.saveButton.disabled = "true"
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
    MemoryGame.highScoreText = "High Scores";
    MemoryGame.cols[4].innerText = localStorage.getItem("rookieHighScoreName");
    MemoryGame.cols[5].innerText = localStorage.getItem("rookieHighScore");
    MemoryGame.cols[7].innerText = localStorage.getItem("advancedHighScoreName");
    MemoryGame.cols[8].innerText = localStorage.getItem("advancedHighScore");
    MemoryGame.cols[10].innerText = localStorage.getItem("proHighScoreName");
    MemoryGame.cols[11].innerText = localStorage.getItem("proHighScore");
}
createScoreTable = () => {
    let table = document.getElementById('table-score');
    for (let i = 0; i < 4; i++) {
        let newRow = document.createElement('tr');
        if (i == 0) {
            newRow.classList.add('row-score1');
        } else {
            newRow.classList.add('row-score');
        }
        for (let j = 0; j < 3; j++) {
            let newCol = document.createElement('td');
            newCol.classList.add('col-score');
            newRow.append(newCol);
        }
        table.append(newRow);
    }
    MemoryGame.cols = document.getElementsByClassName('col-score');
    MemoryGame.cols[0].innerText = "Level";
    MemoryGame.cols[1].innerText = "Name";
    MemoryGame.cols[2].innerText = "Score";
    MemoryGame.cols[3].innerText = "Rookie";
    MemoryGame.cols[6].innerText = "Advanced";
    MemoryGame.cols[9].innerText = "Pro";
}
changeTheme = () => {
    let dog = {
        class: "dog-card-background",
        background: "url(./img/background_image_dog.jpg)",
    }
    let nba = {
        class: "card-background",
        background: "url(./img/background_image.jpg)",
    }
    if (MemoryGame.theme == "nba") {
        MemoryGame.theme = "dog";
        MemoryGame.cardBackgroundClass = dog.class;
        MemoryGame.body.style.backgroundImage = dog.background;
    } else {
        MemoryGame.theme = "nba";
        MemoryGame.cardBackgroundClass = nba.class;
        MemoryGame.body.style.backgroundImage = nba.background;
    }
    enterModal();
}
start();

