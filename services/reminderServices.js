require("dotenv").config();
const cron = require("node-cron");
const Mailjet = require("node-mailjet");
const JobApplication = require("../models/jobApplicationModel");
const User = require("../models/userModel");
const { Op } = require("sequelize");

let mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

async function sendReminderEmail(user, application) {
  console.log("This is the user email : " + user.email);
  try {
    const response = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.SENDER_EMAIL,
            Name: "Job Application Tracker",
          },
          To: [
            {
              Email: user.email,
              Name: user.username,
            },
          ],
          Subject: `Follow-up Reminder: ${application.companyName} - ${application.jobTitle}`,
          TextPart: `Don't forget to follow up on your ${application.status} application for ${application.jobTitle} at ${application.companyName}.`,
          HTMLPart: `<h3>Follow-up Reminder</h3>
                     <p>Don't forget to follow up on your ${
                       application.status
                     } application for <strong>${
            application.jobTitle
          }</strong> at <strong>${application.companyName}</strong>.</p>
                     <p>Current status: ${application.status}</p>
                     <p>Application date: ${new Date(
                       application.applicationDate
                     ).toLocaleDateString()}</p>`,
        },
      ],
    });
    console.log(
      `Reminder email sent for application ID: ${application.id} : ${application.companyName}`,
      response.body
    );
  } catch (error) {
    console.error(
      "Error sending reminder email:",
      error.statusCode,
      error.message
    );
    if (error.response) {
      console.error("Mailjet API response:", error.response.body);
    }
  }
}

async function checkAndSendReminders() {
  try {
    console.log(
      "Checking and sending reminders started at:",
      new Date().toLocaleString()
    );
    const currentDate = new Date();
    const threeDaysAgo = new Date(currentDate);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    console.log("Current date:", currentDate.toISOString());
    console.log("Three days ago:", threeDaysAgo.toISOString());

    const applicationsToRemind = await JobApplication.findAll({
      where: {
        status: {
          [Op.in]: ["applied", "interviewed"],
        },
        updatedAt: {
          [Op.lte]: threeDaysAgo,
        },
      }
    });

    console.log(
      `Found ${applicationsToRemind.length} applications to remind about`
    );

    for (const application of applicationsToRemind) {
      const userId = application.userId;
      console.log("user id: >>>> ",userId);

      const user = await User.findByPk(userId);
      if (!user) {
        console.log("User not found for application ID: ", application.id);
      }
      console.log("user email: >>>> ", user.email);
      if (user && user.email) {
        await sendReminderEmail(user, application);
        await application.update({ updatedAt: new Date() });
      } else {
        console.error(
          `User or email not found for application ID: ${application.id}`
        );
      }
    }

    console.log("Reminder check completed at:", new Date().toLocaleString());
  } catch (error) {
    console.error("Error checking and sending reminders:", error);
  }
}

// Schedule the reminder task to run every day at midnight
cron.schedule("40 21 * * *", checkAndSendReminders);

module.exports = {
  checkAndSendReminders,
};
