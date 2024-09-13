export class GameState {

    // Overall game state
    game = {
        intro: true,
        start: false,
        respawn: false,
        running: false,
        end: false,
        hiScore: false,
        nextLevel: false,
        level: 1,
    };

    player = {
        alive: true,
        score: 0,
        highScore: 0,
        lives: 2,
    };

}
