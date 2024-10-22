// Updated

const elForm = document.querySelector(".home-form");
const elSelect = document.querySelector(".home-select");
const elAnswerBox = document.querySelector(".answer-box");
const elLevelTitle = document.querySelector(".level");
const elMainBtn = document.querySelector(".home-btn-2")

if(elLevelTitle.innerHTML == '') {
    elLevelTitle.style.display = 'none'
} else {
    elLevelTitle.style.display = 'block'
}

async function getAnswers(level) {
    try {
        let res = await fetch(`http://127.0.0.1:8000/api/${level}/`);
        
        let data = await res.json()
        console.log(data);
        
        
        
        if(data.questions) {
            elAnswerBox.classList.add("answer-box-show")
            elMainBtn.style.display = 'block'
            setInterval(updateCountDown, 1000)
        }
        
        elLevelTitle.innerHTML = data.test_level;
        
        if(elLevelTitle.innerHTML == '') {
            elLevelTitle.style.display = 'none'
        } else {
            elLevelTitle.style.display = 'block'
        }
        
        data.questions.forEach((answer, index) => {
            const newText = document.createElement("p");
            newText.classList.add("answer-text")
            newText.innerHTML = answer.question_text;
            
            const newBox = document.createElement("div");
            const newBox2 = document.createElement("div");
            
            newBox2.classList.add('answer-main-box')
            
            const newBoxText = document.createElement("div")
            
            const newText2 = document.createElement("p");
            const newText3 = document.createElement("p");
            const newText4 = document.createElement("p");
            const newText5 = document.createElement("p");
            
            newBoxText.appendChild(newText2)
            newBoxText.appendChild(newText3)
            newBoxText.appendChild(newText4)
            newBoxText.appendChild(newText5)
            
            const newBoxCheck = document.createElement("div")
            
            const newCheck1 = document.createElement("input");
            const newCheck2 = document.createElement("input");
            const newCheck3 = document.createElement("input");
            const newCheck4 = document.createElement("input");
            
            
            newBoxCheck.appendChild(newCheck1)
            newBoxCheck.appendChild(newCheck2)
            newBoxCheck.appendChild(newCheck3)
            newBoxCheck.appendChild(newCheck4)
            
            newCheck1.type = 'checkbox';
            newCheck2.type = 'checkbox';
            newCheck3.type = 'checkbox';
            newCheck4.type = 'checkbox';
            
            newCheck1.value = 1;
            newCheck2.value = 2;
            newCheck3.value = 3;
            newCheck4.value = 4;
            
            newCheck1.classList.add('chec1')
            newCheck2.classList.add('chec2')
            newCheck3.classList.add('chec3')
            newCheck4.classList.add('chec4')
            
            newCheck1.classList.add('chec')
            newCheck2.classList.add('chec')
            newCheck3.classList.add('chec')
            newCheck4.classList.add('chec')
            
            newText2.innerHTML = answer.option_1;
            newText3.innerHTML = answer.option_2;
            newText4.innerHTML = answer.option_3;
            newText5.innerHTML = answer.option_4;
            
            newBox.classList.add("child-answer-wrapper")
            
            newCheck2.addEventListener("change", (evt) => {
                if(evt.target.checked) {
                    newCheck1.classList.add('chec-none')
                } else {
                    newCheck1.classList.remove('chec-none')
                }
            })
            
            newCheck3.addEventListener("change", (evt) => {
                if(evt.target.checked) {
                    newCheck1.classList.add('chec-none')
                    newCheck2.classList.add('chec-none')
                } else {
                    newCheck1.classList.remove('chec-none')
                    newCheck2.classList.remove('chec-none')
                }
            })
            
            newCheck4.addEventListener("change", (evt) => {
                if(evt.target.checked) {
                    newCheck1.classList.add('chec-none')
                    newCheck2.classList.add('chec-none')
                    newCheck3.classList.add('chec-none')
                } else {
                    newCheck1.classList.remove('chec-none')
                    newCheck2.classList.remove('chec-none')
                    newCheck3.classList.remove('chec-none')
                }
            })
            
            newBox.appendChild(newBoxCheck)
            newBox.appendChild(newBoxText)
            
            newBox2.appendChild(newBox)
            
            newBox2.appendChild(newText)
            
            elAnswerBox.appendChild(newBox2)
        })
        const elCheckBox = document.querySelectorAll(".chec")
        const elQuestion = document.querySelectorAll(".answer-main-box")
        
        let checValue = new Array(50).fill(0)
        
        elMainBtn.addEventListener("click", () => {
            elQuestion.forEach((item, index) => {
                let checkdeInp = item.querySelector("input[type='checkbox']:checked");
                
                if(checkdeInp) {
                    checValue[index] = checkdeInp.value;
                    console.log(checValue);
                    
                }
            })
            postAnswer(elLevelTitle.innerHTML, checValue)
            elTime.style.display = 'none'
        })
        
        // TIME\\\\\\\\\\\\\\\\\
        const elTime = document.querySelector(".time")
        const startMin = 60;
        let time = startMin * 60;
        
        function updateCountDown() {
            const minutes = Math.floor(time / 60);
            let seconds = time % 60;
            
            seconds = seconds < 10 ? "0" + seconds : seconds;
            elTime.textContent = `Your time : ${minutes}:${seconds}`;
            time--;
            
            if(minutes == 0 && seconds == 0) {
                elQuestion.forEach((item, index) => {
                    let checkdeInp = item.querySelector("input[type='checkbox']:checked");
                    
                    if(checkdeInp) {
                        checValue[index] = checkdeInp.value
                    }
                })
                elTime.style.display = 'none'
                postAnswer(elLevelTitle.innerHTML, checValue)
            }
        }
        
    } catch (error) {
        console.log(error);
    }
}


elForm.addEventListener("submit", evt => {
    evt.preventDefault()
    
    getAnswers(elSelect.value)
})

async function postAnswer(level, answer) {
    try {
        let res = await fetch(`http://127.0.0.1:8000/api/evaluate/${level}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "level": level,
                "answers": {
                    "1": Number(answer[0]),
                    "2": Number(answer[1]),
                    "3": Number(answer[2]),
                    "4": Number(answer[3]),
                    "5": Number(answer[4]),
                    "6": Number(answer[5]),
                    "7": Number(answer[6]),
                    "8": Number(answer[7]),
                    "9": Number(answer[8]),
                    "10": Number(answer[9]),
                    "11": Number(answer[10]),
                    "12": Number(answer[11]),
                    "13": Number(answer[12]),
                    "14": Number(answer[13]),
                    "15": Number(answer[14]),
                    "16": Number(answer[15]),
                    "17": Number(answer[16]),
                    "18": Number(answer[17]),
                    "19": Number(answer[18]),
                    "20": Number(answer[19]),
                    "21": Number(answer[20]),
                    "22": Number(answer[21]),
                    "23": Number(answer[22]),
                    "24": Number(answer[23]),
                    "25": Number(answer[24]),
                    "26": Number(answer[25]),
                    "27": Number(answer[26]),
                    "28": Number(answer[27]),
                    "29": Number(answer[28]),
                    "30": Number(answer[29]),
                    "31": Number(answer[30]),
                    "32": Number(answer[31]),
                    "33": Number(answer[32]),
                    "34": Number(answer[33]),
                    "35": Number(answer[34]),
                    "36": Number(answer[35]),
                    "37": Number(answer[36]),
                    "38": Number(answer[37]),
                    "39": Number(answer[38]),
                    "40": Number(answer[39]),
                    "41": Number(answer[40]),
                    "42": Number(answer[41]),
                    "43": Number(answer[42]),
                    "44": Number(answer[43]),
                    "45": Number(answer[44]),
                    "46": Number(answer[45]),
                    "47": Number(answer[46]),
                    "48": Number(answer[47]),
                    "49": Number(answer[48]),
                    "50": Number(answer[49]),
                }
            })
        })
        
        let data = await res.json();
        console.log(data);
        
        const newBox = document.createElement("div")
        const newText1 = document.createElement("p")
        const newText2 = document.createElement("p")
        const newText3 = document.createElement("p")
        
        
        newBox.classList.add("total-box")
        newText1.classList.add("total-text")
        newText2.classList.add("total-text")
        newText3.classList.add("total-text-3")
        
        
        
        newBox.appendChild(newText1)
        newBox.appendChild(newText2)
        newBox.appendChild(newText3)
        
        newText3.innerHTML = 'Qayta boshlash'
        
        newText3.addEventListener('click', () => {
            window.location.reload()
        })
        
        elAnswerBox.innerHTML = ''
        newText1.innerHTML = data.correct_answers + " ta to'g'ri javob";
        newText2.innerHTML = String(data.score).slice(0, 5) + " %";
        elMainBtn.style.display = 'none'
        
        elAnswerBox.appendChild(newBox)
    } catch (error) {
        console.log(error);
    }
}
