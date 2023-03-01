let input = document.getElementById('playerInput');
let gameScreen = document.querySelector("[data-gameScreen]")
let scoreDisplay = document.querySelector("[data-scoreDisplay]")
let highScoreDiv = document.querySelector("[data-highScore]")
let body = document.querySelector("[data-body]")
let currentString = ""
let playerInput = ""
let score = 0
let highScore = highScoreDiv.innerText;
let wordIndex = 0
let xInt = 0
let div = document.createElement("div");
let replay = document.createElement("div")
let gameOverDiv = document.createElement("div")
let interval = 0
let timeInterval = 30
let bankOne = ["even", "real", "house", "cow", "dog", "cat", "bird", "bug", "slow", "fast", "house", "barn", "pen",
"slow", "fast", "lead", "toss", "red", "blue", "black", "green", "like", "love", "pour", "have", "hold", "oven", "bake",
"train", "bike", "cold", "warm", "hot", "colt", "mare", "bean", "door", "math", "pig", "frog", "paint", "color", "toy", "cart", "bear",
"dare", "saw", "detail", "shade", "hue"]
let bankTwo = ["yellow", "purple", "orange", "apple", "banana", "pineapple",
 "liquid", "matter", "science", "earth", "reading", "english", "writing", "cheese", "chicken", "grazing",
   "learned", "music", "piano", "battle", "sword", "shield", "father", "mother", "weigh", "basket",
 "dance", "record", "donkey", "present", "canvas", "painting", "lumber", "build", "hammer", "mallet", "measure", "detailed", "narrow",
"detailed", "function"]
 let bankThree = ["fantasy", "hesitant", "questionable", "strawberry", "watermelon", "remarkable", "wretched", "fortunate", "imagination", "organization",
"geology", "geography", "language", "experience", "romantic", "abandoned", "probable", "possible", "acoustics", "imaginary",  "blueberry", "renovate",
"construction", "government", "saturation", "opacity", "variable"]

input.addEventListener('click', () => {
    startGame();
})

input.addEventListener('input', function handleChange(event) {
    playerInput = input.value;
    })

document.addEventListener('keydown', (e) => {
    if (gameOverDiv.classList.contains("gameOver") && e.key == "Enter") { 
        gameOverDiv.classList.remove("gameOver")
        gameOverDiv.remove();
        replay.remove()
        input.placeholder = "Click here to begin game! Type the word to score points!"
        score = 0;
        scoreDisplay.innerText = "SCORE: " + score;
        timeInterval = 30;
    } else {return}
    }
)

function startGame() {
    if (document.querySelector(".currentString") || (document.querySelector(".gameOver"))) {
        return
    } else {
        body.appendChild(div);
        div.classList.add("currentString");
        newWord()
        input.placeholder = ""
        timeInterval = 30
        interval = setInterval(wordFall, timeInterval);
    }
}

function newWord() {
    if (score < 300) {
       wordIndex = Math.floor(Math.random() * bankOne.length);
        currentString = bankOne[wordIndex];
        do { xInt = Math.floor(Math.random() * 80)
        } while (xInt < 15);
    } else if (score < 750) {
        wordIndex = Math.floor(Math.random() * bankTwo.length);
        currentString = bankTwo[wordIndex];
        do { xInt = Math.floor(Math.random() * 60)
        } while (xInt < 15);
    } else {
        wordIndex = Math.floor(Math.random() * bankThree.length);
        currentString = bankThree[wordIndex];
        do { xInt = Math.floor(Math.random() * 60)
        } while (xInt < 15);
    }
    if (Math.random() > 0.66) {
        currentString = currentString.charAt(0).toUpperCase() + currentString.slice(1) 
    }
    div.innerText = currentString;
    div.style.left = xInt.toString() + "%";
    div.style.top = 0
    wordFall();
}


function wordFall() {
    let computedStyle = window.getComputedStyle(div);
    let newTop = parseInt(computedStyle.top, 10) + 1;
    if (playerInput != currentString) {
        if (newTop < 586) {
         div.style.top = newTop + "px";
        } else { 
            gameOver()
        }
    } else {
        clearInterval(interval);
        updateDisplay()
        newWord()
    }
}

function gameOver() {
    clearInterval(interval)
    div.remove()
    body.appendChild(gameOverDiv)
    gameOverDiv.classList.add("gameOver")
    gameOverDiv.innerText = "GAME OVER"
    body.appendChild(replay)
    replay.classList.add("replay")
    replay.innerText = "Press Enter to play again!"
    gameOverDiv.style.top = "120px"
    gameOverDiv.style.left = "5%"
    input.value = ""
    if (score > highScore) {
        highScore = score
        highScoreDiv.innerText = highScore
        $.post("/Typing Game",
        {
        hiscore: score
        }, 
        "json" )
        }
}

function updateDisplay() {
    input.value = ""
    if (score < 300) {
        score += 20;       
    } else if (score < 750) {
        score += 30;
    } else if (score < 1350) {
        score += 40;
    }else {
        score += 50;
    }
    scoreDisplay.innerText = "SCORE: " + score;
    clearInterval(interval)
    if (score < 300 && timeInterval > 22) {
        timeInterval = timeInterval - 1;
    } else if (score > 300 && score < 740 && timeInterval > 15) {
        timeInterval = timeInterval - 1;
    } else if (score > 740 && timeInterval > 10) {
        timeInterval = timeInterval - 1;
    }
    interval = setInterval(wordFall, timeInterval)
}



