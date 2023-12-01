import config from "config/config";
import EmailJS from "@emailjs/browser";

const sendPasswordResetEmail = async (recipientName, recipientEmail, uuid, msg = `Hello, you need to set a password for your account. Please follow the link below to set up your password.`) => {
  const emailParams = {
    from_name: "B2B Support",
    to_name: recipientName,
    to_email: recipientEmail,
    reset_link: `${window.location.origin}/set-password?id=${uuid}`,
    msg
  };

  return EmailJS.send(
    config.env.EMAIL_SERVICE,
    config.env.EMAIL_TEMPLATE,
    emailParams,
    config.env.EMAIL_PUBLIC_ID
  );
};

export default sendPasswordResetEmail;
