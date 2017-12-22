import {
    Engine,
    Render,
    Runner,
    Composite,
    Composites,
    Common,
    Query,
    MouseConstraint,
    Mouse,
    Events,
    World,
    Body,
    // Vertices,
    Bodies,
    Vector
} from 'matter-js';

export default class Simulation {
    constructor(width, height) {
        this.engine = Engine.create();
        this.world = this.engine.world;
        this.world.gravity = {x: 0, y: 0};
        this.center = {
            x: 2500,
            y: 450,
            z: 1
        };

        this.addBodies = this.addBodies.bind(this);
        this.generateUnits = this.generateUnits.bind(this);
        this.removeUnits = this.removeUnits.bind(this);

        // create renderer
        this.render = Render.create({
            element: document.body,
            engine: this.engine,
            options: {
                width: width,
                height: height,
                showAngleIndicator: true
            }
        });
        Render.run(this.render);

        const canvas = this.render.element.getElementsByTagName('canvas')[0];
        console.log('render.element.mouseover: ', {el: canvas});
        canvas.onmousemove = (event) => {
            // console.log('canvas.onmousemove: ', event)
            if (event.buttons === 1) {
                this.center.x -= event.movementX * this.center.z;
                this.center.y -= event.movementY * this.center.z;
                this.lookAt(this.center);
            }

        };
        canvas.onmousewheel = (event) => {
            // console.log('canvas.onmousewheel: ', event)
            //if (event.buttons === 1) {
            this.center.z -= event.wheelDelta !== 0 ? (event.wheelDelta > 0 ? 0.1 : -0.1) : 0;
            if (this.center.z < 0.1) this.center.z = 0.1;
            this.lookAt(this.center);
            //}

        };

        // create runner
        this.runner = Runner.create();
        Runner.run(this.runner, this.engine);

        // add bodies
        let stack = Composites.stack(-width, -height, 8, 6, 200, 100, function (x, y) {
            const swing = 50;
            switch (Math.round(Common.random(0, 1))) {

                case 0:
                    if (Common.random() < 0.8) {
                        return Bodies.rectangle(x + ((Math.random() * swing) - swing / 2), y + ((Math.random() * swing) - swing / 2), Common.random(120, 300), Common.random(120, 300), {
                            angle: Math.random() * (Math.PI * 2),
                            isStatic: true
                        });
                    } else {
                        return Bodies.rectangle(x + ((Math.random() * swing) - swing / 2), y + ((Math.random() * swing) - swing / 2), Common.random(160, 480), Common.random(120, 480), {
                            angle: Math.random() * (Math.PI * 2),
                            isStatic: true
                        });
                    }
                case 1:
                    let sides = Math.round(Common.random(1, 8));
                    sides = (sides === 3) ? 4 : sides;
                    return Bodies.polygon(x + ((Math.random() * swing) - swing / 2), y + ((Math.random() * swing) - swing / 2), sides, Common.random(40, 200), {
                        angle: Math.random() * (Math.PI * 2),
                        isStatic: true
                    });

                default:
                    break;
            }
        });

        this.addBodies([
            //stack,
            /*
             Bodies.rectangle(width / 2, 300, width / 1.5, 50, {isStatic: true}),
             Bodies.rectangle(width / 2, 450, width / 1.2, 25, {isStatic: true}),
             Bodies.rectangle(width - width / 4 + 50, 550, width / 4, 25, {isStatic: true}),
             Bodies.rectangle(188, 250, 25, 300, {isStatic: true}),
             Bodies.rectangle(width / 2 - 350, 600, 25, 450, {isStatic: true}),
             Bodies.rectangle(width / 3 + 20, 700, 25, 350, {isStatic: true}),
             Bodies.rectangle(width - width / 3 + 288, 613, 25, 350, {isStatic: true}),

             Bodies.rectangle(width / 2 + 150, 700, 100, 100, {isStatic: true}),
             */
            /**x, y, width, height, options**/
            Bodies.rectangle(0, -height, width * 2, 25, {isStatic: true}), //up
            Bodies.rectangle(0, height * 2, width * 2, 25, {isStatic: true}), //down

            Bodies.rectangle(-width, height / 2, 25, height * 3, {isStatic: true}), //left
            Bodies.rectangle(width, height / 2 + height, 25, height, {isStatic: true}), //right 1
            Bodies.rectangle(width, height / 2 - height, 25, height, {isStatic: true}), //right 2
            Bodies.rectangle(width + width, height / 2, 25, height, {isStatic: true}), //right 3
            // Bodies.rectangle(width, height / 2, 25, height, {isStatic: true}), //right 3
            Bodies.rectangle(width + width / 2, (height / 2) - (height / 2), width, 25, {isStatic: true}), //down
            Bodies.rectangle(width + width / 2, (height / 2) + (height / 2), width, 25, {isStatic: true}), //down

            /* */
            Bodies.rectangle(width + width / 2, (height / 2) - (height / 2) + 400, width / 2, 25, {isStatic: true}), //down
            Bodies.rectangle(width + width / 2 - 500, (height / 2) - (height / 2) + 175, width / 3.5, 25, {
                angle: -Math.PI / 4,
                isStatic: true
            }), //down
            Bodies.rectangle(width + width / 2 - 700, (height / 2) - (height / 2) + 220, width / 5, 25, {
                angle: -Math.PI / 4,
                isStatic: true
            }), //down
            Bodies.rectangle(width + width / 2 - 550, (height / 2) - (height / 2) + 720, width / 3, 25, {
                angle: Math.PI / 4,
                isStatic: true
            }), //down

            Bodies.rectangle(width + width / 2, (height / 2) - (height / 2) + 175, width / 3.5, 25, {isStatic: true}), //down
            Bodies.rectangle(width + width / 2 - 50, (height / 2) - (height / 2) + 500, 25, width / 4, {isStatic: true}), //down
            Bodies.rectangle(width + width / 2 - 550, (height / 2) - (height / 2) + 770, width / 3, 25, {isStatic: true}), //down
            Bodies.rectangle(width + width / 2 + 600, (height / 2) - (height / 2) + 770, width / 8, width / 8, {isStatic: true}), //down
            Bodies.rectangle(width + width / 2 + 600, (height / 2) - (height / 2) + 150, width / 9, width / 9, {
                angle: Math.PI / 4,
                isStatic: true
            }), //down

            /* крест */
            Bodies.rectangle(width + width / 2 + 600, (height / 2) - (height / 2) + 400, 25, width / 3, {
                angle: Math.PI / 4,
                isStatic: true
            }), //down
            Bodies.rectangle(width + width / 2 + 600, (height / 2) - (height / 2) + 400, 25, width / 3, {
                angle: -Math.PI / 4,
                isStatic: true
            }), //down
            /* */

            Bodies.rectangle(width + width / 2 - 850, (height / 2) - (height / 2) + 400, 25, width / 2.7, {isStatic: true}), //down
            Bodies.rectangle(width + width / 2 + 600, (height / 2) - (height / 2) + 520, width / 2, 25, {isStatic: true}), //down

        ]);

        // Events.on(this.engine, 'collisionActive', (...event) => {
        //     console.log('Player: collision',event);
        //     //player.body is in e.pair, do stuff with it
        // });

        Events.on(this.render, 'beforeRender', () => {
            // console.log('Simulation: beforeRender');
            let allBodies = [...this.world.bodies];

            this.world.composites.forEach((item) => {
                return item.bodies.forEach((body) => {
                    allBodies.push(body);
                });
            });

            let units = allBodies.filter((body) => {
                return body.label === 'unit';
            });

            let bodies = allBodies.filter((body) => {

                return true;//body.label !== 'unit';
            });


            units.forEach((unit) => {
                unit.rayLength = 100;
                let startPoint = unit.position,
                    rayDirection = Vector.rotate({x: 1, y: 0}, unit.angle);
                unit.raysCollisions = [
                    raycast(bodies, startPoint, rayDirection, unit.rayLength * 3, (item) => {
                        return item !== unit;
                    }),
                    raycast(bodies, startPoint, Vector.rotate(rayDirection, Math.PI / 4), unit.rayLength, (item) => {
                        return item !== unit;
                    }),
                    raycast(bodies, startPoint, Vector.rotate(rayDirection, -(Math.PI / 4)), unit.rayLength, (item) => {
                        return item !== unit;
                    }),
                    // raycast(bodies, startPoint, Vector.rotate(rayDirection, Math.PI / 8), rayLength, (item) => {
                    //     return item !== unit;
                    // }),
                    // raycast(bodies, startPoint, Vector.rotate(rayDirection, -(Math.PI / 8)), rayLength, (item) => {
                    //     return item !== unit;
                    // }),
                ];
            });

        });

        Events.on(this.engine, 'collisionActive', function (event) {
            event.pairs.forEach((collision) => {
                if (collision.bodyA.label === 'unit') {
                    collision.bodyA.collisionCount += 1;
                }
                if (collision.bodyB.label === 'unit') {
                    collision.bodyB.collisionCount += 1;
                }
            });
            //console.log('collisionStart: ', [...event.pairs]);
            // do something with the pairs that have started collision
        });
        // Events.on(this.engine, 'collisionStart', function (event) {
        //     console.log('collisionStart: ', [...event.pairs]);
        //     // do something with the pairs that have started collision
        // });

        Events.on(this.render, 'afterRender', () => {

            let context = this.render.context,
                allBodies = [...this.world.bodies],
                render = this.render;

            this.world.composites.forEach((item) => {
                return item.bodies.forEach((body) => {
                    allBodies.push(body);
                });
            });

            let units = allBodies.filter((body) => {
                return body.label === 'unit';
            });


            units.forEach((unit) => {
                let startPoint = unit.position;

                let collisions = unit.raysCollisions;

                collisions.forEach((collision) => {

                    Render.startViewTransform(render);

                    context.beginPath();
                    context.arc(startPoint.x, startPoint.y, 10, 0, 2 * Math.PI);
                    context.stroke();

                    if (collision.point) {
                        context.beginPath();
                        context.moveTo(startPoint.x, startPoint.y);
                        context.lineTo(collision.point.x, collision.point.y);

                        // console.log('collisions: ', collisions);
                        context.strokeStyle = '#F88';
                        context.lineWidth = 0.7;
                        context.stroke();
                    }
                    else {
                        context.beginPath();
                        context.moveTo(startPoint.x, startPoint.y);
                        context.lineTo(collision.ray.x, collision.ray.y);
                        context.strokeStyle = '#FFF';
                        context.lineWidth = 0.5;
                        context.stroke();
                    }

                    context.beginPath();
                    context.moveTo(startPoint.x, startPoint.y);
                    let ray = Vector.mult(Vector.normalise(Vector.sub(collision.ray, startPoint)), collision.maxLength * 0.1);
                    context.lineTo(startPoint.x + ray.x, startPoint.y + ray.y);
                    context.strokeStyle = '#FF0';
                    context.lineWidth = 0.9;
                    context.stroke();

                    context.fillStyle = 'rgba(255,165,0,0.7)';
                    context.fill();

                    Render.endViewTransform(render);

                    Render.startViewTransform(render);

                    context.font = "12px Georgia";
                    if (unit.score > 0) {
                        context.fillStyle = '#0F0';
                    }
                    else {
                        context.fillStyle = '#F00';
                    }

                    context.fillText(`${unit.score ? unit.score.toFixed(2) : ''}`, startPoint.x, startPoint.y);

                    // context.fillStyle = 'rgba(255,165,0,0.7)';
                    // context.fill();
                    Render.endViewTransform(render);
                });
            });
        });

        this.lookAt(this.center)
    }

    lookAt(camera) {
        Render.lookAt(this.render, {
            min: {x: camera.x - (600 * camera.z), y: camera.y - (450 * camera.z)},
            max: {x: camera.x + (600 * camera.z), y: camera.y + (450 * camera.z)}
        });
    }

    removeUnits() {
        Composite.remove(this.world, this.world.bodies.filter((item) => {
            return item.label === 'unit';
        }))
    }

    generateUnits(startX, startY, row, col, distanceX, distanceY, genereateRadius = 0) {
        let stack = Composites.stack(startX, startY, row, col, distanceX, distanceY, function (x, y) {
            const swing = genereateRadius;
            return Bodies.circle(
                x + ((Math.random() * swing) - swing / 2),
                y + ((Math.random() * swing) - swing / 2),
                10,
                {
                    label: 'unit',
                    collisionCount: 0,
                    isStatic: false,// density: 10000, friction: 10000, restitution: 200000, angle: 0
                    // isSensor: true
                });
        });

        this.addBodies([...stack.bodies]);
        return stack;
    }

    addBodies(bodies) {
        World.add(this.world, bodies);
    }
}

function raycast(bodies, start, direction, dist, filterFunc = () => (true)) {
    let normRay = Vector.normalise(direction);
    let ray = normRay;
    let collisions = Query.ray(bodies, start, Vector.add(start, Vector.mult(normRay, dist)));
    // console.log('raycast: collisions: ', collisions);
    if (collisions.length) {
        // console.log('nearestLength: ', nearestLength);
        for (let i = 0; i < dist; i++) {
            ray = Vector.mult(normRay, i);
            ray = Vector.add(start, ray);
            let bod = Query.point(bodies.filter(filterFunc), ray)[0];
            if (bod) {
                return {point: ray, body: bod, maxLength: dist, ray: ray};
            }
        }
    }
    // let point = Vector.add(ray, start);

    return {
        point: null,
        body: null,
        maxLength: dist,
        ray: Vector.add(start, Vector.mult(normRay, dist))
    }
}

/*
 export default (width, height) => {
 // let player = null;
 // create engine
 let engine = Engine.create(),
 world = engine.world;
 world.gravity = {x: 0, y: 0};

 // create renderer
 let render = Render.create({
 element: document.body,
 engine: engine,
 options: {
 width: width,
 height: height,
 showAngleIndicator: true
 }
 });

 Render.run(render);

 // create runner
 let runner = Runner.create();
 Runner.run(runner, engine);

 // add bodies
 let stack = Composites.stack(20, 20, 9, 6, 75, 75, function (x, y) {
 const swing = 100;
 switch (Math.round(Common.random(0, 1))) {

 case 0:
 if (Common.random() < 0.8) {
 return Bodies.rectangle(x + ((Math.random() * swing) - swing / 2), y + ((Math.random() * swing) - swing / 2), Common.random(20, 50), Common.random(20, 50), {isStatic: true});
 } else {
 return Bodies.rectangle(x + ((Math.random() * swing) - swing / 2), y + ((Math.random() * swing) - swing / 2), Common.random(80, 120), Common.random(20, 30), {isStatic: true});
 }
 case 1:
 let sides = Math.round(Common.random(1, 8));
 sides = (sides === 3) ? 4 : sides;
 return Bodies.polygon(x + ((Math.random() * swing) - swing / 2), y + ((Math.random() * swing) - swing / 2), sides, Common.random(20, 50), {isStatic: true});

 default:
 break;
 }
 });

 let player = Bodies.circle(400, 150, 10, {
 // isSensor: true,
 // collisionFilter: {
 //     category: 0x0011,
 //     mask: 0xFFFFFFF0,
 //     group: 1
 // }
 });
 player.label = 'Test unit';
 // player.render.strokeStyle = '#FF0000';
 // player.angle = 200;
 World.add(world, [
 stack,
 // concave,
 // walls
 player,
 Bodies.rectangle(width / 2, 25 / 2, width, 25, {isStatic: true}),
 Bodies.rectangle(width / 2, height - (25 / 2), width, 25, {isStatic: true}),
 Bodies.rectangle(width - (25 / 2), height / 2, 25, height, {isStatic: true}),
 Bodies.rectangle((25 / 2), height / 2, 25, height, {isStatic: true})
 ]);

 Events.on(render, 'afterRender', function () {
 let mouse = mouseConstraint.mouse,
 context = render.context,
 bodies = Composite.allBodies(engine.world),
 startPoint = player.position,//{x: 400, y: 100},
 rayDirection = Vector.rotate({x: 1, y: 0}, player.angle),
 endPoint = Vector.rotate({x: 1, y: 0}, player.angle );

 let collisions = [
 raycast(bodies, startPoint, rayDirection, 400, (item) => {
 return item !== player;
 }),
 raycast(bodies, startPoint, Vector.rotate(rayDirection, Math.PI / 4), 400, (item) => {
 return item !== player;
 }),
 raycast(bodies, startPoint, Vector.rotate(rayDirection, -(Math.PI / 4)), 400, (item) => {
 return item !== player;
 }),
 raycast(bodies, startPoint, Vector.rotate(rayDirection, Math.PI / 8), 400, (item) => {
 return item !== player;
 }),
 raycast(bodies, startPoint, Vector.rotate(rayDirection, -(Math.PI / 8)), 400, (item) => {
 return item !== player;
 }),
 ];
 //Query.ray(bodies, startPoint, endPoint);

 Render.startViewTransform(render);

 collisions.forEach((collision) => {
 if (collision.point) {
 context.beginPath();
 context.moveTo(startPoint.x, startPoint.y);
 context.lineTo(collision.point.x, collision.point.y);

 // console.log('collisions: ', collisions);
 context.strokeStyle = '#F88';
 context.lineWidth = 0.7;
 context.stroke();
 }
 else {
 context.beginPath();
 context.moveTo(startPoint.x, startPoint.y);
 context.lineTo(collision.ray.x, collision.ray.y);
 context.strokeStyle = '#FFF';
 context.lineWidth = 0.5;
 context.stroke();
 }
 });

 context.fillStyle = 'rgba(255,165,0,0.7)';
 context.fill();

 Render.endViewTransform(render);
 });

 // add mouse control
 let mouse = Mouse.create(render.canvas),
 mouseConstraint = MouseConstraint.create(engine, {
 mouse: mouse,
 constraint: {
 stiffness: 0.2,
 render: {
 visible: false
 }
 }
 });

 World.add(world, mouseConstraint);

 // keep the mouse in sync with rendering
 render.mouse = mouse;

 // fit the render viewport to the scene
 Render.lookAt(render, {
 min: {x: 0, y: 0},
 max: {x: width, y: height}
 });

 // context for MatterTools.Demo
 return {
 engine: engine,
 runner: runner,
 render: render,
 player: player,
 canvas: render.canvas,
 stop: () => {
 Render.stop(render);
 Runner.stop(runner);
 }
 };
 };
 */