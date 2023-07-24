import sgMail from "@sendgrid/mail";
import { config } from "../src/config";
import { SendEmailOptions } from "../src/types";
import logger from "./logger";

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
sgMail.setApiKey(config.SENDGRID_API_KEY);

export async function sendEmail(message: SendEmailOptions) {
  try {
    const res = await sgMail.send({
      ...message,
      from: message.from || config.SENDGRID_FROM_EMAIL,
    });
    logger.info(res);
  } catch (error) {
    logger.fatal(error);
    throw new Error("Failed to send email");
  }
}
