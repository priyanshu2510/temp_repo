const nodemailer = require("nodemailer");

const sendEmail = (header,subject, htmlMessage, email) => {
    let transport = nodemailer.createTransport({
        host: "electron.vhostplatform.com",
        port: 465,
        auth: {
            user: '*',
            pass: '*'
        },
        secure: true,
        pool: true,
        tls:{
            rejectUnauthorized:false
        }
    });

    const message = {
        from: `${header}*`,
        to: email,
        subject: subject, // Subject line
        html: htmlMessage
    };
    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("Email Sent");
        }
    });
}

module.exports = sendEmail;