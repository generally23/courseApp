const sg = require('@sendgrid/mail');

class Mailer {
  constructor(from, to, subject, text) {
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.text = text;

    sg.setApiKey(
      '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'
    );
  }
  async send() {
    const { from, to, subject, text, html } = this;
    await sg.send({ from, to, subject, text });
  }
}

module.exports = Mailer;
