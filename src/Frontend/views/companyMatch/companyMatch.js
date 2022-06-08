$(document).ready(() => {
    $.ajax({
        url: '/user/getCompanies',
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            let elements = ''
            for (company of res) {
                elements += `<div class="gridBox">
                                <h4 class="boxTitle">${company.name}</h4>
                                <p class="boxSubTitle">${company.city} / ${company.state}</p>
                                <div class="badgeContainer">
                                    <span class="badge badge-yellow">${company.marketNiche}</span>
                                </div>
                                <p class="boxText">
                                    ${
                                        company.companyPhilosophy.length > 160
                                            ? company.companyPhilosophy.slice(0, 160)
                                            : company.companyPhilosophy
                                    }...
                                </p>
                                <a class="btn btn-yellow" href="/views/companyProfile/companyProfile.html?id=${
                                    company.id
                                }">Mais detalhes</a>
                            </div>`
            }
            $('.grid').html(elements)
        },
        error: function (err) {
            console.log(err)
        },
    })
})
