import  Game from './Game.js';

export default class Menu extends Phaser.Scene{
    constructor(){
        super({key:'Menu'});
    }
    preload(){
        this.load.image("background", "assets/background.jpg");
        this.load.audio("menusong", "assets/menusong.wav");
        this.load.image("one", "assets/1.png");
        this.load.image("two", "assets/2.png");
    }
    create(){

        this.menusong= this.sound.add('menusong'); 
        this.menusong.play();
        this.menusong.setLoop(true);
        
        this.background = this.add.tileSprite(400,350,800,700,"background");
        this.one = this.add.tileSprite(200,350,0,0,"one");
        this.one.setScale(0.2);
        this.two = this.add.tileSprite(200,500,0,0,"two");
        this.two.setScale(0.2);
        
        this.add.text(120, 100, "MAIN MENU", {
            font: "100px Cambria",
            fill: "#FFFFFF"
          });

        this.add.text(250, 325, " SinglePlayer", {
            font: "50px Cambria",
            fill: "#FFFFFF"
          });

        this.add.text(250, 475, " CO-OP ", {
            font: "50px Cambria",
            fill: "#FFFFFF"
          });
        
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.num2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO);
        this.num1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE);
        
        this.num2.on('down',function(event){
            console.log(this);
            this.menusong.stop();
            this.scene.stop();
            this.scene.start('Game');
        }.bind(this));

        this.num1.on('down',function(event){
            console.log(this);
            this.menusong.stop();
            this.scene.stop();
            this.scene.start('SingleGame');
        }.bind(this));

    }
}
