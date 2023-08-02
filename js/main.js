const operations = document.querySelectorAll('#operation>.digits-round');
const digits = document.querySelectorAll('#levels > .digits-round');
const types = document.querySelectorAll('#type > .digits-round')
// const numpad = document.querySelector('input');
const sections = document.querySelectorAll('.levels');
const nextBtn = document.querySelector('#nextBtn');
const inputBox = document.querySelector('#numbers > input');
const alertBox = document.querySelector('#alert');
const nums = document.querySelectorAll('.num');
const checkBtn = document.querySelector('#answer');
const symbol = document.querySelector('.symbol');
const answerBox = document.querySelector('#answerBox');
const attemptsLeft = document.querySelector('#attempts');
const wrongMsg = document.querySelector('.wrong');
const clock = document.querySelector('.clock');
const skipBtn = document.querySelector('#skip');
const nextQesBtn = document.querySelector('#next');
const revealer = document.querySelector('.revealer');
const resultBox = document.querySelector('.results');
const scoreMsg = document.querySelector('.score');
const choicesCont = document.querySelector('.choices');
const choices = document.querySelectorAll('.choice');
const abandonBtn = document.querySelector('.abandon');
const endlessBtn = document.querySelector('#endless');
const retryBtn = document.querySelector('.retryBtn');
const questionNumber = document.querySelector('.question-num');
const backBtn = document.querySelector('.backBtn');

let questions = [];
let answers = [];
let qesNum = 1;
let score = 0;
let op = null, ds = null, numReq= null, type = null;
let indexOfShown = 0;
function factorial(number) {
    let edited = number
    while(number > 1){
        edited *= --number;
    }
    return edited;
}

function showNext(sections, currentIndex){
    indexOfShown++;
    if (currentIndex == 0) {
        backBtn.classList.remove('hidden')
    }
    if(currentIndex == 3){
        document.querySelector('.section').classList.add('question-started');
        backBtn.classList.add('hidden')
        generateQuestions();
        setTimeout(() => {
            nextQes();
        }, 0);
    }
    if(type == 'M'){
        choicesCont.classList.remove('hidden');
        answerBox.disabled = true;
        // endlessBtn.style.display = 'none';
        generateChoices();
    }
    if(op == '!'){
        digits.forEach((digit, index) => {
            if (index != 0) {
                digit.classList.add('hidden')
            }
        })
    }
    sections[currentIndex].classList.add('hidden');
    sections[currentIndex + 1].classList.remove('hidden');
    answerBox.focus();
    inputBox.focus();
    //console.log(op, ds, numReq);
}

function showPrevious(sections){
    if(indexOfShown == 1){
        backBtn.classList.add('hidden')
    }
    sections[indexOfShown].classList.add('hidden');
    sections[indexOfShown - 1].classList.remove('hidden');
    indexOfShown--;
}

function generateQuestions(){
    try{
        recordedTime = 0
    }catch(err){
    }
    timer(10 * ds, clock);
    score = 0;
    questions = [];
    answers = [];
    qesNum = 0;
    symbol.innerHTML = op;
    if(op == 'x'){
        op = '*'
    }
    for(let i = 0; i < numReq; i++){
        let temp = '';
        let repeated;
        let childFriendly = true;
        do{
            if(op == '!'){
                temp = 1 + Math.floor(Math.random() * (7)) + op;
            }else{
                num1 = (Math.floor(Math.random() * (10 ** ds)));
                num1 == 0 ? num1++ : ''; 
                num2 = (Math.floor(Math.random() * (10 ** ds)));
                num2 == 0 ? num2++ : ''; 
                temp = `${num1} ${op} ${num2}`;
                repeated = questions.some(question => {
                    return (question.split('').sort().join('') == temp.split('').sort().join(''));
                });
                childFriendly = ((eval(temp) == Math.floor(eval(temp))) && eval(temp) >= 0);
                //console.log(temp, childFriendly, repeated);
            }
        }while(!childFriendly || repeated);
        questions.unshift(temp);
        //console.log('out');
    }
    questions.forEach(question => {
        if(op == '!'){
            answers.push(factorial(question.split('!').join('')));
        }else{
            answers.push(eval(question));
        }
    });
}

let allChoices = []

function generateChoices(){
    allChoices = [];
    checkBtn.style.display = "none";
    answers.forEach(answer => {
        let choicesArr = [];
        let correctIndex = null;

        do {
            let temp = answer - 10 + Math.floor(Math.random() * (20));
            if(temp != answer){
                choicesArr.unshift(temp);
            }
            choicesArr = [...new Set(choicesArr)];
        } while (choicesArr.length < 4);
        

        correctIndex = Math.floor(Math.random() * 4);
        choicesArr[correctIndex] = answer;

        allChoices.push(choicesArr);
    })
}

function showResults(){
    pauseTime();
    resultBox.classList.remove('hidden');
    if(endless){
        scoreMsg.innerHTML = `You have answerd ${score} questions out of ${questions.length} questions in ${clock.innerText}`
    }else{
        scoreMsg.innerHTML = `You have answerd ${score} out of ${questions.length} questions correctly`
    }
}


function nextQes(){
    // nextEnter(false);
    questionNumber.innerHTML = `#${qesNum + 1}`
    if (attemptsLeft.innerText == 0 && endless) {
        showResults();
    }
    readjustBar();
    styleChangeChoice('revert', choices);
    qesNum++;
    if(type == 'f'){
        answerBox.disabled = false;
    }
    if (type == 'M') {
        try{
            choices.forEach((choice, index) => {
                choice.innerHTML = allChoices[qesNum - 1][index];
            })
        }catch(err){

        }
    }
    checkBtn.classList.remove('inactive');
    skipBtn.classList.remove('inactive');
    nextQesBtn.classList.remove('wrongAns');
    wrongMsg.classList.add('invisible-text');
    if(!endless){
        attemptsLeft.innerHTML = 3;
        attemptsLeft.classList.add('regenerate');
    
        setTimeout(() => {
            attemptsLeft.classList.remove('regenerate');
        }, 1500);
    }

    nextQesBtn.classList.add('inactive');
    nextQesBtn.classList.remove('active');
    
    if(qesNum - 1 < numReq){
        if(!endless){
            timer(10 * ds, clock);
        }else{
            timer(recordedTime, clock);
        }
        nums[0].innerHTML = questions[qesNum - 1].split(op)[0];
        nums[1].innerHTML = questions[qesNum - 1].split(op)[1];
        if(op == "!"){
            nums[1].innerHTML = '';
        }
        answerBox.value = '';
        answerBox.focus();
    }else if(qesNum - 1 == numReq){
        showResults();
    }
}

let startTimer = null;
let abandoned = false;

function pauseTime() {
    clearInterval(startTimer);
}
let recordedTime = 0;
function timer(time, clock){
    try{
        clearInterval(startTimer);
    }catch(err){
    }
    if(!endless){
        let minute = 0;
        let second = time;
        clock.innerHTML = minute + ':' + second;
        startTimer = setInterval(function(){
            time--;
            minute = String(Math.floor(time/60));
            second = String(time % 60);
            if(second.length == 1){
                second = '0' + second
            }
            clock.innerHTML = minute + ':' + second
            if (time <= 0 && attemptsLeft.innerText > 1) {
                attemptsLeft.innerHTML = --attemptsLeft.innerText;
                styleChange(false, attemptsLeft.innerText, time);
                clearInterval(startTimer);
                setTimeout(() => {
                    timer(15, clock)
                }, 1000);
                return;
            }else if(time <= 0){
                clearInterval(startTimer);
                attemptsLeft.innerHTML = --attemptsLeft.innerText;
                showAnswer('time');
                return;
            }
        }, 1000)
    }else{
        let minute = 0;
        let second = '00';
        time = recordedTime;
        if(time == 0){
            clock.innerHTML = minute + ':' + second;
        }
        startTimer = setInterval(function(){
            time++;
            minute = String(Math.floor(time/60));
            second = String(time % 60);
            if(second.length == 1){
                second = '0' + second
            }
            clock.innerHTML = minute + ':' + second;
            recordedTime = time;
        }, 1000)
    }
}

function showAnswer(param){
    checkBtn.classList.add('inactive');
    skipBtn.classList.add('inactive');
    answerBox.disabled = true;
    switch (param) {
        case 'time':
            styleChange(false, 0, 0);
            break;
        case 'attempt':
            styleChange(false, 0, null);            
            break;
    
        default:
            break;
    }
}

function styleChange(status, attemptRemains, time){
    wrongMsg.classList.remove('correct');
    if(time === 0 && attemptRemains === 0){
        nextQesBtn.classList.remove('inactive');
        nextQesBtn.classList.add('active');
        nextQesBtn.classList.add('wrongAns');
        wrongMsg.classList.remove('invisible-text');
        wrongMsg.innerHTML = `Time's up!  The answer was: ${answers[qesNum - 1]}`;
        clock.classList.add('blink');
        setTimeout(() => {
            clock.classList.remove('blink');
        }, 1000);
    }else if(time === 0 && attemptRemains !== 0){
        //console.log('incorrect');
        wrongMsg.classList.remove('invisible-text');
        wrongMsg.innerHTML = 'Time Up!';
        answerBox.classList.add('wrong-answerBox');
        attemptsLeft.classList.add('blink');
        setTimeout(() => {
            attemptsLeft.classList.remove('blink');
            wrongMsg.classList.add('invisible-text');
            answerBox.classList.remove('wrong-answerBox');
            answerBox.focus();
        }, 1000);
    }else if (status) {
        wrongMsg.classList.add('invisible-text');
        wrongMsg.classList.remove('invisible-text');
        wrongMsg.classList.add('correct')
        wrongMsg.innerHTML = 'Correct!';
        nextQesBtn.classList.remove('inactive');
        nextQesBtn.classList.add('active');
        //console.log('correct');
    }else if(attemptRemains === 0){
        pauseTime();
        nextQesBtn.classList.remove('inactive');
        nextQesBtn.classList.add('active');
        nextQesBtn.classList.add('wrongAns');
        wrongMsg.classList.remove('invisible-text')
        wrongMsg.innerHTML = `Incorrect answer! The answer was ${answers[qesNum - 1]}`;
        attemptsLeft.classList.add('blink');
        setTimeout(() => {
            attemptsLeft.classList.remove('blink');
        }, 1000)
    }else{
        //console.log('incorrect');
        wrongMsg.classList.remove('invisible-text');
        wrongMsg.innerHTML = 'Wrong answer';
        answerBox.classList.add('wrong-answerBox');
        attemptsLeft.classList.add('blink');
        setTimeout(() => {
            attemptsLeft.classList.remove('blink');
            wrongMsg.classList.add('invisible-text');
            answerBox.classList.remove('wrong-answerBox');
            answerBox.focus();
        }, 1000);
    }
}

function readjustBar(){
    revealer.style.width = ((numReq - qesNum)/numReq) * 100 + '%'
}

function styleChangeChoice(correct, clicked) {
    if(correct === 'revert'){
        choicesCont.classList.add('not-inactive');
        clicked.forEach(element => {
            element.classList.remove('success')
        });
    }else if(correct){
        clicked.classList.add('success');
        choicesCont.classList.remove('not-inactive');
    }else {
        clicked.classList.add('fail');
        choicesCont.classList.remove('not-inactive');
        if(!endless && attemptsLeft.innerText !== 0){
            setTimeout(() => {
                clicked.classList.remove('fail');
                choicesCont.classList.add('not-inactive');
            }, 1000)
        }
    }
}

function dropHint(){
    wrongMsg.classList.remove('invisible-text');
    wrongMsg.innerHTML = `Wrong answer! Hint: the number starts with a ${String(answers[qesNum - 1])[0]}`;
    attemptsLeft.classList.add('blink');
    setTimeout(() => {
        attemptsLeft.classList.remove('blink');
    }, 1000)
    //console.log('hint time');
}

// function nextEnter(status){
//     if(status){
//         window.addEventListener('keydown', e => {
//             if(e.key.toLowerCase() == 'enter'){
//                 nextQesBtn.click();
//             }
//             answerBox.removeEventListener('keydown', e => {
//                 if(e.keyCode == 13)
//                     checkBtn.click();
//             })
//         })
//         window.addEventListener('keyup', e => {
//             answerBox.addEventListener('keydown', e => {
//                 if(e.keyCode == 13)
//                     checkBtn.click();
//             })
//         })
//     }else{
//         window.removeEventListener('keydown', e => {
//             if(e.key.toLowerCase() == 'enter'){
//                 nextQesBtn.click();
//             }
//             answerBox.removeEventListener('keydown', e => {
//                 if(e.keyCode == 13)
//                     checkBtn.click();
//             })
//         })
//         window.removeEventListener('keyup', e => {
//             answerBox.addEventListener('keydown', e => {
//                 if(e.keyCode == 13)
//                     checkBtn.click();
//             })
//         })
//     }
// }

function check(button){
    if(type == 'M'){
        chosen = button.innerText;
    }else{
        chosen = answerBox.value;
    }
    if(qesNum - 1 == numReq){
        nextBtn.innerHTML = 'Results'
    }
    if(chosen != answers[qesNum - 1] && endless && chosen !== ''){
        attemptsLeft.innerHTML = --attemptsLeft.innerText;
        console.log('im here');
        pauseTime();
        // nextEnter(true);
        if(type != 'f'){
            styleChangeChoice(false, button);
        }
        showAnswer('attempt');
    }
    else if((attemptsLeft.innerText == 2) && chosen != answers[qesNum - 1] && String(answers[qesNum - 1]).length > 1 && type == 'f'){
        attemptsLeft.innerHTML = --attemptsLeft.innerText;
        dropHint();
    }
    else if((attemptsLeft.innerText == 1) && chosen != answers[qesNum - 1]){
        attemptsLeft.innerHTML = --attemptsLeft.innerText;
        pauseTime();
        showAnswer('attempt');
    }else if(attemptsLeft.innerText != 0 && chosen !== ''){
        //console.log(`${questions} \n ${answers.toString()}`);
        if(chosen == answers[qesNum - 1]){
            checkBtn.classList.add('inactive');
            skipBtn.classList.add('inactive');
            score++;
            type == 'M' ? styleChangeChoice(true, button) : '';
            styleChange(true, attemptsLeft, null);
            pauseTime();
            // nextEnter(true);
        }else{
            attemptsLeft.innerHTML = --attemptsLeft.innerText;
            type == 'M' ? styleChangeChoice(false, button) : '';
            styleChange(false, attemptsLeft + 1, null);
            clearInterval(startTimer);
            if(!endless)
                timer(10 * ds, clock);
            setTimeout(() => {
                answerBox.innerHTML = '';
            }, 1000);
        }
    }else if(chosen === ''){
        wrongMsg.classList.remove('correct')
        wrongMsg.classList.remove('invisible-text');
        wrongMsg.innerHTML = 'No input';
        answerBox.classList.add('wrong-answerBox');
        setTimeout(() => {
            wrongMsg.classList.add('invisible-text');
            answerBox.classList.remove('wrong-answerBox');
        }, 1000);
    }
}

abandonBtn.addEventListener('click', () => {
    showResults();
})
answerBox.addEventListener('keydown', e => {
    if(e.keyCode == 13)
        checkBtn.click();
})
checkBtn.addEventListener('click', () => {
    if(!checkBtn.classList.contains('inactive')){
        check();
    }
});
nextQesBtn.addEventListener('click', () => {
    if(nextQesBtn.classList.contains('active') && !nextQesBtn.classList.contains('inactive')){
        nextQes();
    }
})
// window.addEventListener('keydown', e => {
//     if(clock.innerText != '0:00' && e.key.toLowerCase() == 'enter' && !nextQesBtn.classList.contains('inactive')){
//         nextQesBtn.click();
//     }
// })
skipBtn.addEventListener('click', () => {
    if(!skipBtn.classList.contains('inactive')){
        nextQes();
    }
})
choices.forEach(choice => {
    choice.addEventListener('click', () => {
        if(choice.parentElement.classList.contains('not-inactive')){
            check(choice);
        }
    })
})

nextBtn.addEventListener('click', e => {
    alertBox.classList.remove('hidden');
    if(inputBox.value > 0 && inputBox.value <= 100 && inputBox.value != ''){
        alertBox.classList.add('hidden');
        numReq = inputBox.value;
        showNext(sections, 3);
    }else{
        inputBox.value = '';
        inputBox.focus();
    }
})

let endless = false;
endlessBtn.addEventListener('click', () => {
    endless = true;
    nextBtn.click();
})
operations.forEach(operation => {
    operation.addEventListener('click', e => {
        op = operation.innerText[0];
        showNext(sections, 1);
    })
})
digits.forEach(digit => {
    digit.addEventListener('click', e => {
        ds = digit.innerText[0];
        showNext(sections, 2);
    })
})
types.forEach(div => {
    div.addEventListener('click', () => {
        type = div.innerText[0]
        showNext(sections, 0)
    })
})
retryBtn.addEventListener('click', () => {
    let resultBoxUpdated = document.querySelector('.results');
    resultBoxUpdated.classList.add('hidden');
    score = 0;
    attemptsLeft.innerHTML = 3;
    generateQuestions();
    if (type == 'M') {
        generateChoices();
    }
    nextQes();
})
backBtn.addEventListener('click', () => {
    showPrevious(sections)
})
