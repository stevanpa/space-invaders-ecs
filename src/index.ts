import './index.css';
import {Game} from "./game";

if (process.env.NODE_ENV !== 'production') {
    console.log('Looks like we are in development mode!');
}

const game = new Game();
