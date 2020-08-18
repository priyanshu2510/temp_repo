const nodemailer = require("nodemailer");

const sendmsgEmail = (subject, htmlMessage, email) => {
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '*',
            pass: '*'
        },
        secure: true,
        pool: true,
        tls: {
            rejectUnauthorized: false
        }
    });

    const message = {
        from: "*",
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

module.exports = sendmsgEmail;