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
    if (value == 0 && display.result.innerHTML == 0) {
        display.result.innerHTML = 0
    } else if (display.result.innerHTML == 0) {
        display.result.innerHTML = value
    } else {
        display.result.innerHTML += value
    }
}

updateResult(0)
updateResult(1)
updateResult(0)
updateResult(0)
updateResult(0)


/*
função do botão de backspace, que apaga o digito menos significativo do result
*/
function backspace() {
    display.result.innerHTML = display.result.innerHTML.slice(0, -1)
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
    // display.preview.style = "hidden"
    display.preview.innerHTML = ""
}
/* 
hardClear()
 */


function inverter() {
    // pegar valor oposto do atual
    let oposto = - display.result.innerHTML
    // alterar valor da tela pelo oposto
    display.result.innerHTML = oposto
}
