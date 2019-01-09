// here is useless stuff
let genRandNum = (maxNum) => Math.floor(Math.random()* (maxNum-1+1))+1;

let characterObj = () => {

    let obj = {
        strength: 12,
        cunning: 12,
        speed: 12,
        fatigue: 30
    };

    return obj;
};

let character;

function shuffle(array) {
    let j, x, i;
    for (i = array.length -1; i> 0; i--){
        j = genRandNum(i + 1);
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    };
    return array;
};

function modifyCharacter() {
    let newCharacter = characterObj();
    let keys = Object.keys(newCharacter);
    let shuffledArr = shuffle(keys);

    for (i in shuffledArr){
        if (i<=1){
            if (shuffledArr[i] === 'fatigue') {
                newCharacter[shuffledArr[i]] += genRandNum(6);
            } else{
                newCharacter[shuffledArr[i]] += genRandNum(6);
            };
        };
        if (i>1){
            if (shuffledArr[i] === 'fatigue') {
                newCharacter[shuffledArr[i]] -= genRandNum(6);
            } else{
                newCharacter[shuffledArr[i]] -= genRandNum(6);
            };
        };
    };

    return newCharacter;
};

function newCharacter() {
    character = modifyCharacter();

    const strengthStatElement = document.getElementById('strengthStat');
    const cunningStatElement = document.getElementById('cunningStat');
    const speedStatElement = document.getElementById('speedStat');
    const fatigueStatElement = document.getElementById('fatigueStat');

    strengthStatElement.innerHTML=character.strength;
    cunningStatElement.innerHTML=character.cunning;
    speedStatElement.innerHTML=character.speed;
    fatigueStatElement.innerHTML=character.fatigue;

    sessionStorage.setItem('character', JSON.stringify(character));
    let startButton = document.getElementById('btn-start');
    startButton.style.visibility='visible';
};
// end of copy paste

// How is the bot getting infinity damage when attacking

let oppStrengthElement, oppCunningElement, oppSpeedElement, oppFatigueElement;
let characterStrengthElement, characterCunningElement, characterSpeedElement, characterFatigueElement;
let finisherBtn;
let player = JSON.parse(sessionStorage.getItem('character'));
let opponent = modifyCharacter();
let currentOpponent = 0;

function initialize(){
    opponent.strengthElement = document.getElementById('opponent-strength-stat');
    opponent.cunningElement = document.getElementById('opponent-cunning-stat');
    opponent.speedElement = document.getElementById('opponent-speed-stat');
    opponent.fatigueElement = document.getElementById('opponent-fatigue-stat');

    player.strengthElement = document.getElementById('characterStrengthStat');
    player.cunningElement = document.getElementById('characterCunningStat');
    player.speedElement = document.getElementById('characterSpeedStat');
    player.fatigueElement = document.getElementById('characterFatigueStat');

    log = document.getElementById('log');

    finisherBtn = document.getElementById('btn-finisher');

    // Make sure fatigue doesnt rise above 0
    player.originalFatigue = player.fatigue;
    opponent.originalFatigue = opponent.fatigue;

    check();
};

function check(){
    console.log(opponent, player);
    
    if (player.fatigue > player.originalFatigue){
        player.fatigue = player.originalFatigue;
    };

    if (opponent.fatigue > opponent.originalFatigue){
        opponent.fatigue = opponent.originalFatigue;
    };

    player.strengthElement.innerHTML=player.strength
    player.cunningElement.innerHTML=player.cunning;
    player.speedElement.innerHTML=player.speed;
    player.fatigueElement.innerHTML=player.fatigue;

    opponent.strengthElement.innerHTML=opponent.strength;
    opponent.cunningElement.innerHTML=opponent.cunning;
    opponent.speedElement.innerHTML=opponent.speed;
    opponent.fatigueElement.innerHTML=opponent.fatigue;

    if (player.fatigue>=opponent.fatigue*2){
        finisherBtn.style.visibility='visible';
    };
};

function getBotAction(){
    let botActions = ['attack', 'defend'];
    if (player.fatigue*2<=opponent.fatigue){
        return 'finisher';
    }else {
        return botActions[Math.floor(Math.random()*2)]
    };
};

function attack(){
    let damage = (player.strength + player.speed + player.cunning)/(genRandNum(6));
    let defense = player.speed + genRandNum(6);
    console.log(`Player damage of ${damage} and defense of ${defense}`);
    log.innerHTML=`Player damage of ${damage} and defense of ${defense}<br />` + log.innerHTML;

    

    let botAction = getBotAction();
    if (botAction === 'attack'){
        let botAttack = (opponent.strength + opponent.speed + opponent.cunning)/genRandNum(6);
        console.log(botAttack);
        
        let botDefense = opponent.speed + genRandNum(6);
        console.log(`Bot damage of ${botAttack} and defense of ${botDefense}`);
        log.innerHTML=`Bot damage of ${botAttack} and defense of ${botDefense}<br />` + log.innerHTML;
        
        if (attack - botDefense > 0){
            let playerDealtDamage = damage - botDefense;
            opponent.fatigue -= playerDealtDamage;
            console.log(`Player has dealt ${playerDealtDamage} damage`);
            log.innerHTML=`Player has dealt ${playerDealtDamage} damage<br />` + log.innerHTML;
        };
        if (botAttack - defense > 0){
            let botDealtDamage = botAttack - defense;
            player.fatigue -= botDealtDamage;
            console.log(`Bot has done ${botDealtDamage} damage`);
            log.innerHTML=`Bot has done ${botDealtDamage} damage<br />` + log.innerHTML;

        };
    };

    if (botAction === 'defend'){
        let botDefense = opponent.speed + opponent.cunning;
        console.log(`Bot defense of ${botDefense}`);
        log.innerHTML=`Bot defense of ${botDefense}<br />` + log.innerHTML;

        
        if (damage - botDefense > 0){
            let playerDealtDamage = damage - botDefense;
            opponent.fatigue -= playerDealtDamage;
        };
        opponent.fatigue += genRandNum(6);
    };

    if (botAction === 'finisher'){
        let botDefense = opponent.speed + genRandNum(6);
        let botFinisher = opponent.strength + opponent.speed;

        if (botFinisher > defense){
            console.log('The bot has won the game');
            window.location.href='../front-end/bot-win.html'
        };

        if (damage - botDefense > 0){
            console.log(`Player will do ${damage - botDefense}`);
            log.innerHTML=`Player will do ${damage - botDefense}<br />` + log.innerHTML;

            opponent.fatigue -= damage - botDefense;
        };
    };
    check();
};

function defend(){
    let defense = player.speed + player.cunning;
    let botAction = getBotAction();

    if (botAction === 'attack'){
        // bot will attempt to attack
        let botAttack = (opponent.strength + opponent.speed + opponent.cunning)/genRandNum(6);
        console.log(botAttack);
        log.innerHTML=botAttack + '<br />' + log.innerHTML;

        
        let botDealtDamage = botAttack - defense;
        console.log(`Bot will attempt to do ${botDealtDamage}`);
        log.innerHTML=`Bot will attempt to do ${botDealtDamage}` + log.innerHTML;

        
        
        if (botDealtDamage > 0){
            player.fatigue -= botDealtDamage;
        };
    };

    if (botAction === 'defend'){
        // nothing will happen, since both are defending. Just gains fatigue
        console.log('Both are in defense');
        log.innerHTML='Both are in defense<br />' + log.innerHTML;

        
        botAction.fatigue += genRandNum(6);
    };

    if (botAction === 'finisher'){
        let botFinisher = opponent.strength + opponent.speed;
        if (botFinisher - defense > 0){
            console.log('bot has won');
            log.innerHTML='bot has won' + log.innerHTML;

            window.location.href='../front-end/bot-win.html'
        };
    };

    player.fatigue += genRandNum(6);
    check();
};

function finisher(){
    let damage = player.strength + player.speed;
    let defense = player.speed + genRandNum(6);
    let botAction = getBotAction();

    if (botAction === 'attack'){
        let botAttack = (opponent.strength + opponent.speed + opponent.cunning)/genRandNum(6);
        console.log(`Bot can do ${botAttack} damage`);
        log.innerHTML=`Bot can do ${botAttack} damage<br />` + log.innerHTML;

        
        if (botAttack - defense > 0){
            player.fatigue -= botAttack - defense;
        };

        if (damage - defense > 0){
            console.log('Player has won');
            window.location.href='../front-end/player-win.html';;
        };
    };

    if (botAction === 'defend'){
        let botDefense = opponent.speed + opponent.cunning;
        console.log(`Bot defense of ${botDefense}`);
        log.innerHTML=`Bot defense of ${botDefense}<br />` + log.innerHTML;

        
        if (damage > botDefense){
            console.log('Player has won');
            window.location.href='../front-end/player-win.html';

        };
    };

    if (botAction === 'finisher'){
        let botFinisher = opponent.strength + opponent.speed;
        let botDefense = opponent.speed + opponent.cunning;

        if (botFinisher > defense){
            console.log(`Bot has won`);
            window.location.href='../front-end/bot-win.html'
        };

        if (damage > botDefense){
            console.log(`Player has won`);
            window.location.href='../front-end/player-win.html'
        };
    };
};