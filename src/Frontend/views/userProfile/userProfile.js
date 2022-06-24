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
            // COLOCAR INFORMAÇÕES DO USUÁRIO RECEBIDO NA RESPOSTA EM CADA CAMPO HTML
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

            if (hardSkills == '') {
                hardSkills = `<span class="noSkills">Sem competências cadastradas</span>`
            }
            if (softSkills == '') {
                softSkills = `<span class="noSkills">Sem competências cadastradas</span>`
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

            // REQUISIÇÃO 'GET' PARA PEGAR TODAS AS COMPETÊNCIAS
            $.ajax({
                url: '/skills',
                type: 'GET',
                contentType: 'application/json',
                success: function (skills) {
                    let matchedSkills = []
                    for (skill of skills) {
                        for (userSkill of user.skills) {
                            if (userSkill.skillId == skill.id) {
                                matchedSkills.push(skill.id)
                            }
                        }
                    }

                    const hardSelect = []
                    const softSelect = []
                    for (skill of skills) {
                        if (skill.type == 0) {
                            hardSelect.push({
                                id: skill.id,
                                text: skill.name,
                                selected: matchedSkills.includes(skill.id),
                            })
                        } else {
                            softSelect.push({
                                id: skill.id,
                                text: skill.name,
                                selected: matchedSkills.includes(skill.id),
                            })
                        }
                    }

                    // PERMITIR A BUSCA E A SELEÇÃO MÚLTIPLA DO SELECT
                    // PREENCHER OS SELECTS COM OPÇÕES E SELECIONAR AS SKILLS QUE A USUÁRIA JÁ TIVER
                    $('.skillSelect1').select2({
                        allowClear: true,
                        theme: 'classic',
                        placeholder: 'Técnicas',
                        data: hardSelect,
                    })

                    $('.skillSelect2').select2({
                        allowClear: true,
                        theme: 'classic',
                        placeholder: 'Interpessoais',
                        data: softSelect,
                    })
                },
            })
        },
    })

    // FUNÇÃO QUE EDITA AS COMPETÊNCIAS DA USUÁRIA
    $('#editSkill').click(() => {
        const hardSkillsSelect = $('#hardSkillsSelect').val()
        const softSkillsSelect = $('#softSkillsSelect').val()

        $.ajax({
            url: '/user/editSkills',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ skills: hardSkillsSelect.concat(softSkillsSelect) }),
            success: function (res) {
                window.location.reload()
            },
        })
    })

    const backdrop = $('.backdrop')
    const modal = $('.modal')

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
    $('#editButton').click(openModal)

    // EXECUTAR A FUNÇÃO DE FECHAR O MODAL AO CLICAR FORA DO MODAL
    $('.backdrop').click(closeModal)
})
