let url = "http://54.212.85.133/api/battery";

function verifyForm() {
    
    var thisAlert = $('#bid').parent();
    $(thisAlert).removeClass('alert-validate');

    var thisAlert = $('#bdi').parent();
    $(thisAlert).removeClass('alert-validate');
    
    


    let bid = $('#bid').val().trim();
    let bdi = $('#bdi').val().trim();
    



    
    if (bid === "") {
        var thisAlert = $('#bid').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (bdi === "") {
        var thisAlert = $('#bdi').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    





    $("#btnSubmit").attr("disabled", true);
    $.ajax({
        url: url + "/battery-device-add",
        method: "POST",

        data: {
            battery_id: bid,
            device_id: bdi,



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
                $("#errMsg").text(res.message);
                $("#btnSubmit").attr("disabled", false);

            }
        },
        error: function (err) {
            $("#btnSubmit").attr("disabled", false);
            $("#errMsg").text(err);
        }
    });


}