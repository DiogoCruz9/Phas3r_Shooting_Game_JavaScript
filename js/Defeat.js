
export default class Defeat extends Phaser.Scene{
    constructor(){
        super({key:'Defeat'});
    }
    preload(){
        this.load.image("background", "assets/background.jpg");
        this.load.audio("defeat", "assets/defeat.wav");
        this.load.image("def", "assets/def.png");
    }
    create(){

        this.background = this.add.tileSprite(400,350,800,700,"background");
        this.def = this.add.tileSprite(400,200,0,0,"def");
        this.def.setScale(2);

        this.add.text(50, 300, "Press SPACE to Restart", {
            font: "75px Cambria",
            fill: "#FFFFFF"
          });

        this.defeat= this.sound.add('defeat'); 
        this.defeat.play();
        
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.spaceBar.on('down',function(event){
            console.log(this);
           // this.defeat.stop();
            this.scene.stop();
            this.scene.start('Menu');
        }.bind(this));
    

    }
}
