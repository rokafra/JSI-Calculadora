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

/* Primeiro número da operação? */
/* Este booleano indica se caso digitado um número o resultado deve apagar o que está no campo result ou não */
let cleanResult = false;
/* Indica se já uma operação em andamento */
let haveOperation = false;

/*
função centralizada que atualiza o valor do preview em tela por value
*/
function updatePreview(value) {
    display.preview.innerHTML += value
}

/*
função centralizada que atualiza o valor do result em tela por value
*/
function updateResult(value) {
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

    display.preview.innerHTML = ""
    cleanResult = false;
    haveOperation = false;
}


function inputOperation(operator) {
    if (haveOperation) {
        equal();
    }
    display.preview.innerHTML = `${display.result.innerHTML} ${operator} `
    haveOperation = true;
    cleanResult = true;
}

function inverter() {
    // pegar valor oposto do atual
    let oposto = - display.result.innerHTML
    // alterar valor da tela pelo oposto
    display.result.innerHTML = oposto
}


function plus() {
    inputOperation('+');
}

function minus() {
    inputOperation('-');
}

function divide() {
    inputOperation('÷');
}



function multiply() {
    inputOperation('x');
}

/* Bug sem limite */
function equal() {
    display.preview.innerHTML = `${display.preview.innerHTML}${display.result.innerHTML} =`
    cleanResult = true;

    haveOperation = false;

    let operationArray = display.preview.innerHTML.split(" ");
    let operation = getOperation(operationArray[1]);
    let result = operation(+operationArray[0], +operationArray[2]);
    console.log(result)
    console.log(display.preview.innerHTML)

    display.result.innerHTML = result;

}

function getOperation(value) {
    switch (value) {
        case '+':
            return (x, y) => x + y;
        case '-':
            return (x, y) => x - y;
        case '÷':
            return (x, y) => x / y;
        case 'x':
            return (x, y) => x * y;
        default:
            break;
    }
}

function percent() {
   
    let arrayPreview = display.preview.innerHTML.split(' ')

    console.log(arrayPreview);

    let [num1, operator] = arrayPreview

    let percentage = +display.result.innerHTML / 100 // porcentagem 
    
    let previewValue = ''

    switch (operator) {
        case '+':
            previewValue = num1 * percentage
            display.preview.innerHTML = `${display.preview.innerHTML} ${parseFloat(previewValue.toFixed(2))}`
            break;

        case '-':
            previewValue =  num1 * percentage
            display.preview.innerHTML = `${display.preview.innerHTML} ${parseFloat(previewValue.toFixed(2))}`
            break

        case 'x':
            previewValue =  percentage
            display.preview.innerHTML = `${display.preview.innerHTML} ${parseFloat(previewValue.toFixed(2))}`

            break

        case '÷':
            previewValue =  percentage
            display.preview.innerHTML = `${display.preview.innerHTML} ${parseFloat(previewValue.toFixed(2))}`
            
            break

        default:
            display.preview.innerHTML = '0'
            display.result.innerHTML = '0'
            break
    }
}