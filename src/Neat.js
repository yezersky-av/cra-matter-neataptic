import * as neataptic from 'neataptic';

// const WIDTH = $('#field').width();
// const HEIGHT = 800;

// const MAX_AREA = 10000;
// const MIN_AREA = 400;
//
// const RELATIVE_SIZE = 1.1;
// const DECREASE_SIZE = 0.998;
//
// const DETECTION_RADIUS = 150;
// const FOOD_DETECTION = 3;
// const PLAYER_DETECTION = 3;
//
// const MIN_SPEED = 0.6;
// const SPEED = 3;
//
// const FOOD_AREA = 80;
// const FOOD_AMOUNT = Math.round(WIDTH * HEIGHT * 4e-4);
//
// // GA settings
// const PLAYER_AMOUNT = Math.round(WIDTH * HEIGHT * 8e-5);
// const ITERATIONS = 1000;
const START_HIDDEN_SIZE = 3;
const mutation_RATE = 0.5;
const ELITISM_PERCENT = 0.1;

// Trained population
const USE_TRAINED_POP = true;

export default class Neat {
    constructor(popsize, input, output) {
        console.log('neataptic: ', neataptic);

        this.populationPool = [];

        this.neat = new neataptic.Neat(
            input,//1 + PLAYER_DETECTION * 3 + FOOD_DETECTION * 2,
            output,//2,
            null,
            // function (genome) {
            //     console.log('fitness: ', genome);
            // },
            {
                mutation: [
                    neataptic.methods.mutation.ALL,
                    // neataptic.methods.mutation.ADD_NODE,
                    // neataptic.methods.mutation.SUB_NODE,
                    // neataptic.methods.mutation.ADD_CONN,
                    // neataptic.methods.mutation.SUB_CONN,
                    // neataptic.methods.mutation.MOD_WEIGHT,
                    // neataptic.methods.mutation.MOD_BIAS,
                    // neataptic.methods.mutation.MOD_ACTIVATION,
                    // neataptic.methods.mutation.ADD_SELF_CONN,
                    // neataptic.methods.mutation.SUB_SELF_CONN,
                    // neataptic.methods.mutation.ADD_GATE,
                    // neataptic.methods.mutation.SUB_GATE,
                    // neataptic.methods.mutation.ADD_BACK_CONN,
                    // neataptic.methods.mutation.SUB_BACK_CONN,
                    // neataptic.methods.mutation.SWAP_NODES,
                ],
                popsize: popsize,
                mutationRate: mutation_RATE,
                elitism: Math.round(ELITISM_PERCENT * popsize),
                network: new neataptic.architect.Random(
                    input,//1 + PLAYER_DETECTION * 3 + FOOD_DETECTION * 2,
                    START_HIDDEN_SIZE,
                    output,//2,
                )
            }
        );

        if (USE_TRAINED_POP) {
            //this.neat.population = population;
        }
    }

    getGenome() {
        let players = [];
        let highestScore = 0;


        return this.neat.population;
        // for (let genome in neat.population) {
        //     genome = neat.population[genome];
        //     new Player(genome);
        // }]
    }

    endEvaluation() {
        console.log('Generation:', this.neat.generation);//, ' populationScore: ', this.neat.getFittest());//, '- average score:', this.neat.getAverage());
        if (this.neat.generation % 10 === 0) {
            this.populationPool.forEach((population) => {
                console.log('population: : generation: ', population.generation, ' score: ', population.score);
            })
        }

        let populationScore = 0;
        this.neat.population.forEach((item) => {
            if (item.score) {
                populationScore += item.score;
            }
        });

        this.neat.sort();
        // this.populationPool.push({
        //     generation: this.neat.generation,
        //     score: populationScore / this.neat.population.length,
        //     population: [...this.neat.population]
        // });
        let newPopulation = [];

        // Elitism
        for (let i = 0; i < this.neat.elitism; i++) {
            newPopulation.push(this.neat.population[i]);
        }

        // Breed the next individuals
        for (let i = 0; i < this.neat.popsize - this.neat.elitism; i++) {
            newPopulation.push(this.neat.getOffspring());
        }
        // Replace the old population with the new population
        this.neat.population = newPopulation;
        this.neat.mutate();

        this.neat.generation++;
        return this.getGenome();
    }
}