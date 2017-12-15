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

function raycast(bodies, start, direction, dist, filterFunc = () => (true)) {
    let normRay = Vector.normalise(direction);
    let ray = normRay;
    // let point = Vector.add(ray, start);
    for (let i = 0; i < dist; i++) {
        ray = Vector.mult(normRay, i);
        ray = Vector.add(start, ray);
        let bod = Query.point(bodies.filter(filterFunc), ray)[0];
        if (bod) {
            return {point: ray, body: bod};
        }
    }
    return null;
}

function drawPlayer(player, context) {

    context.beginPath();
    context.arc(player.position.x, player.position.y, player.radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#003300';
    context.stroke();
}

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
    Body.rotate(player, Math.PI / 2);
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
        // Body.setAngle(player, Math.random() * Math.PI / 180);
        let mouse = mouseConstraint.mouse,
            context = render.context,
            bodies = Composite.allBodies(engine.world),
            startPoint = player.position,//{x: 400, y: 100},
            rayDirection = Vector.rotate({x: 1, y: 0}, player.angle/* * (180 / Math.PI)*/),
            endPoint = Vector.rotate({x: 1, y: 0}, player.angle /* * (180 / Math.PI)*/);//mouse.position;
        console.log('endPoint: ', endPoint);

        let collisions = [
            raycast(bodies, startPoint, rayDirection, 400, (item) => {
                return item !== player;
            }), raycast(bodies, startPoint, Vector.rotate(rayDirection, 45), 400, (item) => {
                return item !== player;
            }), raycast(bodies, startPoint, Vector.rotate(rayDirection, -45), 400, (item) => {
                return item !== player;
            })
        ];
        console.log('collisions: ', collisions);
        //Query.ray(bodies, startPoint, endPoint);

        Render.startViewTransform(render);

        collisions.forEach((collision) => {
            if (collision && collision.point) {
                context.beginPath();
                context.moveTo(startPoint.x, startPoint.y);
                context.lineTo(collision.point.x, collision.point.y);

                // console.log('collisions: ', collisions);
                context.strokeStyle = '#F88';
                context.lineWidth = 0.7;
                context.stroke();
            }
            // else {
            //     context.beginPath();
            //     context.moveTo(startPoint.x, startPoint.y);
            //     context.lineTo(endPoint.x * 400 + startPoint.x, endPoint.y * 400 + startPoint.y);
            //     context.strokeStyle = '#FFF';
            //     context.lineWidth = 0.5;
            //     context.stroke();
            // }
        });


        // if (Array.isArray(collisions)) {
        //     context.beginPath();
        //     context.moveTo(startPoint.x, startPoint.y);
        //     context.lineTo(endPoint.x, endPoint.y);
        //     if (collisions.length > 0) {
        //         context.strokeStyle = '#fff';
        //     } else {
        //         context.strokeStyle = '#555';
        //     }
        //     context.lineWidth = 0.5;
        //     context.stroke();
        //
        //     for (let i = 0; i < collisions.length; i++) {
        //         let collision = collisions[i];
        //         context.rect(collision.bodyA.position.x - 4.5, collision.bodyA.position.y - 4.5, 8, 8);
        //     }
        // }
        // else {
        //     if (collisions && collisions.point) {
        //         context.beginPath();
        //         context.moveTo(startPoint.x, startPoint.y);
        //         context.lineTo(collisions.point.x, collisions.point.y);
        //
        //         // console.log('collisions: ', collisions);
        //         context.strokeStyle = '#F88';
        //         context.lineWidth = 0.7;
        //         context.stroke();
        //     }
        //     else {
        //         context.beginPath();
        //         context.moveTo(startPoint.x, startPoint.y);
        //         context.lineTo(endPoint.x * 400 + startPoint.x, endPoint.y * 400 + startPoint.y);
        //         context.strokeStyle = '#FFF';
        //         context.lineWidth = 0.5;
        //         context.stroke();
        //     }
        // }

        context.fillStyle = 'rgba(255,165,0,0.7)';
        context.fill();

        Render.endViewTransform(render);
        console.log("player: ", player);
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