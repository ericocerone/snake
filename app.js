/** @type { HTMLCanvasElement } */
const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")


class SnakePart{
    constructor(x, y){
        this.x = x
        this.y = y
    }
}

let speed = 7

let tileCount = 20
let tileSize = (canvas.width/tileCount) - 2
let headX = 10
let headY = 10
const snakeParts = []
let tailLength = 2

let xVel = 0
let yVel = 0
let appleX = 5
let appleY = 5

let score = 0
const gulpSound = new Audio("gulp2.mp3")
const gameOverSound = new Audio("gameover.mp3")

// Game loop
function drawGame() {
    changeSnakePos()
    let result = isGameOver()
    if(result) {
        gameOverSound.play()
        return
    }
    
    clearScreen()

    checkAppleCollision()
    drawApple()
    drawSnake()

    drawScore()

    if(score > 2) {
        speed = 11
    }
    if(score > 5) {
        speed = 15
    }

    setTimeout(drawGame, 1000/speed)
}

function isGameOver() {
    let gameOver = false
    
    if(yVel === 0 && xVel === 0) {
        return false
    }

    // Walls
    if(headX < 0) {
        gameOver = true
    }
    if(headX === tileCount) {
        gameOver = true
    }
    if(headY < 0) {
        gameOver = true
    }
    if(headY === tileCount) {
        gameOver = true
    }

    for(let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i]
        if(part.x === headX && part.y === headY) {
            gameOver = true
            break
        }
    }

    if(gameOver) {
        ctx.fillStyle = "white"
        ctx.font = "50px Impact"

        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
        gradient.addColorStop("0", "magenta")
        gradient.addColorStop("0.5", "blue")
        gradient.addColorStop("1.0", "red")

        // Fill with gradient
        ctx.fillStyle = gradient

        ctx.fillText("Game over!", (canvas.width/2)-112, canvas.height/2)
    }
    return gameOver
}

function clearScreen() {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawSnake() {
    
    ctx.fillStyle = "green"
    for(let i = 0; i < snakeParts.length; i++) {
        let part  = snakeParts[i]
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
    }
    
    snakeParts.push(new SnakePart(headX, headY))
    if(snakeParts.length > tailLength) {
        snakeParts.shift()
    }

    ctx.fillStyle = "orange"
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize)
}

function drawScore() {
    ctx.fillStyle = "white"
    ctx.font = "10px Verdana"
    ctx.fillText("Score: " + score, canvas.width-55, 20)
}

function changeSnakePos() {
    headX = headX + xVel
    headY = headY + yVel
}

function drawApple() {
    ctx.fillStyle = "red"
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}

function checkAppleCollision() {
    if(appleX == headX && appleY == headY) {
        appleX = Math.floor(Math.random() * tileCount)
        appleY = Math.floor(Math.random() * tileCount)
        tailLength++
        score++
        gulpSound.play()
    }
}

document.body.addEventListener('keydown', keyDown)

function keyDown(ev) {
    // Up
    if(ev.key == "ArrowUp") {
        if(yVel == 1) {
            return
        }
        yVel = -1
        xVel = 0
    }
    // Down
    if(ev.key == "ArrowDown") {
        if(yVel == -1) {
            return
        }
        yVel = 1
        xVel = 0    
    }
    // Right
    if(ev.key == "ArrowRight") {
        if(xVel == -1) {
            return
        }
        yVel = 0
        xVel = 1    
    }
    // Left
    if(ev.key == "ArrowLeft") {
        if(xVel == 1) {
            return
        }
        yVel = 0
        xVel = -1
    }
    // Stop
    if(ev.key == " ") {
        yVel = 0
        xVel = 0
    }
}

drawGame()