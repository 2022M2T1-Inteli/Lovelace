// FUNÇÃO EXECUTADA QUANDO A PÁGINA É CARREGADA
$(document).ready(() => {
    // REFERENCIAR OS ELEMENTOS HTML
    const backdrop = $('.backdrop')
    const modal = $('.modal')

    // AJAX PARA PEGAR AS ÁREAS QUE EXISTEM NO BANCO DE DADOS
    $.ajax({
        url: '/area',
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            // PREENCHER TABELA COM AS ÁREAS
            let areaElements = ''
            for (area of res) {
                areaElements += `<tr class="row">
                    <td>${area.name}</td>
                   
                    <td><img class="trashIcon" src="../../assets/skills/trashIcon.png" alt="Lixo" onclick="deleteArea(${area.id})" /></td>
                </tr>`
            }
            $('.areaTable').append(areaElements)
        },
        error: function (err) {
            console.log(err)
        },
    })

    // FUNÇÃO PARA ABRIR A MODAL
    const openModal = () => {
        backdrop.css('display', 'block')
        modal.css('display', 'block')
    }

    // FUNÇÃO PARA FECHAR A MODAL
    const closeModal = () => {
        backdrop.css('display', 'none')
        modal.css('display', 'none')
    }

    // ATRIBUIR A FUNÇÃO A CLIQUES EM ELEMENTOS HTML
    $('#modalBtn').click(openModal)
    $('.backdrop').click(closeModal)

    // ESCUTAR CLIQUES NO ELEMENTO COM ID createArea
    $('#createArea').click(() => {
        // PEGAR VALOR DO INPUT
        const areaName = $('#areaName').val()

        // CHECAR SE VALOR DO INPUT EXISTE
        if (areaName) {
            // AJAX PARA CRIAR NOVA ÁREA
            $.ajax({
                url: '/area/create',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ name: areaName }),
                success: function (res) {
                    // RECARREGAR A PÁGINA
                    window.location.reload()
                },
                error: function (err) {
                    // FECHAR A MODAL
                    closeModal()

                    // MOSTRAR ALERTA COM O ERRO
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

// FUNÇÃO DE DELETAR ÁREA
function deleteArea(id) {
    // REQUISIÇÃO PARA DELETAR ÁREA
    $.ajax({
        url: '/area/' + id,
        type: 'DELETE',
        contentType: 'application/json',
        success: function (res) {
            // RECARREGAR PÁGINA
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
