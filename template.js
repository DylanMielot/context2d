const canvas2 = document.querySelector("#canvas2")
const ctx2 = canvas2.getContext("2d")

canvas2.width = 600
canvas2.height = 400

// CANVAS SETTING
ctx2.fillStyle = 'black'
ctx2.fillRect(0, 0, canvas2.width, canvas2.height)
ctx2.fillStyle = 'white'
ctx2.strokeStyle = 'black'
ctx2.lineWidth = 1

class Particle2 {
    constructor(effect) {
        this.effect = effect
        this.x = Math.floor(Math.random() * this.effect.width)
        this.y = Math.floor(Math.random() * this.effect.height)
    }
    draw(context) {
        context.fillRect(this.x, this.y, 10, 10)
    }
}

class Effect2 {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.particles = []
        this.init()
        this.numberOfParticles = 50
    }
    init() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle2(this))
        }
    }
    render(context) {
        this.particles.forEach(particle => {
            particle.draw(context)
        })
    }
}

const effect2 = new Effect2(canvas2.width, canvas2.height)
effect2.render(ctx2)