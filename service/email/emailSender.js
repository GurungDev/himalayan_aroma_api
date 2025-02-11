import forgotPasswordOtp from "./email-content/forgot-password-otp.js";
import verifyEmailOtp from "./email-content/verify-email-otp.js";
import { Email } from "./email.js";
import baseTemplate from "./template/index.js";

class EmailSender extends Email {
  constructor() {
    super();
    this.verifyUserEmail = this.verifyUserEmail.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
   }

  async verifyUserEmail(email, otp) {
    const subject = "Verify your email";
    const html = baseTemplate(verifyEmailOtp(otp));
    await this._send([email], subject, html);
  }

  async forgotPassword(email, otp) {
    const subject = "Forgot Password ";
    const html = baseTemplate(forgotPasswordOtp(otp));
    await this._send([email], subject, html);
  }

 

 
}

const emailSender = new EmailSender();
export default emailSender;
