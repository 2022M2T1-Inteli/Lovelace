// FUNÇÃO EXECUTADA QUANDO A PÁGINA É CARREGADA
$(document).ready(() => {
    // OBTER PARÂMETRO TYPE DA URL
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const type = urlParams.get('type')

    const form = $('.loginForm')
    const loginButton = $('.loginBtn')
    const errorBadge = $('.errorBadge')
    const termInput = $('#terms')

    let url = ''
    let nextPage = ''

    // CHECAR O PARÂMETRO DA URL E SETAR O ATRIBUTO SRC DOS BOTÕES
    if (type == 'user') {
        url = '/user/login'
        nextPage = '/views/companyMatch/companyMatch.html'
        $('.noAccountLink').attr('href', '/views/userSignUp/userSignUp.html')
    } else if (type == 'company') {
        url = '/company/login'
        nextPage = '/views/jobs/jobs.html'
        $('.noAccountLink').attr('href', '/views/companyRegistration/companyRegistration.html')
    } else if (type == 'admin') {
        url = '/admin/login'
        nextPage = '/views/companyApproval/companyApproval.html'
        $('.noAccountLink').css('display', 'none')
    }

    // FUNÇÃO EXECUTADA QUANDO APERTA O BOTÃO DE LOGIN
    loginButton.click(() => {
        errorBadge.css('display', 'none')
        errorBadge.html('')

        // CHECAR SE O USUÁRIO CONCORDA COM OS TERMO DE USO
        if (termInput.is(':checked')) {
            // REQUISIÇÃO 'POST' 
            $.ajax({
                url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ email: $('#email').val(), password: $('#password').val() }),
                success: function (res) {
                    // MANDAR O USUÁRIO PARA SUA RESCPECTIVA PÁGINA 
                    window.location.replace(nextPage)
                },
                error: function (err) {
                    errorBadge.css('display', 'block')
                    errorBadge.html(err.responseText)
                },
            })
        } else {
            // MENSAGEM DE ERRO PARA CONCORDAR COM OS TERMOS DE USO
            errorBadge.css('display', 'block')
            errorBadge.html('É necessário que você concorde com os termos de uso!')
        }
    })
})
