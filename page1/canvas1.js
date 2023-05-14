
let image1 = new Image()

const canvas1 = document.querySelector("#canvas1")
const ctx1 = canvas1.getContext("2d", { willReadFrequently: true })
const numberP = canvas1.parentElement.querySelector("#numberP")
const tailleP = canvas1.parentElement.querySelector("#tailleP")
const imagePage1 = canvas1.parentElement.querySelector("#imagePage1")

canvas1.width = 600
canvas1.height = 400

image1.onload = () => {

    let particles1 = []
    let particleCount1 = numberP.value < 0 ? 0 : numberP.value

    function getImagePixels(image) {
        ctx1.drawImage(image, 0, 0, canvas1.width, canvas1.height)
        let pixels1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height)
        ctx1.clearRect(0, 0, canvas1.width, canvas1.height)

        return pixels1
    }

    function getMappedImage() {
        let mappedImage = []
        for (let y = 0; y < canvas1.height; y++) {
            let row = []
            for (let x = 0; x < canvas1.width; x++) {
                let red = pixels1.data[(y * 4 * canvas1.width) + (x * 4)]
                let green = pixels1.data[(y * 4 * canvas1.width) + (x * 4 + 1)]
                let blue = pixels1.data[(y * 4 * canvas1.width) + (x * 4 + 2)]
                let brightness = (red + green + blue) / 255
                let cell = [
                    brightness = brightness,
                    color = `rgb(${red},${green},${blue})`
                ]
                row.push(cell)
            }
            mappedImage.push(row)
        }
        return mappedImage
    }


    var mouse = {
        x: null,
        y: null,
        radius: 80
    }

    canvas1.addEventListener("mousemove", (event) => {
        var rect = event.target.getBoundingClientRect()
        mouse.x = event.x - rect.left
        mouse.y = event.y - rect.top
    })

    class Particle1 {
        constructor() {
            this.x = Math.random() * canvas1.width
            this.y = Math.random() * canvas1.height
            this.speed = 0
            this.velocity = Math.random() * 1.5 + 0.75
            this.size = tailleP.value < 0 ? 0.5 : tailleP.value * Math.random() + 0.5
            this.position1 = Math.floor(this.y)
            this.position2 = Math.floor(this.x)
            this.baseX = this.x
            this.baseY = this.y
        }
        update() {
            this.position1 = Math.floor(this.y)
            this.position2 = Math.floor(this.x)

            this.speed = mappedImage1[this.position1][this.position2][0]

            let movement = (2.3 - this.speed) + this.velocity
            this.y += movement
            this.x += movement
            if (this.y >= canvas1.height) {
                this.y = 0
                this.x = Math.random() * canvas1.width
                this.baseX = this.x
                this.baseY = this.y
            }
            if (this.x >= canvas1.width) {
                this.y = Math.random() * canvas1.height
                this.x = 0
                this.baseX = this.x
                this.baseY = this.y
            }

            let dx = mouse.x - this.x
            let dy = mouse.y - this.y
            let distance = Math.sqrt(dx ** 2 + dy ** 2)

            if (distance < mouse.radius) {

                this.x -= (mouse.radius / distance) * Math.cos(Math.atan2(dy / 2, dx * 100)) * 2

                if (this.x < 0) {
                    this.x = 1
                } else if (this.x > canvas1.width) {
                    this.x = canvas1.width - 1
                }

            } else {
                if (this.x != this.baseX) {
                    let dx = this.x - this.baseX
                    this.x -= dx / 15
                }
            }
        }
        draw() {
            ctx1.beginPath()
            ctx1.fillStyle = mappedImage1[this.position1][this.position2][1]
            ctx1.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx1.fill()
        }
    }

    function init1() {
        particles1 = []
        for (let i = 0; i < particleCount1; i++) {
            particles1.push(new Particle1)
        }
    }

    var animationFrame1 = null
    function animate1(frame = true) {
        ctx1.globalAlpha = frame ? 0.3 : 1
        ctx1.fillStyle = 'rgb(0,0,0)'
        ctx1.fillRect(0, 0, canvas1.width, canvas1.height)
        particles1.forEach((p, index) => {
            p.update()
            ctx1.globalAlpha = particles1[index].speed / 3.5
            p.draw()
        })

        if (frame) {
            animationFrame1 = requestAnimationFrame(animate1)
        }
    }


    let pixels1 = getImagePixels(image1)
    let mappedImage1 = getMappedImage()
    init1()
    animate1(false)

    /**
     * Run or stop on click on canvas
     */
    canvas1.addEventListener('mouseenter', () => {
        if (animationFrame1 == null) {
            animate1()
        }
    })
    canvas1.addEventListener('mouseleave', () => {
        mouse.x = null
        mouse.y = null
    })
    canvas1.parentElement.addEventListener('mouseleave', () => {
        cancelAnimationFrame(animationFrame1)
        animationFrame1 = null
    })

    document.querySelector("#numberP").addEventListener('change', () => {
        particleCount1 = numberP.value < 0 ? 0 : numberP.value
        init1()
        animate1(false)
    })
    document.querySelector("#tailleP").addEventListener('change', () => {
        init1()
        animate1(false)
    })

    /**
     * On window resize, resize the canvas and redraw the image to take new data
     */
    window.addEventListener('resize', () => {

        cancelAnimationFrame(animationFrame1)

        pixels1 = getImagePixels()
        mappedImage1 = getMappedImage()

        init1()
        animate1(false)
    })
}

image1.src = "page1/link.png"