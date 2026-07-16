/* ======================================
   GameVerse Pro - Physics Engine
====================================== */

const Physics = {

    gravity: 0.5,

    friction: 0.98,

    // Rectangle Collision
    isColliding(a, b) {

        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );

    },

    // Apply Gravity
    applyGravity(object) {

        object.velocityY += this.gravity;

        object.y += object.velocityY;

    },

    // Apply Friction
    applyFriction(object) {

        object.velocityX *= this.friction;

        object.velocityY *= this.friction;

    },

    // Bounce
    bounce(object, power = 10) {

        object.velocityY = -power;

    },

    // Distance
    distance(x1, y1, x2, y2) {

        return Math.sqrt(

            Math.pow(x2 - x1, 2) +

            Math.pow(y2 - y1, 2)

        );

    },

    // Clamp
    clamp(value, min, max) {

        return Math.max(

            min,

            Math.min(value, max)

        );

    },

    // Random Number
    random(min, max) {

        return Math.floor(

            Math.random() *

            (max - min + 1)

        ) + min;

    },

    // Degrees to Radians
    degToRad(deg) {

        return deg * Math.PI / 180;

    },

    // Radians to Degrees
    radToDeg(rad) {

        return rad * 180 / Math.PI;

    },

    // Move Toward
    moveTowards(current, target, speed) {

        if (current < target)

            return Math.min(current + speed, target);

        if (current > target)

            return Math.max(current - speed, target);

        return current;

    },

    // Circle Collision
    circleCollision(c1, c2) {

        return this.distance(

            c1.x,

            c1.y,

            c2.x,

            c2.y

        ) < c1.radius + c2.radius;

    }

};

console.log("✅ physics.js Loaded");
