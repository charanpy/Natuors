const nodemailer = require("nodemailer");

const sendEmail = async options => {
            console.log(options.email)
            const transporter = nodemailer.createTransport({
                        host: process.env.EMAIL_HOST,
                        port: process.env.EMAIL_PORT,
                        auth: {
                                    user: process.env.EMAIL_USERNAME,
                                    pass: process.env.EMAIL_PASSWORD
                        }
            });
            //  var transporter = nodemailer.createTransport({
            //             host: "smtp.mailtrap.io",
            //             port: 2525,
            //             auth: {
            //                         user: "05b76151c8fa98",
            //                         pass: "c2c0bad5510c32"
            //             }
            // });

            const mailOptions = {
                        from: "Developer",
                        to: options.email,
                        subject: options.subject,
                        text: options.message
            };

            await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;