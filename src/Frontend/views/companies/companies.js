let selectCompanyId = null

// CONSTANTE DEFINIDA PELA CLASSE BACKDROP VINDA DO HTML
const backdrop = $('.backdrop')

// CONSTANTE DEFINIDA PELA CLASSE MODAL VINDA DO HTML
const modal = $('.modal')

// FUNÇÃO QUE ABRE O MODAL
const openModal = (id) => {
    selectCompanyId = id
    backdrop.css('display', 'block')
    modal.css('display', 'block')
}

// FUNÇÃO QUE FECHA O MODAL
const closeModal = () => {
    console.log('closed')
    selectCompanyId = null
    backdrop.css('display', 'none')
    modal.css('display', 'none')
}

//EXECUTA A FUNÇÃO AO CLICAR NO BOTÃO
$('#modalBtn').click(openModal)

//EXECUTA A FUNÇÃO QUANDO CLICA FORA DO MODAL
$('.backdrop').click(closeModal)

// FUNÇÃO EXECUTADA QUANDO CARREGA A PÁGINA
$(document).ready(() => {
    // REQUISIÇÃO 'GET' QUE ADICIONA OS DADOS DA EMPRESA À PÁGINA HTML
    $.ajax({
        url: '/companies',
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            let companyElements = ''
            for (company of res) {
                companyElements += `<tr class="row">
                    <td>${company.name}</td>
                    <td>${company.email}</td>
                    <td>${company.cnpj}</td>
                    <td>${company.phone}</td>
                    <td>${company.phone2}</td>
                    <td>${company.openingDate}</td>
                    <td>${company.marketNiche}</td>
                    <td><img class="trashIcon" src="../../assets/skills/trashIcon.png" alt="Lixo" onclick="openModal(${company.id})" /></td>
                </tr>`
            }
            $('.skillTable').append(companyElements)
        },
        error: function (err) {
            console.log(err)
        },
    })

    // REQUISIÇÃO 'DELETE' QUE REMOVE A EMPRESA DO BANCO DE DADOS
    $('.confirmationBtn').click(() => {
        $.ajax({
            url: '/company/' + selectCompanyId,
            type: 'DELETE',
            contentType: 'application/json',

            success: function (res) {
                // RECARREGA A PÁGINA
                location.reload()
            },
            error: function (err) {
                console.log(err)
            },
        })
    })
})
