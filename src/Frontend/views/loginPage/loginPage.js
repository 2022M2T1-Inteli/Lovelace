// Função executada quando a página é carregada
$(document).ready(() => {
    // Obter parâmetro type da url
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const type = urlParams.get('type')

    // Checar o parâmetro da url e setar o atributo src dos botões
    if (type == 'user') {
        $('.loginBtn').attr('href', '/views/companyMatch/companyMatch.html')
        $('.noAccountLink').attr('href', '/views/userSignUp/userSignUp.html')
    } else if (type == 'company') {
        $('.loginBtn').attr('href', '/views/jobs/jobs.html')
        $('.noAccountLink').attr('href', '/views/companyRegistration/companyRegistration.html')
    }
})
