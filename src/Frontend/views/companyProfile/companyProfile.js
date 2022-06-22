$(document).ready(() => {
    // OBTER PARÂMETRO ID DA URL
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const id = urlParams.get('id')

    // FUNÇÃO DE DAR LIKE 
    const likeButton = () => {
        $('#like').addClass('like')
        $('#like').removeClass('dislike')
        $('#like').html('Like')
    }

    // FUNÇÃO DE DAR DISLIKE
    const dislikeButton = () => {
        $('#like').removeClass('like')
        $('#like').addClass('dislike')
        $('#like').html('Dislike')
    }

    // REQUISIÇÃO GET PARA PEGAR OS DADOS DA EMPRESA E ADCIONÁ-LOS À PÁGINA HTML
    $.ajax({
        url: '/user/getCompanies/' + id,
        type: 'GET',
        contentType: 'application/json',
        success: function ({company, isLiked}) {
            
            $('.title').html(company.name)
            $('#philosophy').html(company.companyPhilosophy)
            $('#culture').html(company.companyCulture)
            $('#openingDate').html('Data de Abertura: ' + company.openingDate)
            $('#marketNiche').html('Nicho: ' + company.marketNiche)
            $('#badges').html('Premiações e programas: ' + company.badges)
            
            // CHECA SE JÁ FOI DADO LIKE
            if (isLiked) {
                // DÁ LIKE 
                dislikeButton()
            } else {
                // DÁ DISLIKE
               likeButton()
            }
        },
        error: function (err) {
            console.log(err)
        },
    })

    // REQUISIÇÃO GET PARA CHECAR SE FOI DADO O LIKE
    $('#like').click(() => {
        if ($('#like').hasClass('like')) {
            $.ajax({
                url: '/user/likeCompany/' + id,
                type: 'GET',
                contentType: 'application/json',
                success: function (res) {
                    // DÁ DISLIKE
                    dislikeButton()
                },
                error: function (err) {
                    // DA DISLIKE
                    dislikeButton()
                },
            })
        // REQUISIÇÃO PARA DAR LIKE 
        } else {
            $.ajax({
                url: '/user/likeCompany/' + id,
                type: 'DELETE',
                contentType: 'application/json',
                success: function (res) {
                    // DÁ LIKE
                    likeButton()
                },
            })
        }
    })
})
