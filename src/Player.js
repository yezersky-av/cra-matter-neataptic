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

import bezier from 'bezier-easing';
import clamp from 'clamp';

const bezierFunc = bezier(.61,.01,.05,.99);

export default class Player {
    constructor(body, genome, populationData, render) {
        this.body = body;
        this.populationData = populationData;
        this.render = render;
        this.brain = genome;
        this.brain.score = 0;
        this.positionPrev = null;

        this.lastNormalizedOutput = new Array(4).fill(0);
        this.lastMoveVector = {x: 0, y: 0};

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
                // this.lastOutput = [...normalizedOutput];
                let defForwardMove = Vector.rotate({x: 3 * clamp(output[1], 0, 1), y: 0}, this.body.angle);
                let defBackwardMove = Vector.rotate({x: 3 * clamp(output[2], 0, 1), y: 0}, this.body.angle);
                //
                let forwardMovment = Object.assign({}, defForwardMove);
                let backwardMovment = Vector.rotate(defBackwardMove, Math.PI);

                //Body.setPosition(this.body.position, Vector.add(this.body.position, forwardMovment));
                //Body.translate(body, translation)
                try {
                    if (normalizedOutput[0] === 1 && normalizedOutput[3] === 0) {
                        Body.setAngle(this.body, this.body.angle - ((Math.PI / 180) * (output[0] * 5)));
                    } else if (normalizedOutput[0] === 0 && normalizedOutput[3] === 1) {
                        Body.setAngle(this.body, this.body.angle + ((Math.PI / 180) * (output[3] * 5)));
                    } else if (normalizedOutput[1] === 1 && normalizedOutput[2] === 1) {
                        if (output[0] > output[3])
                        {
                            Body.setAngle(this.body, this.body.angle - ((Math.PI / 180) * output[0]));
                        }
                        else if (output[0] < output[3])
                        {
                            Body.setAngle(this.body, this.body.angle + ((Math.PI / 180) * output[3]));
                        }
                    }
                    /*-------------------*/
                    if (normalizedOutput[1] === 1 && normalizedOutput[2] === 0) {
                        Body.setPosition(this.body, Vector.add(this.body.position, forwardMovment));
                    } else if (normalizedOutput[1] === 0 && normalizedOutput[2] === 1) {
                        Body.setPosition(this.body, Vector.add(this.body.position, backwardMovment))
                    } else if (normalizedOutput[1] === 1 && normalizedOutput[2] === 1) {
                        if (output[1] > output[2]) {
                            Body.setPosition(this.body, Vector.add(this.body.position, forwardMovment));
                        }
                        else if (output[1] < output[2]) {
                            Body.setPosition(this.body, Vector.add(this.body.position, backwardMovment));
                        }
                    }


                    let deltaVec = Vector.sub(this.positionPrev, this.body.position);
                    let deltaLenght = Math.sqrt(deltaVec.x * deltaVec.x + deltaVec.y * deltaVec.y);
                    let score = 0;
                    let directionOfMovement = Vector.add(deltaVec, this.lastMoveVector);
                    let directionOfMovementLength = Math.sqrt(directionOfMovement.x * directionOfMovement.x + directionOfMovement.y * directionOfMovement.y);
                    //console.log('directionOfMovementLength: ', directionOfMovementLength)
                    if (directionOfMovementLength > 5) {
                        score += ((deltaLenght * normalizedOutput[1]) * 1.5);
                        score += (normalizedOutput[1] === 1 || normalizedOutput[2] === 1) && (normalizedOutput[0] === 0 && normalizedOutput[3] === 0) ? 2 : 0;
                        score += bezierFunc(input[0]);
                        score += bezierFunc(input[1]);
                        score += bezierFunc(input[2]);

                    }
                    else {
                        score -= 1;
                    }
                    // + (deltaLenght * (normalizedOutput[2] * 1.0));
                    // console.log('deltaLenght: ', deltaLenght, ' : ', score);

                    //score += input[0] > 0.5 ? 21 : 0;

                    // score += (normalizedOutput[1] === 1 || normalizedOutput[2] === 1) && (normalizedOutput[0] === 0 && normalizedOutput[3] === 0) ? 15 : 0;

                    // score -= input[0] < 0.1 ? 30 : 0;
                    // score -= input[1] < 0.1 ? 30 : 0;
                    // score -= input[2] < 0.1 ? 30 : 0;
                    //
                    // score -= input[0] < 0.1 ? 30 : 0;
                    // score -= input[1] < 0.1 ? 30 : 0;
                    // score -= input[2] < 0.1 ? 30 : 0;


                    score -= this.body.collisionCount * 30;
                    this.body.collisionCount = 0;
                    //
                    // score -= normalizedOutput[0] === 1 ? this.brain.score * 0.5 : 0;
                    // score -= normalizedOutput[3] === 1 ? this.brain.score * 0.5 : 0;
                    this.brain.score += score;
                    if (this.brain.score < -2000) this.brain.score = -2000;
                    if (!isFinite(this.brain.score)) {
                        //console.log('!isFinite');
                        this.brain.score = 0;
                    }
                    this.body.score = this.brain.score;
                    this.lastNormalizedOutput = [...normalizedOutput];
                    this.lastMoveVector = deltaVec;
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