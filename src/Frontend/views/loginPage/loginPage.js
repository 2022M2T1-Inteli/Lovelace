$(document).ready(() => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const type = urlParams.get('type')

    if (type == 'user') {
        $(".loginBtn").attr('href', '/views/companyMatch/companyMatch.html')
        $('.noAccountLink').attr('href', '/views/userSignUp/userSignUp.html')
    } else if (type == 'company') {
        $(".loginBtn").attr('href', '/views/jobs/jobs.html')
        $('.noAccountLink').attr('href', '/views/companyRegistration/companyRegistration.html')
    }
})
