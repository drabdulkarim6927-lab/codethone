import nodemailer from "nodemailer";

async function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  baseUrl: string
) {
  const verifyUrl = `${baseUrl}/verify?token=${token}`;

  if (!process.env.SMTP_HOST) {
    // Development mode: log to console
    console.log("\n=== رسالة تفعيل البريد الإلكتروني ===");
    console.log(`إلى: ${email}`);
    console.log(`رابط التفعيل: ${verifyUrl}`);
    console.log("=====================================\n");
    return;
  }

  const transporter = await getTransporter();

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"كود ثون" <noreply@codethon.sa>',
    to: email,
    subject: "تفعيل حسابك في كود ثون",
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; background: #f3f4f6; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1e3a8a, #1d4ed8); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .header p { color: #bfdbfe; margin: 8px 0 0; }
          .body { padding: 40px 30px; }
          .body p { color: #374151; line-height: 1.8; font-size: 16px; }
          .btn { display: inline-block; background: #1d4ed8; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: bold; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px 30px; text-align: center; color: #9ca3af; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>كود ثون 2025</h1>
            <p>تفعيل الحساب</p>
          </div>
          <div class="body">
            <p>مرحباً بك في <strong>كود ثون</strong>!</p>
            <p>شكراً لتسجيلك في المنصة. للتحقق من بريدك الإلكتروني وتفعيل حسابك، يُرجى الضغط على الزر أدناه:</p>
            <div style="text-align: center;">
              <a href="${verifyUrl}" class="btn">تفعيل الحساب</a>
            </div>
            <p>أو انسخ الرابط التالي في متصفحك:</p>
            <p style="word-break: break-all; background: #f3f4f6; padding: 12px; border-radius: 6px; font-size: 13px; direction: ltr; text-align: left;">${verifyUrl}</p>
            <p style="color: #ef4444; font-size: 14px;">هذا الرابط صالح لمدة 24 ساعة فقط.</p>
          </div>
          <div class="footer">
            <p>إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة.</p>
            <p>© 2025 كود ثون. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  baseUrl: string
) {
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  if (!process.env.SMTP_HOST) {
    console.log("\n=== رسالة إعادة تعيين كلمة المرور ===");
    console.log(`إلى: ${email}`);
    console.log(`رابط إعادة التعيين: ${resetUrl}`);
    console.log("======================================\n");
    return;
  }

  const transporter = await getTransporter();

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"كود ثون" <noreply@codethon.sa>',
    to: email,
    subject: "إعادة تعيين كلمة المرور - كود ثون",
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; background: #f3f4f6; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1e3a8a, #1d4ed8); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .header p { color: #bfdbfe; margin: 8px 0 0; }
          .body { padding: 40px 30px; }
          .body p { color: #374151; line-height: 1.8; font-size: 16px; }
          .btn { display: inline-block; background: #1d4ed8; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: bold; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px 30px; text-align: center; color: #9ca3af; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>كود ثون 2025</h1>
            <p>إعادة تعيين كلمة المرور</p>
          </div>
          <div class="body">
            <p>مرحباً،</p>
            <p>تلقّينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في <strong>كود ثون</strong>.</p>
            <p>اضغط على الزر أدناه لإنشاء كلمة مرور جديدة:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="btn">إعادة تعيين كلمة المرور</a>
            </div>
            <p>أو انسخ الرابط التالي في متصفحك:</p>
            <p style="word-break: break-all; background: #f3f4f6; padding: 12px; border-radius: 6px; font-size: 13px; direction: ltr; text-align: left;">${resetUrl}</p>
            <p style="color: #ef4444; font-size: 14px;">⚠️ هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
            <p style="color: #6b7280; font-size: 14px;">إذا لم تطلب إعادة تعيين كلمة المرور، تجاهل هذه الرسالة وستبقى كلمة مرورك كما هي.</p>
          </div>
          <div class="footer">
            <p>© 2025 كود ثون. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
