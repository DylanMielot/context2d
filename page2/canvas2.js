const canvas2 = document.querySelector("#canvas2")
const ctx2 = canvas2.getContext("2d")
const numberP2 = canvas2.parentElement.querySelector("#numberP2")
const curve2 = canvas2.parentElement.querySelector("#curve2")
const zoom2 = canvas2.parentElement.querySelector("#zoom2")
const flowfield2 = canvas2.parentElement.querySelector("#flowfield2")
const cellSize2 = canvas2.parentElement.querySelector("#cellSize2")

canvas2.width = 600
canvas2.height = 400

// CANVAS SETTING
ctx2.fillStyle = 'black'
ctx2.fillRect(0, 0, canvas2.width, canvas2.height)
ctx2.lineWidth = 1

class Particle2 {
    constructor(effect) {
        this.effect = effect
        this.x = Math.floor(Math.random() * this.effect.width)
        this.y = Math.floor(Math.random() * this.effect.height)
        this.velocity = Math.floor(Math.random() * 3 + 1)
        this.speedX
        this.speedY
        this.history = [{ x: this.x, y: this.y }]
        this.maxLength = Math.floor(Math.random() * 300 + 10)
        this.timer = this.maxLength * 2
        this.angle = 0
        this.colors = ['#022554', '#124994', '#246ac9', '#3c85e8', '#5fa1fa']
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
    }
    draw(context) {
        context.beginPath()
        context.moveTo(this.history[0].x, this.history[0].y)
        this.history.forEach(coord => {
            context.lineTo(coord.x, coord.y)
        })
        context.strokeStyle = this.color
        context.stroke()
    }
    update() {
        this.timer--
        if (this.timer >= 1) {

            let x = Math.floor(this.x / this.effect.cellSize)
            let y = Math.floor(this.y / this.effect.cellSize)
            let index = y * this.effect.cols + x
            this.angle = this.effect.flowField[index]

            this.speedX = Math.cos(this.angle) * this.velocity
            this.speedY = Math.sin(this.angle) * this.velocity
            this.x += this.speedX
            this.y += this.speedY

            this.history.push({ x: this.x, y: this.y })
            if (this.history.length > this.maxLength) {
                this.history.shift()
            }
            if (this.history[0].x > this.effect.width ||
                this.history[0].x < 0) {
                this.reset()
            }
            if (this.history[0].y > this.effect.height ||
                this.history[0].y < 0) {
                this.reset()
            }
        } else if (this.history.length > 1) {
            this.history.shift()
        } else {
            this.reset()
        }
    }
    reset() {
        this.x = Math.floor(Math.random() * this.effect.width)
        this.y = Math.floor(Math.random() * this.effect.height)
        this.history = [{ x: this.x, y: this.y }]
        this.timer = this.maxLength * 2
    }
}

class Effect2 {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.particles = []
        this.numberOfParticles = numberP2.value
        this.cellSize = cellSize2.value
        this.cols
        this.rows
        this.flowField = []
        this.curve = curve2.value
        this.zoom = zoom2.value
        this.init()
    }
    init() {
        // Create flowfield
        this.rows = Math.floor(this.height / this.cellSize)
        this.cols = Math.floor(this.width / this.cellSize)
        this.flowField = []
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let angle = (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve
                this.flowField.push(angle)
            }
        }

        // Create particle
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle2(this))
        }
    }
    render(context) {
        flowfield2.checked && this.drawGrid(context)
        this.particles.forEach(particle => {
            particle.draw(context)
            particle.update()
        })
    }
    drawGrid(context) {
        context.save()
        context.strokeStyle = 'red'
        context.lineWidth = 0.5
        for (let c = 0; c < this.cols; c++) {
            context.beginPath()
            context.moveTo(this.cellSize * c, 0)
            context.lineTo(this.cellSize * c, this.height)
            context.stroke()
        }
        for (let r = 0; r < this.rows; r++) {
            context.beginPath()
            context.moveTo(0, this.cellSize * r)
            context.lineTo(this.width, this.cellSize * r)
            context.stroke()
        }
        context.restore()
    }
}

let effect2 = new Effect2(canvas2.width, canvas2.height)

let animationFrame2 = null
let mouseOnPage = false
function animate2() {
    ctx2.fillStyle = 'black'
    ctx2.fillRect(0, 0, canvas2.width, canvas2.height)
    effect2.render(ctx2)

    animationFrame2 = requestAnimationFrame(animate2)
}

canvas2.addEventListener('click', () => {
    cancelAnimationFrame(animationFrame2)
    animationFrame2 = null
    effect2 = new Effect2(canvas2.width, canvas2.height)
    animate2()
})
canvas2.parentElement.addEventListener('mouseleave', () => {
    cancelAnimationFrame(animationFrame2)
    animationFrame2 = null
    mouseOnPage = false
})

numberP2.addEventListener('change', () => {
    cancelAnimationFrame(animationFrame2)
    animationFrame2 = null
    effect2 = new Effect2(canvas2.width, canvas2.height)
    animate2()
})
curve2.addEventListener('change', () => {
    console.log('new curve : ', curve2.value)
    cancelAnimationFrame(animationFrame2)
    animationFrame2 = null
    effect2 = new Effect2(canvas2.width, canvas2.height)
    animate2()
})
zoom2.addEventListener('change', () => {
    console.log('new zoom : ', zoom2.value)
    cancelAnimationFrame(animationFrame2)
    animationFrame2 = null
    effect2 = new Effect2(canvas2.width, canvas2.height)
    animate2()
})
cellSize2.addEventListener('change', () => {
    console.log('new cellsize : ', cellSize2.value)
    cancelAnimationFrame(animationFrame2)
    animationFrame2 = null
    effect2 = new Effect2(canvas2.width, canvas2.height)
    animate2()
})