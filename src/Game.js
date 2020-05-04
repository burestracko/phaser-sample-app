class Game extends Phaser.Scene {
    constructor(sound) {
        super('Game');
    }
    init(data) {
        this.soundOn = data.sound;
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48});
        this.load.audio('hitStar', [ 'assets/blaster.mp3' ]);
        this.load.audio('explosion', [ 'assets/explosion.mp3' ]);
        this.load.audio('jump', [ 'assets/jump.wav' ]);
    }

    create() {
        // prepare music effects
        this.hitStarSound = this.sound.add('hitStar');
        this.explosionSound = this.sound.add('explosion');
        this.jumpSound = this.sound.add('jump');

        this.gameOver = false;
        this.score = 0;
        this.cameras.main.setBounds(0, 0, 1600, 600);
        this.physics.world.setBounds(0, 0, 1600, 600);

        //  A simple background for our game
        this.add.image(400, 300, 'sky');
        this.add.image(1200, 300, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(1200, 568, 'ground').setScale(2).refreshBody();

        //  Now let's create some ledges
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 400, 'ground');
        this.platforms.create(750, 220, 'ground');
        this.platforms.create(1400, 300, 'ground');
        this.platforms.create(1100, 450, 'ground');

        // The player and its settings
        this.player = this.physics.add.sprite(100, 250, 'dude');

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.3);
        this.player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{key: 'dude', frame: 4}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        //  Some stars to collect, 22 in total
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 21,
            setXY: {x: 12, y: 0, stepX: 70}
        });

        this.stars.children.iterate(function (child) {
            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // prepare bombs collection, one is generated on begin
        this.bombs = this.physics.add.group();
        var bomb = this.bombs.create(Phaser.Math.Between(400, 800), 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

        //  The score
        this.scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});

        // game over text
        this.gameOverText = this.add.text(0, 300, 'GAME OVER', {fontSize: '50px', fill: '#333'});
        this.gameOverText.setVisible(false);

        //  collide the player and the stars with the platforms
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

    update() {
        if (this.gameOver) {
            return;
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.soundOn && this.jumpSound.play();
            this.player.setVelocityY(-330);
        }

        // update position of score based on camera move
        this.scoreText.setX(this.cameras.main.scrollX + 20);
    }

    collectStar(player, star) {
        star.disableBody(true, true);

        this.soundOn && this.hitStarSound.play();

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.stars.countActive(true) === 0) {
            //  A new batch of stars to collect
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            // one more bomb
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }
    }

    // hmmm, finished
    hitBomb(player, bomb) {
        this.explosionSound.play();
        this.gameOverText.setVisible(true);
        this.gameOverText.setPosition(this.player.x - 100, 300);
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn');
        bomb.visible = false;
        this.gameOver = true;
    }
}
