$(document).ready(() => {
    $('.skillSelect').select2({
        allowClear: true,
        theme: 'classic',
    })
})

let stage = 0

const assetsInitialPath = '../../../assets/companyRegistration/'

const iconContainers = [$('.iconImageBox0'), $('.iconImageBox1'), $('.iconImageBox2')]
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
const containers = [$('.stage0'), $('.stage1'), $('.stage2')]

containers[0].css('opacity', 100)
containers[1].css('display', 'none')
containers[2].css('display', 'none')

const nextStage = () => {
    if (stage < 2) {
        containers[stage].animate(
            {
                opacity: 0,
            },
            600,
            function () {
                containers[stage].css('display', 'none')
                iconContainers[stage].removeClass('active')
                icons[stage].element.attr('src', icons[stage].whiteIcon)

                stage++

                containers[stage].css('display', 'flex')
                iconContainers[stage].addClass('active')
                icons[stage].element.attr('src', icons[stage].yellowIcon)

                containers[stage].animate(
                    {
                        opacity: 1,
                    },
                    600,
                    function () {}
                )
            }
        )
    }
}

const previousStage = () => {
    if (stage > 0) {
        containers[stage].animate(
            {
                opacity: 0,
            },
            600,
            function () {
                containers[stage].css('display', 'none')
                iconContainers[stage].removeClass('active')
                icons[stage].element.attr('src', icons[stage].whiteIcon)

                stage--

                iconContainers[stage].addClass('active')
                containers[stage].css('display', 'flex')
                icons[stage].element.attr('src', icons[stage].yellowIcon)

                containers[stage].animate(
                    {
                        opacity: 1,
                    },
                    600,
                    function () {}
                )
            }
        )
    }
}

$('.nextButton').click(nextStage)
$('.backButton').click(previousStage)
