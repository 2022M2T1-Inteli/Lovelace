// FUNÇÃO EXECUTADA QUANDO CARREGA A PÁGINA
$(document).ready(() => {
    // REQUISIÇÃO 'GET' QUE DISPÕE OS DADOS DA EMPRESA NA PÁGINA HTML
    $.ajax({
        url: '/admin/companyApproval',
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            if (res.length > 0) {
                let elements = ''
                // LOOP PARA ADICINAR CADA EMPRESA E SEUS DADOS
                for (company of res) {
                    elements += `<div class="gridBox">
                                    <h4 class="boxTitle">${company.name}</h4>
                                    <p class="boxSubTitle">${company.address.city} / ${company.address.state}</p>
                                    <p class="boxText">
                                        ${company.marketNiche}
                                    </p>
                                    
                                    <p class="boxText">
                                            ${
                                                company.companyPhilosophy.length > 160
                                                    ? company.companyPhilosophy.slice(0, 160)
                                                    : company.companyPhilosophy
                                            }
                                    </p>
                                    
                                    <a class="btn btn-yellow" href="../viewCompany/viewCompany.html?id=${
                                        company.id
                                    }">Mais detalhes</a>
                                </div>`
                }
                $('.grid').html(elements)

            // MENSAGEM PARA A EMPRESA CASO NÃO TENHA EMPRESA A SEREM APROVADAS
            } else {
                $('.grid').html(`<p class="noDataFound">Nenhuma empresa necessita de aprovação!</p>`)
            }
        },
        error: function (err) {
            console.log(err)
        },
    })
})
