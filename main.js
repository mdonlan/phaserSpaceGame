var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    // set data
    count = 0;
    score = 0;
    fireCoolDown = 100;
    powerupTypes = ["healthPowerup", "shieldPowerup"];
    hullHealth = 100;

    // load images
    game.load.image('background', 'assets/background.jpg');
    game.load.image('asteroid', 'assets/asteroid_01.png');
    game.load.image('ship', 'assets/playerShip1_red.png');
    game.load.image('healthPowerup', 'assets/pill_blue.png');
    game.load.image('redLaser', 'assets/redLaser.png');
    game.load.image('shieldPowerup', 'assets/powerupGreen_shield.png');
    game.load.image('shield1', 'assets/shield1.png');
    game.load.image('asteroid1', 'assets/asteroids/asteroid1.png');
    game.load.image('asteroid2', 'assets/asteroids/asteroid2.png');
    game.load.image('asteroid3', 'assets/asteroids/asteroid3.png');
    game.load.image('asteroid4', 'assets/asteroids/asteroid4.png');
    game.load.image('asteroid5', 'assets/asteroids/asteroid5.png');
    game.load.image('asteroid6', 'assets/asteroids/asteroid6.png');
    game.load.image('asteroid7', 'assets/asteroids/asteroid7.png');
    game.load.image('asteroid8', 'assets/asteroids/asteroid8.png');
    game.load.image('asteroid9', 'assets/asteroids/asteroid9.png');
    game.load.image('asteroid10', 'assets/asteroids/asteroid10.png');
    game.load.image('asteroid11', 'assets/asteroids/asteroid11.png');
    game.load.image('asteroid12', 'assets/asteroids/asteroid12.png');
    game.load.image('asteroid13', 'assets/asteroids/asteroid13.png');
    game.load.image('asteroid14', 'assets/asteroids/asteroid14.png');
    game.load.image('asteroid15', 'assets/asteroids/asteroid15.png');
    game.load.image('asteroid16', 'assets/asteroids/asteroid16.png');
    game.load.image('asteroid17', 'assets/asteroids/asteroid17.png');
    game.load.image('asteroid18', 'assets/asteroids/asteroid18.png');
    game.load.image('asteroid19', 'assets/asteroids/asteroid19.png');
    game.load.image('asteroid20', 'assets/asteroids/asteroid20.png');

    // load audio
    

    // load highscore
    loadHighscore();
}

function create() {
    game.time.advancedTiming = true;
    // display background image
    var background = game.add.sprite(0, 0, 'background');
    background.height = game.height;
    background.width = game.width;
    // display ship image
    ship = game.add.sprite(game.world.centerX, game.height - 60, 'ship');
    //ship.scale.setTo(0.25,0.25);
    //ship.anchor.setTo(0.5,0.5);
    ship.height = 50;
    ship.width = 75;

    // set height and width values
    maxX = (game.width);
    minX = (-5);
    maxY = (game.height);

    // enable phaser physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // enable ship physics
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.setSize(100, 50, 0, 20);
    

    // setup sprite groups
    asteroidGroup = game.add.group();
    powerupGroup = game.add.group();
    laserGroup = game.add.group();

    // user movement setup
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // create text
    scoreText = "Score: " + score;
    scoreTextStyle = { font: "32px Arial", fill: "#dddddd", align: "center" };
    scoreTextRender = game.add.text(game.world.centerX + 110, 30, scoreText, scoreTextStyle);
    scoreTextRender.anchor.setTo(0.5,0.5);
    if(!localStorage.getItem("highscore")) {
        // no highscore, set current score to highscore
        highscoreText = "Highscore: " + highscore;
        highscoreTextStyle = { font: "32px Arial", fill: "#dddddd", align: "center" };
        highscoreTextRender = game.add.text(game.world.centerX - 110, 30, highscoreText, highscoreTextStyle);
        highscoreTextRender.anchor.setTo(0.5,0.5);
    } else {
        // render highscore
        highscoreText = "Highscore: " + highscore;
        highscoreTextStyle = { font: "32px Arial", fill: "#dddddd", align: "center" };
        highscoreTextRender = game.add.text(game.world.centerX - 110, 30, highscoreText, highscoreTextStyle);
        highscoreTextRender.anchor.setTo(0.5,0.5);
    
    }

    // create UI text
    fireCoolDownUI();

    // player health text
    hullHealthText = "Hull Health: " + hullHealth;
    hullHealthTextStyle = { font: "32px Arial", fill: "#dddddd", align: "center" };
    hullHealthTextRender = game.add.text(game.world.centerX + 410, 30, hullHealthText, hullHealthTextStyle);
    hullHealthTextRender.anchor.setTo(0.5,0.5);
    
    // run events function
    // currently starts asteroid spawing event and score updating event
    events();
    spawnShield();
    
}

function update() {
    // check for user input
    if (leftKey.isDown || aKey.isDown) {
        //ship.body.velocity.setTo(-200,0);
        ship.x = ship.x - 10;
    }
    if (rightKey.isDown || dKey.isDown) {
        //ship.body.velocity.setTo(200,0);
        ship.x = ship.x + 10;
    }
    if(upKey.isDown || wKey.isDown) {
        ship.y = ship.y - 5;
    }
    if(downKey.isDown || sKey.isDown) {
        ship.y = ship.y + 5;
    }
    if (spaceKey.isDown) {
        if(fireCoolDown >= 100) {
            fireCoolDown = 0;
            var newLaser = game.add.sprite(ship.x + 37, ship.y, 'redLaser');
            game.physics.enable(newLaser, Phaser.Physics.ARCADE);
            newLaser.body.velocity.setTo(0,-600);
            newLaser.scale.setTo(0.25,0.25);
            newLaser.anchor.setTo(0.5,0.5);
            laserGroup.add(newLaser);
        }
    }
    fireCoolDown++;
    // show ship hitbox
    //game.debug.body(ship, "#ff9090", false);
    // show each asteroid hitbox
    //asteroidGroup.forEachAlive(game.debug.body,game.debug,"#ff9090",false);	
    // show each powerup hitbox
    //powerupGroup.forEachAlive(game.debug.body,game.debug,"#ff9090",false);	
    // check for collisions
    this.game.physics.arcade.overlap(ship, asteroidGroup, onCollision, null);
    this.game.physics.arcade.overlap(laserGroup, asteroidGroup, laserCollision, null);
    this.game.physics.arcade.overlap(ship, powerupGroup, powerupCollision, null);
    

    // update shield position
    if(typeof shield == 'undefined') {

    } else {
        this.game.physics.arcade.overlap(shield, asteroidGroup, shieldCollision, null);
        shield.x = ship.x + 38;
        shield.y = ship.y + 15;
    }

    // update fire cooldown text
    if(fireCoolDown <= 100) {
        cooldownTextRender.setText("Reloading: " + fireCoolDown + '%');
    } else {
        cooldownTextRender.setText("");
    }
    cooldownTextRender.x = ship.x + 100;
    cooldownTextRender.y = ship.y + 12;

}

function render() {
    // show fps
    game.debug.text(game.time.fps, 2, 14, "#00ff00");
    //game.debug.body(ship);
};

function onCollision(ship, asteroid) {
    hullHealth = hullHealth - 25;
    if(hullHealth <= 0) {
        asteroid.kill();
        ship.kill();
        if(score > localStorage.getItem("highscore")) {
            localStorage.setItem("highscore" , score);
        }
        game.time.events.remove(scoreLoop);
        createPlayAgainButton();
    } else {
        asteroid.kill();
        hullHealthTextRender.setText("Hull Health: " + hullHealth);
    }
};

function events() {
    scoreLoop = game.time.events.loop(Phaser.Timer.SECOND, updateScore);
    // spawn asteroid every 100ms
    spawnAsteroidLoop = game.time.events.loop(150, spawnAsteroid);
    // spawn powerup every 1000ms
    spawnPowerupLoop = game.time.events.loop(1000, spawnPowerup);
};

function updateScore() {
    score = score + 1;
    updateText();
};

function updateText() {
    // score text
    scoreTextRender.setText("Score: " + score);
    
    if(score > highscore) {
        highscoreTextRender.setText("Highscore: " + score);
    }
}

function loadHighscore() {
    if(!localStorage.getItem("highscore")) {
        console.log('no previous highscore saved');
        highscore = 0;
    } else {
        console.log('found a saved highscore');
        highscore = localStorage.getItem("highscore");
    }
};

function spawnAsteroid() {
    // get random spawn location
    var randX = Math.floor(Math.random() * maxX) + minX;
    var randVelocity = Math.floor(Math.random() * 200) + 200;
    var randAngle = Math.floor(Math.random() * -200) + 200;
    var randAsteroid = Math.floor(Math.random() * 20) + 1;
    // spawn new asteroid
    var newAsteroid = game.add.sprite(randX, -30, 'asteroid' + randAsteroid);
    game.physics.enable(newAsteroid, Phaser.Physics.ARCADE);
    asteroidGroup.add(newAsteroid);
    newAsteroid.body.velocity.setTo(randAngle,randVelocity);
    game.time.events.add(10000, killAfterTime, newAsteroid);
};

function killAfterTime() {
    // destroy asteroids after a certain amount of time
    this.kill();
};

function spawnPowerup() {
    // get random spawn location and random powerup
    var max = powerupTypes.length;
    var randType = Math.floor(Math.random() * max) + 0;
    var randX = Math.floor(Math.random() * maxX) + minX;
    powerupSelected = powerupTypes[randType];
    
    // spawn new power up
    var newPowerup = game.add.sprite(randX, -30, powerupSelected);
    game.physics.enable(newPowerup, Phaser.Physics.ARCADE);
    powerupGroup.add(newPowerup);
    newPowerup.body.velocity.setTo(0,200);
};

function laserCollision(laser, asteroid) {
    console.log('laser hit asteroid')
    laser.kill();
    asteroid.kill();
}

function powerupCollision(ship, powerup) {
    console.log('collected a powerup');
    console.log(powerup.key)
    powerup.kill();

    // give player powerup skill
    if(powerup.key == 'shieldPowerup') {
        spawnShield();
    } else if (powerup.key == 'healthPowerup') {
        if(hullHealth < 100) {
            hullHealth = hullHealth + 25;
            hullHealthTextRender.setText("Hull Health: " + hullHealth);
        }
    }
};

function spawnShield() {
    // spawn new shield
    if(typeof shield == 'undefined') {
        shield = game.add.sprite(ship.world.x, ship.world.y, 'shield1');
        shield.anchor.setTo(0.5,0.5);
        //shield.scale.setTo(0.5,0.5);
        shield.height = 70;
        shield.width = 100;
        game.physics.enable(shield, Phaser.Physics.ARCADE);
    }
};

function createPlayAgainButton() {
    playAgainButton = game.add.text(game.world.centerX, game.world.centerY, "PLAY AGAIN", { font: "65px Arial", fill: "#dddddd", align: "center", backgroundColor: "#111111" });
    playAgainButton.anchor.set(0.5);
    playAgainButton.inputEnabled = true;
    playAgainButton.events.onInputDown.add(clickedPlayAgainButton);
};

function clickedPlayAgainButton() {
    console.log('clicked play again button')
    game.state.start(game.state.current);
};

function shieldCollision(shield, asteroid) {
    shield.kill();
    asteroid.kill();
};

function fireCoolDownUI() {
    cooldownText = "Reloading: " + fireCoolDown;
    cooldownTextStyle = { font: "12px Arial", fill: "#dddddd", align: "center" };
    cooldownTextRender = game.add.text(ship.x, ship.y, cooldownText, cooldownTextStyle);
    cooldownTextRender.anchor.setTo(0.5,0.5);
}