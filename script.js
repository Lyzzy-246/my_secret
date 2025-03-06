// Hàm loại bỏ dấu tiếng Việt
function removeDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* Mảng clues chứa thông tin:
   - letter: Chữ cái đầu tiên
   - img: Đường dẫn hình ảnh
   - answer: Đáp án đầy đủ (có dấu)
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

// Hiệu ứng trái tim khi nhập đúng
function createHeartEffect(element) {
  const heart = document.createElement("div");
  heart.innerHTML = "❤️";
  heart.classList.add("heart-pop");
  document.body.appendChild(heart);

  const rect = element.getBoundingClientRect();
  const scrollX = window.scrollX || document.documentElement.scrollLeft;
  const scrollY = window.scrollY || document.documentElement.scrollTop;

  heart.style.left = `${rect.left + rect.width / 2 + scrollX}px`;
  heart.style.top = `${rect.top + scrollY - 10}px`;

  setTimeout(() => {
    heart.remove();
  }, 600);
}

// Hiệu ứng dấu X khi nhập sai
function createCrossEffect(element) {
  const cross = document.createElement("div");
  cross.innerHTML = "❌";
  cross.classList.add("heart-pop");
  document.body.appendChild(cross);

  const rect = element.getBoundingClientRect();
  const scrollX = window.scrollX || document.documentElement.scrollLeft;
  const scrollY = window.scrollY || document.documentElement.scrollTop;

  cross.style.left = `${rect.left + rect.width / 2 + scrollX}px`;
  cross.style.top = `${rect.top + scrollY - 10}px`;

  setTimeout(() => {
    cross.remove();
  }, 600);
}

// Tạo các dòng câu hỏi
clues.forEach((clue) => {
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("clue-container");

  // Phần chứa hình ảnh (ban đầu ẩn qua CSS)
  const clueLabel = document.createElement("div");
  clueLabel.classList.add("clue-label");
  const img = document.createElement("img");
  img.src = clue.img;
  img.alt = clue.letter + " - " + clue.answer;
  clueLabel.appendChild(img);
  rowDiv.appendChild(clueLabel);

  // Phần chứa các ô nhập đáp án
  const answerBox = document.createElement("div");
  answerBox.classList.add("answer-box");

  // Xử lý đáp án: bỏ dấu, bỏ khoảng trắng, viết hoa
  const processedAnswer = removeDiacritics(clue.answer).replace(/\s+/g, '').toUpperCase();

  // Tạo input cho từng ký tự
  for (let i = 0; i < processedAnswer.length; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.classList.add("letter-input");
    // Gắn data-correct để so sánh nhanh
    input.dataset.correct = processedAnswer.charAt(i);

    // Sự kiện khi người dùng nhập
    input.addEventListener("input", function() {
      let userInput = removeDiacritics(this.value).toUpperCase();
      this.value = userInput;

      if (userInput === "") {
        this.classList.remove("correct", "incorrect");
      } else if (userInput === this.dataset.correct) {
        this.classList.add("correct");
        this.classList.remove("incorrect");
        createHeartEffect(this);
      } else {
        this.classList.add("incorrect");
        this.classList.remove("correct");
        createCrossEffect(this);
      }

      // Tự động focus ô kế tiếp
      if (userInput.length === 1) {
        let nextInput = this.nextElementSibling;
        if (nextInput && nextInput.tagName.toUpperCase() === "INPUT") {
          nextInput.focus();
        }
      }

      // Kiểm tra cả dòng đã đúng chưa
      const rowInputs = rowDiv.querySelectorAll(".letter-input");
      let allCorrect = true;
      rowInputs.forEach((inp) => {
        if (inp.value !== inp.dataset.correct) {
          allCorrect = false;
        }
      });
      if (allCorrect && !rowDiv.classList.contains("solved")) {
        rowDiv.classList.add("solved");
        // Hiển thị hình ảnh
        img.style.opacity = 1;
        // Ẩn dần các ô trừ ô đầu tiên
        answerBox.classList.add("solved");
        // Vô hiệu hóa input
        rowInputs.forEach((inp) => inp.disabled = true);
      }

      // Kiểm tra toàn bộ project
      checkAllAnswers();
    });

    // Cho phép nhấn Backspace để lùi
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

// Hàm kiểm tra toàn bộ
function checkAllAnswers() {
  for (let input of allInputs) {
    if (input.value !== input.dataset.correct) {
      return; // Chưa hoàn thành
    }
  }
  // Nếu chạy hết vòng for mà không return => tất cả đều đúng
  triggerFinalAnimation();
}

let finalAnimationTriggered = false;

// Khi tất cả đúng -> chờ 3 giây -> hiển thị dãy ký tự + message
function triggerFinalAnimation() {
  if (finalAnimationTriggered) return;
  finalAnimationTriggered = true;

  // Chờ 3 giây để người dùng thấy hiệu ứng
  setTimeout(() => {
    // 1) Ẩn container chứa câu hỏi
    const cluesContainer = document.getElementById("clues-container");
    cluesContainer.style.display = "none";

    // 2) Chuẩn bị final word (các ký tự A-N-H-T-H-I-C-H-E-M)
    const finalWordContainer = document.getElementById("finalWord");
    finalWordContainer.innerHTML = ""; // Xóa nội dung cũ
    finalWordContainer.style.display = "flex"; 
    finalWordContainer.style.justifyContent = "center";
    finalWordContainer.style.alignItems = "center";

    // Lấy chữ cái đầu tiên của mỗi đáp án
    const letters = [];
    document.querySelectorAll(".answer-box input:first-child").forEach((input) => {
      const letter = input.value.toUpperCase();
      if (!letter.trim()) return;
      letters.push(letter);
    });

    // Tạo các ô chữ trong #finalWord
    letters.forEach((letter, index) => {
      const letterBox = document.createElement("div");
      letterBox.textContent = letter;
      letterBox.classList.add("final-letter-box");

      // Thiết lập trạng thái ban đầu (ẩn, đẩy lên trên 1 chút)
      letterBox.style.opacity = 0;
      letterBox.style.transform = "translateY(-20px)";
      // Thêm transition để cho phép hiệu ứng mượt
      letterBox.style.transition = "opacity 0.8s ease, transform 0.8s ease";

      finalWordContainer.appendChild(letterBox);

      // Dùng setTimeout để mỗi chữ hiện lên trễ hơn một chút (stagger effect)
      setTimeout(() => {
        letterBox.style.opacity = 1;
        letterBox.style.transform = "translateY(0)";
      }, index * 300); 
    });

    // 3) Tạo container mới cho đoạn văn và nút trái tim
    const mainContainer = document.getElementById("mainContainer");
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("final-message-container");

    // Cho phép fade-in toàn bộ đoạn văn
    messageContainer.style.opacity = 0;
    messageContainer.style.transition = "opacity 1s ease";

    messageContainer.innerHTML = `
        <p>Hehehe, so you've figured out what I wanted to say through the little gifts I gave you, right?</p>
        <p>Actually, this idea just popped into my head when I met you (maybe some mysterious force from the universe made it happen). It’s really simple—I like you.</p>
        <p>If you truly feel like you could give me a chance to walk this path with you, then go ahead and click on the little heart below. (I’ve prepared a small letter I want to share with you.)</p>
        <p>But if you feel like you're not ready yet, then please don’t click it. (I’d get really shy...)</p>
        <p>Just think of this as my little secret—something I wanted to share with you, that’s all! Hehe (^_^)''</p>
    `;
    mainContainer.appendChild(messageContainer);

    // 4) Tạo nút hình trái tim
    const heartButton = document.createElement("button");
    heartButton.classList.add("heart-button");
    heartButton.innerHTML = "❤️"; 
    heartButton.addEventListener("click", function() {
      // Nhảy sang trang letter/letter.html
      window.location.href = "letter/letter.html";
    });
    messageContainer.appendChild(heartButton);

    // Sau khi các chữ cái đã "bay" vào vị trí (đợi thêm chút),
    // ta mới cho messageContainer fade-in
    setTimeout(() => {
      messageContainer.style.opacity = 1;
    }, letters.length * 300 + 500); 

  }, 3000);
}
