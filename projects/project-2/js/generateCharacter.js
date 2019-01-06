let characterObj = () => {

    let charObj = {
        strength: 12,
        cunning: 12,
        speed: 12,
        fatigue: 12 
    };

    return charObj;
};

let character;

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

function modifyCharacter() {
    let character = characterObj();
    let keys = Object.keys(character);
    let shuffledArr = shuffle(keys);

    for (i in shuffledArr){
        if (i<=1){
            if (shuffledArr[i] === 'fatigue') {
                character[shuffledArr[i]] += genRandNum(6);
            } else{
                character[shuffledArr[i]] += genRandNum(6);
            };
        };
        if (i>1){
            if (shuffledArr[i] === 'fatigue') {
                character[shuffledArr[i]] -= genRandNum(6);
            } else{
                character[shuffledArr[i]] -= genRandNum(6);
            };
        };
    };

    return character;
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
};
