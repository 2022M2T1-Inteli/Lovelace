// FUNÇÃO EXECUTADA QUANDO A PÁGINA É CARREGADA
$(document).ready(() => {
    const backdrop = $('.backdrop')
    const modal = $('.modal')

    // REQUISIÇÃO 'GET' PARA DISPOR A SKILLS NA PÁGINA HTML
    $.ajax({
        url: '/skills',
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            let skillElements = ''
            for (skill of res) {
                skillElements += `<tr class="row">
                    <td>${skill.name}</td>
                    <td>${skill.type == 0 ? 'Técnica' : 'Interpessoal'}</td>
                    <td><img class="trashIcon" src="../../assets/skills/trashIcon.png" alt="Lixo" onclick="deleteSkill(${
                        skill.id
                    })" /></td>
                </tr>`
            }
            $('.skillTable').append(skillElements)
        },
        error: function (err) {
            console.log(err)
        },
    })

    // FUNÇÃO QUE ABRE O MODAL
    const openModal = () => {
        backdrop.css('display', 'block')
        modal.css('display', 'block')
    }

    // FUNÇÃO QUE FECHA O MODAL
    const closeModal = () => {
        backdrop.css('display', 'none')
        modal.css('display', 'none')
    }

    // EXECUTAR A FUNÇÃO DE ABRIR O MODAL AO APERTAR O BOTÃO
    $('#modalBtn').click(openModal)

    // EXECUTAR A FUNÇÃO DE FECHAR O MODAL AO CLICAR FORA DO MODAL
    $('.backdrop').click(closeModal)

    // FUNÇÃO EXECUTADA AO CLICAR NO BOTÃO
    $('#createSkill').click(() => {
        const skillName = $('#skillName').val()
        const skillType = $('#skillType').val()

        // CHECAR A EXISTÊNCIA DA SKILL
        if (skillName && skillType) {
            // REQUISIÇÃO 'POST' QUE ADICIONA A SKILL AO BANCO DE DADOS
            $.ajax({
                url: '/skill/create',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ name: skillName, type: skillType }),
                success: function (res) {
                    // RECARREGA A PÁGINA
                    window.location.reload()
                },
                error: function (err) {
                    // FECHAR O MODAL
                    closeModal()
                    // MOSTRAR ALERTA DE ERRO
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err.responseText,
                    })
                },
            })
        }
    })
})

// FUNÇÃO AO CLICAR NO BOTÃO DE DELETE
function deleteSkill(id) {
    // REQUISIÇÃO DE 'DELETE' PARA REMOVER A SKILL DO BANCO DE DADOS
    $.ajax({
        url: '/skill/' + id,
        type: 'DELETE',
        contentType: 'application/json',

        success: function (res) {
            // RECARREGA A PÁGINA
            window.location.reload()
        },
        error: function (err) {
            // MOSTRAR ALERTA DE ERRO
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.responseText,
            })
        },
    })
}
