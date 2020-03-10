const sg = require('@sendgrid/mail');

class Mailer {
  constructor(from, to, subject, text) {
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.text = text;

    sg.setApiKey(process.env.SENDGRID_API_KEY);
  }
  async send() {
    const { from, to, subject, text, html } = this;
    await sg.send({ from, to, subject, text });
  }
}

module.exports = Mailer;
