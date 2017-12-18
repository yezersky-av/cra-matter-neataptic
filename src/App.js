import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import matterJS, {
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
    Body,
    Vector
} from 'matter-js';
import Matter from './matter';
import Neat from './Neat';
import Player from './Player';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            interval: 2000
        };
        this.matter = null;
        this.neat = null;
        this.genoms = null;
    }

    handleOnChange = (event) => {
        this.setState({interval: event.target.value});
    }

    componentDidMount() {
        // if (this.canvas) {
        //     this.ctx = this.canvas.getContext('2d');
        //     this.ctx.fillRect(0, 0, this.props.width, this.props.height);
        // }
        this.matter = new Matter(this.props.width, this.props.height);
        console.log('matter: ', this.matter);
        const startX = 300;
        const startY = 150;
        const row = 5;
        const coll = 3;
        const distX = 250;
        const distY = 120;
        const genereateRadius = 10;
        let units = this.matter.generateUnits(startX, startY, coll, row, distX, distY, genereateRadius);
        this.neat = new Neat(units.length, 3, 4);
        this.genoms = this.neat.getGenome();

        units.bodies.map((unit, index) => {
            Body.setAngle(unit, Math.random() * (Math.PI * 2));
            return new Player(unit, this.genoms[index], {score: 0}, this.matter.render);
        });

        setTimeout(this.evolStep, parseInt(this.state.interval));

        // setInterval(() => {
        //     this.matter.removeUnits();
        //     this.genoms = this.neat.endEvaluation(0);
        //     let units = this.matter.generateUnits(startX, startY, coll, row, distX, distY, genereateRadius);
        //     let bots = units.bodies.map((unit, index) => {
        //         Body.setAngle(unit, Math.random() * (Math.PI * 2));
        //         return new Player(unit, this.genoms[index], {score: 0}, this.matter.render);
        //     });
        // }, parseInt(this.state.interval));
        // let units = this.matter.generateUnits(200, 150, 4, 4, 50, 50);
        // units.bodies.map((unit,index) => {
        //     Body.setAngle(unit, Math.random() * (Math.PI * 2));
        //     return new Player(unit, genoms[index], this.matter.render);
        // })
    }

    evolStep = () => {
        const startX = 300;
        const startY = 150;
        const row = 5;
        const coll = 3;
        const distX = 250;
        const distY = 120;
        const genereateRadius = 10;

        this.matter.removeUnits();
        this.genoms = this.neat.endEvaluation(0);
        console.log('neat: ', this.neat);

        let units = this.matter.generateUnits(startX, startY, coll, row, distX, distY, genereateRadius);
        let bots = units.bodies.map((unit, index) => {
            Body.setAngle(unit, Math.random() * (Math.PI * 2));
            return new Player(unit, this.genoms[index], {score: 0}, this.matter.render);
        });
        setTimeout(this.evolStep, parseInt(this.state.interval))
    }

    render() {
        return (
            <div className="App">
                <input value={this.state.interval} onChange={this.handleOnChange}/>
                {/*<canvas height={this.props.height} width={this.props.width} ref={this.getCanvasRef}>*/}
                {/*</canvas>*/}
            </div>
        );
    }
}

export default App;
