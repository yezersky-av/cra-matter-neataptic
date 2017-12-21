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
import * as neataptic from 'neataptic';
import Matter from './matter';
import Neat from './Neat';
import Player from './Player';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            interval: 5000
        };
        this.matter = null;
        this.neat = null;
        this.genoms = null;

        this.startX = 2400;
        this.startY = 100;
        this.row = 5;//6;
        this.coll = 5;//6;
        this.distX = 100;
        this.distY = 100;
        this.genereateRadius = 0;

        this.fileImport = null;

        this.fileImportRef = this.fileImportRef.bind(this);
        this.exportPopulation = this.exportPopulation.bind(this);
        this.hanldeOnImportPopulation = this.hanldeOnImportPopulation.bind(this);
        this.handleOnFileImportChange = this.handleOnFileImportChange.bind(this);
    }

    handleOnChange = (event) => {
        this.setState({interval: event.target.value});
    };

    fileImportRef(el) {
        this.fileImport = el;
    }

    hanldeOnImportPopulation() {
        this.fileImport.click();
    }

    handleOnFileImportChange(event) {
        let files = event.target.files; // FileList object
        let reader = new FileReader();

        console.log('handleOnFileImportChange: ', files);
        reader.onload = ((file) => {
            console.log('handleOnFileImportChange: onload: ', file);

            let JSONpopulation = JSON.parse(file.target.result);
            let population = JSONpopulation.map((item) => {
                return neataptic.Network.fromJSON(item);
            });
            this.neat.setPopulation(population);
        });
        reader.readAsText(files[0]);

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

    exportPopulation() {
        console.log('exportPopulation onClick');
        // let population = [];
        // this.neat.getGenome().forEach((unit) => {
        //     // console.log('exportPopulation: unit: ', unit.toJSON());
        //     population.push(Object.assign({}, unit.toJSON()));
        // });
        let blob = new Blob([JSON.stringify(this.neat.getGenome())]);
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = ('population_' + this.neat.getGeneration() + '_' + this.neat.getCurentPopulationAvarageScore().toFixed(2) + '_' + Date.now() + ".json");//.replace(/\+/g, ' ');
        link.click();
    }

    evolStep = () => {

        this.matter.removeUnits();
        this.genoms = this.neat.endEvaluation(0);
        console.log('neat: ', this.neat.getGenome());
        // console.log('neat: ', this.neat.getGenome()[0].score);
        // console.log('neat: ', [...this.neat.getGenome()[0].selfconns]);
        // console.log('neat: json: ', JSON.stringify(this.neat.getGenome()[0]));

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
                <button onClick={this.exportPopulation}>Export population</button>
                <input value={this.state.interval} onChange={this.handleOnChange}/>
                <button onClick={this.hanldeOnImportPopulation}>Import population</button>
                <input type={'file'} ref={this.fileImportRef} onChange={this.handleOnFileImportChange} hidden/>
                {/*<canvas height={this.props.height} width={this.props.width} ref={this.getCanvasRef}>*/}
                {/*</canvas>*/}
            </div>
        );
    }
}

export default App;
