const statement = document.querySelector("#statement");
const optionButtons = document.querySelector("#options").children;
const explanation = document.querySelector("#explanation");
const nextButton = document.querySelector(".nxtQuestion");
const scoreDisplay = document.getElementById("score");
const main = document.querySelector("main");

let questions = [];
let currentQuestionIndex = 0;
let currentQuestion = {
    statement: '',
    answer: '',
    explanation: ''
};
let score = 0;
function displayQuestion() {
    statement.textContent = currentQuestion.statement;
    explanation.textContent = "";

    for (let btn of optionButtons) {
        btn.classList.remove("correct", "incorrect");
        enableButton(btn);
    }
    nextButton.setAttribute("disabled", "");
}

function disableButton(button) {
    button.setAttribute("disabled", "");
}

function enableButton(button) {
    button.removeAttribute("disabled");
}

function isGuessCorrect(guess) {
    return guess === currentQuestion.answer.toString();

}

for (let button of optionButtons) {
    button.addEventListener("click", () => {
        explanation.textContent = currentQuestion.explanation;

        for (let btn of optionButtons) {
            disableButton(btn);
        }

        if (isGuessCorrect(button.value)) {
            button.classList.add("correct");
            score++; // Update score only if the answer is correct
            updateScore(); // Update the score display
        } else {
            button.classList.add("incorrect");
        }

        enableButton(nextButton);
    });
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < 10) {
        fetchQuestion();
    } else {
        showFinalScore();
        nextButton.setAttribute("disabled", "");
    }
});
function updateScore() {
    scoreDisplay.textContent = "Score: " + score;
}

function showFinalScore() {
    // Remove both the header and main content
    const header = document.querySelector("header");
    header.remove();
    main.remove();
    // Display the final score in full screen
    const finalScoreContainer = document.getElementById("finalScore");
    const finalScoreValue = document.getElementById("finalScoreValue");
    finalScoreValue.textContent = score;
    finalScoreContainer.style.display = "flex";
}

const fetchedQuestions = new Set(); // Keep track of fetched questions

function fetchQuestion() {
    fetch('https://quizzyjs.onrender.com/get-question')
        .then(res => res.json())
        .then(question => {
            if (!fetchedQuestions.has(question.statement)) {
                fetchedQuestions.add(question.statement);

                currentQuestion = {
                    statement: question['statement'],
                    answer: question['answer'],
                    explanation: question['explanation']
                };
                displayQuestion();
                updateScore();
            } else {
                // If the question has already been fetched, fetch another one
                return fetchQuestion();
            }
        })
        .catch(err => {
            console.log(err);
        });
}

fetchQuestion();





