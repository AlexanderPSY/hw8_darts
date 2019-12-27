var app = document.getElementById('app')
var boardMovingTimer = 0

function Circle(size, backgroundColor, score, zIndex = 0) {
    var element = document.createElement("div")
    element.style.cssText = `
       width: ${size}px;
       height: ${size}px;
       border-radius: 50%;
       background-color: ${backgroundColor};
       transition: .7s all;
       position: absolute;
       top: calc(50% - ${size / 2}px);
       left: calc(50% - ${size / 2}px);
       z-index: ${zIndex};
    `
    this.centerX = window.innerWidth / 2
    this.centerY = window.innerHeight / 2
    this.appendToApp = () => app.appendChild(element)
    this.move = (x, y) => {
        element.style.left = `calc(50% - ${size / 2 + x}px)`
        element.style.top = `calc(50% - ${size / 2 + y}px)`
        this.centerX = window.innerWidth / 2 - x
        this.centerY = window.innerHeight / 2 - y
    }

}

var circles = [
    new Circle(400, 'blue', 10),
    new Circle(200, 'green', 20, 1),
    new Circle(100, 'red', 50, 2)
]

circles.forEach((circle) => circle.appendToApp())

function Bird(size, imageSrc, intervalTime, zIndex = 5) {
    var element = document.createElement('img')
    element.src = imageSrc
    element.style.cssText = `
       width: ${size}px;
       transition: ${intervalTime / 1000}s all;
       position: absolute;
       z-index: ${zIndex};
    `

    var random = (min, max) => Math.round(Math.random() * (max - min) + min)

    this.appendToApp = () => app.appendChild(element)
    this.startInterval = () => {
        setInterval(() => {
            element.style.top = `${random(0, window.innerHeight - size)}px`
            element.style.left = `${random(0, window.innerWidth - size)}px`
        }, intervalTime)
    }
}

var random = (min, max) => Math.round(Math.random() * (max - min) + min)


function moveBoard() {
    return setInterval(() => {
        var x = random(-100, 100)
        var y = random(-100, 100)
        circles.forEach((circle) => circle.move(x, y))
    }, 1000)
}

function gameStart() {
    var birds = []
    for (var i = 1; i <= 5; i++) {
        birds.push(new Bird(random(50, 200),
            'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c6165d18-54f5-4989-900d-ae5404b57f0b/dal9hu1-312417ff-2ea6-4173-bcd7-54d8ba098071.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2M2MTY1ZDE4LTU0ZjUtNDk4OS05MDBkLWFlNTQwNGI1N2YwYlwvZGFsOWh1MS0zMTI0MTdmZi0yZWE2LTQxNzMtYmNkNy01NGQ4YmEwOTgwNzEuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.JPmCY9W7V-fPlPl7tXMgahfAZ8UmpeWPNRBqR3-vmuQ',
            random(200, 2000)))
    }

    birds.forEach((bird) => bird.appendToApp())
    birds.forEach((bird) => bird.startInterval())

    boardMovingTimer = moveBoard()
    dart.track()
    score.clearScore()
    window.onmouseup = dart.drop

}

function gamePause() {
    clearInterval(boardMovingTimer)
    dart.noTrack()
    window.onmouseup = () => {
    }
}

function gameContinue() {
    boardMovingTimer = moveBoard()
    dart.track()
    window.onmouseup = dart.drop
}


function Dart(link) {

    var hitSound = new Audio()
    hitSound.src = './audio/hit.mp3'
    hitSound.load()
    var bezierA = 0, bezierB = 100, bezierC = -40
    var img = document.createElement('img')
    var t = 0
    img.src = link
    img.style.zIndex = 10
    img.style.width = '80px'
    img.style.position = 'absolute'
    app.appendChild(img)

    function hit(dartX, dartY) {
        score.checkScore(dartX, dartY, circles[0].centerX, circles[0].centerY)
    }

    this.track = () => {
        window.onmousemove = (event) => {
            img.style.top = `${event.clientY - 85}px`
            img.style.left = `${event.clientX}px`
        }
    }
    this.noTrack = () => {
        window.onmousemove = (event) => {
        }
    }
    this.drop = function () {
        gamePause()
        var baseDartX = parseFloat(img.style.top)
        var dartFly = setInterval(() => {
            var x = ((1 - t) ** 2) * bezierA + 2 * (1 - t) * t * bezierB + (t ** 2) * bezierC
            t += 0.05
            img.style.top = `${baseDartX - x}px`
            img.style.width = `${80 * (1 - t * 0.5)}px`
            if (t >= 1) {
                clearInterval(dartFly)
                t = 0
                hitSound.play()
                hit(parseFloat(img.style.left), parseFloat(img.style.top) + 42)
                setTimeout(() => {
                    img.style.width = '80px'
                    gameContinue()
                }, 600)

            }
        }, 20)
    }
}


var dart = new Dart('./img/dart.png')

var style = document.createElement('style')
style.innerText = `
html, body {
    margin: 0;
    height: 100%;
}
body:hover{
    cursor: none;
}
`
document.head.appendChild(style)

function Score() {
    var score = 0
    var element = document.createElement("div")
    element.style.cssText = `
       position: fixed;
       top: 70px;
       left: 50px;
       font-size: 50px;
    `
    element.innerText = `Click to start`

    function checkHit(xCoord, yCoord) {
        console.log(xCoord, yCoord)
        var hitVal = (xCoord) ** 2 + (yCoord) ** 2
        if (hitVal <= 50 ** 2) {
            console.log('Center')
            return 50
        }
        if (hitVal <= 100 ** 2) return 20
        if (hitVal <= 200 ** 2) return 10
        return 0
    }

    this.checkScore = (dartX, dartY, boardX, boardY) => {
        score += checkHit(dartX - boardX, dartY - boardY)
        element.innerText = score.toString()

    }
    this.clearScore = () => {
        score = 0
        element.innerText = `0`
    }
    this.appendToApp = () => app.appendChild(element)
}

var score = new Score()
score.appendToApp()

var music = new Audio()
music.src = './audio/music.mp3'
music.load()

window.onclick = () => {
    music.play()
    gameStart()
    window.onclick = () => {
    }
}
