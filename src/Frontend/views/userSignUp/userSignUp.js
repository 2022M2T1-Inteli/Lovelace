// FUNÇÃO EXECUTADA QUANDO A PÁGINA É CARREGADA

$(document).ready(() => {
    $('.nextButton').click(nextStage)
    $('.backButton').click(previousStage)
    $('#phone').mask('(00) 0000-0000')
    $('#birthDate').mask('00/00/0000')
    $('#cpf').mask('000.000.000-00', { reverse: true })
    $('#cep').mask('00000-000')

    // REQUISIÇÃO 'GET' QUE DISPÕE AS SKILLS NO SELECT
    $.ajax({
        url: '/skills',
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            let hardSkillOptions = ''
            let softSkillOptions = ''
            for (skill of res) {
                // CHECAR QUAL O TIPO DE SKILL
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

    // PERMITIR A BUSCA E A SELEÇÃO MÚLTIPLA DO SELECT
    $('.skillSelect').select2({
        allowClear: true,
        theme: 'classic',
    })
})

// VARIÁVEL DE CONTROLE DE ESTÁGIO DO CADASTRO 
let stage = 0

// URL INICIAL DOS ICONES 
const assetsInitialPath = '../../../assets/companyRegistration/'

// ARRAY COM CONTAINER DE ICONES 
const iconContainers = [$('.iconImageBox0'), $('.iconImageBox1'), $('.iconImageBox2')]

// ARRAY DE PBJETOS COM AS URLS DOS DIFERENTES ICONES E ELEMENTOS 
const icons = [
    {
        yellowIcon: assetsInitialPath + 'infoYellow.png',
        whiteIcon: assetsInitialPath + 'infoWhite.png',
        element: $('.icon0'),
    },
    {
        yellowIcon: assetsInitialPath + 'saveYellow.png',
        whiteIcon: assetsInitialPath + 'saveWhite.png',
        element: $('.icon1'),
    },
    {
        yellowIcon: assetsInitialPath + 'uploadYellow.png',
        whiteIcon: assetsInitialPath + 'uploadWhite.png',
        element: $('.icon2'),
    },
]

// ARRAY COM CONTAINERS 
const containers = [$('.stage0'), $('.stage1'), $('.stage2')]

// SETAR A OPACIDADE OU O DISPLAY DE CADA CONTAINER 
containers[0].css('opacity', 100)
containers[1].css('display', 'none')
containers[2].css('display', 'none')

// FUNÇÃO DE CRIAR USUÁRIO
const createUser = () => {

    // CRIA UM OBJETO PARA ARMAZENAR OS VALORES
    const form = {}

    // ATRIBUI OS VALORES DOS INPUTS A ESSE OBJETO
    $('#accountForm input').each(function () {
        var input = $(this)[0]
        form[input.name] = input.value
    })

    $('#infoForm input').each(function () {
        var input = $(this)[0]
        form[input.name] = input.value
    })

    $('#addressForm input').each(function () {
        var input = $(this)[0]
        form[input.name] = input.value
    })

    form.aboutYou = $('.aboutYou').val()

    form.skills = $('#hardSkills').val().concat($('#softSkills').val())

    // REQUISIÇÃO 'POST' QUE REGISTRA OS DADOS DO USUÁRIO NO BANCO DE DADOS
    $.ajax({
        url: '/user/signUp',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(form),
        success: function (res) {
            window.location.replace('/views/companyMatch/companyMatch.html')
        },
        error: function (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.responseText,
            })
        },
    })
}

// FUNÇÃO PARA CHECAR SE OS CAMPOS FORAM PREENCHIDOS
const validate = (inputs) => {
    let error = false

    inputs.each(function (index) {
        // CHECAR SE OS CAMPOS ESTÃO PREENCHIDOS
        if ($(this).val() == '') {
            // DEIXA O CAMPO VERMELHO
            $(this).css('border', '1px solid red')
            error = true
        }
    })

    return error
}

// FUNÇÃO EXECUTADA QUANDO O USUÁRIO APERTA NO BOTÃO "PRÓXIMO" 
const nextStage = () => {
    // CHECAR EM QUAL ESTÁGIO O USUÁRIO ESTÁ
    if (stage == 0) {
        let inputs = $('#infoForm input, #addressForm input, #accountForm input')
        if (validate(inputs) == true) {
            return
        }
    } else if (stage == 1) {
        let inputs = $('#hardSkills, #softSkills')
        if (validate(inputs) == true) {
            return
        }
    } else if (stage == 2) {
        let input = $('#aboutYou')
        if (input.val() == '') {
            input.css('border', '1px solid red')
            return
        }
        createUser()
    }

    // CHECAR SE O ESTÁGIO É MENOR QUE 2
    if (stage < 2) {
        // FUNÇÃO QUE ANIMA A OPACIDADE DO CONTAINER 
        containers[stage].animate(
            {
                opacity: 0,
            },
            400,
            // FUNÇÃO EXECUTADA QUANDO A ANIMAÇÃO ACABA
            function () {
                // SETAR O DISPLAY DO CONTAINER ANIMADO PARA NONE
                containers[stage].css('display', 'none')

                // REMOVER A CLASSE ATIVO DO CONTAINER DO ICONE
                iconContainers[stage].removeClass('active')

                // MUDAR A COR DO ICONE
                icons[stage].element.attr('src', icons[stage].whiteIcon)

                // PASSAR PARA O PRÓXIMO ESTÁGIO 
                stage++

                // Setar o display do próximo container como flex (visível)
                containers[stage].css('display', 'flex')

                // SETAR O DISPLAY DO PRÓXIMO CONTAINER COMO FLEX (VISÍVEL)
                iconContainers[stage].addClass('active')

                // MUDAR A COR DO ICONE
                icons[stage].element.attr('src', icons[stage].yellowIcon)

                // ANIMAR A OPACIDADE DO PRÓXIMO CONTAINER
                containers[stage].animate(
                    {
                        opacity: 1,
                    },
                    400
                )
            }
        )
    }
}

// FUNÇÃO EXECUTADA QUANDO O USUÁRIO APERTA NO BOTÃO "VOLTAR"
const previousStage = () => {
    
    // CHECAR SE O ESTÁGIO É MENOR QUE 0
    if (stage > 0) {

        // FUNÇÃO QUE ANIMA A OPACIDADE DO CONTAINER
        containers[stage].animate(
            {
                opacity: 0,
            },
            400,
            // FUNÇÃO EXECUTADA QUANDO A ANIMAÇÃO ACABA 
            function () {
                // SETAR O DISPLAY DO CONTAINER ANIMADO PARA NONE
                containers[stage].css('display', 'none')

                // REMOVER A CLASSE ATIVO DO CONTAINER DO ICONE
                iconContainers[stage].removeClass('active')

                // MUDAR A COR DO ICONE
                icons[stage].element.attr('src', icons[stage].whiteIcon)

                // PASSAR PARA O ESTÁGIO ANTERIOR 
                stage--

                // ADICIONAR A CLASSSE ATIVA AO PRÓXIMO CONTAINER DO ICONE
                iconContainers[stage].addClass('active')

                // SETAR O DISPLAY DO PRÓXIMO CONTAINER COMO FLEX (VISÍVEL)
                containers[stage].css('display', 'flex')

                // MUDAR A COR DO ICONE
                icons[stage].element.attr('src', icons[stage].yellowIcon)

                // ANIMAR A OPACIDADE DO PRÓXIMO CONTAINER
                containers[stage].animate(
                    {
                        opacity: 1,
                    },
                    400
                )
            }
        )
    }
}
