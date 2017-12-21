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
            interval: 10000
        };
        this.matter = null;
        this.neat = null;
        this.genoms = null;

        this.startX = 100;
        this.startY = 100;
        this.row = 6;
        this.coll = 4;
        this.distX = 250;
        this.distY = 120;
        this.genereateRadius = 10;
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

        let units = this.matter.generateUnits(this.startX, this.startY, this.coll, this.row, this.distX, this.distY, this.genereateRadius);
        this.neat = new Neat(units.bodies.length, 3, 4);
        this.genoms = this.neat.getGenome();

        units.bodies.map((unit, index) => {
            Body.setAngle(unit, Math.random() * (Math.PI * 2));
            return new Player(unit, this.genoms[index], {score: 0}, this.matter.render);
        });

        setTimeout(this.evolStep, parseInt(this.state.interval));
    }

    evolStep = () => {

        this.matter.removeUnits();
        this.genoms = this.neat.endEvaluation(0);
        console.log('neat: ', this.neat);

        let units = this.matter.generateUnits(this.startX, this.startY, this.coll, this.row, this.distX, this.distY, this.genereateRadius);
        let bots = units.bodies.map((unit, index) => {
            Body.setAngle(unit, Math.random() * (Math.PI * 2));
            return new Player(unit, this.genoms[index], {score: 0}, this.matter.render);
        });
        setTimeout(this.evolStep, parseInt(this.state.interval))
    };

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
