const form = document.getElementById('form')
let backBtn = document.querySelector('.back')
form.addEventListener('submit', (e)=>{
    const userNameInput = document.getElementById('uname')
    let userName = userNameInput.value
    e.preventDefault()
    if(userNameInput.value == ''){
        return;
    }
    document.querySelector('.greetings').innerText = `Welcome ${userName}`
    document.querySelector('.username').classList.remove('active')

    document.querySelector('.loader').style.display = 'flex'

    setTimeout(()=>{
    document.querySelector('.loader').style.display = 'none'
    document.querySelector('.main-screen').classList.add('active')
    }, 2500)
})

backBtn.addEventListener('click', ()=>{
    document.querySelector('.main-screen').classList.remove('active')
    document.querySelector('.loader').style.display = 'flex'
    document.querySelector('.greetings').classList.remove('chat-active')
    document.querySelector('.chat-field').classList.add('chat-active')
    const chatField = document.querySelector('.chat-field');
    setTimeout(()=>{
    chatField.innerHTML = '';
    document.querySelector('.loader').style.display = 'none'
    document.querySelector('.username').classList.add('active')
    }, 2500)

})

let moon = document.querySelector('.moon')
let sun = document.querySelector('.sun')
let light = true
function lightMode(){
    moon.classList.remove('toggle-dark-light')
    sun.classList.add('toggle-dark-light')
    document.body.style.background = 'white'
    document.querySelector('.header').style.background = 'white'
    document.querySelector('.ask-input').style.background = 'none'
    const divs = document.querySelectorAll('.main div');
    divs.forEach(div => {
    div.style.color = 'black'; 
    });
    document.querySelector('#question').style.border = '1px solid #ECDFCC'
    let questions = document.querySelectorAll('.question')
    questions.forEach(question => {
        question.style.border = '2px solid black'
    })
    let answers = document.querySelectorAll('.answer')
    answers.forEach(answer => {
        answer.style.background = 'black'
    })
    let answersP = document.querySelectorAll('.answer p')
    answersP.forEach(answer => {
        answer.style.color = 'white'
    })
    document.querySelector('.send').style.background = 'black'
}

function darkMode(){
    moon.classList.add('toggle-dark-light')
    sun.classList.remove('toggle-dark-light')
    document.body.style.background = '#181C14'
    document.querySelector('.loader img').style.filter = 'invert(1)'
    document.querySelector('.header').style.background = '#181C14'
    document.querySelector('.ask-input').style.background = '#ECDFCC'
    let questions = document.querySelectorAll('.question')
    questions.forEach(question => {
        question.style.border = '2px solid #ECDFCC'
    })
    const divs = document.querySelectorAll('.main div');
    divs.forEach(div => {
    div.style.color = '#ECDFCC'; 
    });
    document.querySelector('#question').style.border = '1px solid white'
    document.querySelector('.send').style.background = '#181C14'
    let answers = document.querySelectorAll('.answer')
    answers.forEach(answer => {
        answer.style.background = 'rgb(36, 42, 30)'
    })
}


window.addEventListener('load', () => {
    const savedMode = localStorage.getItem('lightMode');
    
    if (savedMode === 'false') {
        darkMode();
        light = false;
    } else {
        lightMode();
        light = true;
    }
});

// Dark mode button (moon) click event
moon.addEventListener('click', () => {
    darkMode();
    light = false;
    localStorage.setItem('lightMode', light); // Store the mode in localStorage
    console.log(light);
});

// Light mode button (sun) click event
sun.addEventListener('click', () => {
    lightMode();
    light = true;
    localStorage.setItem('lightMode', light); // Store the mode in localStorage
    console.log(light);
});
console.log(light);

let questionInput = document.querySelector('.ask-input');
let questionForm = document.getElementById('question')


function createQuestionBubble(question) {
    let questionBubble = document.createElement('div');
    questionBubble.classList.add('chat', 'question');
    questionBubble.innerHTML = `<p>${question}</p>`;

    // Apply the current mode's styles to the new bubble
    if (light) {
        questionBubble.style.border = '2px solid black';
        questionBubble.style.color = 'black';
    } else {
        questionBubble.style.border = '2px solid #ECDFCC';
        questionBubble.style.color = '#ECDFCC';
    }

    document.querySelector('.chat-field').appendChild(questionBubble);
    const chatField = document.querySelector('.chat-field');
    chatField.scrollTop = questionBubble.offsetTop;
    return questionBubble;
}


function createAnswerBubble(answer) {
    let answerBubble = document.createElement('div');
    answerBubble.classList.add('chat', 'answer');
    answer = answer.replace(/\n/g, '<br>'); // Replace newlines with <br>
    answer = answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 
    answerBubble.innerHTML = `<p>${answer}</p>`;

    // Apply the current mode's styles to the new bubble
    if (light) {
        answerBubble.style.background = 'black';
        answerBubble.querySelector('p').style.color = 'white';
    } else {
        answerBubble.style.background = 'rgb(36, 42, 30)';
        answerBubble.querySelector('p').style.color = '#ECDFCC';
    }

    document.querySelector('.chat-field').appendChild(answerBubble);

    return answerBubble;
}



function createSpinner() {
    let spinner = document.createElement('div');
    spinner.classList.add('loading-image');
    spinner.innerHTML = '<img class="spin" src="assets/img/ai.png" alt="">';
    if(!light){
        spinner.style.filter = 'invert(1)'
    }
    document.querySelector('.chat-field').appendChild(spinner);
    // Scroll to the bottom of chat field
    const chatField = document.querySelector('.chat-field');
    chatField.scrollTop = chatField.scrollHeight;

    return spinner;  // Return the spinner so it can be referenced later
}

let apiKey = 'AIzaSyBGsWrrx2TnIw2Ww9ed-RiZek4DP7TQ5H4';
let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

async function generateResponse(question) {
    // Create the spinner and save the reference
    const spinner = createSpinner();
    
    try {
        // Make the API request
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [{ text: question }]
                }]
            })
        });
        
        const data = await response.json();
        const apiAnswer = data?.candidates[0].content.parts[0].text;
        
        console.log(apiAnswer);
        
        // Create the answer bubble
        createAnswerBubble(apiAnswer);

        // Hide the spinner after displaying the answer
        spinner.style.display = 'none';
    } catch (error) {
        console.log(error);
        console.log(data);
        // Hide the spinner in case of an error
        spinner.style.display = 'none';
    }
}

questionForm.addEventListener('submit', (e) => {
    e.preventDefault();  // Prevent default form submission
    let question = questionInput.value;  // Get the question input
    if(question !=''){
        createQuestionBubble(question);  // Create question bubble
        generateResponse(question);  // Generate response (and show spinner)
        questionInput.value = null;  // Clear input field
        document.querySelector('.greetings').classList.add('chat-active')
        document.querySelector('.chat-field').classList.remove('chat-active')
    }
});