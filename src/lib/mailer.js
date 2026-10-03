import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email, otpCode) => {
  const mailOptions = {
    from: `"Alouh Futsal" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Kode Verifikasi Akun Anda',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #10B981; text-align: center;">Verifikasi Akun</h2>
        <p>Terima kasih telah mendaftar di Alouh Futsal. Untuk mengaktifkan akun Anda, masukkan 6-digit kode OTP berikut pada halaman verifikasi:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f1f5f9; border: 2px dashed #10B981; color: #0f172a; padding: 16px 24px; border-radius: 8px; font-weight: bold; font-size: 32px; letter-spacing: 4px; display: inline-block;">
            ${otpCode}
          </div>
        </div>
        <p style="text-align: center;">Kode ini akan kadaluarsa, mohon segera dimasukkan.</p>
        <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;" />
        <p style="color: #888; font-size: 12px; text-align: center;">Jika Anda tidak merasa mendaftar di aplikasi ini, Anda dapat mengabaikan email ini.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    console.log('Kode OTP untuk', email, 'adalah:', otpCode); // For debugging
    return true;
  } catch (error) {
    console.error('Error sending email: ', error);
    console.log('--- DEVELOPMENT MODE ---');
    console.log('KODE OTP ANDA (KARENA EMAIL GAGAL DIKIRIM):', otpCode);
    return false;
  }
};
