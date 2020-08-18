let url = "http://54.212.85.133/api/swap";

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
        url: url + "/check",
        method: "POST",

        data: {
            driver_id: bid,
            wall_id:`Wall-${bdi}`,



        },

        crossDomain: true,
        success: function (res) {
            console.log(res.status);
            if (res.status === 500) {
                $("#btnSubmit").attr("disabled", false);
                $("#errMsg").text(res.message);
            } else if (res.status === 404) {
                $("#btnSubmit").attr("disabled", false);
                $("#errMsg").text(res.message);
            } 
            else if (res.status === 200) {
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
// function verifyForm1() {

//     var thisAlert = $('#bid').parent();
//     $(thisAlert).removeClass('alert-validate');

//     var thisAlert = $('#bdi').parent();
//     $(thisAlert).removeClass('alert-validate');




//     let bid = $('#bid').val().trim();
//     let bdi = $('#bdi').val().trim();





//     if (bid === "") {
//         var thisAlert = $('#bid').parent();
//         $(thisAlert).addClass('alert-validate');
//         return;
//     }
//     if (bdi === "") {
//         var thisAlert = $('#bdi').parent();
//         $(thisAlert).addClass('alert-validate');
//         return;
//     }






//     $("#btnSubmit1").attr("disabled", true);
//     $.ajax({
//         url: url + "/collect",
//         method: "POST",

//         data: {
//             driver_id: bid,
//             wall_id: bdi,



//         },

//         crossDomain: true,
//         success: function (res) {
//             console.log(res.status);
//             if (res.status === 500) {
//                 $("#btnSubmit1").attr("disabled", false);
//                 $("#errMsg").text(res.message);
//             } else if (res.status === 404) {
//                 $("#btnSubmit1").attr("disabled", false);
//                 $("#errMsg").text(res.message);
//             } else if (res.status === 200) {
//                 $("#errMsg").css({
//                     "color": "green"
//                 });
//                 $("#errMsg").text(res.message);
//                 $("#btnSubmit1").attr("disabled", false);
                

//             }
            
//         },
//         error: function (err) {
//             $("#btnSubmit1").attr("disabled", false);
//             $("#errMsg").text(err);
//         }
//     });


// }
// function verifyForm2() {

//     var thisAlert = $('#bid').parent();
//     $(thisAlert).removeClass('alert-validate');

//     var thisAlert = $('#bdi').parent();
//     $(thisAlert).removeClass('alert-validate');




//     let bid = $('#bid').val().trim();
//     let bdi = $('#bdi').val().trim();





//     if (bid === "") {
//         var thisAlert = $('#bid').parent();
//         $(thisAlert).addClass('alert-validate');
//         return;
//     }
//     if (bdi === "") {
//         var thisAlert = $('#bdi').parent();
//         $(thisAlert).addClass('alert-validate');
//         return;
//     }






//     $("#btnSubmit2").attr("disabled", true);
//     $.ajax({
//         url: url + "/submit",
//         method: "POST",

//         data: {
//             driver_id: bid,
//             wall_id: bdi,



//         },

//         crossDomain: true,
//         success: function (res) {
//             console.log(res.status);
//             if (res.status === 500) {
//                 $("#btnSubmit2").attr("disabled", false);
//                 $("#errMsg").text(res.message);
//             } else if (res.status === 404) {
//                 $("#btnSubmit2").attr("disabled", false);
//                 $("#errMsg").text(res.message);
//             } else if (res.status === 200) {
//                 $("#errMsg").css({
//                     "color": "green"
//                 });
//                 $("#errMsg").text(res.message);
//                 $("#btnSubmit2").attr("disabled", false);
                

//             }
            
//         },
//         error: function (err) {
//             $("#btnSubmit2").attr("disabled", false);
//             $("#errMsg").text(err);
//         }
//     });


// }