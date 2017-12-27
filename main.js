var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var count = 0;
var score = 0;
var highscore = 0;

function preload() {
    // load images
    game.load.image('background', 'assets/background.jpg');
    game.load.image('asteroid', 'assets/asteroid_01.png');
    game.load.image('rocket', 'assets/rocket.png');
    game.load.image('healthPowerup', 'assets/healthPowerup.png');
    loadHighscore();
}

function create() {
    // display background image
    var background = game.add.sprite(0, 0, 'background');
    background.height = game.height;
    background.width = game.width;
    // display rocket image
    rocket = game.add.sprite(game.world.centerX, game.height - 30, 'rocket');
    rocket.scale.setTo(0.25,0.25);
    rocket.anchor.setTo(0.5,0.5);

    // set height and width values
    maxX = (game.width / 10) * 9;
    minX = (game.width / 10) * 1;
    maxY = (game.height);

    // enable phaser physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // enable rocket physics
    game.physics.enable(rocket, Phaser.Physics.ARCADE);

    // setup sprite groups
    asteroidGroup = game.add.group();
    powerupGroup = game.add.group();

    // user movement setup
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

    // create text
    scoreText = "Score: " + score;
    scoreTextStyle = { font: "32px Arial", fill: "#ff0044", align: "center" };
    scoreTextRender = game.add.text(game.world.centerX, 30, scoreText, scoreTextStyle);
    scoreTextRender.anchor.setTo(0.5,0.5);

    // run events function
    events();
    
}

function update() {
    // check for collisions
    this.game.physics.arcade.overlap(rocket, asteroidGroup, onCollision, null);

    // check for user input
    if (leftKey.isDown || aKey.isDown)
    {
        rocket.body.velocity.setTo(-200,0);
    }
    else if (rightKey.isDown || dKey.isDown)
    {
        rocket.body.velocity.setTo(200,0);
    }

    count++;
    // on every 5th frame load a sprite
    if(count % 5 === 0) {
        // get random spawn location
        var randX = Math.floor(Math.random() * maxX) + minX;
        // spawn new asteroid
        var newAsteroid = game.add.sprite(randX, -30, 'asteroid');
        game.physics.enable(newAsteroid, Phaser.Physics.ARCADE);
        asteroidGroup.add(newAsteroid);
        newAsteroid.body.velocity.setTo(0,200);
    }
    // on every 500th frame load a powerup
    if(count % 500 === 0) {
        // get random spawn location and random powerup
        var randX = Math.floor(Math.random() * maxX) + minX;
        // spawn new power up
        var newPowerup = game.add.sprite(randX, -30, 'healthPowerup');
        game.physics.enable(newPowerup, Phaser.Physics.ARCADE);
        powerupGroup.add(newPowerup);
        newPowerup.body.velocity.setTo(0,200);
    }
}

function onCollision() {
    rocket.kill();
    localStorage.setItem("highscore" , score);
    game.time.events.remove(scoreLoop);
};

function onPowerup() {

};

function events() {
    scoreLoop = game.time.events.loop(Phaser.Timer.SECOND, updateScore)
};

function updateScore() {
    score = score + 1;
    updateText();
};

function updateText() {
    // score text
    scoreTextRender.setText("Score: " + score);
}

function loadHighscore() {
    if(!localStorage.getItem("highscore")) {
        console.log('no previous highscore saved');
    } else {
        console.log('found a saved highscore');
        highscore = localStorage.getItem("highscore");
    }
};