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

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as colors from 'material-ui/styles/colors';
import Drawer from 'material-ui/Drawer';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import UploadIcon from 'material-ui/svg-icons/file/file-upload';
import LinearProgress from 'material-ui/LinearProgress';
import {List, ListItem} from 'material-ui/List';

const muiTheme = getMuiTheme({
    palette: {
        // primary1Color: '#009688',
        // primary2Color: '#009688',
        // primary3Color: '#009688',
        // primaryColor: '#009688',
        // accent1Color: colors.red700,
        // accent2Color: colors.red700,
        // accent3Color: colors.red700,
        // disabledColor: colors.grey700
    },
    textField: {
        borderBottom: '1px solid #E0E0E0',
    }
});

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            interval: 5000,
            iterationTimeout: 100,
            populationPool: []
        };
        this.matter = null;
        this.neat = null;
        this.genoms = null;

        this.startX = 2400;
        this.startY = 100;
        this.row = 1;//6;
        this.coll = 2;//6;
        this.distX = 100;
        this.distY = 100;
        this.genereateRadius = 0;

        this.fileImport = null;
        this.players = null;

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

        this.players = units.bodies.map((unit, index) => {
            Body.setAngle(unit, Math.random() * (Math.PI * 2));
            return new Player(unit, this.genoms[index], {score: 0}, this.matter.render);
        });


        setInterval(() => {
            this.setState({
                iterationTimeout: this.state.iterationTimeout - 100
            })
        }, 100);
        setTimeout(this.evolStep, parseInt(this.state.interval));
    }

    exportPopulation() {
        console.log('exportPopulation onClick');
        let lastPopulation = this.neat.getPopulationPool()[0];
        // let population = [];
        // this.neat.getGenome().forEach((unit) => {
        //     // console.log('exportPopulation: unit: ', unit.toJSON());
        //     population.push(Object.assign({}, unit.toJSON()));
        // });
        let blob = new Blob([JSON.stringify(lastPopulation.population)]);
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = ('population_' + lastPopulation.generation + '_' + lastPopulation.score.toFixed(2) + '_' + Date.now() + ".json");//.replace(/\+/g, ' ');
        link.click();
    }

    evolStep = () => {
        this.setState({
            iterationTimeout: this.state.interval
        });
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

        this.players.forEach((player, index) => {
            delete this.players[index];
        });
        this.players = bots;
        this.setState({
            populationPool: this.neat.getPopulationPool().map((item) => {
                return (
                    <ListItem key={item.key} primaryText={'Score: ' + item.score}
                              secondaryText={'Generation: ' + item.generation}/>
                )
            })
        });
        setTimeout(this.evolStep, parseInt(this.state.interval))
    };

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div className="App">
                    <Drawer open containerStyle={{width: 300}} containerClassName="drawer">
                        <div style={{padding: '20px'}}>
                            <LinearProgress mode="determinate" value={this.state.iterationTimeout}
                                            max={this.state.interval} min={0}/>
                            <TextField floatingLabelText="Time for iteration" type="number" value={this.state.interval}
                                       onChange={this.handleOnChange}/>
                            <FlatButton label="Export popilation last" icon={<DownloadIcon/>} fullWidth primary
                                        style={{textAlign: 'left'}}
                                        onClick={this.exportPopulation}/>
                            <FlatButton label="Import popilation" icon={<UploadIcon/>} fullWidth secondary
                                        style={{textAlign: 'left'}}
                                        onClick={this.hanldeOnImportPopulation}/>
                            <input type={'file'} ref={this.fileImportRef} onChange={this.handleOnFileImportChange}
                                   hidden/>
                        </div>

                        <List>
                            {this.state.populationPool}
                        </List>
                    </Drawer>
                    {/*<div className="sidebad">*/}
                    {/*<button onClick={this.exportPopulation}>Export population</button>*/}
                    {/*<input value={this.state.interval} onChange={this.handleOnChange}/>*/}
                    {/*<button onClick={this.hanldeOnImportPopulation}>Import population</button>*/}
                    {/**/}
                    {/*</div>*/}
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
