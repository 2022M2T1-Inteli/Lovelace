// FUNÇÃO EXECUTADA QUANDO A PÁGINA É CARREGADA
$(document).ready(() => {
    // FUNÇÃO QUE CALCULA A IDADE POR MEIO DA DATE DE NASCIMENTO
    function getAge(dateString) {
        var today = new Date()

        var dateParts = dateString.split('/')

        var birthDate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])

        var age = today.getFullYear() - birthDate.getFullYear()
        var m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        
        return age + ' anos'
    }


    // REQUISIÇÃO 'GET' QUE DISPÕE OS DADOS DA USUÁRIA NA PÁGINA HTML
    $.ajax({
        url: '/user/me',
        type: 'GET',
        contentType: 'application/json',
        success: function (user) {
            $('#name').html(user.firstName + ' ' + user.lastName)
            $('#age').html(getAge(user.birthDate))
            $('#location').html(user.country)
            $('#history').html(user.aboutYou)

            let hardSkills = ''
            let softSkills = ''
            for (skill of user.skills) {

                //CHECAR QUAL O TIPO DA SKILL
                if (skill.type == 0) {
                    hardSkills += `<span class="badge badge-yellow">${skill.name}</span>`
                } else {
                    softSkills += `<span class="badge badge-blue">${skill.name}</span>`
                }
            }

            $('#hardSkills').html(hardSkills)
            $('#softSkills').html(softSkills)
            $('#email').html(user.email)
            $('#birthDate').html(user.birthDate)
            $('#phone').html(user.phone)
            $('#country').html(user.country)
            $('#civilState').html(user.civilState)
            $('#cpf').html(user.cpf)
            $('#rg').html(user.rg)

            $('#street').html(user.address.street)
            $('#cep').html(user.address.cep)
            $('#neighborhood').html(user.address.neighborhood)
            $('#city').html(user.address.city)
            $('#state').html(user.address.state)
            $('#complement').html(user.address.complement)

            $('#editButton').attr('href', `/views/userProfileEdit/userProfileEdit.html`)
        },
        error: function (err) {
            console.log(err)
        },
    })
})
