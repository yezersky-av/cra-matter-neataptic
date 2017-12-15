import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
// import matterJS, {
//     Engine,
//     Render,
//     Runner,
//     Composite,
//     Composites,
//     Common,
//     Query,
//     MouseConstraint,
//     Mouse,
//     Events,
//     World,
//     Vertices,
//     Bodies,
//     Vector
// } from 'matter-js';
import matter from './matter';

class App extends Component {

    constructor(props) {
        super(props);
        this.canvas = null;
        // this.ctx = null;
        this.matter = null;
        this.player = null;
    }

    getCanvasRef = (canvas) => {
        this.canvas = canvas;
    };

    componentDidMount() {
        // if (this.canvas) {
        //     this.ctx = this.canvas.getContext('2d');
        //     this.ctx.fillRect(0, 0, this.props.width, this.props.height);
        // }
        this.matter = matter(this.props.width, this.props.height, {
            position: {
                x: 400,
                y: 100,
            },
            radius: 100,
            direction: {
                x: 0,
                y: 0,
            },
            rays: 3
        });
        console.log('matter: ', this.matter);
        this.player = this.matter.player;
        // console.log("this.player: ", this.player);
    }

    render() {
        return (
            <div className="App">
                {/*<canvas height={this.props.height} width={this.props.width} ref={this.getCanvasRef}>*/}
                {/*</canvas>*/}
            </div>
        );
    }
}

export default App;
