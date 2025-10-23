const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const numStars = 800;
const shootingStars = [];
const meteors = [];
const galaxyParticles = [];

// Custom cursor
const cursor = document.querySelector('.custom-cursor');
const trails = [];
const maxTrails = 10;

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    document.body.appendChild(trail);

    trails.push(trail);
    if (trails.length > maxTrails) {
        const oldTrail = trails.shift();
        oldTrail.remove();
    }

    setTimeout(() => {
        trail.style.opacity = '0';
        setTimeout(() => trail.remove(), 200);
    }, 100);
});

// Meteor shower
for (let i = 0; i < 5; i++) {
    const meteor = document.createElement('div');
    meteor.className = 'meteor-shower';
    meteor.style.left = Math.random() * window.innerWidth + 'px';
    meteor.style.animationDelay = Math.random() * 3 + 's';
    document.body.appendChild(meteor);
}

class Star {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random();
        this.brightness = Math.random();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.twinkleSpeed = Math.random() * 0.015 + 0.005;
        this.brightness = Math.random();
        
        // Star colors based on temperature (like real stars)
        const temp = Math.random();
        if (temp < 0.3) {
            this.color = { r: 155, g: 176, b: 255 }; // Blue (hot stars)
        } else if (temp < 0.6) {
            this.color = { r: 255, g: 244, b: 234 }; // White-yellow
        } else if (temp < 0.85) {
            this.color = { r: 255, g: 209, b: 178 }; // Orange
        } else {
            this.color = { r: 255, g: 180, b: 150 }; // Red (cool stars)
        }
    }

    update() {
        this.opacity += this.twinkleSpeed;
        if (this.opacity > 1 || this.opacity < 0.2) {
            this.twinkleSpeed *= -1;
        }
    }

    draw() {
        // Main star
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
        ctx.fill();
        
        // Glow effect for brighter stars
        if (this.brightness > 0.7) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.2})`;
            ctx.fill();
            
            // Cross sparkle for very bright stars
            if (this.brightness > 0.9) {
                ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.4})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(this.x - 4, this.y);
                ctx.lineTo(this.x + 4, this.y);
                ctx.moveTo(this.x, this.y - 4);
                ctx.lineTo(this.x, this.y + 4);
                ctx.stroke();
            }
        }
    }
}

class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height / 2;
        this.length = Math.random() * 100 + 60;
        this.speed = Math.random() * 15 + 10;
        this.opacity = 1;
        this.angle = Math.PI / 4;
        this.thickness = Math.random() * 2 + 1;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.015;

        if (this.opacity <= 0) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(
            this.x, this.y,
            this.x - Math.cos(this.angle) * this.length,
            this.y - Math.sin(this.angle) * this.length
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${this.opacity * 0.6})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.thickness;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - Math.cos(this.angle) * this.length,
            this.y - Math.sin(this.angle) * this.length
        );
        ctx.stroke();
        ctx.restore();
    }
}

class Nebula {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 200 + 150;
        this.hue = Math.random() * 60 + 240; // Purple to blue
        this.opacity = Math.random() * 0.2 + 0.1;
        this.pulseSpeed = Math.random() * 0.001 + 0.0005;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
        this.pulsePhase += this.pulseSpeed;
        this.currentOpacity = this.opacity + Math.sin(this.pulsePhase) * 0.05;
    }

    draw() {
        // Multi-layered nebula for realistic look
        for (let i = 0; i < 3; i++) {
            const gradient = ctx.createRadialGradient(
                this.x + (i * 20), this.y + (i * 15), 0,
                this.x, this.y, this.radius - (i * 30)
            );
            gradient.addColorStop(0, `hsla(${this.hue + (i * 10)}, 80%, 60%, ${this.currentOpacity * (0.3 - i * 0.08)})`);
            gradient.addColorStop(0.3, `hsla(${this.hue + (i * 15)}, 70%, 50%, ${this.currentOpacity * (0.2 - i * 0.06)})`);
            gradient.addColorStop(0.6, `hsla(${this.hue + (i * 20)}, 60%, 40%, ${this.currentOpacity * (0.1 - i * 0.03)})`);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        }
    }
}

class GalaxyParticle {
    constructor(centerX, centerY) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.pow(Math.random(), 1.3) * 250; // More particles near center
        this.size = Math.random() * 1.2 + 0.3;
        this.speed = 0.0008 + (Math.random() * 0.0012);
        this.brightness = Math.random() * 0.9 + 0.1;
        
        // Spiral arm calculation
        this.spiralFactor = this.distance * 0.01;
        this.wobble = Math.random() * 0.6 + 0.2;
    }

    update() {
        // Faster rotation for particles closer to center
        this.angle += this.speed * (1 + this.distance / 250);
    }

    draw() {
        // Calculate spiral position with wobble
        const spiralAngle = this.angle + this.spiralFactor + Math.sin(this.distance * 0.01) * this.wobble;
        const x = this.centerX + Math.cos(spiralAngle) * this.distance;
        const y = this.centerY + Math.sin(spiralAngle) * this.distance * 0.7; // Flatten for galaxy look
        
        // Create gradient for particle glow
        const grad = ctx.createRadialGradient(x, y, 0, x, y, this.size * 6);
        
        // Color varies by distance from center (yellow center to blue edges)
        const distanceRatio = this.distance / 250;
        const r = Math.floor(255 * (1 - distanceRatio * 0.6));
        const g = Math.floor(200 * (1 - distanceRatio * 0.4) + 55 * distanceRatio);
        const b = Math.floor(220 + 35 * distanceRatio);
        const alpha = this.brightness * (0.9 - distanceRatio * 0.4);
        
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${alpha * 0.35})`);
        grad.addColorStop(1, 'transparent');
        
        ctx.save();
        ctx.globalCompositeOperation = 'lighter'; // Additive blending for glow
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

const nebulas = [];
for (let i = 0; i < 4; i++) {
    nebulas.push(new Nebula());
}

for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
}

for (let i = 0; i < 5; i++) {
    shootingStars.push(new ShootingStar());
}

// Create spiral galaxy
const galaxyCenter = { x: canvas.width * 0.25, y: canvas.height * 0.4 };
for (let i = 0; i < 600; i++) {
    galaxyParticles.push(new GalaxyParticle(galaxyCenter.x, galaxyCenter.y));
}

// Second galaxy
const galaxyCenter2 = { x: canvas.width * 0.72, y: canvas.height * 0.62 };
for (let i = 0; i < 500; i++) {
    galaxyParticles.push(new GalaxyParticle(galaxyCenter2.x, galaxyCenter2.y));
}

function drawGalaxy() {
    // Deep space background with slight gradient
    const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
    );
    bgGradient.addColorStop(0, '#000814');
    bgGradient.addColorStop(1, '#000000');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Distant galaxy glow
    const distantGalaxy = ctx.createRadialGradient(
        canvas.width * 0.75, canvas.height * 0.3, 0,
        canvas.width * 0.75, canvas.height * 0.3, 200
    );
    distantGalaxy.addColorStop(0, 'rgba(138, 43, 226, 0.08)');
    distantGalaxy.addColorStop(0.5, 'rgba(75, 0, 130, 0.04)');
    distantGalaxy.addColorStop(1, 'transparent');
    ctx.fillStyle = distantGalaxy;
    ctx.fillRect(canvas.width * 0.55, canvas.height * 0.1, 400, 400);

    // Milky Way dust effect
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 6);
    const milkyWay = ctx.createLinearGradient(-canvas.width, 0, canvas.width, 0);
    milkyWay.addColorStop(0, 'transparent');
    milkyWay.addColorStop(0.3, 'rgba(200, 180, 255, 0.03)');
    milkyWay.addColorStop(0.5, 'rgba(220, 200, 255, 0.06)');
    milkyWay.addColorStop(0.7, 'rgba(200, 180, 255, 0.03)');
    milkyWay.addColorStop(1, 'transparent');
    ctx.fillStyle = milkyWay;
    ctx.fillRect(-canvas.width, -100, canvas.width * 2, 200);
    ctx.restore();
}

function animate() {
    drawGalaxy();

    // Draw nebulas with pulsing
    nebulas.forEach(nebula => {
        nebula.update();
        nebula.draw();
    });

    // Draw spiral galaxy particles
    galaxyParticles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw stars
    stars.forEach(star => {
        star.update();
        star.draw();
    });

    // Draw shooting stars
    shootingStars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const astronaut = document.querySelector('.astronaut');
    if (astronaut) {
        astronaut.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});