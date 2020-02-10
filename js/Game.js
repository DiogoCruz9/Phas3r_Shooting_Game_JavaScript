var enemydown;
var lastFired=0;
var lastFired2=0;
var P1lives=5;
var P1Life=true;
var P1Death=false;
var P2lives=5;
var P2Life=true;
var P2Death=false;
var gameend = 0;
var enemyLVL1=0;
var level=1;
var teste=0;
var BossLives = 100;
var BossLife=true;
var BossDeath=false;


export default class Game extends Phaser.Scene{
    constructor (key)
    {
        super(key);
    }


 preload()
{
	this.load.image("background", "assets/background.jpg");
	this.load.image("player1", "assets/player.png");
	this.load.image("player2", "assets/player.png");
	this.load.image("enemydown", "assets/enemy.png");
	this.load.image("bullet", "assets/bullet.png");
	this.load.image("boss", "assets/boss.png");
	this.load.image("enemy2", "assets/enemy2.png");
	this.load.spritesheet('kaboom', 'assets/explode.png',{ frameWidth: 128, frameHeight: 128 });	
	this.load.spritesheet('reck', 'assets/reck.png',{ frameWidth: 193, frameHeight: 195 });
    this.load.audio("music", "assets/music.mp3");
	this.load.audio("blast", "assets/blast.wav");
    this.load.audio("crash", "assets/crash.wav");
    this.load.image("laser", "assets/laser.png");
    this.load.image("reckage", "assets/reckage.png");
    this.load.image("fire", "assets/fire.png");
}

 create()
{
	this.createMusic(this.music,this.sound);
	
	this.background = this.add.tileSprite(400,350,800,700,"background");
	
	this.player1 = this.physics.add.sprite(200,500, 'player1');
	this.player1.setBounce(0.1);
	this.player1.setScale(0.5);
	//this.player1.tint = 0x800000;
    this.player1.setCollideWorldBounds(true);
    
	//Player 2
	this.player2 = this.physics.add.sprite(400,500, 'player2');
	this.player2.setBounce(0.1);
	this.player2.setScale(0.5);
	this.player2.tint = 0x33ff33;
	this.player2.setCollideWorldBounds(true);
 
    this.boss = this.physics.add.sprite(400,0,'boss'); 
    this.boss.setVelocityY(50);
    this.boss.checkWorldBounds = true; 
    this.boss.outOfBoundsKill = true;
    this.boss.setCollideWorldBounds(true);

    this.time.addEvent({ 
        delay: 1000, 
        callback: function (){
            this.addBulletBoss(this.boss.body.x+90, this.boss.body.y+120, this.boss.body.velocity.x);
        },
        callbackScope: this,
        repeat:-1,
    });

	this.cursors = this.input.keyboard.addKeys(
		{up:Phaser.Input.Keyboard.KeyCodes.UP,
		down:Phaser.Input.Keyboard.KeyCodes.DOWN,
		left:Phaser.Input.Keyboard.KeyCodes.LEFT,
        right:Phaser.Input.Keyboard.KeyCodes.RIGHT,
        shoot:Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO,
		});
	
	this.teclas = this.input.keyboard.addKeys(
		{up:Phaser.Input.Keyboard.KeyCodes.W,
		down:Phaser.Input.Keyboard.KeyCodes.S,
		left:Phaser.Input.Keyboard.KeyCodes.A,
		right:Phaser.Input.Keyboard.KeyCodes.D,
		shoot:Phaser.Input.Keyboard.KeyCodes.SPACE,
		});
    
    this.livesP1 = this.add.text(600, 16, 'Vidas P1: 5', { fontSize: '25px', fill: '#FFF' });
    this.livesP2 = this.add.text(600, 36, 'Vidas P2: 5', { fontSize: '25px', fill: '#FFF' });
    this.livesBoss = this.add.text(530, 55, 'Boss Shield: 100%', { fontSize: '25px', fill: '#FFF' });
    
	
	
	this.enemies = this.physics.add.group();
	
	

    this.timer3=this.time.addEvent({ 
        delay: 3000, 
        callback: this.addBulletEnemy, 
        callbackScope: this,
        repeat:0
    });

	
	this.bulletsP1 = this.physics.add.group();   //Balas P1
	this.bulletsP2 = this.physics.add.group();   //Balas P2
	this.bulletsenemy = this.physics.add.group(); //Balas Inimigos
	this.explosions = this.physics.add.group({defaultKey: 'kaboom',maxSize: 30});
    this.bulletsenemy = this.physics.add.group();
      this.bulletsboss = this.physics.add.group();

	this.anims.create({
        key: 'kaboom',
        frames: this.anims.generateFrameNames('kaboom', { start: 1, end: 15, }),
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'reck',
        frames: this.anims.generateFrameNames('reck', { start: 1, end: 23, }),
        frameRate: 10,
        repeat: 0
    });
	
	this.physics.add.collider(this.player1, this.player2);
    this.physics.add.overlap(this.bulletsenemy, this.player1, this.hitPlayerExplosion1, null, this);
    this.physics.add.overlap(this.bulletsenemy, this.player2, this.hitPlayerExplosion2, null, this);
    this.physics.add.overlap(this.bulletsP1, this.enemies, this.hitBulletP1, null, this);
    this.physics.add.overlap(this.bulletsP2, this.enemies, this.hitBulletP2, null, this);
    this.physics.add.overlap(this.enemies, this.player1, this.hitPlayerExplosion1, null, this);
    this.physics.add.overlap(this.enemies, this.player2, this.hitPlayerExplosion2, null, this);
    this.physics.add.overlap(this.bulletsP1, this.boss, this.hitBulletBoss, null, this);
    this.physics.add.overlap(this.player1, this.boss, this.playerinstakill, null, this);
    this.physics.add.overlap(this.bulletsP2, this.boss, this.hitBulletBoss, null, this);
    this.physics.add.overlap(this.player2, this.boss, this.player2instakill, null, this);
    this.physics.add.overlap(this.bulletsboss, this.player1, this.hitPlayerExplosionBoss, null, this);
    this.physics.add.overlap(this.bulletsboss, this.player2, this.hitPlayer2ExplosionBoss, null, this);

    this.boss.factor = 1;
    this.boss.factor2 = 1;
}
	
update(time)
{
   this.background.tilePositionY -= 0.1;


    if(enemyLVL1==15)////////////////////////////////////////////////////////////////////
   {
       level++;
   }

   if(level==1&&teste==0)////////////////////////////////////////////////////////////////////
   {
       teste++;
    this.timer=this.time.addEvent({ 
        delay: 1000, 
        callback: this.addEnemyDownLVL1, 
        callbackScope: this,
        repeat:30
    });
   }

   if(level==2&&enemyLVL1==15)////////////////////////////////////////////////////////////////////
   {
    this.timer2=this.time.addEvent({ 
        delay: 2000, 
        callback: this.addEnemyDownLVL2, 
        callbackScope: this,
        repeat:-1
    });
   }
   
   if(P1Death==false){
		//Player1 Andar para a esquerda
        if (this.cursors.left.isDown){  
            this.player1.body.setVelocityX(-200);
            this.player1.flipX = true; 
        }
        //Player1 Andar para a direita
        else if (this.cursors.right.isDown){
            this.player1.body.setVelocityX(200);
            this.player1.flipX = false; 
        }
        //Player1 afk
        else {
            this.player1.body.setVelocityX(0);
            this.player1.flipX = false;
        }
        //Player1 salto
        if (this.cursors.up.isDown){
            this.player1.body.setVelocityY(-300);  
        }
        //Player1 andar para baixo
        if(this.cursors.down.isDown){
            this.player1.body.setVelocityY(300);
        }  
		//disparar
		if(this.cursors.shoot.isDown && time > lastFired){
            this.addBulletPlayer1(this.player1.body.x, this.player1.body.y, this.player1.body.velocity.x); 
            //this.addBulletEnemy(this.enemy2.body.x+25, this.enemy2.body.y+20, this.enemy2.body.velocity.x);
			lastFired = time + 300;			
        }
   
    }
		
//JOGADOR 2    
        //Player2 Andar para a esquerda

    if(P2Death==false){
        if (this.teclas.left.isDown ){
            this.player2.body.setVelocityX(-200);
            this.player2.flipX = true; 
        }
        //Player2 Andar para a direita
        else if (this.teclas.right.isDown)
        {
            this.player2.body.setVelocityX(200);
            this.player2.flipX = false;
        } 
        //Player2 afk
        else {
            this.player2.body.setVelocityX(0);
            this.player2.flipX = false;
        }
        //Player2 salto
        if (this.teclas.up.isDown)
        {
            this.player2.body.setVelocityY(-300);        
        }
        //Player2 andar para baixo
        if(this.teclas.down.isDown)
        {
            this.player2.setVelocityY(300);
        }
		//disparar
		if(this.teclas.shoot.isDown && time > lastFired2)
        {
            this.addBulletPlayer2(this.player2.body.x, this.player2.body.y, this.player2.body.velocity.x);
            //this.addBulletEnemy(this.enemydown.body.x+25, this.enemydown.body.y+20, this.enemydown.body.velocity.x);
			lastFired2 = time + 300;
        }
    }


        if(P1Death==true && P2Death==true && gameend==0){
        this.explosions.kill();
        this.enemies.kill();
        this.music.stop();
        
        this.crash.stop();
        this.scene.stop();
       
        this.timer.pause = true;
     
        gameend=1;

        P1lives=5;
        P1Life=true;
        P1Death=false;
        P2lives=5;
        P2Life = true;
        P2Death=false;
        enemyLVL1=0;////////////////////////////////////////////////////////////////////
        level=1;////////////////////////////////////////////////////////////////////
        teste=0;////////////////////////////////////////////////////////////////////

        this.player1 = this.physics.add.sprite(200,500, 'player1');
        this.player1.setBounce(0.1);
        this.player1.setScale(0.5);
        //this.player1.tint = 0x800000;
        this.player1.setCollideWorldBounds(true);
    
        //Player 2
        this.player2 = this.physics.add.sprite(400,500, 'player2');
        this.player2.setBounce(0.1);
        this.player2.setScale(0.5);
        this.player2.tint = 0x33ff33;
        this.player2.setCollideWorldBounds(true);
        this.scene.start('Defeat');
        gameend=0;
    }


    if(BossDeath==true && gameend==0){
        this.explosions.kill();
        this.enemies.kill();
        this.music.stop();
        this.crash.stop();
        this.scene.stop();
        
        
        this.timer.pause = true;
        this.timer2.pause = true;
        this.timer3.pause = true;  
        gameend=1;

        P1lives=5;
        P1Life=true;
        P1Death=false;
        P2lives=5;
        P2Life=true;
        P2Death=false;
        BossLives = 100;
        BossLife = true; 
        BossDeath = false;
        enemyLVL1=0;////////////////////////////////////////////////////////////////////
        level=1;////////////////////////////////////////////////////////////////////
        teste=0;////////////////////////////////////////////////////////////////////


        this.player1 = this.physics.add.sprite(200,500, 'player1');
        this.player1.setBounce(0.1);
        this.player1.setScale(0.5);
        //this.player1.tint = 0x800000;
        this.player1.setCollideWorldBounds(true);

        this.player2 = this.physics.add.sprite(400,500, 'player2');
        this.player2.setBounce(0.1);
        this.player2.setScale(0.5);
        this.player2.tint = 0x33ff33;
        this.player2.setCollideWorldBounds(true);

        this.boss = this.physics.add.sprite(400,0, 'boss');
        this.boss.setCollideWorldBounds(true);
        this.scene.start('Victory');
        gameend=0;
        }



        if(BossDeath==false){
    this.boss.body.velocity.y = this.boss.factor * 50;
    this.boss.body.velocity.x = this.boss.factor2 * 50;

    
    if (this.boss.body.y >= 450){
        this.boss.factor = -1;
    }

    if (this.boss.body.y <= 0){
        this.boss.factor = 1;
    }

    if (this.boss.body.x >= 600){
        this.boss.factor2 = -1;
    }

    if (this.boss.body.x <= 0){
        this.boss.factor2 = 1;
    }
}
		
} //fim update

 addEnemyDownLVL1()
{
	var space = Math.floor(Math.random() * 600)+75 ;	
	this.addOneEnemyDownLVL1(space,-20);
        enemyLVL1++;
}

 addOneEnemyDownLVL1(x,y)
{
    this.enemydown = this.enemies.create(x, y,'enemydown');  
    this.enemydown.setVelocityY(50);
    this.enemydown.checkWorldBounds = true; 
    //enemydown.body.setAllowGravity(true);
    this.enemydown.outOfBoundsKill = true;
	this.enemydown.setScale(0.5);
    //this.bullet = this.bulletsenemy.create(x,y, 'laser');
}

 addEnemyDownLVL2()
{
	var space = Math.floor(Math.random() * 600)+75 ;	
	
	this.addOneEnemyDownLVL2(space,-20);
}

 addOneEnemyDownLVL2(x,y)
{
    this.enemy2 = this.enemies.create(x, y,'enemy2');  
    this.enemy2.setVelocityY(100);
    this.enemy2.checkWorldBounds = true; 
    //enemydown.body.setAllowGravity(true);
    this.enemy2.outOfBoundsKill = true;
	this.enemy2.setScale(0.5);

    this.time.addEvent({ 
        delay: 1000, 
        callback: function (){
            this.addBulletEnemy(this.enemy2.body.x+25, this.enemy2.body.y+20, this.enemy2.body.velocity.x);
        },
        callbackScope: this,
        repeat:-1,
    });
}

 addBulletPlayer1(x,y,vx)
{
	this.createBulletPlayer1(x+10,y+25,-450);
	this.createBulletPlayer1(x+50,y+25,-450);
}

 bulletsphysics(bullet)
{
    this.bullet.checkWorldBounds = true; 
    this.bullet.body.setAllowGravity(false);
    this.bullet.outOfBoundsKill = true;
}

addBulletEnemy(x,y,vx)
{
    this.createBulletEnemy(x,y,450);
}

createBulletEnemy(x,y,vx)
{
    this.bullet= this.bulletsenemy.create(x,y,'laser');
    this.bullet.body.velocity.y=vx;
    this.bulletsphysics(this.bullet);
}

 createBulletPlayer1(x,y,vx)
{
	this.bullet= this.bulletsP1.create(x,y,'bullet');
    this.bullet.body.velocity.y=vx;
    this.bulletsphysics(this.bullet);  
}

 addBulletPlayer2(x,y,vx)
{
    this.createBulletPlayer2(x+10,y+25,-450);
	this.createBulletPlayer2(x+50,y+25,-450);
}

 createBulletPlayer2(x,y,vx)
{
    this.bullet= this.bulletsP1.create(x,y,'bullet');
    this.bullet.body.velocity.y=vx;
	this.bulletsphysics(this.bullet);
    this.bullet.tint = 0xFF00FF;
}

 createExplosion(object,time, sound, blast)
{
    this.explosion = this.explosions.create(object.x-15,object.y,'kaboom');
	this.explosion.play("kaboom");
	
	this.blast.play();
	
    this.explosion.body.setAllowGravity(false);
    this.explosion.body.immovable = true;
    this.explosion.body.velocity.y=-50;
    time.addEvent({ 
        delay: 1400, 
        callback: this.explosionsHandler, 
        args: [this.explosion],
        callbackScope: this,
        repeat:0,
    });
}

 hitBulletP1(bullet,enemy)
{
    this.createExplosion(enemy,this.time);
    bullet.destroy();
	enemy.destroy();
}

 hitBulletP2(bullet2,enemy)
{
    this.createExplosion(enemy,this.time);
    bullet2.destroy();
	enemy.destroy();
}

 explosionsHandler(boom)
{
    boom.destroy();
}

 createMusic(music, sound){
	this.music= this.sound.add('music'); 
    this.music.setLoop(true);
    this.music.play();
	
	this.blast = this.sound.add('blast');
    this.crash = this.sound.add('crash');
}



 hitPlayerExplosion1(player1, object, time, bullet)
{
    if(P1Life==true)
     {
        P1lives--;
        this.bullet.destroy();
        this.explosion = this.explosions.create(object.x-15,object.y,'reck');
        this.explosion.play("reck");
       
        this.time.addEvent({ 
        delay: 1400, 
        callback: this.explosionsHandler, 
        args: [this.explosion],
        callbackScope: this,
        repeat:0,
    });

        player1.alpha = 0.4;
        this.livesP1.setText("Vidas P1: "+P1lives);
        P1Life=false; 
        this.time.addEvent({ 
            delay: 3000, 
            callback: this.playerDeathImune, 
            callbackScope: this,
            repeat:0
        });
     }
    if(P1lives<=0 && P1Life==false)
    {
        P1Death = this.physics.add.sprite(player1.x+30,player1.y, 'reckage');

        
        P1Death.setScale(0.5);
        P1Death.body.velocity.y=200;
        P1Death.body.setAllowGravity(false);
        P1Death.body.immovable = true;
        this.crash.play();
        P1Death=true;   
        player1.destroy();
    }
}

 hitPlayerExplosion2(player1, object,time, bullet)
{
    if(P2Life==true)
    {
       P2lives--;
       this.bullet.destroy();
       this.explosion = this.explosions.create(object.x-15,object.y,'reck');
       this.explosion.play("reck");
       this.time.addEvent({ 
        delay: 1400, 
        callback: this.explosionsHandler, 
        args: [this.explosion],
        callbackScope: this,
        repeat:0,
    });
       player1.alpha = 0.4;
       this.livesP2.setText("Vidas P2: "+P2lives);
       P2Life=false; 
       this.time.addEvent({ 
        delay: 3000, 
        callback: this.playerDeathImune2, 
        callbackScope: this,
        repeat:-1
    });
    }
   if(P2lives<=0 && P2Life==false)
   {
       P2Death = this.physics.add.sprite(player1.x+30,player1.y, 'reckage');
       
       P2Death.setScale(0.5);
       P2Death.body.velocity.y=200;
       P2Death.body.setAllowGravity(false);
       P2Death.body.immovable = true;
       this.crash.play();
       P2Death=true;
       player1.destroy();

   }
}


 playerDeathImune()
{
    if(P1Life==false && P1lives>0)
    {
        this.player1.alpha = 1;
        P1Life=true;
    }
}

 playerDeathImune2()
{
    if(P2Life==false && P2lives>0)
    {
        this.player2.alpha = 1;
        P2Life=true;
    }
}

addBulletBoss(x,y,vx)
{
    this.createBulletBossVertical(x,y,450);
    this.createBulletBossDiagonal(x,y,450);
    this.createBulletBossDiagonal2(x,y,-450, 450);
}

createBulletBossVertical(x,y,vx)
{
    this.bullet= this.bulletsboss.create(x,y,'fire');
    this.bullet.body.velocity.y=vx;
    this.bulletsphysics(this.bullet);
}

createBulletBossDiagonal(x,y,vx)
{
    this.bullet= this.bulletsboss.create(x,y,'fire');
    this.bullet.body.velocity.x=vx;
    this.bullet.body.velocity.y=vx;
    this.bulletsphysics(this.bullet);
}

createBulletBossDiagonal2(x,y,vx,vy)
{
    this.bullet= this.bulletsboss.create(x,y,'fire');
    this.bullet.body.velocity.x=vx;
    this.bullet.body.velocity.y=vy;
    this.bulletsphysics(this.bullet);
}

hitPlayerExplosionBoss(player1, object, time, bullet)
{
    if(P1Life==true)
     {
        P1lives--;
        P1lives--;
        this.bullet.destroy();
        this.explosion = this.explosions.create(object.x-15,object.y,'reck');
        this.explosion.play("reck");
       
        this.time.addEvent({ 
        delay: 1400, 
        callback: this.explosionsHandler, 
        args: [this.explosion],
        callbackScope: this,
        repeat:0,
    });

        player1.alpha = 0.4;
        this.livesP1.setText("Vidas P1: "+P1lives);
        P1Life=false; 
        this.time.addEvent({ 
            delay: 3000, 
            callback: this.playerDeathImune, 
            callbackScope: this,
            repeat:0
        });
     }
    if(P1lives<=0 && P1Life==false)
    {
        P1Death = this.physics.add.sprite(player1.x+30,player1.y, 'reckage');
        P1Death.setScale(0.5);
        P1Death.body.velocity.y=200;
        P1Death.body.setAllowGravity(false);
        P1Death.body.immovable = true;
        this.crash.play();
        P1Death=true;   
        player1.destroy();
    }
}

hitPlayer2ExplosionBoss(player1, object, time, bullet)
{
    if(P2Life==true)
     {
        P2lives--;
        P2lives--;
        this.bullet.destroy();
        this.explosion = this.explosions.create(object.x-15,object.y,'reck');
        this.explosion.play("reck");
       
        this.time.addEvent({ 
        delay: 1400, 
        callback: this.explosionsHandler, 
        args: [this.explosion],
        callbackScope: this,
        repeat:0,
    });

        player1.alpha = 0.4;
        this.livesP2.setText("Vidas P2: "+P2lives);
		
        P2Life=false; 
        this.time.addEvent({ 
            delay: 3000, 
            callback: this.playerDeathImune2, 
            callbackScope: this,
            repeat:0
        });
     }
    if(P2lives<=0 && P2Life==false)
    {
        P2Death = this.physics.add.sprite(player1.x+30,player1.y, 'reckage');
        P2Death.setScale(0.5);
        P2Death.body.velocity.y=200;
        P2Death.body.setAllowGravity(false);
        P2Death.body.immovable = true;
        this.crash.play();
        P2Death=true;   
        player1.destroy();
    }
}


hitBulletBoss(bullet, object, time, boss){

    if(BossLife == true){
        BossLives--;
        BossLives--;
        BossLives--;
        BossLives--;
        BossLives--;
        this.bullet.destroy();
        this.explosion = this.explosions.create(object.x-15,object.y,'reck');
        this.explosion.play("reck");
		this.explosion.setScale(0.5);
        this.explosion.body.velocity.y=50;
       
        this.time.addEvent({ 
        delay: 1400, 
        callback: this.explosionsHandler, 
        args: [this.explosion],
        callbackScope: this,
        repeat:0,
    });
        this.livesBoss.setText("Boss Shield: " + BossLives + "%");
        BossLife = false;
        this.time.addEvent({ 
            delay: 500, 
            callback: this.bossimune, 
            callbackScope: this,
            repeat:0
        });

    }

    if(BossLives<=0 && BossLife==false){
        //BossDeath = this.physics.add.sprite(this.boss.x+30,this.boss.y, 'reckage');
        //BossDeath.setScale(3);
        BossDeath = true;
        this.boss.destroy();
    }    

}

 bossimune()
{
    if(BossLife==false && BossLives>0)
    {
        BossLife=true;
    }
}

playerinstakill(){
    if(P1Life == true){
        P1Life= false;
        P1Death = true;
    }
}

player2instakill(){
  if(P2Life == true){
        P2Life= false;
        P2Death = true;
    }
}

}