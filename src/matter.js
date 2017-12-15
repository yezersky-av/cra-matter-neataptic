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
    Vertices,
    Bodies,
    Vector
} from 'matter-js';

function raycast(bodies, start, r, dist) {
    let normRay = Vector.normalise(r);
    let ray = normRay;
    let point = Vector.add(ray, start);
    for (let i = 0; i < dist; i++) {
        ray = Vector.mult(normRay, i);
        ray = Vector.add(start, ray);
        let bod = Query.point(bodies, ray)[0];
        if (bod) {
            return {point: ray, body: bod};
        }
    }
    return;
}

export default (width, height) => {
    // create engine
    let engine = Engine.create(),
        world = engine.world;

    let testUnits = new Array(30);

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
        }
    });

    let star = Vertices.fromPath('50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38'),
        concave = Bodies.fromVertices(200, 200, star);

    World.add(world, [
        stack,
        // concave,
        // walls
        Bodies.rectangle(width / 2, 25 / 2, width, 25, {isStatic: true}),
        Bodies.rectangle(width / 2, height - (25 / 2), width, 25, {isStatic: true}),
        Bodies.rectangle(width - (25 / 2), height / 2, 25, height, {isStatic: true}),
        Bodies.rectangle((25 / 2), height / 2, 25, height, {isStatic: true})
    ]);

    Events.on(render, 'afterRender', function () {
        let mouse = mouseConstraint.mouse,
            context = render.context,
            bodies = Composite.allBodies(engine.world),
            startPoint = {x: 400, y: 100},
            endPoint = mouse.position;


        let collisions = raycast(bodies, startPoint, Vector.sub(mouse.position,startPoint), 400);
        //Query.ray(bodies, startPoint, endPoint);
        // if (collisions.length) console.log('collisions: ', collisions);

        Render.startViewTransform(render);


        if (Array.isArray(collisions)) {
            context.beginPath();
            context.moveTo(startPoint.x, startPoint.y);
            context.lineTo(endPoint.x, endPoint.y);
            if (collisions.length > 0) {
                context.strokeStyle = '#fff';
            } else {
                context.strokeStyle = '#555';
            }
            context.lineWidth = 0.5;
            context.stroke();

            for (let i = 0; i < collisions.length; i++) {
                let collision = collisions[i];
                context.rect(collision.bodyA.position.x - 4.5, collision.bodyA.position.y - 4.5, 8, 8);
                context.rect(
                    collision.body.position.x - collision.penetration.x - 4,
                    collision.body.position.y - collision.penetration.y - 4,
                    8, 8);
                console.log(`collisions: ${i}`, collision);
            }
        }
        else {
            if (collisions && collisions.point) {
                context.beginPath();
                context.moveTo(startPoint.x, startPoint.y);
                context.lineTo(collisions.point.x, collisions.point.y);

                // console.log('collisions: ', collisions);
                context.strokeStyle = '#F88';
                context.lineWidth = 0.7;
                context.stroke();
            }
            else {
                context.beginPath();
                context.moveTo(startPoint.x, startPoint.y);
                context.lineTo(endPoint.x, endPoint.y);
                context.strokeStyle = '#FFF';
                context.lineWidth = 0.5;
                context.stroke();
            }

        }


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
        canvas: render.canvas,
        stop: () => {
            Render.stop(render);
            Runner.stop(runner);
        }
    };
};