const sgMail = require('@sendgrid/mail');
const mustache = require('mustache');
const fs = require('fs');

// Set your SendGrid API key here
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

const XSS_PAYLOAD_FIRE_EMAIL_TEMPLATE = fs.readFileSync(
  './templates/xss_email_template.htm',
  'utf8'
);

async function send_email_notification(xss_payload_fire_data) {
  const notification_html_email_body = mustache.render(
    XSS_PAYLOAD_FIRE_EMAIL_TEMPLATE,
    xss_payload_fire_data
  );

  try {
    const info = await sgMail.send({
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.SMTP_RECEIVER_EMAIL,
      subject: `[XSS Hunter Express] XSS Payload Fired On ${xss_payload_fire_data.url}`,
      text: "Only HTML reports are available, please use an email client which supports this.",
      html: notification_html_email_body,
    });

    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = { send_email_notification };
