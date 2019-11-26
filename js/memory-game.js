let MemoryGame = {};
MemoryGame.level = 'easy';
MemoryGame.numberOfCards = 12;
MemoryGame.wrongCounter = 0;
MemoryGame.cards = document.getElementsByClassName('card');
MemoryGame.wrong = document.getElementById('wrong-answers');
MemoryGame.showCard = true;
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
                e.target.classList.add('correct');
                MemoryGame.cards[i].classList.add('correct');
                if (userWon()) {
                    alert(`You Won!, you had ${MemoryGame.wrongCounter} wrong guesses!`)
                }
            }
        }
    }
}
handleSelection = (e) => {
    let selected = selectedCards();
    if (selected == 1) {
        e.target.style.cssText = `background-image: url(./img/${MemoryGame.level}/${e.target.num}.png)`;
        e.target.classList.add('selected');
        setTimeout(() => {
            checkMatch(e);
        }, 700);
    } else if (selected == 0) {
        e.target.style.cssText = `background-image: url(./img/${MemoryGame.level}/${e.target.num}.png)`;
        e.target.classList.add('selected');
    }
}
randomCards = () => {
    let cardNum = new Array(MemoryGame.numberOfCards).fill(0);
    let cardsOnBoard = 0;
    let i = 0;
    let num;
    while (cardsOnBoard < 12) {
        num = Math.floor(Math.random() * (MemoryGame.numberOfCards / 2));
        while (cardNum[num] == 2) {
            num = Math.floor(Math.random() * (MemoryGame.numberOfCards / 2));
        }
        MemoryGame.cards[i].num = num;
        MemoryGame.cards[i].index = i;
        MemoryGame.cards[i].style.cssText = `background-image: url(./img/nba_card.png)`;
        MemoryGame.cards[i].addEventListener('click', handleSelection)
        i++;
        ++cardNum[num];
        cardsOnBoard++;
    }
}
randomCards();


