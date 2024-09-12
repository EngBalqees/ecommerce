import nodemailer from "nodemailer";

export async function sendEmail(to,subject,html){
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
            user:process.env.EMAILSENDER,
            pass:process.env.PASSWORD
        },

    });

    const info =  await transporter.sendMail({
        from: `Balqees Sukar <${process.env.EMAILSENDER}>`,
        to,
        subject,
        html
    });
  
}