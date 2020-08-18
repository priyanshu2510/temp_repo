let url = "http://54.212.85.133/api/battery";
let url1="http://54.212.85.133/api/auth";
$.ajax({
    url: url1 + "/getUserState",
    method: "GET",
    headers: {
        'x-access-token': localStorage.getItem("token")
    },
    crossDomain: true,
    success: function (res) {
        console.log(res);
        if (res.status !== 200 ) {
             window.location = "http://54.212.189.135/signin";
            
        }
        
        
    },
    error: function (err) {
    }
});
function verifyForm() {
    
    var thisAlert = $('#bcc').parent();
    $(thisAlert).removeClass('alert-validate');

    var thisAlert = $('#bcl').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#bms').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#bbc').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#dod').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#bda').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#bti').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#boi').parent();
    $(thisAlert).removeClass('alert-validate');


    let bcc = $('#bcc').val().trim();
    let bcl = $('#bcl').val().trim();
    let bms = $('#bms').val().trim();
    let bbc = $('#bbc').val().trim();
    let dod = $('#dod').val().trim();
    let bda = $('#bda').val().trim();
    let bti = $('#bti').val().trim();
    let boi = $('#boi').val().trim();



    
    if (bcc === "") {
        var thisAlert = $('#bcc').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (bcl === "") {
        var thisAlert = $('#bcl').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (bms === "") {
        var thisAlert = $('#bms').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (bbc === "") {
        var thisAlert = $('#bbc').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (dod === "") {
        var thisAlert = $('#dod').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }

    if (bda === "") {
        var thisAlert = $('#bda').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }

    if (bti === "") {
        var thisAlert = $('#bti').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }

    if (boi === "") {
        var thisAlert = $('#boi').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }





    $("#btnSubmit").attr("disabled", true);
    $.ajax({
        url: url + "/battery-add",
        method: "POST",

        data: {
            battery_company: bcc,
            current_location: bcl,
            other_info: boi,
            maxswaps: bms,
            battery_reg_date: bda,
            battery_reg_time: bti,
            battery_capacity: bbc,
            dod:dod



        },
        headers: {
            'x-access-token': localStorage.getItem("token")
        },

        crossDomain: true,
        success: function (res) {
            console.log(res.status);
            if (res.status !== 200) {
                $("#btnSubmit").attr("disabled", false);
                $("#errMsg").text(res.message);
            } else if (res.status === 200) {
                $("#errMsg").css({
                    "color": "green"
                });
                $("#errMsg").text(res.message+" with Id "+res.data);
                $("#btnSubmit").attr("disabled", false);

            }
        },
        error: function (err) {
            $("#btnSubmit").attr("disabled", false);
            $("#errMsg").text(err);
        }
    });


}