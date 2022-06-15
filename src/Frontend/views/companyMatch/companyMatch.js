$(document).ready(() => {
    var companies = []

    function renderCompanies() {
        let elements = ''
        if (companies.length == 0) {
            elements = "<a class='errorMessage'>Nenhuma empcompaniesa encontrada.<br> Ainda não temos vagas que condizem com seu perfil!</a>"
        }
        else {
            for (company of companies) {
                elements += `<div class="gridBox">
                                <h4 class="boxTitle">${company.name}</h4>
                                <p class="boxSubTitle">${company.city} / ${company.state}</p>
                                <div class="badgeContainer">
                                    <span class="badge badge-yellow">${company.marketNiche}</span>
                                </div>
                                <p class="boxText">
                                    ${company.companyPhilosophy.length > 160
                        ? company.companyPhilosophy.slice(0, 160)
                        : company.companyPhilosophy
                    }...
                                </p>
                                <a class="btn btn-yellow" href="/views/companyProfile/companyProfile.html?id=${company.id
                    }">Mais detalhes</a>
                            </div>`
            }
        }
        $('.grid').html(elements)
    }

    $.ajax({
        url: '/user/getCompanies',
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            companies = res
            renderCompanies()

        },
        error: function (err) {
            console.log(err)
        },
    })

    $(".orderSelect").change(function () {
        const value = $(".orderSelect").val()

        if (value == "az") {
            const sortedCompanies = companies.sort(function (a, b) {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1
                }
                return 0

            })
            companies = sortedCompanies
            renderCompanies()
        } else if (value == "za") {
            const sortedCompanies = companies.sort(function (a, b) {
                if (a.name > b.name) {
                    return -1;
                }
                if (a.name < b.name) {
                    return 1
                }
                return 0

            })
            companies = sortedCompanies
            renderCompanies()
        } else if (value == "data") {
            const sortedCompanies = companies.sort(function (a, b) {
                if (a.id > b.id) {
                    return -1;
                }
                if (a.id < b.id) {
                    return 1;
                }
                return 0
            })
            companies = sortedCompanies
            renderCompanies()
        } else if (value == "data2") {
            const sortedCompanies = companies.sort(function (a, b) {
                if (a.id < b.id) {
                    return -1;
                }
                if (a.id > b.id) {
                    return 1;
                }
                return 0
            })
            companies = sortedCompanies
            renderCompanies()}

    })


    // $(".jobTypesContainer input").click((el) => {
    //     console.log(el.currentTarget.defaultValue)
    //     console.log(el.checked)

    //     console.log(companies[0])

    //     // companies.filter((company) => {
    //     //     return 
    //     // })
    // })
})
