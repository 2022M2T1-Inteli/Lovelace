// FUNÇÃO EXECUTADA QUANDO OS CAMPOS NÃO SÃO PREENCHIDOS
const validate = (inputs) => {
    let error = false

    inputs.each(function (index) {
        if (inputs[index].value == '') {

            // DEIXA OS CAMPOS NÃO PREENCHIDOS VERMELHOS
            $(this).css('border', '1px solid red')

            // JOGA UM ERRO
            error = true
        }
    })

    return error
}

// FUNÇÃO QUE RECEBE OS VALORES DOS INPUTS E OS ARMAZENA EM UMA CONSTANTE
const createJob = () => {
    const form = {
        type: $('#jobType').val(),
        workModel: $('#jobModel').val(),
        area: $('#jobArea').val(),
        skills: $('#hardSkills').val().concat($('#softSkills').val()),
    }

    // INTEGRAÇÃO POST QUE ADICIONA A CONSTANTE COM OS VALORES DOS INPUTS AO BANCO DE DADOS
    $.ajax({
        url: '/job/create',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(form),
        success: function (res) {
            window.location.replace('/views/jobs/jobs.html')
        },
        error: function (err) {
            console.log(err)
        },
    })
}

// FUNÇÃO EXECUTADA QUANDO A PÁGINA É CARREGADA
$(document).ready(() => {
    // PERMITIR A BUSCA E A SELEÇÃO MÚLTIPLA DO SELECT 
    $('.skillSelect').select2({
        allowClear: true,
    })

    // REQUISIÇÃO 'GET' QUE DISPÕE AS HARDSKILLS E SOFTSKILLS NO SELECT
    $.ajax({
        url: '/skills',
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            let hardSkillOptions = ''
            let softSkillOptions = ''
            for (skill of res) {
                // CHECAR SE É UMA HARDSKILL OU SOFTSKILL
                if (skill.type == 0) {
                    hardSkillOptions += `<option value="${skill.id}">${skill.name}</option>`
                } else {
                    softSkillOptions += `<option value="${skill.id}">${skill.name}</option>`
                }
            }

            $('#hardSkills').html(hardSkillOptions)
            $('#softSkills').html(softSkillOptions)
        },
        error: function (err) {
            console.log(err)
        },
    })

    // REQUISIÇÃO 'GET' QUE DISPÕE AS OPÇÕES DE ÁREA DO MERCADO NO SELECT
    $.ajax({
        url: '/area',
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            let areaOptions = ''
            for (area of res) {
                areaOptions += `<option value="${area.id}">${area.name}</option>`
            }

            $('#jobArea').append(areaOptions)
        },
        error: function (err) {
            console.log(err)
        },
    })

    // FUNÇÃO EXECUTADA QUANDO CLICA NO BOTÃO
    $('#createJobButton').click(() => {
        let inputs = $('#jobType, #jobModel, #jobArea, #hardSkills, #softSkills')

        // CHECA SE OS CAMPOS NÃO ESTÃO VAZIOS
        if (validate(inputs) == true) {
            return
        }

        // CRIA A VAGA
        createJob()
    })
})
