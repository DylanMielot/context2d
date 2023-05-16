const canvas4 = document.querySelector("#canvas4")
const ctx4 = canvas4.getContext("2d", { willReadFrequently: true })

canvas4.width = 600
canvas4.height = 400

// CANVAS SETTING
ctx4.fillStyle = 'black'
ctx4.fillRect(0, 0, canvas4.width, canvas4.height)
ctx4.lineWidth = 1


class Particle4 {
    constructor(effect) {
        this.effect = effect
        this.x
        this.y
        this.reset()
        this.velocity = Math.floor(Math.random() * 1 + 1)
        this.speedX
        this.speedY
        this.history = [{ x: this.x, y: this.y }]
        this.maxLength = Math.floor(Math.random() * 60 + 30)
        this.timerFactor = 1
        this.timer = this.maxLength / this.timerFactor
        this.angle = 0
        this.newAngle = 0
        this.angleCorrector = Math.random() * 0.5 + 0.01
        this.red = 0
        this.green = 0
        this.blue = 0
        this.color = `rgb(${this.red}, ${this.green}, ${this.blue})`
        this.size = Math.random() > 0.9 ? 3 : 1
    }
    draw(context) {
        context.beginPath()
        context.moveTo(this.history[0].x, this.history[0].y)
        this.history.forEach(coord => {
            context.lineTo(coord.x, coord.y)
        })
        context.strokeStyle = this.color
        context.lineWidth = this.size
        context.stroke()
    }
    update() {
        this.timer--
        if (this.timer >= 1) {

            let x = Math.floor(this.x / this.effect.cellSize)
            let y = Math.floor(this.y / this.effect.cellSize)
            let index = y * this.effect.cols + x

            let flowFieldIndex = this.effect.flowField[index]
            if (flowFieldIndex) {

                //motion
                this.newAngle = flowFieldIndex.colorAngle
                this.angle += (this.newAngle - this.angle) * Math.random() * 0.1 + 0.01

                //color
                if (flowFieldIndex.alpha > 0) {
                    let factor = 0.1
                    this.red === flowFieldIndex.red ? this.red : this.red += (flowFieldIndex.red - this.red) * factor
                    this.green === flowFieldIndex.green ? this.green : this.green += (flowFieldIndex.green - this.green) * factor
                    this.blue === flowFieldIndex.blue ? this.blue : this.blue += (flowFieldIndex.blue - this.blue) * factor
                    this.color = `rgb(${this.red}, ${this.green}, ${this.blue})`
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

        } else if (this.history.length > 1) {
            this.history.shift()
        } else {
            this.reset()
        }
    }
    reset() {
        var attempts = 0
        var success = false

        while (!success) {
            attempts++
            let testIndex = Math.floor(Math.random() * this.effect.flowField.length)
            if (this.effect.flowField[testIndex].alpha > 0) {
                this.x = this.effect.flowField[testIndex].x
                this.y = this.effect.flowField[testIndex].y
                this.history = [{ x: this.x, y: this.y }]
                this.timer = this.maxLength / this.timerFactor
                success = true
            }
        }
        if (!success) {
            this.x = Math.random() * this.effect.width
            this.y = Math.random() * this.effect.height
            this.history = [{ x: this.x, y: this.y }]
            this.timer = this.maxLength / this.timerFactor
        }
    }
}

class Effect4 {
    constructor(canvas, context) {
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.context = context
        this.particles = []
        this.numberOfParticles = 6000
        this.cellSize = 10
        this.cols
        this.rows
        this.flowField = []
        this.curve = 1.2
        this.zoom = 0.2
        this.debug = false
        this.image = new Image()
        this.image.onload = () => {
            this.init()
        }
        this.image.src = 'page1/avengers.png'

        document.addEventListener('keydown', (e) => {
            if (e.key === 'd') {
                this.debug = !this.debug
            }
        })
    }
    drawFlowImage() {
        this.context.drawImage(this.image, 0, 0, this.width, this.height)
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
        this.context.fillText('JS', this.width / 2, this.height / 2, this.width)
        this.context.restore()
    }
    init() {
        this.context.filter = 'blur(1px)'
        this.context.clearRect(0, 0, this.width, this.height)

        this.rows = Math.floor(this.height / this.cellSize)
        this.cols = Math.floor(this.width / this.cellSize)

        // Draw text
        this.drawFlowImage()

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
                    red: red,
                    green: green,
                    blue: blue,
                    alpha: alpha,
                    colorAngle: colorAngle
                })
            }
        }
        this.context.filter = 'none'

        // Create particle
        this.particles = []
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle4(this))
        }
    }
    render() {
        if (this.debug) {
            this.drawGrid()
            this.drawFlowImage()
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

let effect4 = new Effect4(canvas4, ctx4)

let animationFrame4 = null
function animate4() {
    ctx4.fillStyle = 'black'
    ctx4.fillRect(0, 0, canvas4.width, canvas4.height)
    effect4.render()

    animationFrame4 = requestAnimationFrame(animate4)
}

canvas4.addEventListener('click', () => {
    cancelAnimationFrame(animationFrame4)
    animationFrame4 = null
    effect4 = new Effect4(canvas4, ctx4)
    animate4()
})
canvas4.parentElement.addEventListener('mouseleave', () => {
    cancelAnimationFrame(animationFrame4)
    animationFrame4 = null
})