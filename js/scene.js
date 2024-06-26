import { game as gController } from "./space.js";
import {config} from "./config.js";
class RedLaser extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene, x,y,'redlaser')
        this.scaleX = 0.05;
        this.scaleY = 0.05;
    }
    fire(x, y, speedx, speedy){
        this.body.reset(x,y);
        this.body.enable=true;
        this.setActive(true);
        this.setVisible(true);
    
        this.setVelocityY(speedy);
        this.setVelocityX(speedx);
    }
}
class RedLaserGroup extends Phaser.Physics.Arcade.Group{
    constructor(scene){
        super(scene.physics.world, scene);
        this.allred = [];
        this.createMultiple({
            classType:RedLaser,
            frameQuantity: 100,
            active: false,
            visible: false,
            key: 'redlaser'
        })
    }
    firelaser(x,y, speedx, speedy){
        const laser = this.getFirstDead(false);
        if (laser){
            laser.setSize(30,30);
            this.allred.push(laser);
            laser.fire(x,y, speedx, speedy);
        }else this.createMultiple({
            classType:RedLaser,
            frameQuantity: 100,
            active: false,
            visible: false,
            key: 'redlaser'
        })
    }
}
class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene,x,y,'ufo')
        this.scaleX = 1;
        this.scaleY = 1;
        this.maxhealth = 10;
        this.health = this.maxhealth;
        this.veloc = 0;
        this.shoot = false;
    }
    sent(){
        this.veloc = Math.floor(Math.random() * 3) +1;
        this.rand = Math.floor(Math.random() * 2);
        if(this.rand){
            this.startpos = -config.width -300;
        }
        else this.startpos = config.width + 300;
        this.body.reset(config.width + 300,100);
        this.body.setImmovable(true);
        this.body.enable = true;
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(-100 * this.veloc);
        this.play('ufor');
    }
    damaged(){
        this.health -= 1;
        if(this.health <= 0){
            this.body.enable = false;
            this.visible = false;
            this.active = false;
            if(this.veloc < 0){
                this.veloc = -this.veloc;
            }
            gController.addPoints(150+ 10*this.veloc)
            this.health = this.maxhealth
        }
        console.log(this.health);
    }
}

class EnemyGroup extends Phaser.Physics.Arcade.Group{
    constructor(scene){
        super(scene.physics.world, scene);
        this.ufonew=false;
        this.chance = 3;
        this.allenemies=this.createMultiple({
            classType:Enemy,
            frameQuantity: 3,
            active: false,
            visible: false,
            key: 'ufo'
        })
        setTimeout(() => {
            this.ufonew = true;
        }, 1000);
    }
    sendufo(){
        const ufo = this.getFirstDead(false);
        if(this.ufonew){
            if(ufo){
                this.rand = Math.floor(Math.random() * this.chance +1);
                if(this.rand == this.chance){
                    ufo.sent();
                    setTimeout(() => {
                        ufo.shoot = true;
                    }, 2000);
                }this.ufonew = false;
                setTimeout(() => {
                    this.ufonew = true;
                }, 5000);
            }
            else this.allenemies = this.allenemies.concat(this.createMultiple({
                classType:Enemy,
                frameQuantity: 3,
                active: false,
                visible: false,
                key: 'ufo'
            }))
        }
    }
}



class Rock extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene,x,y,'asteroid')
        this.rand = Math.floor(Math.random() * 3) +1;
        this.scaleX = 0.05*this.rand;
        this.scaleY = 0.05*this.rand;
        this.maxhealth = (this.rand*2) + 1;
        this.health = this.maxhealth;
        this.veloc = 0;
    }
    fall(x){
        this.veloc = Math.floor(Math.random() * 5) +1;
        this.body.reset(x,0);
        this.body.setImmovable(true);
        this.body.enable = true;
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityY(300*this.veloc/2 );
        
    }
    damaged(){
        this.health -= 1;
        if(this.health <= 0){
            this.body.enable = false;
            this.visible = false;
            this.active = false; 
            gController.addPoints(10*this.rand + 5*this.veloc)
            this.health = this.maxhealth;
        }console.log(this.health);
    }
}

class RockGroup extends Phaser.Physics.Arcade.Group{
    constructor(scene){
        super(scene.physics.world, scene);
        this.fall=false;
        this.chance=2;
        this.allrocks = [];
        this.createMultiple({
            classType:Rock,
            frameQuantity: 10,
            active: false,
            visible: false,
            key: 'asteroid'
        })
        setTimeout(() => {
            this.fall = true;
        }, 1000);
    }
    asteroidfall(){
        const ast = this.getFirstDead(false);
        if(this.fall){
            if(ast){
                this.allrocks.push(ast);
                this.rand = Math.floor(Math.random() * this.chance +1) +1;
                if(this.rand == this.chance){
                    this.pos = Math.floor(Math.random() * 700);
                    ast.fall(this.pos);
                    
                }this.fall = false;
                setTimeout(() => {
                    this.fall = true;
                }, 1000);
            }
            else this.createMultiple({
                classType:Rock,
                frameQuantity: 10,
                active: false,
                visible: false,
                key: 'asteroid',
            })
        }
    }
}

class Laser extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene,x,y,'laser')
        this.scaleX = 0.05;
        this.scaleY = 0.05;
    }
    fire(x,y){
        this.body.reset(x,y);
        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(-1500);
        
    }
}
class LaserGroup extends Phaser.Physics.Arcade.Group{
    constructor(scene){
        super(scene.physics.world, scene);
        this.shoot=true
        this.allblue = [];
        this.createMultiple({
            classType:Laser,
            frameQuantity: 20,
            active: false,
            visible: false,
            key: 'laser',
        })
        scene.physics.add.existing(this);
    }
    firelaser(x,y){
        if(this.shoot){
            const laser = this.getFirstDead(false);
            if (laser){
                laser.fire(x,y);
                this.allblue.push(laser)
                this.shoot = false;
                setTimeout(() => {
                    this.shoot = true;
                }, 100)
        }   else this.createMultiple({
                classType:Laser,
                frameQuantity: 20,
                active: false,
                visible: false,
                key: 'laser',
            })
        }
    }
}
export class PlayScene extends Phaser.Scene{
    constructor (){
        super({key: 'PlayScene'});
        this.variables = gController.init(()=>null);
        if(this.variables[0]){
            this.scene = this.variables[2];
        }
        this.player = this.variables[1];
        this.second = true;
    }

    preload() {  
        this.load.spritesheet('ship', this.player.sprite, {frameWidth: 80, frameHeight: 80}, 16);
        this.load.image('laser', '../resources/bullet.png');
        this.load.image('redlaser', '../resources/redbullet.png');
        this.load.image('asteroid', '../resources/Asteroid.png');
        this.load.spritesheet('ufo', '../resources/ufo1.png', {frameWidth: 200, frameHeight: 80}, 30);
        this.load.image('background', '../resources/space_background2.jpg');
    }

    create() {
        this.add.image(350,500,'background');
        this.LaserGroup = new LaserGroup(this);
        this.RedLaserGroup = new RedLaserGroup(this);
        this.RockGroup = new RockGroup(this);
        this.EnemyGroup = new EnemyGroup(this);
        this.cameras.main.setBackgroundColor(0xBFFCFF);
        this.ship = this.physics.add.sprite(this.player.position[0], this.player.position[1], 'ship');
        this.createanimations();
        this.ship.body.setImmovable(true);
        this.spacebar = this.input.keyboard.addKey('SPACE');
        this.escape = this.input.keyboard.addKey('ESC');
        this.cursors=this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.ship, this.RedLaserGroup, this.playerHit, null, this);
        this.physics.add.collider(this.RockGroup, this.ship, this.playerHit, null, this);
        this.physics.add.collider(this.ship, this.EnemyGroup, this.playerHit, null, this);
        this.physics.add.collider(this.LaserGroup, this.RockGroup, this.enemyHit, null, this);
        this.physics.add.collider(this.LaserGroup, this.EnemyGroup, this.enemyHit, null, this);
        this.ship.body.setSize(30,30);
        this.veil = this.add.graphics();
        this.veil.fillStyle('0x000000', 0.3);
        this.veil.fillRect(0,0, config.width, config.height);
        this.veil.visible = false;
        this.score = this.add.text(0,0,'SCORE: ', {font: '32px Perpetua Titling MT'});
        this.score.setStyle({fill: '#33ff00'});
        this.p = this.add.text(120,0, gController.getPoints(), {font: '32px Perpetua Titling MT'});
        this.p.setStyle({fill: '#33ff00'});
        this.time = this.add.text(350,0,'TIME: ', {font: '32px Perpetua Titling MT'});
        this.time.setStyle({fill: '#33ff00'});
        this.counter = this.add.text(470,0,gController.getTime(), {font: '32px Perpetua Titling MT'});
        this.counter.setStyle({fill: '#33ff00'});
    }

    update() {
        this.p.setText(gController.getPoints());
        if(this.second){
            this.second = false;
            gController.nextSecond();
            this.counter.setText(gController.getTime())
            setTimeout(() => {
                this.second = true;
            }, 1000);
        }
        this.veil.visible = false;
        this.ship.setVelocityX(0);
        this.ship.setVelocityY(0);
        if(this.cursors.up.isDown){
            if(this.cursors.left.isDown){
                if(this.ship.y > 30)this.ship.setVelocityY(-(this.player.speed)/Math.sqrt(2));
                if(this.ship.x > 30)this.ship.setVelocityX(-(this.player.speed)/Math.sqrt(2));
                if(this.ship.anims.currentAnim.key != "goUpLeft")this.ship.anims.play("goUpLeft");
            }
            else if(this.cursors.right.isDown){
                if(this.ship.y > 30)this.ship.setVelocityY(-(this.player.speed)/Math.sqrt(2));
                if(this.ship.x < (config.width - 30))this.ship.setVelocityX((this.player.speed)/Math.sqrt(2));
                if(this.ship.anims.currentAnim.key != "goUpRight")this.ship.anims.play("goUpRight");
            }
            else{
                if(this.ship.y > 30)this.ship.setVelocityY(-(this.player.speed));
                if(this.ship.anims.currentAnim.key != "goUp")this.ship.anims.play("goUp");
            } 
        }else if(this.cursors.down.isDown){
            if(this.cursors.left.isDown){
                if(this.ship.y < (config.height - 30))this.ship.setVelocityY((this.player.speed)/Math.sqrt(2));
                if(this.ship.x > 30)this.ship.setVelocityX(-(this.player.speed)/Math.sqrt(2));
                if(this.ship.anims.currentAnim.key != "goDownLeft")this.ship.anims.play("goDownLeft");
            }
            else if(this.cursors.right.isDown){
                if(this.ship.y < (config.height - 30))this.ship.setVelocityY((this.player.speed)/Math.sqrt(2));
                if(this.ship.x < (config.width - 30))this.ship.setVelocityX((this.player.speed)/Math.sqrt(2));
                if(this.ship.anims.currentAnim.key != "goDownRight")this.ship.anims.play("goDownRight");
            }
            else{
                if(this.ship.y < (config.height - 30))this.ship.setVelocityY((this.player.speed));
                if(this.ship.anims.currentAnim.key != "goDown")this.ship.anims.play("goDown");
            } 
        }else if(this.cursors.right.isDown){
            if(this.ship.x < (config.width - 30))this.ship.setVelocityX(this.player.speed);
            if(this.ship.anims.currentAnim.key != "goRight")this.ship.anims.play("goRight");
        }else if(this.cursors.left.isDown){
            if(this.ship.x > 30)this.ship.setVelocityX(-(this.player.speed));
            if(this.ship.anims.currentAnim.key != "goLeft")this.ship.anims.play("goLeft");
        }else if(this.ship.anims.currentAnim.key != "idle")this.ship.anims.play("idle");

        if(this.spacebar.isDown){
            this.shootLaser();
        }if(this.escape.isDown){
            this.pause = false;
            this.scene.launch('PauseScene');
            this.veil.visible = true;
            this.scene.pause();
        }this.fallAsteroid();
        this.sendEnemy();
        this.EnemyGroup.allenemies.forEach(c => {
            if(c.x > 700){
                if(c.veloc > 0){
                    c.veloc = -c.veloc;
                    c.setVelocityX(100 * c.veloc);
                }
            }else if(c.x < 0){
                if(c.veloc < 0){
                    c.veloc = -c.veloc;
                    c.setVelocityX(100 * c.veloc);
                }
            }
            if(c.shoot && c.active){
                this.enemyShoot(c.x, c.y);
                c.shoot = false;
                setTimeout(() => {
                    c.shoot = true;
                }, 3000);
            }
        });
    }
    playerHit(){
        if (!this.player.invincible){
            this.player.getHit();
            if (!this.player.dead){
                this.ship.body.checkCollision.none = true;
                this.ship.alpha = 0.75;
                setTimeout(() => {
                    this.ship.body.checkCollision.none = false;
                    this.ship.alpha = 1;
                }, 3000);
            }else {
                this.ship.body.enable = false;
                alert("HAS MORT \nPUNTS FINALS: " + gController.getPoints() + "\nTEMPS TOTAL: " + gController.getTime());
                this.player.resurrect();
                gController.addPoints(-gController.getPoints());
                gController.resetTime();
                this.scene.restart();
            }
        }this.eliminateObstacle();
    }
    eliminateObstacle(){
        var found = false;
        this.RockGroup.allrocks.forEach(c => {
            if(!c.body.touching.none && !found){
                found = true;
                c.body.enable = false;
                c.active = false;
                c.visible = false;
            }
        })
        if(!found){
            this.RedLaserGroup.allred.forEach(c => {
                if(!c.body.touching.none && !found){
                    found = true;
                    c.body.enable = false;
                    c.visible = false;
                    c.active = false;
                }
            })
        }
    }
    enemyHit(){
        var found = false
        this.LaserGroup.allblue.forEach(c => {
            if(!c.body.touching.none && !found){
                this.damageEnemy();
                found = true;
                c.body.enable = false;
                c.visible = false;
                var index = this.LaserGroup.allblue.indexOf(c);
                this.LaserGroup.allblue.splice(index, 1);
                c.destroy()
            }
        })
    }
    damageEnemy(){
        var found = false;
        this.RockGroup.allrocks.forEach(c => {
            if(!c.body.touching.none && !found){
                found = true;
                c.damaged();
            }
        })
        if(!found){
            this.EnemyGroup.allenemies.forEach(c => {
                if(!c.body.touching.none && !found){
                    found = true;
                    c.damaged();
                }
            })
        }
    }
    shootLaser(){
        this.LaserGroup.firelaser(this.ship.x, this.ship.y - 20);
    }
    fallAsteroid(){
        this.RockGroup.asteroidfall();
    }
    sendEnemy(){
        this.EnemyGroup.sendufo();
    }
    enemyShoot(x, y){
        var speedx = 200;
        var speedy = 380;
        var reverse = false
        var index = 0;
        while (index < 5){
            this.RedLaserGroup.firelaser(x, y, speedx, speedy);
            if(reverse){
                speedy = speedy - 60;
            }else speedy = speedy + 60;
            if(speedy == 500) reverse = true;
            speedx = speedx -100;
            index = index + 1;
        }
    }
    createanimations(){
        this.anims.create({
            key:'idle',
            frames: this.anims.generateFrameNumbers('ship', {
                start:1,
                end:2
            }),
            repeat: -1,
            frameRate: 1
        })
        this.anims.create({
            key:'goUp',
            frames: this.anims.generateFrameNumbers('ship', {
                start:4,
                end:5
            }),
            repeat: -1,
            frameRate: 5
        })
        this.anims.create({
            key:'goDown',
            frames: this.anims.generateFrameNumbers('ship', {
                start:6,
                end:7
            }),
            repeat: -1,
            frameRate: 5
        })
        this.anims.create({
            key:'goLeft',
            frames: this.anims.generateFrameNumbers('ship', {
                start:0,
                end:0
            }),
            repeat: -1,
            frameRate: 5
        })
        this.anims.create({
            key:'goRight',
            frames: this.anims.generateFrameNumbers('ship', {
                start:3,
                end:3
            }),
            repeat: -1,
            frameRate: 5
        })
        this.anims.create({
            key:'goUpRight',
            frames: this.anims.generateFrameNumbers('ship', {
                start:10,
                end:11
            }),
            repeat: -1,
            frameRate: 5
        })
        this.anims.create({
            key:'goDownRight',
            frames: this.anims.generateFrameNumbers('ship', {
                start:14,
                end:15
            }),
            repeat: -1,
            frameRate: 5
        })
        this.anims.create({
            key:'goUpLeft',
            frames: this.anims.generateFrameNumbers('ship', {
                start:8,
                end:9
            }),
            repeat: -1,
            frameRate: 5
        })
        this.anims.create({
            key:'goDownLeft',
            frames: this.anims.generateFrameNumbers('ship', {
                start:12,
                end:13
            }),
            repeat: -1,
            frameRate: 5
        })
        this.anims.create({
            key:'ufor',
            frames: this.anims.generateFrameNumbers('ufo', {
                start:0,
                end:29
            }),
            repeat: -1,
            frameRate: 10
        })
        this.ship.anims.play("idle");
    }
}