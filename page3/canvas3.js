const canvas3 = document.querySelector("#canvas3")
const ctx3 = canvas3.getContext("2d", { willReadFrequently: true })
const numberP3 = canvas3.parentElement.querySelector("#numberP3")
const speed3 = canvas3.parentElement.querySelector("#speed3")
const long3 = canvas3.parentElement.querySelector("#long3")
const angle3 = canvas3.parentElement.querySelector("#angle3")
const texte3 = canvas3.parentElement.querySelector("#texte3")

canvas3.width = 600
canvas3.height = 400

// CANVAS SETTING
ctx3.fillStyle = 'black'
ctx3.fillRect(0, 0, canvas3.width, canvas3.height)
ctx3.lineWidth = 1

mouse = {
    x: null,
    y: null,
    radius: 80
}

canvas3.addEventListener("mousemove", (event) => {
    var rect = event.target.getBoundingClientRect()
    mouse.x = event.x - rect.left
    mouse.y = event.y - rect.top
})

class Particle3 {
    constructor(effect) {
        this.effect = effect
        this.x
        this.y
        this.reset()
        this.velocity = Math.floor(Math.random() * Number(speed3.value - 1) + 1)
        this.speedX
        this.speedY
        this.history = [{ x: this.x, y: this.y }]
        this.maxLength = Math.floor(Math.random() * Number(long3.value) + 3)
        this.timer = this.maxLength * 2
        this.angle = 0
        this.newAngle = 0
        this.angleCorrector = Math.random() * Number(angle3.value) + Number(angle3.value) / 2.5
        this.colors = ['yellow', '#124994', '#246ac9', '#3c85e8', '#5fa1fa', '#022554', '#124994', '#246ac9', '#3c85e8', '#5fa1fa', '#022554', '#124994', '#246ac9', '#3c85e8', '#5fa1fa', 'white']
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

            if (this.effect.flowField[index]) {
                this.newAngle = this.effect.flowField[index].colorAngle
                if (this.angle > this.newAngle) {
                    this.angle -= this.angleCorrector
                } else if (this.angle < this.newAngle) {
                    this.angle += this.angleCorrector
                } else {
                    this.angle = this.newAngle
                }
            }

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

            let dx = mouse.x - this.x
            let dy = mouse.y - this.y
            let distance = Math.sqrt(dx ** 2 + dy ** 2)

            if (distance < mouse.radius) {
                this.x -= dx / 15
                this.y -= dy / 15

                if (this.x < 0) {
                    this.x = 1
                } else if (this.x > this.effect.width) {
                    this.x = this.effect.width - 1
                }
            }

        } else if (this.history.length > 1) {
            this.history.shift()
        } else {
            this.reset()
        }
    }
    reset() {
        let attempts = 0
        let success = false

        while (!success) {
            attempts++
            let testIndex = Math.floor(Math.random() * this.effect.flowField.length)
            if (this.effect.flowField[testIndex].alpha > 0) {
                this.x = this.effect.flowField[testIndex].x
                this.y = this.effect.flowField[testIndex].y
                this.history = [{ x: this.x, y: this.y }]
                this.timer = this.maxLength * 2
                success = true
            }
        }
        if (!success) {
            this.x = Math.random() * this.effect.width
            this.y = Math.random() * this.effect.height
            this.history = [{ x: this.x, y: this.y }]
            this.timer = this.maxLength * 2
        }
    }
}

class Effect3 {
    constructor(width, height, context) {
        this.context = context
        this.width = width
        this.height = height
        this.particles = []
        this.numberOfParticles = numberP3.value
        this.cellSize = 10
        this.cols
        this.rows
        this.flowField = []
        this.curve = 1.2
        this.zoom = 0.2
        this.init()
        this.debug = false

        document.addEventListener('keydown', (e) => {
            if (e.key === 'd') {
                this.debug = !this.debug
            }
        })
    }
    drawText() {
        this.context.save()
        this.context.font = '400px Impact'
        this.context.textAlign = 'center'
        this.context.textBaseline = 'middle'

        const gradient1 = this.context.createRadialGradient(this.width * 0.2, this.height * 0, 1,
            this.width * 0.5, this.height * 0.5, this.width)
        gradient1.addColorStop(0.2, 'blue')
        gradient1.addColorStop(0.4, 'rgb(200, 255, 0)')
        gradient1.addColorStop(0.6, 'blue')
        gradient1.addColorStop(0.8, 'rgb(200, 255, 0)')

        this.context.fillStyle = gradient1
        this.context.fillText(texte3.value, this.width / 2, this.height / 2, this.width)
        this.context.restore()
    }
    init() {
        this.context.clearRect(0, 0, this.width, this.height)

        this.rows = Math.floor(this.height / this.cellSize)
        this.cols = Math.floor(this.width / this.cellSize)

        // Draw text
        this.drawText()

        // Scan pixel data
        this.flowField = []
        const pixels = this.context.getImageData(0, 0, this.width, this.height).data
        for (let y = 0; y < this.height; y += this.cellSize) {
            for (let x = 0; x < this.width; x += this.cellSize) {
                const index = (y * this.width + x) * 4
                const red = pixels[index]
                const green = pixels[index + 1]
                const blue = pixels[index + 2]
                const alpha = pixels[index + 3]
                const grayscale = (red + green + blue) / 3
                const colorAngle = ((grayscale / 255) * 6.28).toFixed(2)
                this.flowField.push({
                    x: x,
                    y: y,
                    alpha: alpha,
                    colorAngle: colorAngle
                })
            }
        }

        // Create particle
        this.particles = []
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle3(this))
        }
    }
    render() {
        if (this.debug) {
            this.drawGrid()
            this.drawText()
        }
        this.particles.forEach(particle => {
            particle.draw(this.context)
            particle.update()
        })
    }
    drawGrid() {
        this.context.save()
        this.context.strokeStyle = 'red'
        this.context.lineWidth = 0.5
        for (let c = 0; c < this.cols; c++) {
            this.context.beginPath()
            this.context.moveTo(this.cellSize * c, 0)
            this.context.lineTo(this.cellSize * c, this.height)
            this.context.stroke()
        }
        for (let r = 0; r < this.rows; r++) {
            this.context.beginPath()
            this.context.moveTo(0, this.cellSize * r)
            this.context.lineTo(this.width, this.cellSize * r)
            this.context.stroke()
        }
        this.context.restore()
    }
}

let effect3 = new Effect3(canvas3.width, canvas3.height, ctx3)

let animationFrame3 = null
function animate3() {
    ctx3.fillStyle = 'black'
    ctx3.fillRect(0, 0, canvas3.width, canvas3.height)
    effect3.render()

    animationFrame3 = requestAnimationFrame(animate3)
}

canvas3.addEventListener('click', () => {
    cancelAnimationFrame(animationFrame3)
    animationFrame3 = null
    effect3 = new Effect3(canvas3.width, canvas3.height, ctx3)
    animate3()
})
canvas3.parentElement.addEventListener('mouseleave', () => {
    cancelAnimationFrame(animationFrame3)
    animationFrame3 = null
})
canvas3.addEventListener('mouseleave', () => {
    mouse.x = null
    mouse.y = null
})
numberP3.addEventListener('change', () => {
    cancelAnimationFrame(animationFrame3)
    animationFrame3 = null
    effect3 = new Effect3(canvas3.width, canvas3.height, ctx3)
    animate3()
})
speed3.addEventListener('change', () => {
    cancelAnimationFrame(animationFrame3)
    animationFrame3 = null
    effect3 = new Effect3(canvas3.width, canvas3.height, ctx3)
    animate3()
})
long3.addEventListener('change', () => {
    cancelAnimationFrame(animationFrame3)
    animationFrame3 = null
    effect3 = new Effect3(canvas3.width, canvas3.height, ctx3)
    animate3()
})
angle3.addEventListener('change', () => {
    cancelAnimationFrame(animationFrame3)
    animationFrame3 = null
    effect3 = new Effect3(canvas3.width, canvas3.height, ctx3)
    animate3()
})
texte3.addEventListener('change', () => {
    cancelAnimationFrame(animationFrame3)
    animationFrame3 = null
    effect3 = new Effect3(canvas3.width, canvas3.height, ctx3)
    animate3()
})