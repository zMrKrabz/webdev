// template character object
let characterObj = () => {

    let charObj = {
        strength: 12,
        cunning: 12,
        speed: 12,
        fatigue: 30
    };

    return charObj;
};

let character;

// a random number based on max number input
let genRandNum = (maxNum) => Math.floor(Math.random()*maxNum);

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

// modifies the character, decrease 2 and increase 2
function modifyCharacter() {
    let newCharacter = characterObj();
    let keys = Object.keys(newCharacter);
    let shuffledArr = shuffle(keys);

    for (i in shuffledArr){
        if (i<=1){
            if (shuffledArr[i] === 'fatigue') {
                newCharacter[shuffledArr[i]] += genRandNum(6);
            } else{
                newCharacter[shuffledArr[i]] += genRandNum(3);
            };
        };
        if (i>1){
            if (shuffledArr[i] === 'fatigue') {
                newCharacter[shuffledArr[i]] -= genRandNum(6);
            } else{
                newCharacter[shuffledArr[i]] -= genRandNum(3);
            };
        };
    };

    return newCharacter;
};

// generates a new character
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
