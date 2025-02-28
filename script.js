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
  
    const processedAnswer = removeDiacritics(clue.answer).replace(/\s+/g, '').toUpperCase();
  
    // Tạo input cho từng ký tự
    for (let i = 0; i < processedAnswer.length; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.classList.add("letter-input");
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
        return;
      }
    }
    // Nếu chạy hết vòng for mà không return => tất cả đều đúng
    triggerFinalAnimation();
  }
  
  let finalAnimationTriggered = false;
  
  // Khi tất cả đúng -> chờ 5 giây -> thay thế container
  function triggerFinalAnimation() {
    if (finalAnimationTriggered) return;
    finalAnimationTriggered = true;
  
    // Chờ 5 giây
    setTimeout(() => {
      // Xóa (hoặc ẩn) container chứa câu hỏi
      const cluesContainer = document.getElementById("clues-container");
      cluesContainer.style.display = "none";
      // Hoặc cluesContainer.style.display = "none"; tùy ý
  
      // Tạo nội dung cho final word
      const finalWordContainer = document.getElementById("finalWord");
      finalWordContainer.innerHTML = ""; // Xóa nội dung cũ
      // Hiển thị container finalWord (vì ban đầu ta để display: none trong CSS)
      finalWordContainer.style.display = "inline-flex"; 
  
      // Lấy chữ cái đầu tiên của mỗi đáp án
      const firstLetters = [];
      document.querySelectorAll(".answer-box input:first-child").forEach((input) => {
        const letter = input.value.toUpperCase();
        if (!letter.trim()) return;
        const letterBox = document.createElement("div");
        letterBox.textContent = letter;
        letterBox.classList.add("final-letter-box");
        finalWordContainer.appendChild(letterBox);
        firstLetters.push(letterBox);
      });
  
      // (Tuỳ chọn) Hiệu ứng di chuyển nhẹ
      setTimeout(() => {
        firstLetters.forEach((box, index) => {
          box.style.transform = `translateX(${index * 1}px)`;
        });
      }, 100);
  
    }, 5000);
  }
  