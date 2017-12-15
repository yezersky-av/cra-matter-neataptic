import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import matter from './matter';

class App extends Component {

    constructor(props) {
        super(props);
        this.canvas = null;
        this.ctx = null;
        this.matter = null;
    }

    getCanvasRef = (canvas) => {
        this.canvas = canvas;
    };

    componentDidMount() {
        // if (this.canvas) {
        //     this.ctx = this.canvas.getContext('2d');
        //     this.ctx.fillRect(0, 0, this.props.width, this.props.height);
        // }
        this.matter = matter(this.props.width, this.props.height);
        console.log('matter: ', this.matter);
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
