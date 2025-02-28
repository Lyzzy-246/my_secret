// Function to remove Vietnamese diacritics (Unicode normalization)
function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* Array containing clues with:
   - letter: First letter of the answer
   - img: Image path
   - answer: The correct word (processed into uppercase, no spaces, no diacritics)
*/
const clues = [
    { letter: "A", img: "images/alpenliebe.jpg", answer: "Alpenliebe" },
    { letter: "N", img: "images/notebook.jpg", answer: "Notebook" },
    { letter: "H", img: "images/hopnhac.jpg", answer: "Hộp nhạc" },
    { letter: "T", img: "images/teddy.jpg", answer: "Teddy bear" },
    { letter: "H", img: "images/hoa.jpg", answer: "Hoa" },
    { letter: "I", img: "images/icecream.jpg", answer: "Ice cream" },
    { letter: "C", img: "images/chocolate.jpg", answer: "Chocolate" },
    { letter: "H", img: "images/hinhdan.jpg", answer: "Hình dán" },
    { letter: "E", img: "images/ep.jpg", answer: "Ép" },
    { letter: "M", img: "images/mockhoa.jpg", answer: "Móc khóa" }
];

const cluesContainer = document.getElementById("clues");
const allInputs = [];

// Function to create a floating heart effect
function createHeartEffect(element) {
    const heart = document.createElement("div");
    heart.innerHTML = "❤️";
    heart.classList.add("heart-pop");
    document.body.appendChild(heart);

    const rect = element.getBoundingClientRect();

    // Adjust for scrolling
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    heart.style.left = `${rect.left + rect.width / 2 + scrollX}px`;
    heart.style.top = `${rect.top + scrollY - 10}px`; // Adjust height

    setTimeout(() => {
        heart.remove();
    }, 600);
}
function createCrossEffect(element) {
    const heart = document.createElement("div");
    heart.innerHTML = "❌";
    heart.classList.add("heart-pop");
    document.body.appendChild(heart);

    const rect = element.getBoundingClientRect();

    // Adjust for scrolling
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    heart.style.left = `${rect.left + rect.width / 2 + scrollX}px`;
    heart.style.top = `${rect.top + scrollY - 10}px`; // Adjust height

    setTimeout(() => {
        heart.remove();
    }, 600);
}
// Generate the question interface
clues.forEach((clue) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("clue-container");
    
    // Image hint
    const clueLabel = document.createElement("div");
    clueLabel.classList.add("clue-label");
    const img = document.createElement("img");
    img.src = clue.img;
    img.alt = clue.letter + " - " + clue.answer;
    clueLabel.appendChild(img);
    rowDiv.appendChild(clueLabel);
    
    // Answer input fields
    const answerBox = document.createElement("div");
    answerBox.classList.add("answer-box");

    const processedAnswer = removeDiacritics(clue.answer).replace(/\s+/g, '').toUpperCase();
    
    for (let i = 0; i < processedAnswer.length; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.classList.add("letter-input");
        input.dataset.correct = processedAnswer.charAt(i);
        
        input.addEventListener("input", function() {
            let userInput = removeDiacritics(this.value).toUpperCase();
            this.value = userInput;
            
            if (userInput === "") {
                this.classList.remove("correct", "incorrect");
            } else if (userInput === this.dataset.correct) {
                this.classList.add("correct");
                this.classList.remove("incorrect");
                createHeartEffect(this); // Trigger heart animation
            } else {
                this.classList.add("incorrect");
                this.classList.remove("correct");
                createCrossEffect(this)
            }
            
            if (userInput.length === 1) {
                let nextInput = this.nextElementSibling;
                if (nextInput && nextInput.tagName.toUpperCase() === "INPUT") {
                    nextInput.focus();
                }
            }
            checkAllAnswers();
        });

        input.addEventListener("keydown", function(event) {
            if (event.key === "Backspace" && this.value === "") {
                let prevInput = this.previousElementSibling;
                if (prevInput && prevInput.tagName.toUpperCase() === "INPUT") {
                    prevInput.focus();
                }
            }
        });

        answerBox.appendChild(input);
        allInputs.push(input);
    }

    rowDiv.appendChild(answerBox);
    cluesContainer.appendChild(rowDiv);
});

// Check if all answers are correct
function checkAllAnswers() {
    for (let input of allInputs) {
        if (input.value !== input.dataset.correct) {
            return;
        }
    }
    triggerFinalAnimation();
}

let finalAnimationTriggered = false;

function triggerFinalAnimation() {
    if (finalAnimationTriggered) return;
    finalAnimationTriggered = true;

    // Hide all question boxes and images
    document.getElementById("clues-container").classList.add("hidden-clues");

    // Show final word container
    const finalWordContainer = document.getElementById("finalWord");
    finalWordContainer.innerHTML = ""; // Clear previous content
    finalWordContainer.style.display = "flex"; // Ensure it's visible

    const firstLetters = [];

    // Hide all letter boxes except the first letter
    document.querySelectorAll(".answer-box").forEach((box) => {
        box.classList.add("hidden"); // Hide other letters
    });

    // Find and move first letter of each answer
    document.querySelectorAll(".answer-box input:first-child").forEach((input, index) => {
        const letter = input.value.toUpperCase(); // Get first letter

        if (!letter.trim()) return; // Skip if empty

        const letterBox = document.createElement("div");
        letterBox.textContent = letter;
        letterBox.classList.add("final-letter-box");

        // Get original position of the input box
        const rect = input.getBoundingClientRect();
        letterBox.style.left = `${rect.left}px`;
        letterBox.style.top = `${rect.top}px`;

        finalWordContainer.appendChild(letterBox);
        firstLetters.push(letterBox);
    });

    // Small delay for natural transition
    setTimeout(() => {
        firstLetters.forEach((box, index) => {
            box.style.position = "relative"; // Move into final position
            box.style.left = "0px";
            box.style.top = "0px";
            box.style.transform = `translateX(${index * 50}px)`;
        });

        // Show the final word
        finalWordContainer.classList.add("show");
    }, 100);
}


