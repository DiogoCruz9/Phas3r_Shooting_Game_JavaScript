import config from './config.js';
import Game from './Game.js';
import Menu from './Menu.js';
import Defeat from './Defeat.js';
import SingleGame from './SingleGame.js';
import Victory from './Victory.js';

class Order extends Phaser.Game{
    constructor(){
        super(config);
        this.scene.add('Game',Game);
        this.scene.add('Menu',Menu);
        this.scene.add('Victory',Victory);
        this.scene.add('Defeat',Defeat);
        this.scene.add('SingleGame', SingleGame);
        this.scene.start('Menu');
    }
}
new Order();