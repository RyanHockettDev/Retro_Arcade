let gameGrid = document.querySelector("[data-gameGrid]");
let scoreDisplay = document.querySelector("[data-scoreDisplay]");
let highScoreDisplay= document.querySelector("[data-highScore]");
let buttonUp = document.querySelector("[data-buttonUp]");
let buttonDown = document.querySelector("[data-buttonDown]");
let buttonLeft = document.querySelector("[data-buttonLeft]");
let buttonRight = document.querySelector("[data-buttonRight]");
let hiddenHiscore = document.querySelector("[data-hiddenHiscore]");
let width = 20;
let appleIndex = 0;
let currentSnake = [197, 196, 195, 194];
let direction = 1;
let score = 0;
let speed = 0.95;
let intervalTime = 0;
let interval = 0;
let highScore = highScoreDisplay.innerText;
let directionNew=0;
const mediaQuery = window.matchMedia('(max-width: 900px)')


document.addEventListener('touchend', event => {
    if (mediaQuery.matches) {
        if (!document.querySelector("[data-gameGrid] div")){
        createBoard();
        startGame();
        }
     } else {
        return
     }
    }) 

document.addEventListener('keyup', event => {
    if (event.key === ' ') {
        if (!document.querySelector("[data-gameGrid] div")){
        createBoard();
        startGame();
        }
     } else {
        return
     }
    })

function createBoard() {
    if (document.querySelector("[data-gameGrid] div")) {
        return
    } else {
    for (let i = 0; i < 400; i++) {
        let div = document.createElement("div");
        gameGrid.appendChild(div);
    }
}
}

function startGame() {
    let squares = document.querySelectorAll("[data-gameGrid] div")
    randomRed(squares)
    direction = 1
    score=0 
    scoreDisplay.innerText = "SCORE: " + score
    intervalTime = 850
    currentSnake = [190, 189, 188, 187]
    currentSnake.forEach((index) => squares[index].classList.add("snake"))
    interval = setInterval(moveOutcome, intervalTime)
    squares[currentSnake[0]].classList.add("snakeHead")
    squares[currentSnake[currentSnake.length-1]].classList.add("snakeTail")
}

function moveOutcome() {
    let squares = document.querySelectorAll("[data-gameGrid] div");
if (checkForHits(squares)) {
    if (score > highScore){
    highScore = score;
    highScoreDisplay.innerHTML = highScore;
    hiddenHiscore.value = highScore;
    alert("GAME OVER\r\nNEW HIGH SCORE")
    } else {
        alert("GAME OVER");
    }
    gameGrid.innerHTML=""
    return clearInterval(interval);
} else {
    moveSnake(squares);
    }
}

function moveSnake(squares) {
    let tail = currentSnake.pop();
    squares[tail].classList.remove("snake","snakeTail");
    currentSnake.unshift(currentSnake[0] + direction);
    eatApple(squares, tail);
    squares[currentSnake[1]].classList.remove("snakeHead");
    squares[currentSnake[0]].classList.add("snake","snakeHead");
    squares[currentSnake[currentSnake.length-1]].classList.add("snakeTail");  
} 

function checkForHits(squares) {
    if (
        direction == 1 && currentSnake[1] == currentSnake[0] + 1 ||
        direction == -1 && currentSnake[1] == currentSnake[0] - 1 ||
        direction == width && currentSnake[1] == currentSnake[0] + width ||
        direction == -width && currentSnake[1] == currentSnake[0] - width
        ) { direction = -direction;
            if(
                (currentSnake[0] + width >= width * width && direction === width) ||
                (currentSnake[0] % width === width - 1 && direction === 1) ||
                (currentSnake[0] % width === 0 && direction === -1) ||
                (currentSnake[0] - (width - 1) <= 0 && direction === -width) ||
                squares[currentSnake[0] + direction].classList.contains("snake")
            ) {
                return true;
            } else {
                return false;
            }
        }
    else { if(
        (currentSnake[0] + width >= width * width && direction === width) ||
        (currentSnake[0] % width === width - 1 && direction === 1) ||
        (currentSnake[0] % width === 0 && direction === -1) ||
        (currentSnake[0] - (width - 1) <= 0 && direction === -width) ||
        squares[currentSnake[0] + direction].classList.contains("snake")
    ) {
        return true;
    } else {
        return false;
    }

    }
}

function eatApple(squares, tail) {
    if (squares[currentSnake[0]].classList.contains("red")) {
        squares[currentSnake[0]].classList.remove("red");
        squares[tail].classList.add("snake");
        currentSnake.push(tail);
        randomRed(squares);
        if (score < 250) {
            score += 50;
        } else if (score < 750) {
            score += 100;
        } else if (score < 1500) {
            score += 150;
        } else {
            score += 250;
        }
        scoreDisplay.innerText = "SCORE: " + score;
        clearInterval(interval);
        intervalTime = intervalTime * speed;
        interval = setInterval(moveOutcome, intervalTime);
    } 
}

function randomRed(squares) {
    do {
        appleIndex = Math.floor(Math.random() * squares.length)
    } while (squares[appleIndex].classList.contains("snake"));
    squares[appleIndex].classList.add("red");
}


document.addEventListener('keydown', event => {
    if (event.key === "ArrowRight") {
        direction = 1;
    } else if (event.key === "ArrowUp") {
        direction = -width;
    } else if (event.key === "ArrowLeft"){
        direction = -1;
    } else if (event.key === "ArrowDown") {
        direction = +width;
    }
})

buttonUp.addEventListener('click',() => direction= -width)
buttonDown.addEventListener('click',() => direction= width)
buttonRight.addEventListener('click',() => direction= 1)
buttonLeft.addEventListener('click',() => direction= -1)