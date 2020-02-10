import './phaser.js';

 export default {   
    type: Phaser.AUTO,   
    width: 800,   
    height: 625,    
    pixelArt: false,
    physics: {      
        default: 'arcade',       
        arcade: {           
            gravity: {y: 0},                
        }   
    },       
};
