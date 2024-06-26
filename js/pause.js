import {config} from "./config.js";
import { PlayScene } from "./scene.js";
import { game as gController } from "./space.js";
class Button {
    constructor(x, y, label, scene, callback) {
        const button = scene.add.text(x, y, label)
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#33ff00' })
            .setStyle({ fill: '#000' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => callback())
            .on('pointerover', () => button.setStyle({ fill: '#FFF' }))
            .on('pointerover', () => button.setStyle({ background: '#f39c12' }))
            .on('pointerout', () => button.setStyle({ fill: '#000', background: '#33ff00' }));
    }
}
export class PauseScene extends Phaser.Scene{
    constructor(){
        super({key: 'PauseScene'});
    }
    preload(){

    }
    create(){
        this.escape = this.input.keyboard.addKey('ESC');
        this.pausetext = this.add.text(config.width/2,config.height/2- 300, 'PAUSE', {font: '96px Perpetua Titling MT'})
        this.pausetext.setOrigin(0.5);
        this.pausetext.setPadding(10);
        this.pausetext.setStyle({fill: '#33ff00'})
        const res = new Button(config.width/2,config.height/2, 'Resume', this, this.resumegame)
        const save = new Button(config.width/2,config.height/2 +100, 'Save Game', this, gController.save)
        const exitgame = new Button(config.width/2,config.height/2 +200, 'Exit', this, gController.exitgame)
    }
    update(){
        if(this.escape.isDown){
            this.resumegame()
        }
    }
    resumegame(){
        this.scene.resume('PlayScene');
        this.scene.stop();
    }

}