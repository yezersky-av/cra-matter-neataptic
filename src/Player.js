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
    Bodies,
    Vector
} from 'matter-js';

export default class Player {
    constructor(body, genome, populationData, render) {
        this.body = body;
        this.populationData = populationData;
        this.render = render;
        this.brain = genome;
        this.brain.score = 0;
        this.positionPrev = null;

        Events.on(this.render, 'beforeRender', () => {
            if (!this.positionPrev) this.positionPrev = this.body.position;
            // console.log('Player: beforeRender:',this.body.raysCollisions);

            if (this.body && this.body.raysCollisions) {
                let input = this.body.raysCollisions.map((rayCast, index) => {
                    let ray = {
                        x: rayCast.ray.x - this.body.position.x,
                        y: rayCast.ray.y - this.body.position.y
                    };
                    return ((1 / rayCast.maxLength) * Math.sqrt(ray.x * ray.x + ray.y * ray.y));
                });
                let output = this.brain.activate(input);
                let normalizedOutput = output.map((item) => {
                    return Math.round(item);
                });
                let defForwardMove = Vector.rotate({x: 5 * output[1], y: 0}, this.body.angle);
                let defBackwardMove = Vector.rotate({x: 5 * output[2], y: 0}, this.body.angle);
                let forwardMovment = Object.assign({}, defForwardMove);
                let backwardMovment = Vector.rotate(defBackwardMove, Math.PI);

                //Body.setPosition(this.body.position, Vector.add(this.body.position, forwardMovment));
                //Body.translate(body, translation)
                try {
                    if (normalizedOutput[1] === 1) {
                        Body.setPosition(this.body, Vector.add(this.body.position, forwardMovment));
                        // this.body.position = Vector.add(this.body.position, forwardMovment);
                    }
                    if (normalizedOutput[2] === 1) {
                        Body.setPosition(this.body, Vector.add(this.body.position, backwardMovment));
                        // this.body.position = Vector.add(this.body.position, backwardMovment);
                    }

                    if (normalizedOutput[0] === 1) {
                        Body.setAngle(this.body, this.body.angle - (Math.PI / 8) * output[0]);
                        // this.body.angle -= Math.PI / 180;
                    }
                    if (normalizedOutput[3] === 1) {
                        Body.setAngle(this.body, this.body.angle + (Math.PI / 8) * output[3]);
                        // this.body.angle += Math.PI / 180;
                    }
                    // this.body.positionPrev = this.body.position;
                    // this.body.anglePrev = this.body.angle;
                    // this.body.angularVelocity = 0;
                    // this.body.angularSpeed = 0;
                    // this.body.inertia = 1;
                    // this.body.speed = 1;
                    // this.body.inertia = 99999999;
                    // this.body.speed = 0;
                    let deltaVec = Vector.sub(this.positionPrev, this.body.position);
                    let deltaLenght = Math.sqrt(deltaVec.x * deltaVec.x + deltaVec.y * deltaVec.y);
                    let score = (deltaLenght * normalizedOutput[1] * 1.2) + (deltaLenght * (normalizedOutput[2] * 0.01));
                    score -= input[0] < 0.003?1.5:0;
                    score -= normalizedOutput[0] === 1 ?0.01:0;
                    score -= normalizedOutput[3] === 1 ?0.01:0;
                    this.brain.score += score;
                    if (!isFinite(this.brain.score)) {
                        //console.log('!isFinite');
                        this.brain.score = 0;
                    }
                    this.body.score = this.brain.score;
                    //this.populationData.score += this.body.score;
                    // console.log('this.brain: ', this.brain);

                }
                catch (e) {
                    console.error(e);
                }
                this.positionPrev = Object.assign({}, this.body.position);
            }


            //console.log('Player: input: ', output);
        });

        Events.on(this.render, 'afterRender', () => {
            // console.log('Player: afterRender:');
        });


    }
}