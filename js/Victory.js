export default class Victory extends Phaser.Scene{
    constructor(){
        super({key:'Victory'});
    }
    preload(){
        this.load.image("background", "assets/background.jpg");
        this.load.audio("victory", "assets/victory.wav");
        this.load.image("vic", "assets/vic.png");
    }
    create(){

        this.victory= this.sound.add('victory'); 
        this.victory.play();

        this.background = this.add.tileSprite(400,350,800,700,"background");
        this.vic = this.add.tileSprite(400,200,0,0,"vic");
        this.vic.setScale(2);

        this.add.text(50, 300, "Press SPACE to Restart", {
            font: "75px Cambria",
            fill: "#FFFFFF"
          });
        
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.spaceBar.on('down',function(event){
            console.log(this);
            this.victory.stop();
            this.scene.stop();
            this.scene.start('Menu');
        }.bind(this));
    }
}
