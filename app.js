/*
- preview: campo cinza que exibe a operação
- resultado: campo cor preta que mostra apenas o resultado

display é um objeto global para acessar ambos dentro das funções sem precisar redeclará-los
para pegar o valor do elemento use: display.preview.innerText
Mude os valores em tela apenas com as funções updatePreview e updateResult. 
*/
const display = {
    preview: document.querySelector("#pseudo"),
    result: document.querySelector("#result")
}

/* Estrutura de dados dedicada ao armazenamento do histórico */
let history = [];

/* Estrutura de dados dedicada ao armazenamento da memória */
let memory = [];

/* Primeiro número da operação? */
/* Este booleano indica se caso um número for digitado se deve apagar o que está no campo result ou não */
let cleanResult = false;

/* Indica se já uma operação em andamento */
let haveOperation = false;

/* Indica que tanto o preview quanto o result devem ser limpos */
/* Após uma operação de equals */
let cleanDisplay = false;

/* Verifica se um digito númerico foi pressionado */
/* Para impedir a repeticação da operação caso o operador seja pressionado mais de uma vez */
let digitWasPressed = true;

/*
função centralizada que atualiza o valor do result em tela por value
*/
function updateResult(value) {
    if (cleanDisplay && !haveOperation) {
        hardClear();
        cleanDisplay = false;
    }

    if (!cleanResult) {
        if (value == 0 && display.result.innerHTML == 0) {
            display.result.innerHTML = 0
        } else if (display.result.innerHTML == 0) {
            display.result.innerHTML = value
        } else {
            display.result.innerHTML += value
        }
    } else {
        display.result.innerHTML = value
        cleanResult = false;
    }

    /* Indica que um digito foi pressionado -> possibilita operação */
    digitWasPressed = true;
}

/*
função do botão de backspace, que apaga o digito menos significativo do result
*/

function backspace() {
    //se estiver no último número, apaga e coloca zero
    if (display.result.innerHTML.length == 1) {
        display.result.innerHTML = 0
    } else {
        display.result.innerHTML = display.result.innerHTML.slice(0, -1)

    }
}

/*
função do botão CE, que apaga apenas o valor de result, mantendo o preview
*/
function softClear() {
    display.result.innerHTML = 0
}



/*
função do botão C, que apaga tanto o preview quanto o result
*/
function hardClear() {
    display.result.innerHTML = 0
    /* display.preview.style.visibility = "hidden" */
    display.preview.innerHTML = "&nbsp"
    cleanResult = false;
    haveOperation = false;
}

/* Funciona apenas para as operações básicas */
function putOperatorOnDisplay(operator) {
    let displayResult = display.result.innerHTML;
    /* Verifica se um digito foi pressionado */
    if (digitWasPressed) {
        /* Verifica se já existe um operador no preview */
        if (haveOperation) {
            /* Realiza a soma sem ter que apertar o botão equals */
            equal();
        }

        digitWasPressed = false;
        cleanResult = true;
    }
    haveOperation = true;
    /* Permite trocar o operador caso um já exita no preview*/
    /* Cortando o antigo operador e colocando o novo */
    display.preview.innerHTML = `${displayResult} ${operator} `
}

function inverter() {
    // pegar valor oposto do atual
    let oposto = - display.result.innerHTML
    // alterar valor da tela pelo oposto
    display.result.innerHTML = oposto
}

function plus() {
    putOperatorOnDisplay('+');
}

function minus() {
    putOperatorOnDisplay('-');
}

function divide() {
    putOperatorOnDisplay('÷');
}

function multiply() {
    putOperatorOnDisplay('x');
}

function inverse() {
    let displayResult = Number.parseFloat(display.result.innerHTML.replace(",", "."));
    let preview = `1/(${displayResult.toString().replace(".", ",")})`;
    if (haveOperation && !display.preview.innerHTML.includes("=")) {
        display.preview.innerHTML += preview;
    } else {
        display.preview.innerHTML = preview;
    }
    display.result.innerHTML = 1 / displayResult;
    saveOnHistory()
    printHistory()
}

function sqrRoot() {
    let displayResult = Number.parseFloat(display.result.innerHTML.replace(",", "."));
    let preview = `√(${displayResult.toString().replace(".", ",")})`;
    if (haveOperation && !display.preview.innerHTML.includes("=")) {
        display.preview.innerHTML += preview;
    } else {
        display.preview.innerHTML = preview;
    }
    display.result.innerHTML = Math.sqrt(displayResult);

    saveOnHistory()
    printHistory()

}

function sqr() {
    let displayResult = Number.parseFloat(display.result.innerHTML.replace(",", "."));
    let preview = `sqr(${displayResult.toString().replace(".", ",")})`;
    if (haveOperation && !display.preview.innerHTML.includes("=")) {
        display.preview.innerHTML += preview;
    } else {
        display.preview.innerHTML = preview;
    }
    display.result.innerHTML = displayResult * displayResult;
    saveOnHistory()
    printHistory()
}

/* Virgula */
function comma() {
    if (!display.result.innerHTML.includes(",")) {
        display.result.innerHTML += ",";
    }
}

function equal() {
    /* Divide o preview em um array e troca todas as vírgulas */
    let previewMemory = display.preview.innerHTML.replaceAll(",", ".").split(" ");
    let operator = previewMemory[1];
    let displayResult = Number.parseFloat(display.result.innerHTML.replace(",", "."));
    let result;
    let preview;

    let haveEqualsOperator = display.preview.innerHTML.includes("=");

    /* Operações especiais (1/(x), sqr(x), √(x)) */
    if (previewMemory.lenght == 1) {
        preview = `${display.preview.innerHTML} =`
        /* Neste caso não precisa definir o result porque já foi definido no método 
           que coloca os simbolos das operações especiais no display */
    } else {

        /* Operações normais (+, -, * , /) */
        if (previewMemory.length <= 2 && (haveEqualsOperator || previewMemory.length == 1)) {

            /* Neste caso só há um número e o sinal de igual */
            result = displayResult;
            preview = `${display.result.innerHTML} =`;

        } else if (previewMemory.length == 4) {

            /* Caso o botão equals seja apertado mais de uma vez seguida */
            result = doOperation(operator, displayResult, +previewMemory[2]);
            preview = `${displayResult} ${operator} ${previewMemory[2]} =`
            cleanDisplay = true;
        } else {

            /* Operação normal */
            result = doOperation(operator, +previewMemory[0], displayResult);
            preview = `${+previewMemory[0]} ${operator} ${displayResult} =`
        }
    }
    display.preview.innerHTML = preview.replaceAll(".", ",");
    display.result.innerHTML = result.toString().replace(".", ",");
    saveOnHistory();
    printHistory();
    cleanResult = true;
    haveOperation = false;
}

function doOperation(operator, value1, value2) {
    switch (operator) {
        case '+':
            return (value1 + value2);
        case '-':
            return (value1 - value2);
        case '÷':
            return (value1 / value2);
        case 'x':
            return (value1 * value2);
        default:
            break;
    }
}

function saveOnHistory() {
    /* historyo */
    history.push(
        {
            preview: display.preview.innerHTML,
            result: display.result.innerHTML,
        }
    );
}

function printHistory() {
    let historyDisplay = document.getElementById("history");
    historyDisplay.innerHTML = "";
    history.forEach((element) =>
        historyDisplay.innerHTML +=
        `<div class="history-item-pair" onclick="putHistoryOnDiplay(this)">
        <p class="history-preview">${element.preview}</p>
        <p class="history-result">${element.result}</p>
    </div>`
    );
    /* Caso implementar o memory rever o funcionamento */
    document.getElementById("delete-history-btn").style.visibility = "visible";
}

function putHistoryOnDiplay(divHTML) {
    /* Coloca os filhos da div recebida como argumento no display */
    display.preview.innerHTML = divHTML.children[0].innerHTML;
    display.result.innerHTML = divHTML.children[1].innerHTML;

    /* Para manter o funcionamento da calculadora semelhante ao da original */
    cleanDisplay = true;
    cleanResult = true;
    haveOperation = false;
}

function cleanHistory() {
    history = new Array();
    document.getElementById("history").innerHTML = "Ainda não há histórico";
    /* Caso implementar o memory rever o funcionamento */
    document.getElementById("delete-history-btn").style.visibility = "hidden";
}

function percent() {

    let arrayPreview = display.preview.innerHTML.split(' ')

    console.log(arrayPreview);

    let [num1, operator] = arrayPreview

    let percentage = +display.result.innerHTML / 100 // porcentagem 

    let previewValue = ''

    switch (operator) {
        case '+':
        case '-':
            previewValue = num1 * percentage
            display.preview.innerHTML = `${display.preview.innerHTML}${parseFloat(previewValue.toFixed(2))}`
            display.result.innerHTML = `${parseFloat(previewValue.toFixed(2))}`
            break;

        case 'x':
        case '÷':
            previewValue = percentage
            display.preview.innerHTML = `${display.preview.innerHTML}${parseFloat(previewValue.toFixed(2))}`
            display.result.innerHTML = `${parseFloat(previewValue.toFixed(2))}`
            break

        default:
            display.preview.innerHTML = '0'
            display.result.innerHTML = '0'
            break
    }
}


document.addEventListener('keydown', e => {
    let tecla = e.key
    switch (tecla) {
        case "Enter":
            equal()
            break
        case "%":
            percent()
            break
        case "Backspace":
            backspace()
            break;
        case "+":
            plus()
            break;
        case "-":
            minus()
            break;
        case "/":
            divide()
            break;
        case "*":
            multiply()
            break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            updateResult(tecla)
            break
        case ",":
            comma();
            break;
        default:
            break;
    }
})







function setMemory(memoria){
    let area = document.getElementById("memory")
    area.innerText = ""
    memoria.forEach((elemento) => {
        let valor = document.createElement("p")
        valor.classList.add("memory-p")
        valor.addEventListener("click", (e) => {
            display.result.innerHTML = e.target.innerHTML
        })
        valor.innerText = elemento
        area.appendChild(valor)
    })

}

function clearMemory() {
    memory = []
    setMemory(memory)
}

function putMemory() {
    if (memory.length <= 0) return;

    let stackTop = memory[memory.length - 1]
    display.result.innerHTML = stackTop
    setMemory(memory)

}

function sumOnMemory() {
    if (memory.length <= 0) return;

    let result = +display.result.innerHTML
    memory[memory.length - 1] += result;
    setMemory(memory)
}

function subOnMemory() {
    if (memory.length <= 0) return;
    
    let result = +display.result.innerHTML
   
    memory[memory.length - 1] -= result;
    setMemory(memory)

}

function stackMemory() {
    let result = display.result.innerHTML
    memory.push(+result)
    setMemory(memory)
    
}

document.getElementById("historyTab").addEventListener("click", () => {
    //isMemory = false
    document.getElementById("history").classList.remove("inactive")
    document.getElementById("history").classList.add("active")
    
    document.getElementById("memory").classList.add("inactive")
    document.getElementById("memory").classList.remove("active")

    // colocando sublinhado azul
    let spanHistory = document.getElementById("historyTabStyle")
    let spanMemory = document.getElementById("memoryTabStyle")
    spanHistory.classList.add("tab-selected")
    spanMemory.classList.remove("tab-selected")
})

document.getElementById("memoryTab").addEventListener("click", () => {
    
    document.getElementById("memory").classList.remove("inactive")
    document.getElementById("memory").classList.add("active")

    document.getElementById("history").classList.add("inactive")
    document.getElementById("history").classList.remove("active")

    // colocando sublinhado azul
    let spanHistory = document.getElementById("historyTabStyle")
    let spanMemory = document.getElementById("memoryTabStyle")
    spanHistory.classList.remove("tab-selected")
    spanMemory.classList.add("tab-selected")
})

