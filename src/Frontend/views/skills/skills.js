$(document).ready(() => {
    const backdrop = $('.backdrop')
    const modal = $('.modal')

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

    $('#createSkill').click(() => {
        const skillName = $('#skillName').val()
        const skillType = $('#skillType').val()
        if (skillName && skillType) {
            $.ajax({
                url: '/skill/create',
                type: 'POST',
                contentType: 'application/json',
                body: JSON.stringify({ name: skillName, type: skillType }),
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
