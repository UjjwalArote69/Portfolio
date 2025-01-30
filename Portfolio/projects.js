gsap.registerPlugin(ScrollTrigger);

const locoScroll = new LocomotiveScroll({
  el: document.querySelector("#body"),
  smooth: true
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy("#body", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector("#body").style.transform ? "transform" : "fixed"
});

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

function cursor() {

  Shery.mouseFollower({
    skew: true,
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    duration: 1,
  })

}

cursor();

function waveAnimation() {
  class Noise {
    constructor(seed = 0) {
      this.grad3 = [
        new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0),
        new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1),
        new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)
      ];

      this.p = [151, 160, 137, 91, 90, 15,
        131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
        190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
        88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
        77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
        102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
        135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
        5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
        223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
        129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
        251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
        49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
        138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];

      this.perm = new Array(512);
      this.gradP = new Array(512);

      this.seed(seed);
    }

    /**
     * Seed function
     */
    seed(seed) {
      if (seed > 0 && seed < 1) {
        seed *= 65536;
      }

      seed = Math.floor(seed);
      if (seed < 256) {
        seed |= seed << 8;
      }

      for (let i = 0; i < 256; i++) {
        let v;
        if (i & 1) {
          v = this.p[i] ^ (seed & 255);
        } else {
          v = this.p[i] ^ ((seed >> 8) & 255);
        }

        this.perm[i] = this.perm[i + 256] = v;
        this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
      }
    }

    /**
     * Fade function
     */
    fade(t) {
      return t * t * t * (t * (t * 6 - 15) + 10);
    }

    /**
     * Lerp function
     */
    lerp(a, b, t) {
      return (1 - t) * a + t * b;
    }

    /**
     * Perlin 2D noise
     */
    perlin2(x, y) {
      let X = Math.floor(x);
      let Y = Math.floor(y);

      x -= X;
      y -= Y;

      X = X & 255;
      Y = Y & 255;

      const n00 = this.gradP[X + this.perm[Y]].dot2(x, y);
      const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1);
      const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y);
      const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);

      const u = this.fade(x);

      return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y));
    }
  }

  class Grad {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    dot2(x, y) {
      return this.x * x + this.y * y;
    }

    dot3(x, y, z) {
      return this.x * x + this.y * y + this.z * z;
    }
  }

  class AWaves extends HTMLElement {
    /**
     * Init
     */
    connectedCallback() {
      // Elements
      this.svg = this.querySelector('.js-svg')

      // Properties
      this.mouse = {
        x: 0,
        y: 0,
        lx: 0,
        ly: 0,
        sx: 0,
        sy: 0,
        v: 0,
        vs: 0,
        a: 0,
        set: false,
      }

      this.lines = []
      this.paths = []
      this.noise = new Noise(Math.random())

      // Init
      this.setSize()
      this.setLines()

      this.bindEvents()

      // RAF
      requestAnimationFrame(this.tick.bind(this))
    }

    /**
     * Bind events
     */
    bindEvents() {
      window.addEventListener('resize', this.onResize.bind(this))

      window.addEventListener('mousemove', this.onMouseMove.bind(this))
      this.addEventListener('touchmove', this.onTouchMove.bind(this))
    }

    /**
     * Resize handler
     */
    onResize() {
      this.setSize()
      this.setLines()
    }

    /**
     * Mouse handler
     */
    onMouseMove(e) {
      this.updateMousePosition(e.pageX, e.pageY)
    }

    /**
     * Touch handler
     */
    onTouchMove(e) {
      e.preventDefault()

      const touch = e.touches[0]
      this.updateMousePosition(touch.clientX, touch.clientY)
    }

    /**
     * Update mouse position
     */
    updateMousePosition(x, y) {
      const { mouse } = this

      mouse.x = x - this.bounding.left
      mouse.y = y - this.bounding.top + window.scrollY

      if (!mouse.set) {
        mouse.sx = mouse.x
        mouse.sy = mouse.y
        mouse.lx = mouse.x
        mouse.ly = mouse.y

        mouse.set = true
      }
    }

    /**
     * Set size
     */
    setSize() {
      this.bounding = this.getBoundingClientRect()

      this.svg.style.width = `${this.bounding.width }px`
      this.svg.style.height = `${this.bounding.height }px`
    }

    /**
     * Set lines
     */
    setLines() {
      const { width, height } = this.bounding

      this.lines = []

      this.paths.forEach((path) => {
        path.remove()
      })
      this.paths = []

      const xGap = 10
      const yGap = 32

      const oWidth = width + 200
      const oHeight = height + 30

      const totalLines = Math.ceil(oWidth / xGap)
      const totalPoints = Math.ceil(oHeight / yGap)

      const xStart = (width - xGap * totalLines) / 2
      const yStart = (height - yGap * totalPoints) / 2

      for (let i = 0; i <= totalLines; i++) {
        const points = []

        for (let j = 0; j <= totalPoints; j++) {
          const point = {
            x: xStart + xGap * i,
            y: yStart + yGap * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
          }

          points.push(point)
        }

        // Create path
        const path = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        )
        path.classList.add('a__line')
        path.classList.add('js-line')

        this.svg.appendChild(path)
        this.paths.push(path)

        // Add points
        this.lines.push(points)
      }
    }

    /**
     * Move points
     */
    movePoints(time) {
      const { lines, mouse, noise } = this

      lines.forEach((points) => {
        points.forEach((p) => {
          // Wave movement
          const move =
            noise.perlin2(
              (p.x + time * 0.0125) * 0.002,
              (p.y + time * 0.005) * 0.0015
            ) * 12
          p.wave.x = Math.cos(move) * 32
          p.wave.y = Math.sin(move) * 16

          // Mouse effect
          const dx = p.x - mouse.sx
          const dy = p.y - mouse.sy
          const d = Math.hypot(dx, dy)
          const l = Math.max(175, mouse.vs)

          if (d < l) {
            const s = 1 - d / l
            const f = Math.cos(d * 0.001) * s

            p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065
            p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065
          }

          p.cursor.vx += (0 - p.cursor.x) * 0.005 // String tension
          p.cursor.vy += (0 - p.cursor.y) * 0.005

          p.cursor.vx *= 0.925 // Friction/duration
          p.cursor.vy *= 0.925

          p.cursor.x += p.cursor.vx * 2 // Strength
          p.cursor.y += p.cursor.vy * 2

          p.cursor.x = Math.min(100, Math.max(-100, p.cursor.x)) // Clamp movement
          p.cursor.y = Math.min(100, Math.max(-100, p.cursor.y))
        })
      })
    }

    /**
     * Get point coordinates with movement added
     */
    moved(point, withCursorForce = true) {
      const coords = {
        x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
        y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
      }

      // Round to 2 decimals
      coords.x = Math.round(coords.x * 10) / 10
      coords.y = Math.round(coords.y * 10) / 10

      return coords
    }

    /**
     * Draw lines
     */
    drawLines() {
      const { lines, moved, paths } = this

      lines.forEach((points, lIndex) => {
        let p1 = moved(points[0], false)

        let d = `M ${p1.x} ${p1.y}`

        points.forEach((p1, pIndex) => {
          const isLast = pIndex === points.length - 1

          p1 = moved(p1, !isLast)

          const p2 = moved(
            points[pIndex + 1] || points[points.length - 1],
            !isLast
          )

          // d += `Q ${p1.x} ${p1.y} ${(p1.x + p2.x) / 2} ${(p1.y + p2.y) / 2} `
          d += `L ${p1.x} ${p1.y}`
        })


        paths[lIndex].setAttribute('d', d)
      })
    }

    /**
     * Tick
     */
    tick(time) {
      const { mouse } = this

      // Smooth mouse movement
      mouse.sx += (mouse.x - mouse.sx) * 0.1
      mouse.sy += (mouse.y - mouse.sy) * 0.1

      // Mouse velocity
      const dx = mouse.x - mouse.lx
      const dy = mouse.y - mouse.ly
      const d = Math.hypot(dx, dy)

      mouse.v = d
      mouse.vs += (d - mouse.vs) * 0.1
      mouse.vs = Math.min(100, mouse.vs)

      // Mouse last position
      mouse.lx = mouse.x
      mouse.ly = mouse.y

      // Mouse angle
      mouse.a = Math.atan2(dy, dx)

      // Animation
      this.style.setProperty('--x', `${mouse.sx}px`)
      this.style.setProperty('--y', `${mouse.sy}px`)

      this.movePoints(time)
      this.drawLines()

      requestAnimationFrame(this.tick.bind(this))
    }
  }

  customElements.define('a-waves', AWaves)

}

waveAnimation();

function projects() {

  const preview = document.querySelector('#preview');
  
  
  var timeline = gsap.timeline({

    scrollTrigger: {
      trigger: 'a-waves',
      scroller: '#body',
      start: 'top top',
      end: 'bottom 100vh',
      scrub: true,
      // markers: true,
    }
    
  });
  
  timeline.to('#body', {
    backgroundColor: 'rgb(0,0,0)',
  });

  // timeline.from('.first h2', {
  //   y:400,
  //   opacity: 1,
  // });

  // document.querySelectorAll(".elem").forEach(function (elem) {
  //   var rotate = 0;
  //   var diffrot = 0;
  
  //   elem.addEventListener("mouseleave", function (dets) {
  //     gsap.to(elem.querySelector("img"), {
  //       opacity: 0,
  //       ease: Power3,
  //       duration: 0.5,
  //     });
  //   });
  
  //   elem.addEventListener("mousemove", function (dets) {
  //     var diff = dets.clientY - elem.getBoundingClientRect().top;
  //     diffrot = dets.clientX - rotate;
  //     rotate = dets.clientX;
  //     gsap.to(elem.querySelector("img"), {
  //       opacity: 1,
  //       ease: Power3,
  //       top: diff,
  //       left: dets.clientX,
  //       rotate: gsap.utils.clamp(-20, 20, diffrot * 0.5),
  //     });
  //   });
  // });

  document.querySelectorAll(".elem").forEach(function (elem) {
    var rotate = 0;
    var diffrot = 0;
  
    elem.addEventListener("mouseleave", function (dets) {
      gsap.to(elem.querySelector("img"), {
        opacity: 0,
        ease: Power3,
        duration: 0.5,
      });
    });
  
    elem.addEventListener("mousemove", function (dets) {
      var diff = dets.clientY - elem.getBoundingClientRect().top;
      diffrot = dets.clientX - rotate;
      rotate = dets.clientX;
      gsap.to(elem.querySelector("img"), {
        opacity: 1,
        ease: Power3,
        top: diff,
        left: dets.clientX,
        rotate: gsap.utils.clamp(-20, 20, diffrot * 0.5),
      });
    });
  });

}

projects();