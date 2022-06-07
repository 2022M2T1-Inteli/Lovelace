$(document).ready(() => {
    // Obter parâmetro id da url
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const jobId = urlParams.get('jobId')

    $.ajax({
        url: `/job/${jobId}/getUsers`,
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            console.log(res)
        },
        error: function (err) {
            console.log(err)
        },
    })
})
