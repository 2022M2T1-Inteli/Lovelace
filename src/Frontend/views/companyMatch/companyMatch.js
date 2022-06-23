// FUNÇÃO EXECUTADA QUANDO A PÁGINA É CARREGADA
$(document).ready(() => {
    // VARIÁVEL DE EMPRESAS
    var companies = []

    // FUNÇÃO PARA RENDERIZAR AS EMPRESAS NA TELA
    function renderCompanies() {
        let elements = ''

        // MOSTRAR MENSAGEM CASO NÃO EXISTAM EMPRESAS
        if (companies.length == 0) {
            elements =
                "<a class='errorMessage'>Nenhuma empresa encontrada.<br> Ainda não temos vagas que condizem com seu perfil!</a>"
        } else {
            // LOOP EM EMPRESAS
            for (company of companies) {
                elements += `<div class="gridBox">
                                <h4 class="boxTitle">${company.name}</h4>
                                <p class="boxSubTitle">${company.city} / ${company.state}</p>
                                <div class="badgeContainer">
                                    <span class="badge badge-yellow">${company.marketNiche}</span>
                                </div>
                                <p class="boxText">
                                    ${
                                        company.companyPhilosophy.length > 160
                                            ? company.companyPhilosophy.slice(0, 160)
                                            : company.companyPhilosophy
                                    }...
                                </p>
                                <a class="btn btn-yellow" href="/views/companyProfile/companyProfile.html?id=${
                                    company.id
                                }">Mais detalhes</a>
                            </div>`
            }
        }

        // MOSTRAR EMPRESAS NA TELA
        $('.grid').html(elements)
    }

    // GET DE EMPRESAS
    $.ajax({
        url: '/user/getCompanies',
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            // SETAR VARIÁVEL COM AS EMPRESAS DA RESPOSTA
            companies = res

            // RENDERIZAR EMPRESAS NA TELA
            renderCompanies()
        },
        error: function (err) {
            console.log(err)
        },
    })

    // SELECT DE ORDENAÇÃO
    $('.orderSelect').change(function () {
        // VALOR DO SELECT DE ORDENAÇÃO
        const value = $('.orderSelect').val()

        if (value == 'az') {
            // ORDENAR AS EMPRESAS NA ORDEM ALFABÊTICA
            const sortedCompanies = companies.sort(function (a, b) {
                if (a.name < b.name) {
                    return -1
                }
                if (a.name > b.name) {
                    return 1
                }
                return 0
            })

            // SETAR VARIÁVEL DE EMPRESAS COM A NOVA ORDEM
            companies = sortedCompanies

            // RENDERIZAR NOVA ORDEM DE EMPRESAS
            renderCompanies()
        } else if (value == 'za') {
            // ORDENAR AS EMPRESAS AO CONTRÁRIO DA ORDEM ALFABÊTICA
            const sortedCompanies = companies.sort(function (a, b) {
                if (a.name > b.name) {
                    return -1
                }
                if (a.name < b.name) {
                    return 1
                }
                return 0
            })

            // SETAR VARIÁVEL DE EMPRESAS COM A NOVA ORDEM
            companies = sortedCompanies

            // RENDERIZAR NOVA ORDEM DE EMPRESAS
            renderCompanies()
        } else if (value == 'data') {
            // ORDENAR AS EMPRESAS NA ORDEM DE CRIAÇÃO
            const sortedCompanies = companies.sort(function (a, b) {
                if (a.id > b.id) {
                    return -1
                }
                if (a.id < b.id) {
                    return 1
                }
                return 0
            })

            // SETAR VARIÁVEL DE EMPRESAS COM A NOVA ORDEM
            companies = sortedCompanies

            // RENDERIZAR NOVA ORDEM DE EMPRESAS
            renderCompanies()
        } else if (value == 'data2') {
            // ORDENAR AS EMPRESAS AO CONTRÁRIO DA ORDEM DE CRIAÇÃO
            const sortedCompanies = companies.sort(function (a, b) {
                if (a.id < b.id) {
                    return -1
                }
                if (a.id > b.id) {
                    return 1
                }
                return 0
            })

            // SETAR VARIÁVEL DE EMPRESAS COM A NOVA ORDEM
            companies = sortedCompanies

            // RENDERIZAR NOVA ORDEM DE EMPRESAS
            renderCompanies()
        }
    })
})
