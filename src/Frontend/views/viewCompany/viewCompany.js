$(document).ready(() => {
    // OBTER PARÂMETRO ID DA URL
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const id = urlParams.get('id')

    $.ajax({
        url: '/admin/companyApproval/' + id,
        type: 'GET',
        contentType: 'application/json',
        success: function (company) {
            console.log(company)
            // INFORMAÇÕES DA EMPRESA
            $('#title').html(company.name)
            $('#companyPhilosophy').html(company.companyPhilosophy)
            $('#companyCulture').html(company.companyCulture)
            $('#badges').html(company.badges)
            $('#email').html(company.email)
            $('#cnpj').html(company.cnpj)
            $('#title').html(company.title)
            $('#openingDate').html(company.openingDate)
            $('#phone').html(company.phone)
            $('#location').html(company.address.city + ' ' + company.address.state)
            $('#marketNiche').html(company.marketNiche)
            $('#openingDate').html(company.openingDate)

            // ENDEREÇO DA EMPRESA
            $('#companyAddress').html(company.address.street)
            $('#neighborhood').html(company.address.neighborhood)
            $('#city').html(company.address.city)
            $('#state').html(company.address.state)
            $('#cep').html(company.address.cep)
            $('#complement').html(company.address.complement ? company.address.complement : '-')

            // INFORMAÇÕES DO RECRUTADOR
            $('#recruterName').html(`${company.recruter.firstName} ${company.recruter.secondName}`)
            $('#recruterEmail').html(company.recruter.email)
            $('#recruterRole').html(company.recruter.role)
            $('#recruterPhone').html(company.recruter.phone)
            $('#recruterLocation').html(company.recruter.location)
        },
        error: function (err) {
            console.log(err)
        },
    })

    // FUNÇÃO EXECUTADA QUANDO APERTA O BOTÃO DE APROVAR
    $('#approveButton').click(() => {
        // REQUISIÇÃO 'PATCH' PARA ENVIAR A APROVAÇÃO AO BANCO DE DADOS
        $.ajax({
            url: '/admin/companyApproval/' + id,
            type: 'PATCH',
            contentType: 'application/json',

            success: function (res) {
                // ADMINISTRADOR É REDIRECIONADO PARA A PÁGINA DE APROVAÇÃO
                window.location.replace('/views/companyApproval/companyApproval.html')
            },
            error: function (err) {
                console.log(err)
            },
        })
    })

    // FUNÇÃO EXECUTADA QUANDO APERTA O BOTÃO DE REJEITAR A EMPRESA
    $('#deleteCompany').click(() => {
        // REQUISIÇÃO 'DELETE' PARA REMOVAR A EMPRESA DO BANCO DE DADOS
        $.ajax({
            url: '/admin/company/' + id,
            type: 'DELETE',
            contentType: 'application/json',

            success: function (res) {
                // ADMINISTRADOR É REDIRECIONADO PARA A PÁGINA DE APROVAÇÃO
                window.location.replace('/views/companyApproval/companyApproval.html')
            },
            error: function (err) {
                console.log(err)
            },
        })
    })
})
