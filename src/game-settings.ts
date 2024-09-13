export class GameSettings {

    relativeWidth = 224;
    relativeHeight = 256;

    lastRender = 0;
    lastTick = 0;
    tickLength = 100; // 10 fps = 100ms, 50 fps = 20ms

    explosionDelay = 150;
    saucerStartDelay = 10000;

    aliens = {
        moveDelay: 500,
        fireDelay: 1500,
    };

    player = {
        fireDelay: 500,
    };

    extent = {
        debug: false,
    };

    renderNext(tick: number): boolean {
        return tick - this.lastTick > this.tickLength;
    }
}
