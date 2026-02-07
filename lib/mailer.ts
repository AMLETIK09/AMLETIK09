import nodemailer from 'nodemailer';

export async function sendMail(email: string, code: string) {
  // Если переменные окружения не заданы, выводим в консоль (для разработки)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('___________');
    console.log(` 📧 EMAIL: ${email}`);
    console.log(` 🔐 CODE: ${code}`);
    console.log('___________');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true для порта 465, false для других портов
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // для разработки, в продакшене лучше true
      },
    });

    await transporter.sendMail({
      from: `"Marketplace" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Код подтверждения',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Код подтверждения</h2>
          <p>Ваш код подтверждения:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #666; font-size: 14px;">Код действителен в течение 10 минут.</p>
          <p style="color: #666; font-size: 14px;">Если вы не запрашивали этот код, проигнорируйте это письмо.</p>
        </div>
      `,
    });

    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error('Email send error:', error);
    // В случае ошибки выводим в консоль для разработки
    console.log('___________');
    console.log(` 📧 EMAIL: ${email}`);
    console.log(` 🔐 CODE: ${code}`);
    console.log('___________');
    throw error;
  }
}
