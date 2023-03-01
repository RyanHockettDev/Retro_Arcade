let canvas = document.getElementById('canvas');

let context = canvas.getContext('2d');

let score = document.getElementById('score')
let highScore = document.getElementById('highScore')

let width = window.innerWidth;
let height = window.innerHeight * 0.81;

canvas.width = width;
canvas.height = height;


let leftWall = width * .15;
let topWall = height * .15;
let bottomWall = height;
let rightWall = width * .85;
let center = width / 2;
let quarterLeft = width * .325;
let quarterRight = width * .675;

let level = 1;

var playerScore = 0;
var cpuScore = 0;

var gameRun = false;
var gameEnd = false;

var speed = -3;


context.strokeStyle = "white";



context.fillStyle = "white";
context.font = "25px monospace";
context.textAlign = "center";
context.textBaseline = "middle";
context.fillText("This paddle is yours.", (quarterLeft + 40), (topWall + 200));
context.fillText("Control it with", (quarterLeft + 40), (topWall + 250));
context.fillText("your mouse.", (quarterLeft + 40), (topWall + 300));
context.fillText("Click to serve the ball.", (quarterLeft + 40), (topWall + 350));


class GameScreen {
    draw(context) {
        context.strokeStyle = "white";
        context.setLineDash([])
        context.beginPath();
        context.moveTo(leftWall, topWall);
        context.lineTo(rightWall, topWall);
        context.stroke();
        context.closePath();
        context.beginPath();
        context.moveTo(leftWall, bottomWall);
        context.lineTo(rightWall, bottomWall);
        context.stroke();
        context.closePath();
        context.beginPath();
        context.setLineDash([8, 2]);
        context.moveTo(center, topWall);
        context.lineTo(center, bottomWall);
        context.stroke();
        context.closePath();
    }
}

class ScoreDisplay {
    constructor(xPos, yPos, score) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.score = score;
    }
    draw(context) {
        context.fillStyle = "white";
        context.beginPath();
        switch(this.score) {
            case 0:
                context.fillRect(this.xPos, this.yPos - 60, 6, 40);
                context.fillRect((this.xPos + 26), (this.yPos - 60), 6, 40);
                context.fillRect((this.xPos + 6), (this.yPos - 66), 20, 6);
                context.fillRect((this.xPos + 6), (this.yPos - 20), 20, 6);
                context.closePath();
                break;
            case 1:
                context.fillRect(this.xPos + 14, this.yPos - 66, 6, 52);
                context.closePath();
                break;
            case 2:
                context.fillRect(this.xPos, this.yPos - 37, 6, 17);
                context.fillRect((this.xPos + 26), (this.yPos - 60), 6, 17);
                context.fillRect((this.xPos + 6), (this.yPos - 66), 20, 6);
                context.fillRect((this.xPos + 6), (this.yPos - 43), 20, 6);
                context.fillRect((this.xPos + 6), (this.yPos - 20), 20, 6);
                context.closePath();
                break;
            case 3:
                context.fillRect(this.xPos + 26, this.yPos - 37, 6, 17);
                context.fillRect((this.xPos + 26), (this.yPos - 60), 6, 17);
                context.fillRect((this.xPos + 6), (this.yPos - 66), 20, 6);
                context.fillRect((this.xPos + 6), (this.yPos - 43), 20, 6);
                context.fillRect((this.xPos + 6), (this.yPos - 20), 20, 6);
                context.closePath();
                break;
            case 4:
                context.fillRect(this.xPos, this.yPos - 60, 6, 20);
                context.fillRect((this.xPos + 26), (this.yPos - 60), 6, 40);
                context.fillRect((this.xPos + 6), (this.yPos - 40), 20, 6);
                context.closePath();
                break;
            case 5:
                context.fillRect(this.xPos, this.yPos - 60, 6, 17);
                context.fillRect((this.xPos + 26), (this.yPos - 37), 6, 17);
                context.fillRect((this.xPos + 6), (this.yPos - 66), 20, 6);
                context.fillRect((this.xPos + 6), (this.yPos - 43), 20, 6);
                context.fillRect((this.xPos + 6), (this.yPos - 20), 20, 6);
                context.closePath();
                break;
            case 6:
                context.fillRect(this.xPos, this.yPos - 60, 6, 40);
                context.fillRect((this.xPos + 26), (this.yPos - 37), 6, 17);
                context.fillRect((this.xPos + 6), (this.yPos - 66), 20, 6);
                context.fillRect((this.xPos + 6), (this.yPos - 43), 20, 6);
                context.fillRect((this.xPos + 6), (this.yPos - 20), 20, 6);
                context.closePath();
                break;
            case 7:
                context.fillRect((this.xPos + 26), (this.yPos - 60), 6, 40);
                context.fillRect((this.xPos + 6), (this.yPos - 66), 20, 6);
                context.closePath();
                break;
            case 8:
                context.fillRect(this.xPos, this.yPos - 60, 6, 40);
                context.fillRect((this.xPos + 26), (this.yPos - 60), 6, 40);
                context.fillRect((this.xPos + 6), (this.yPos - 66), 20, 6);
                context.fillRect((this.xPos + 6), (this.yPos - 43), 20, 6);
                context.fillRect((this.xPos + 6), (this.yPos - 20), 20, 6);
                context.closePath();
                break;
            case 9:
                context.fillRect(this.xPos, this.yPos - 60, 6, 17);
                context.fillRect((this.xPos + 26), (this.yPos - 60), 6, 40);
                context.fillRect((this.xPos + 6), (this.yPos - 66), 20, 6);
                context.fillRect((this.xPos + 6), (this.yPos - 43), 20, 6);
                context.fillRect((this.xPos + 6), (this.yPos - 20), 20, 6);
                context.closePath();
                break;
            case 10:
                context.fillRect(this.xPos - 15, this.yPos - 66, 6, 52);
                context.fillRect(this.xPos, this.yPos - 60, 6, 40);
                context.fillRect((this.xPos + 26), (this.yPos - 60), 6, 40);
                context.fillRect((this.xPos + 6), (this.yPos - 66), 20, 6);
                context.fillRect((this.xPos + 6), (this.yPos - 20), 20, 6);
                context.closePath();
                break;
            case 11:
                context.fillRect(this.xPos - 15, this.yPos - 66, 6, 52);
                context.fillRect(this.xPos + 20, this.yPos - 66, 6, 52);
        }
    }   
}

class Paddle {
    constructor(xPos, yPos) {
        this.yPos = yPos;
        this.xPos = xPos;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = "white"
        context.fillRect(this.xPos, this.yPos, 6, 60);
        context.closePath();
    }

    update(yPosNew) {
        context.clearRect(this.xPos, this.yPos, 6, 60);
        this.yPos = yPosNew;
        this.draw(context); 
    }
}

class Ball {
    constructor(xPos, yPos, speed) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.speed = speed,
        this.dx = this.speed * 1;
        this.dy = this.speed * 1;
    }
    draw(context) {
        context.beginPath();
        context.fillStyle = "white"
        context.fillRect(this.xPos, this.yPos, 8, 8);
        context.closePath();
    }
    update() {
        context.clearRect(0, 0, width, height);
        newGameScreen.draw(context);
        playerPaddle.draw(context);
        cpuPaddle.draw(context);
        if(
            this.yPos <= topWall ||
            this.yPos + 8 >= bottomWall) {
                this.dy = -this.dy;
        }
        if(
            this.xPos + 8 >= cpuPaddle.xPos &&
            this.xPos + 8 <= cpuPaddle.xPos + 6 &&
            this.yPos <= cpuPaddle.yPos + 50 &&
            this.yPos + 8 >= cpuPaddle.yPos) {
                this.dx = -this.dx;  
        }
        if(
            this.xPos <= playerPaddle.xPos + 6 &&
            this.yPos <= playerPaddle.yPos + 50 &&
            this.yPos >= playerPaddle.yPos) {
                this.dx = -this.dx;
                this.dy = speed;
        }
        if(
            this.xPos <= leftWall ||
            this.xPos >= rightWall) {
                if(!gameEnd){
                cpuScoreDisplay.draw(context);
                playerScoreDisplay.draw(context);
                return;
                } else {
                    this.dx = -this.dx;
                }    
        }
        this.xPos += this.dx;
        this.yPos += this.dy;
        this.draw(context);
        cpuScoreDisplay.draw(context);
        playerScoreDisplay.draw(context); 
    }
}


var playerPaddle = new Paddle((leftWall + 80), (height / 2));
var cpuPaddle = new Paddle((rightWall - 80), (height / 2));
var gameBall = new Ball(center, topWall+10, speed)
var newGameScreen = new GameScreen();
var playerScoreDisplay = new ScoreDisplay(quarterLeft, topWall, playerScore);
var cpuScoreDisplay = new ScoreDisplay(quarterRight, topWall, cpuScore);

playerPaddle.draw(context);
cpuPaddle.draw(context);
newGameScreen.draw(context);
playerScoreDisplay.draw(context);
cpuScoreDisplay.draw(context);

canvas.addEventListener('mousedown', () => {
    if (!gameRun){
        gameRun = true;
        canvas.style.cursor = "none";
        context.clearRect((quarterLeft * .80), (topWall * 2.7), 300, 200);
        if (gameEnd){
            playerScoreDisplay.score = 0;
            cpuScoreDisplay.score = 0;
            score.innerHTML = "SCORE: " + playerScoreDisplay.score;
            gameEnd = false;
            gameBall.xPos = center;
            gameBall.yPos = topWall + 10;
            gameBall.dy = 1;
            gameBall.dx = -3;
        }
        gameBall.draw(context);
        updateBall();
        updateCpuPaddle();
    }
})

let currentYpos;
let prevYpos;
let movement;

canvas.addEventListener('mousemove', (e) => {
    if (gameRun && e.offsetY > topWall + 15 && e.offsetY < bottomWall - 75){
        playerPaddle.update(e.offsetY);
        currentYpos = playerPaddle.yPos;    
    }
    
})



function speedTracker() {
    if(currentYpos && prevYpos){   
        movement = prevYpos - currentYpos;
        speed = (movement * 0.025);
        return speed;
    }
    prevYpos = currentYpos;
}

setInterval(speedTracker, 100);

function gameOver() {
    let prevHighScore = parseInt(highScore.innerHTML);
    if (playerScoreDisplay.score > prevHighScore){
        let newHighScore = playerScoreDisplay.score;
        highScore.innerHTML = newHighScore;
        $.post("/loadGame/2",
        {
            hiscore: newHighScore
        }, 
        "json" )
        }
    updateBall();
}


var ballReq = 0;
var cpuReq = 0;

function updateBall() {
    gameBall.update();
    if((gameBall.xPos <= leftWall || gameBall.xPos >= rightWall) && !gameEnd){
        if(gameBall.xPos <= leftWall){
            cpuScoreDisplay.score += 1;
            gameBall.dx = -3;
        } else {
            playerScoreDisplay.score += 1;
            score.innerHTML = "SCORE: " + playerScoreDisplay.score;
            gameBall.dx = 3;
        };
        
        setTimeout(() => {
            gameBall.xPos = center;
            gameBall.yPos = topWall + 10;
            gameBall.dy = 1;
            cpuPaddle.yPos = height/2;
            playerPaddle.yPos = height/2;
            gameRun = false;
            if(
                playerScoreDisplay.score == 11 ||
                cpuScoreDisplay.score == 11){
                    gameBall.dx = 5;
                    gameBall.dy = 5;
                    gameEnd = true;
                    gameOver(); 
                }
            gameBall.update();
        }, 2000);
        
        cancelAnimationFrame(ballReq);
        cancelAnimationFrame(cpuReq);
        return;
    }
    ballReq = requestAnimationFrame(updateBall);
}

function updateCpuPaddle() {
    
    level = (playerScoreDisplay.score * .6) + 1
    if (gameBall.xPos > center - 50 && 
        gameBall.dx > 0) {
        if (cpuPaddle.yPos - 15 > topWall && cpuPaddle.yPos + 75 < bottomWall) {
            if(gameBall.yPos < cpuPaddle.yPos + 10) {
                cpuPaddle.update(cpuPaddle.yPos - level)
            } else if (gameBall.yPos > cpuPaddle.yPos + 40) {
                cpuPaddle.update(cpuPaddle.yPos + level)
            }
        } else if (cpuPaddle.yPos - 15 > topWall) {
            cpuPaddle.update(cpuPaddle.yPos - 1)
        } else if (cpuPaddle.yPos + 75 < bottomWall) {
            cpuPaddle.update(cpuPaddle.yPos + 1)
        }
    }
    cpuReq = requestAnimationFrame(updateCpuPaddle);
}

