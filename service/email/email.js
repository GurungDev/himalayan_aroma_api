import sgMail from "@sendgrid/mail";
import EnvConfig from "../../config/EnvConfig.js";

export class Email {
  constructor() {
    this.sendGridProvider = sgMail.setApiKey(EnvConfig.sendgridApiKey);
    this.genericSender = EnvConfig.genericEmailSender;
    this._send = this._send.bind(this);
  }

  /**
   * @param {string[]} to
   * @param {string} subject
   * @param {string} html
   */
  async _send(to, subject, html, sender = this.genericSender) {
    try {
      await this.sendGridProvider.send({
        to,
        from: sender,
        subject,
        html,
      });
    } catch (e) {
      console.log("error in sending email", e);
    }
  }
}
