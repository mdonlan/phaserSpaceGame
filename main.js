var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    // set data
    count = 0;
    score = 0;
    fireCoolDown = 101;
    powerupTypes = ["healthPowerup", "shieldPowerup"];
    hullHealth = 100;

    // load images
    game.load.image('background', 'assets/background.jpg');
    game.load.image('asteroid', 'assets/asteroid_01.png');
    game.load.image('rocket', 'assets/playerShip1_red.png');
    game.load.image('healthPowerup', 'assets/healthPowerup.png');
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

    // load highscore
    loadHighscore();
}

function create() {
    game.time.advancedTiming = true;
    // display background image
    var background = game.add.sprite(0, 0, 'background');
    background.height = game.height;
    background.width = game.width;
    // display rocket image
    rocket = game.add.sprite(game.world.centerX, game.height - 30, 'rocket');
    rocket.scale.setTo(0.25,0.25);
    rocket.anchor.setTo(0.5,0.5);

    // set height and width values
    maxX = (game.width);
    minX = (-5);
    maxY = (game.height);

    // enable phaser physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // enable rocket physics
    game.physics.enable(rocket, Phaser.Physics.ARCADE);
    rocket.body.setSize(50, 50, 20, 0);
    

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
    } else {
        // render highscore
        highscoreText = "Highscore: " + highscore;
        highscoreTextStyle = { font: "32px Arial", fill: "#dddddd", align: "center" };
        highscoreTextRender = game.add.text(game.world.centerX - 110, 30, highscoreText, highscoreTextStyle);
        highscoreTextRender.anchor.setTo(0.5,0.5);
    
    }

    // create UI text

    // player health text
    hullHealthText = "Hull Health: " + hullHealth;
    hullHealthTextStyle = { font: "32px Arial", fill: "#dddddd", align: "center" };
    hullHealthTextRender = game.add.text(game.world.centerX + 410, 30, hullHealthText, hullHealthTextStyle);
    hullHealthTextRender.anchor.setTo(0.5,0.5);
    
    // run events function
    // currently starts asteroid spawing event and score updating event
    events();
    
}

function update() {
    // check for user input
    if (leftKey.isDown || aKey.isDown)
    {
        //rocket.body.velocity.setTo(-200,0);
        rocket.x = rocket.x - 10;
    } else if (rightKey.isDown || dKey.isDown) {
        //rocket.body.velocity.setTo(200,0);
        rocket.x = rocket.x + 10;
    } else if (spaceKey.isDown) {
        if(fireCoolDown >= 100) {
            fireCoolDown = 0;
            var newLaser = game.add.sprite(rocket.x, rocket.y, 'redLaser');
            game.physics.enable(newLaser, Phaser.Physics.ARCADE);
            newLaser.body.velocity.setTo(0,-600);
            newLaser.scale.setTo(0.25,0.25);
            newLaser.anchor.setTo(0.5,0.5);
            laserGroup.add(newLaser);
        }
    }
    fireCoolDown++;
    // show rocket hitbox
    //game.debug.body(rocket, "#ff9090", false);
    // show each asteroid hitbox
    //asteroidGroup.forEachAlive(game.debug.body,game.debug,"#ff9090",false);	
    // show each powerup hitbox
    //powerupGroup.forEachAlive(game.debug.body,game.debug,"#ff9090",false);	
    // check for collisions
    this.game.physics.arcade.overlap(rocket, asteroidGroup, onCollision, null);
    this.game.physics.arcade.overlap(laserGroup, asteroidGroup, laserCollision, null);
    this.game.physics.arcade.overlap(rocket, powerupGroup, powerupCollision, null);
    

    // update shield position
    if(typeof shield == 'undefined') {

    } else {
        this.game.physics.arcade.overlap(shield, asteroidGroup, shieldCollision, null);
        shield.x = rocket.x;
        shield.y = rocket.y;
    }
}

function render() {
    // show fps
    game.debug.text(game.time.fps, 2, 14, "#00ff00");
};

function onCollision(rocket, asteroid) {
    hullHealth = hullHealth - 25;
    if(hullHealth <= 0) {
        asteroid.kill();
        rocket.kill();
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
    spawnAsteroidLoop = game.time.events.loop(1000, spawnAsteroid);
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

function powerupCollision(rocket, powerup) {
    console.log('collected a powerup');
    console.log(powerup.key)
    powerup.kill();

    // give player powerup skill
    if(powerup.key == 'shieldPowerup') {
        
        // spawn new shield
        shield = game.add.sprite(rocket.world.x, rocket.world.y, 'shield1');
        shield.anchor.setTo(0.5,0.5);
        shield.scale.setTo(0.5,0.5);
        game.physics.enable(shield, Phaser.Physics.ARCADE);
        //powerupGroup.add(newPowerup);
        //newPowerup.body.velocity.setTo(0,200);
    } else if (powerup.key == 'healthPowerup') {

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