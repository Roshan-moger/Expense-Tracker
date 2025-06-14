const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const Imap = require("imap");
const { simpleParser } = require("mailparser");
const Email = require("./models/Email");
const connectDB = require("./config/db");
const moment = require("moment-timezone"); // install this if not already: npm install moment-timezone
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes placeholder
app.use('/api/auth', require('./routes/authRoutes'));

// Email Fetching and Management
app.use("/api/emails", require("./routes/emailRouters"));

// Manual Transactions

app.use('/api/manualtransactions', require('./routes/manualTransactionRoutes'));


connectDB().then(() => {
 setInterval(startEmailReader, 20000000);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});


// ---------------------------
// Email Reader Function
// ---------------------------
function startEmailReader() {
  console.log("📨 Email reader started...");

  const imap = new Imap({
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    host: process.env.IMAP_HOST,
    port: parseInt(process.env.IMAP_PORT),
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  });

  function openInbox(cb) {
    imap.openBox("INBOX", false, cb);
  }

  imap.once("ready", function () {
    console.log("📥 IMAP ready");

    openInbox(function (err, box) {
      if (err) {
        console.error("❌ Open INBOX error:", err);
        return;
      }


      const fetch = imap.seq.fetch("1:*", {
        bodies: "",
        struct: true,
        markSeen: false,
      });

      fetch.on("message", function (msg, seqno) {

        msg.on("body", function (stream) {
          simpleParser(stream, async (err, parsed) => {
            if (err) {
              console.error("❌ Email parse error:", err);
              return;
            }

          

            const istDate = moment(parsed.date).tz("Asia/Kolkata").toDate();

            if (parsed.from?.text?.includes("alerts@axisbank.com")) {
              try {
                const exists = await Email.findOne({ date: parsed.date });

                if (!exists) {
                  const email = new Email({
                    subject: parsed.subject,
                    from: parsed.from.text,
                    date: istDate,
                  });

                  await email.save();
                  console.log(`✅ Saved: ${parsed.subject}`);
                } else {
                  console.log(`ℹ️ Duplicate skipped: ${parsed.subject}`);
                }
              } catch (e) {
                console.error("❌ Save error:", e);
              }
            }
          });
        });
      });

      fetch.once("error", (err) => {
        console.error("❌ Fetch error:", err);
      });

      fetch.once("end", function () {
        console.log("📬 Finished fetching emails.");
        imap.end();
      });
    });
  });

  imap.once("error", function (err) {
    console.error("❌ IMAP error:", err);
  });

  imap.once("end", function () {
    console.log("📴 IMAP connection closed.");
  });

  imap.connect();
}



