// FUNÇÃO EXECUTADA QUANDO A PÁGINA CARREGA
$(document).ready(() => {
    // REQUISIÇÃO 'GET' PARA PEGAR OS DADOS DAS VAGAS NO BANCO DE DADOS
    $.ajax({
        url: '/job',
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            let elements = ''
            // CHECAR SE ALGUMA VAGA FOI CRIADA JÁ
            if (res.length == 0) {
                // MENSAGEM CASO NÃO TENHA VAGAS CRIADAS
                elements =
                    "<a class='errorMessage'>Você ainda não cadastrou nenhuma vaga. <br> Clique em 'Criar vaga' para disponibilizar uma nova vaga. </a>"
                // ADICINA À PAGINA HTML OS DADOS
            } else {
                for (job of res) {
                    elements += `
                            <a class="gridLink" href="/views/candidates/candidates.html?jobId=${job.id}">
                                <div class="gridBox">
                                <h4 class="boxTitle">${job.area ? job.area.name : '-'}</h4>
                                <p class="boxSubTitle">${job.type}</p>
                                <div class="badgeContainer">
                                    <span class="badge badge-blue">${job.workModel}</span>
                                </div>
                                <div class="badgeContainer">`

                    for (skill of job.skills) {
                        elements += `<span class="badge badge-yellow">${skill.name}</span>`
                    }

                    elements += `</div>
                                <div class="iconsContainer">
                                    
                                    <button onClick="deleteJob(${job.id})"><img src="../../assets/icons/trashIcon.png" class="icon" alt=""
                                    /></button>
                                </div>
                            </div>
                        </a>`
                }
            }
            $('.grid').html(elements)
        },
        error: function (err) {
            console.log(err)
        },
    })
})
// REQUISIÇÃO DE 'DELETE' PARA REMOVER A VAGA DO BANCO DE DADOS
const deleteJob = (id) => {
    $.ajax({
        url: '/job/' + id,
        type: 'DELETE',
        contentType: 'application/json',
        success: function (res) {
            // RECARREGA A PÁGINA
            window.location.reload()
        },
        error: function (err) {
            console.log(err)
        },
    })
}
