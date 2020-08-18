const axios = require('axios');

const sendPM = (message, phoneNo) => {
    let otpUrl = `*`;

    axios.get(otpUrl)
        .then(function (response) {
            console.log("SMS sent");
        })
        .catch(function (error) {
            console.log(error);
        })
};

module.exports = sendPM;