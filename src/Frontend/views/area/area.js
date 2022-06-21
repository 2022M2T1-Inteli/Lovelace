$(document).ready(() => {
    const backdrop = $('.backdrop')
    const modal = $('.modal')

    $.ajax({
        url: '/area',
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
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

    const openModal = () => {
        backdrop.css('display', 'block')
        modal.css('display', 'block')
    }

    const closeModal = () => {
        backdrop.css('display', 'none')
        modal.css('display', 'none')
    }

    $('#modalBtn').click(openModal)
    $('.backdrop').click(closeModal)

    $('#createArea').click(() => {
        const areaName = $('#areaName').val()

        if (areaName) {
            $.ajax({
                url: '/area/create',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ name: areaName }),
                success: function (res) {
                    window.location.reload()
                },
                error: function (err) {
                    console.log(err)
                },
            })
        }
    })
})

function deleteArea(id) {
    $.ajax({
        url: '/area/' + id,
        type: 'DELETE',
        contentType: 'application/json',

        success: function (res) {
            window.location.reload()
        },
        error: function (err) {
            console.log(err)
        },
    })
}
