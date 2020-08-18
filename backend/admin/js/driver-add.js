let url = "http://54.212.85.133/api/driver";
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

    var thisAlert = $('#dna').parent();
    $(thisAlert).removeClass('alert-validate');

    var thisAlert = $('#dln').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#dad').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#dmn').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#dvn').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#drd').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#drt').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#doi').parent();
    $(thisAlert).removeClass('alert-validate');


    let dna = $('#dna').val().trim();
    let dln = $('#dln').val().trim();
    let dad = $('#dad').val().trim();
    let dmn = $('#dmn').val().trim();
    let dvn = $('#dvn').val().trim();
    let drd = $('#drd').val().trim();
    let drt = $('#drt').val().trim();
    let doi = $('#doi').val().trim();




    if (dna === "") {
        var thisAlert = $('#dna').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (dln === "") {
        var thisAlert = $('#dln').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (dad === "") {
        var thisAlert = $('#dad').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }

    if (dmn === "") {
        var thisAlert = $('#dmn').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }

    if (dvn === "") {
        var thisAlert = $('#dvn').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }

    if (drd === "") {
        var thisAlert = $('#drd').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (drt === "") {
        var thisAlert = $('#drt').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (doi === "") {
        var thisAlert = $('#doi').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }





    $("#btnSubmit").attr("disabled", true);
    $.ajax({
        url: url + "/driver-add",
        method: "POST",

        data: {
            driver_name: dna,
            license_number: dln,
            driver_address: dad,
            mobile_number: dmn,
            driver_vechile_number: dvn,
            other_info: doi,
            driver_reg_date: drd,
            driver_reg_time: drt,



        },
        headers: {
            'x-access-token': localStorage.getItem("token")
        },

        crossDomain: true,
        success: function (res) {
            console.log(res.status);
            if (res.status !== 200) {
                $("#errMsg").css({
                    "color": "red"
                });
                $("#btnSubmit").attr("disabled", false);
                $("#errMsg").text(res.message);
            } else if (res.status === 200) {
                $("#errMsg").css({
                    "color": "green"
                });
                $("#errMsg").text(res.message + " with Id " + res.data);
                $("#btnSubmit").attr("disabled", false);

            }
        },
        error: function (err) {
            $("#errMsg").css({
                "color": "red"
            });
            $("#btnSubmit").attr("disabled", false);
            $("#errMsg").text(err);
        }
    });


}