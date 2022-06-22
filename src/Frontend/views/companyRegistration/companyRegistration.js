// FUNÇÃO EXECUTDA QUANDO A PÁGINA É CARREGADA
$(document).ready(() => {

    $('#cnpj').mask('00.000.000/0000-00', {reverse: true});
    $('#date').mask('00/00/0000');
    $('#phone_with_ddd').mask('(00) 0000-0000');
    $('#phone_with_ddd2').mask('(00) 0000-0000');
    $('#cep').mask('00000-000');
    $('#cellphone').mask('0 0000-0000')

    $('#finalButton').click(() => {
        const form = {}

        $('#companyAccount :input').each(function () {
            var input = $(this)[0] // This is the jquery object of the input, do what you will
            console.log(input)
            form[input.name] = input.value
        })

        $('#companyInfo :input').each(function () {
            var input = $(this)[0] // This is the jquery object of the input, do what you will
            form[input.name] = input.value
        })

        $('#companyAddress :input').each(function () {
            var input = $(this)[0] // This is the jquery object of the input, do what you will
            form[input.name] = input.value
        })

        $('#companyRecruter :input').each(function () {
            var input = $(this)[0] // This is the jquery object of the input, do what you will
            form[input.name] = input.value
        })

        form.companyPhilosophy = $('#companyPhilosophy').val()
        form.companyCulture = $('#companyCulture').val()
        form.badges = $('#badges').val()
        
        $.ajax({
            url: '/company/signUp',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(form),
            success: function (res) {
                window.location.replace('/views/companySignUpCompleted/companySignUpCompleted.html')
            },
            error: function (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.responseText,
                })
            },
        })
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

// ARRAY DE OBJETOS COM AS URLS DOS DIFERENTES ICONES E ELEMENTOS
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

const validate = (inputs) => {
    let error = false;
  
    inputs.each(function (index) {
      if ($(this).val() == "") {
        $(this).css("border", "1px solid red");
        error = true;
      }
    });
  
    return error;
  };

// FUNÇÃO EXECUTADA QUANDO O USUÁRIO APERTA NO BOTÃO "PRÓXIMO"
const nextStage = () => {

    if (stage == 0) {
        let inputs = $("#companyAccount input, #companyInfo input, #companyAddress input, #companyRecruter input");
        if (validate(inputs) == true) {
          return;
        }
      } else if (stage == 1) {
        let inputs = $("#companyPhilosophy, #companyCulture");
        if (validate(inputs) == true) {
          return;
        }
      } else if (stage == 2) {
        let inputs = [$("#badges")];
        if (validate(inputs) == true) {
          return;
        }
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

                // SETAR O DISPLAY DO PRÓXIMO CONTAINER COMO FLEX (VISÍVEL)
                containers[stage].css('display', 'flex')

                // ADICIONAR A CLASSSE ATIVA AO PRÓXIMO CONTAINER DO ICONE 
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

// FUNÇÃO EXECIUTADA QUANDO O SUÁRIO APERTA NO BOTÃO "VOLTAR" 
const previousStage = () => {
    // CHECAR SE O ESTÁGIO É MAIOR QUE 0

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

// LINKAR AS FUNÇÕES AO APERTO DOS BOTÕES 
$('.nextButton').click(nextStage)
$('.backButton').click(previousStage)
