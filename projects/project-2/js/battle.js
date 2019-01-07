let oppStrengthElement, oppCunningElement, oppSpeedElement, oppFatigueElement;
let characterStrengthElement, characterCunningElement, characterSpeedElement, characterFatigueElement;
let finisherBtn;
let player = JSON.parse(sessionStorage.getItem('character'));
let opponents = [];
let currentOpponent = 0;

function initialize(){
    oppStrengthElement = document.getElementById('opponent-strength-stat');
    oppCunningElement = document.getElementById('opponent-cunning-stat');
    oppSpeedElement = document.getElementById('opponent-speed-stat');
    oppFatigueElement = document.getElementById('opponent-fatigue-stat');

    characterStrengthElement = document.getElementById('characterStrengthStat');
    characterCunningElement = document.getElementById('characterCunningStat');
    characterSpeedElement = document.getElementById('characterSpeedStat');
    characterFatigueElement = document.getElementById('characterFatigueStat');

    log = document.getElementById('log');

    finisherBtn = document.getElementById('btn-finisher');
    for (let i=0;i<3;i++){
        opponents.push(modifyCharacter());
    };

    // Make sure fatigue doesnt rise above 0
    playerOriginalFatigue = player.fatigue;
    opponentOriginalFatigue = opponents[currentOpponent].fatigue;

    check();
};

function check(){
    if (player.fatigue > playerOriginalFatigue){
        player.fatigue = playerOriginalFatigue
    };
    if (opponents[currentOpponent].fatigue > opponentOriginalFatigue){
        opponents[currentOpponent].fatigue = opponentOriginalFatigue;
    };

    characterStrengthElement.innerHTML=player.strength
    characterCunningElement.innerHTML=player.cunning;
    characterSpeedElement.innerHTML=player.speed;
    characterFatigueElement.innerHTML=player.fatigue;

    oppStrengthElement.innerHTML=opponents[currentOpponent].strength;
    oppCunningElement.innerHTML=opponents[currentOpponent].cunning;
    oppSpeedElement.innerHTML=opponents[currentOpponent].speed;
    oppFatigueElement.innerHTML=opponents[currentOpponent].fatigue;

    if (player.fatigue*2===opponents[currentOpponent].fatigue){
        finisherBtn.style.visibilility='visible';
    };
};

function attack(person){
    let damage;
    if (person === 'player'){
        damage = (player.strength + player.speed + player.cunning)/(genRandNum(6));
    }else {
        damage = (opponents[currentOpponent].strength + opponents[currentOpponent].speed + opponents[currentOpponent].cunning)/(genRandNum(6));
    };

    return damage;
};

function defend(person){
    let defense;
    if (person === 'player'){
        defense = player.speed + player.cunning;
    }else {
        defense = opponents[currentOpponent].speed + opponents[currentOpponent].cunning;
    };

    return defend;
};

function getBotAction(){
    let botActions = ['attack', 'defend'];
    if (player.fatigue*2<=opponents[currentOpponent].fatigue){
        return 'finisher';
    }else {
        return botActions[Math.floor(Math.random()*2)]
    };
};

// happens every turn. The action is the action submitted by the player
function play(action){
    let defense = player.speed + genRandNum(6);

    function attackAction(){
        let damage = attack('player');
        let botAction = getBotAction();
        
        if (botAction === 'attack'){
            let botDamage = attack('bot');
            if ((botDamage - defense) > 0){
                player.fatigue -= botDamage - defense;
            };
            if ((damage - opponents[currentOpponent].defense) > 0){
                opponents[currentOpponent].fatigue -= damage - opponents[currentOpponent].defense;
            };
        };

        if (botAction === 'defend'){
            let botDefense = defend('bot');
            // If a fighter defends and does not take damage on that turn, it will recover 1-6 random fatigue points.
            // Fatigue may never rise above the original level, but may go below 0.
            if ((damage - botDefense) > 0){
                opponents[currentOpponent].fatigue -= botDamage - defense;
            }else {
                opponents[currentOpponent].fatigue += genRandNum(6);
                if (opponents[currentOpponent].fatigue > opponentOriginalFatigue){
                    opponents[currentOpponent].fatigue = opponentOriginalFatigue
                };
            };
        };

        // A Finishing Move is a standard attack, but Cunning is not calculated into the formula.
        if (botAction === 'finisher'){
            let finisher = attack('bot') - opponents[currentOpponent].cunning;
            if (finisher > player.defense){
                log.innerHTML='<p>The bot has won</p>' + log.innerHTML;
            } else{
                if (damage > opponents[currentOpponent].defense){
                    opponents[currentOpponent].fatigue -= damage > opponents[currentOpponent].defense;
                };
            };
        };
    };

    function defendAction(){
        // need to add regain fatigue
        let defense = defend('player');
        let botAction = getBotAction();
        
        if (botAction === 'attack'){
            let botDamage = attack('bot');
            if ((botDamage - defense) > 0){
                player.fatigue -= botDamage - defense;
            };
        };

        if (botAction === 'defend'){
            opponents[currentOpponent].fatigue += genRandNum(6);
            player.fatigue += genRandNum(6);
        };

        // A Finishing Move is a standard attack, but Cunning is not calculated into the formula.
        if (botAction === 'finisher'){
            let finisher = attack('bot') - opponents[currentOpponent].cunning;
            if (finisher > defense){
                log.innerHTML='<p>The bot has won</p>' + log.innerHTML;
            };
        };
    };

    function finisherAction(){
        let finisher = attack('player') - player.cunning;
        let botAction = getBotAction();
        
        if (botAction === 'attack'){
            let botDamage = attack('bot');
            if ((botDamage - player.defense) > 0){
                player.fatigue -= botDamage - player.defense;
            };
            if ((damage - opponents[currentOpponent].defense) > 0){
                opponents[currentOpponent].fatigue -= damage - opponents[currentOpponent].defense;
            };
        };

        if (botAction === 'defend'){
            opponents[currentOpponent].fatigue += genRandNum(6);
        };

        // A Finishing Move is a standard attack, but Cunning is not calculated into the formula.
        if (botAction === 'finisher'){
            let botFinisher = attack('bot') - opponents[currentOpponent].cunning;
            if (botFinisher > player.defense){
                log.innerHTML='<p>The bot has won</p>' + log.innerHTML;
            };
        } else{
            if (finisher){
                log.innerHTML='<p>The player has won</p>' + log.innerHTML;
            };
        };
    };

    switch (action){
        case 'attack': attackAction();
        case 'defend': defendAction();
        case 'finisher': finisherAction();
    };
};

// improve this by just exporting out of generateCharacter.js please
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

let characterObj = () => {

    let charObj = {
        strength: 12,
        cunning: 12,
        speed: 12,
        fatigue: 30
    };

    return charObj;
};

function shuffle(array) {
    let j, x, i;
    for (let i = array.length -1; i> 0; i--){
        j = genRandNum(i + 1);
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    };
    return array;
};

let genRandNum = (maxNum) => Math.floor(Math.random()*maxNum);
// all of the above is not really needed