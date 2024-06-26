import { PlayScene } from "./scene.js";
import { PauseScene } from "./pause.js";

export var config = {
    type: Phaser.AUTO,
    domCreateContainer: true,
    width: 700,
    height: 1500,
    parent: 'game',
    scene: [PlayScene, PauseScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    }
}

var game = new Phaser.Game(config);