
export var game = function(){
    const spaceship = '../resources/Spaceship.png';
    const player = {
        lives: 3,
        invincible: false,
        dead: false,
        position: [350,1000],
        sprite: spaceship,
        getHit: function (){
            this.lives -= 1;
            if(this.lives<=0)
                this.dead=true;
            else
                this.invincible = true
                setTimeout(() => {
                    this.invincible = false;
                }, 3000);
        },
        resurrect: function(){
            this.lives = 3,
            this.invincible = false;
            this.dead = false;
        }
    };
    var totaltime = 0;
    var points = 0;
    var escena;
    var pass = [];
    var pl;

    return {
        init: function (){
            
            if (sessionStorage.save){ // Load game
                let partida = JSON.parse(sessionStorage.save);
                pl = Object.create(player)
                pl.lives = partida.lives;
                pl.invincible = partida.invincible
                points = partida.points;
                totaltime = partida.totaltime;
                escena = partida.scenestatus;
                pass = [true, pl, escena]
                return pass;
            }
            else{
                pl = Object.create(player);
                pl.position = [350, 1000];
                pl.speed=500;
                pass = [false, pl, null];
                return pass;
            };
        },
        save: function (scene){
            var partida = {
                uuid: localStorage.uuid,
                lives: pl.lives,
                invincible: pl.invincible,
                scenestatus: scene,
                totaltime: totaltime,
                points: points,
            }
            let json_partida = JSON.stringify(partida);

            fetch("../php/save.php",{
                method: "POST",
                body: json_partida,
                headers: {"content-type":"application/json; charset=UTF-8"}
            })
            .then(response=>response.json())
            .then(json => {
                console.log(json);
            })
            .catch(err=>{
                console.log(err);
                localStorage.save = json_partida;
                console.log(localStorage.save);
            })
            .finally(()=>{
               window.location.replace("../");
            });
        },
        exitgame: function(){
            window.location.replace("../");
        },
        getPoints: function(){
            return points;
        },
        addPoints: function(sum){
            points += sum;
        },
        getTime: function(){
            return totaltime;
        },
        nextSecond: function(){
            totaltime += 1;
        },
        resetTime: function(){
            totaltime = 0;
        }
    }
}();