//Setting the game name
let gameName="Guess The Word";
document.title=gameName;
document.querySelector("h1").innerHTML=gameName;
document.querySelector("footer").innerHTML=`${gameName} Game Created By Seif Essam`;

// Game Settings
let numberOfTries=6;
let numberOfLetters=6;
let currentTry=1;
let hints=2;

//Manage Words
let words=[
    "banana", "cherry", "orange", "grapes", "tomato", "pepper", 
    "apples", "apricot", "durian", "guavas", "lemony", "mangos", 
    "melons", "papaya", "peachy", "plummy", "quince", "raisin", 
    "tanger", "citron"
];
let wordToGuess= words[Math.floor(Math.random()*words.length)].toLowerCase();

let messageArea=document.querySelector(".message")
// Put Hints Number in HTML
document.querySelector(".hint span").innerHTML=hints;
let hintButton = document.querySelector(".hint");
hintButton.addEventListener("click",getHint)



function generateInput(){
    const inputContainer=document.querySelector(".inputs");
    for (let index = 1; index <= numberOfTries; index++) {
        const tryDiv=document.createElement("div")
        tryDiv.classList.add(`try-${index}`)
        tryDiv.innerHTML=`<span>Try ${index}</span>`
        if (index !== 1) {
            tryDiv.classList.add("disabled-inputs")
        }
        for (let j = 1; j <= numberOfLetters; j++) {
            const input=document.createElement("input");
            input.type="text";
            input.id=`guess-${index}-letter-${j}`
            input.setAttribute("maxlength","1")
            tryDiv.appendChild(input)
            
        }
        inputContainer.appendChild(tryDiv)
    }
    inputContainer.children[0].children[1].focus();

    // Disable All Inputs Except The First One
    const inputsInDisabledDiv=document.querySelectorAll(".disabled-inputs input");
    inputsInDisabledDiv.forEach((input)=>input.disabled=true)

    //Navigation
    const inputs=document.querySelectorAll("input")
    inputs.forEach((input,index)=>{
        input.addEventListener("input",function(){
            input.value=this.value.toUpperCase()
            const nextInput=inputs[index+1];
            if (nextInput) nextInput.focus()
        })
        input.addEventListener("keydown",function(e){
            const currentIndex=Array.from(inputs).indexOf(e.target)
            if(e.key==="ArrowRight"){
                const nextInput=currentIndex+1
                if (nextInput<inputs.length) inputs[nextInput].focus();
            } if(e.key==="ArrowLeft"){
                const prevInput= currentIndex - 1;
                if (prevInput >= 0) inputs[prevInput].focus();
            }
        })
    })
}
console.log(wordToGuess)
//Game Logic
let guessButton = document.querySelector(".check");
guessButton.addEventListener("click",handleGuesses);
function handleGuesses(){
    let goodGuess=true;
    for (let index = 1; index <= numberOfLetters; index++) {
        let inputField = document.querySelector(`#guess-${currentTry}-letter-${index}`);
        let letter = inputField.value.toLowerCase();
        const currentLetter = wordToGuess[index - 1 ];
        // Guess Logic
        if (letter===currentLetter) {
            inputField.classList.add("in-place");
        }else if (wordToGuess.includes(letter) && letter!=="") {
            inputField.classList.add("not-in-place");
            goodGuess=false;
        }else{
            inputField.classList.add("no");
            goodGuess=false;
        }
    }
    if (goodGuess) {
        messageArea.innerHTML=`Good Guess The Word Is <span>${wordToGuess}</span>`;
        if (hints===2) {
            messageArea.innerHTML=`<p>Congratulations You Didn't Use any Hint</p>`;
        }
        let allRemInputs=document.querySelectorAll(".inputs > div");
        allRemInputs.forEach((tryDiv)=>tryDiv.classList.add("disabled-inputs"));
        guessButton.disabled=true;
        hintButton.disabled=true;
        }else{
            document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
            const currentTryInputs=document.querySelectorAll(`.try-${currentTry} input`);
            currentTryInputs.forEach((e)=>e.disabled=true);
            currentTry++;
            const nexttTryInputs=document.querySelectorAll(`.try-${currentTry} input`);
            nexttTryInputs.forEach((e)=>e.disabled=false);
            if (document.querySelector(`.try-${currentTry}`)) {
                document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
                document.querySelector(`.try-${currentTry}`).children[1].focus();
                
            }else{
                guessButton.disabled=true;
                hintButton.disabled=true;
                messageArea.innerHTML=`You Lost The Word Was <span>${wordToGuess}</span>`;
            }
    }
}

function getHint(){
    if (hints>0) {
        hints--;
        document.querySelector(".hint span").innerHTML=hints;
    }
    if(hints===0){
        hintButton.disabled=true;
    }
    const enabledInputs=document.querySelectorAll("Input:not([disabled])")
    const emptyEnabled=Array.from(enabledInputs).filter((e)=>e.value==="")

    if (emptyEnabled.length>0) {
        const randomIndex=Math.floor(Math.random()*emptyEnabled.length);
        const randomInput=emptyEnabled[randomIndex];
        const indexToFill=Array.from(enabledInputs).indexOf(randomInput);
        if (indexToFill!==-1) {
            randomInput.value=wordToGuess[indexToFill].toUpperCase();
        }
    }
    
}
function handleBackSpace(e){
    if (e.key==="Backspace") {
        const inputs =document.querySelectorAll("input:not([disabled])");
        const currentIndex=Array.from(inputs).indexOf(document.activeElement);
        if (currentIndex>0) {
            const currentInput=inputs[currentIndex];
            const prevInput=inputs[currentIndex-1];
            currentInput.value="";
            prevInput.value="";
            prevInput.focus();
            
        }

    }
}
document.addEventListener("keydown",handleBackSpace)

window.onload=function(){
    generateInput()
}