let selectCompanyId = null

const backdrop = $('.backdrop')
const modal = $('.modal')

const openModal = (id) => {
    selectCompanyId = id
    backdrop.css('display', 'block')
    modal.css('display', 'block')
}

const closeModal = () => {
    console.log('closed')
    selectCompanyId = null
    backdrop.css('display', 'none')
    modal.css('display', 'none')
}

$('#modalBtn').click(openModal)
$('.backdrop').click(closeModal)

$(document).ready(() => {
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

    $('.confirmationBtn').click(() => {
        $.ajax({
            url: '/company/' + selectCompanyId,
            type: 'DELETE',
            contentType: 'application/json',

            success: function (res) {
                location.reload()
            },
            error: function (err) {
                console.log(err)
            },
        })
    })
})
