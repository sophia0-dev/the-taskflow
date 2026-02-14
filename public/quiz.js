/* --- JAVASCRIPT LOGIC --- */

// 1. Quiz Data
const quizData = [
    {
        question: "Which language runs in a web browser?",
        a: "Java",
        b: "C",
        c: "Python",
        d: "JavaScript",
        correct: "d",
    },
    {
        question: "What does CSS stand for?",
        a: "Central Style Sheets",
        b: "Cascading Style Sheets",
        c: "Cascading Simple Sheets",
        d: "Cars SUVs Sailboats",
        correct: "b",
    },
    {
        question: "What does HTML stand for?",
        a: "Hypertext Markup Language",
        b: "Hypertext Markdown Language",
        c: "Hyperloop Machine Language",
        d: "None of the above",
        correct: "a",
    },
    {
        question: "What year was JavaScript launched?",
        a: "1996",
        b: "1995",
        c: "1994",
        d: "1993",
        correct: "b",
    },
    {
        question: "Which tool is used to style web pages?",
        a: "HTML",
        b: "JQuery",
        c: "CSS",
        d: "React",
        correct: "c",
    }
];

// 2. DOM Elements
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const questionText = document.getElementById('question-text');
const answerEls = document.querySelectorAll('.answer');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');
const progressBar = document.getElementById('progress');
const questionCountEl = document.getElementById('question-count');
const scoreEl = document.getElementById('score');
const feedbackText = document.getElementById('feedback-text');

// 3. Variables
let currentQuiz = 0;
let score = 0;

// 4. Initialize Start Button
startBtn.addEventListener('click', () => {
    startScreen.classList.add('hide');
    questionScreen.classList.remove('hide');
    loadQuiz();
});

// 5. Load Quiz Function
function loadQuiz() {
    deselectAnswers();
    
    const currentQuizData = quizData[currentQuiz];
    
    // Set Question Text
    questionText.innerText = currentQuizData.question;
    
    // Set Option Text
    a_text.innerText = currentQuizData.a;
    b_text.innerText = currentQuizData.b;
    c_text.innerText = currentQuizData.c;
    d_text.innerText = currentQuizData.d;

    // Update Progress
    const totalQuestions = quizData.length;
    const progressPercent = ((currentQuiz) / totalQuestions) * 100;
    progressBar.style.width = `${progressPercent}%`;
    questionCountEl.innerText = `Question ${currentQuiz + 1} of ${totalQuestions}`;
}

// 6. Helper: Deselect Radio Buttons
function deselectAnswers() {
    answerEls.forEach(answerEl => answerEl.checked = false);
}

// 7. Helper: Get Selected Answer
function getSelected() {
    let answer;
    answerEls.forEach(answerEl => {
        if(answerEl.checked) {
            answer = answerEl.id;
        }
    });
    return answer;
}

// 8. Submit Logic
submitBtn.addEventListener('click', () => {
    const answer = getSelected();
    
    if(answer) {
        // Check correctness
        if(answer === quizData[currentQuiz].correct) {
            score++;
        }

        currentQuiz++;

        // If more questions exist, load next. Otherwise show results.
        if(currentQuiz < quizData.length) {
            loadQuiz();
        } else {
            questionScreen.classList.add('hide');
            resultScreen.classList.remove('hide');
            
            scoreEl.innerText = score;
            
            // Custom Feedback based on score
            if(score === quizData.length){
                feedbackText.innerText = "Perfect Score! You're a Master!";
            } else if (score > 2) {
                feedbackText.innerText = "Great job! You know your stuff.";
            } else {
                feedbackText.innerText = "Keep practicing, you'll get there!";
            }
        }
    } else {
        alert("Please select an answer before clicking Submit!");
    }
});