// FUNÇÃO EXECUTADA QUANDO A PÁGINA É CARREGADA
$(document).ready(() => {

    // FUNÇÃO EXECUTADA NO CLIQUE DO BOTÃO DE ACEITAR COOKIES
    $('.cookies-save').click(() => {
        // SETAR VARIÁVEL NO LOCALSTORAGE
        window.localStorage.setItem('cookieEnable', true)

        // ESCONDER CONTAINER DE COOKIES
        $('.cookies-container').css('display', 'none')
    })
    
    // CHECAR SE VARIÁVEL DE COOKIES NÃO EXISTE NO LOCALSTORAGE
    if (!window.localStorage.getItem('cookieEnable')) {

        // MOSTRAR CONTAINER DE COOKIES
        $('.cookies-container').css('display', 'flex')
    } 
})