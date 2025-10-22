// src/utils/emailService.ts
import nodemailer from "nodemailer";

export const sendApprovalEmail = async (to: string, name: string, token: string) => {
  const registrationLink = `${process.env.FRONTEND_URL}/register-phase2?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail", // or "outlook"
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"League Registration" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Complete Your Registration - Phase 2",
    html: `
      <h2>Hello ${name},</h2>
      <p>Your account has been approved! 🎉</p>
      <p>Please complete your Phase 2 registration by clicking the link below:</p>
      <a href="${registrationLink}" style="color: #2563eb; font-weight: bold;">Complete Registration</a>
      <p>This link is valid for 24 hours.</p>
      <p>Best regards,<br>League Admin Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
