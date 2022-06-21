$(document).ready(() => {

    $(".saveChangesButton").click(nextStage);
    $(".backButton").click(previousStage);
    $("#phone").mask("(00) 0000-0000");
    $("#birthDate").mask("00/00/0000");
    $("#cpf").mask("000.000.000-00", { reverse: true });
    $("#cep").mask("00000-000");

    $.ajax({
        url: '/user/me',
        type: 'GET',
        contentType: 'application/json',
        success: function (user) {
            $('#name').html(user.firstName + ' ' + user.lastName)
            $('#birthDate').html(user.birthDate)
            $('#location').html(user.country)
            $('#history').html(user.aboutYou)

            let hardSkills = ''
            let softSkills = ''
            for (skill of user.skills) {
                if (skill.type == 0) {
                    hardSkills += `<span class="badge badge-yellow">${skill.name}</span>`
                } else {
                    softSkills += `<span class="badge badge-blue">${skill.name}</span>`
                }
            }

            $('#hardSkills').html(hardSkills)
            $('#softSkills').html(softSkills)
            $('#email').html(user.email)
            $('#phone').html(user.phone)
            $('#country').html(user.country)
            $('#civilState').html(user.civilState)
            $('#birthDate').html(user.birthDate)
            $('#cpf').html(user.cpf)
            $('#rg').html(user.rg)

            $('#street').html(user.address.street)
            $('#cep').html(user.address.cep)
            $('#neighborhood').html(user.address.neighborhood)
            $('#city').html(user.address.city)
            $('#state').html(user.address.state)
            $('#complement').html(user.address.complement)

            // $('#saveChangesButton').attr('href', `/views/`)
        },
        error: function (err) {
            console.log(err)
        },
    });

    $("#saveChangesButton").click(() => {
        const form = {};
    
        $("#accountForm :input").each(function () {
          var input = $(this)[0]; // This is the jquery object of the input, do what you will
          form[input.name] = input.value;
        });
    
        $("#infoForm :input").each(function () {
          var input = $(this)[0]; // This is the jquery object of the input, do what you will
          form[input.name] = input.value;
        });
    
        $("#addressForm :input").each(function () {
          var input = $(this)[0]; // This is the jquery object of the input, do what you will
          form[input.name] = input.value;
        });
    
        form.aboutYou = $(".aboutYou").val();
    
        form.skills = $("#hardSkills").val().concat($("#softSkills").val());
    
        $.ajax({
          url: "/user/userProfileEdit",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(form),
          success: function (res) {
            window.location.replace("/views/userProfile/userProfile.html");
          },
          error: function (err) {
            console.log(err);
          },
        });

        let inputs = $("#aboutYou input, #addressForm input, #accountForm input, #hardSkills, #softSkills");
        if (validate(inputs) == true) {
            return;
        }
    });

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
})
