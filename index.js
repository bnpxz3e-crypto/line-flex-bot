// ==========================
// 🎯 LINE Flex Bot by Nutthawut
// ==========================

const express = require("express");
const line = require("@line/bot-sdk");
const https = require("https");

const app = express();

// ===== ตั้งค่า LINE OA =====
const config = {
  channelAccessToken:
    "QpB/ZAmVLg2pT9Py/HFfXnj6nRnCzd9VrGU6EbzcNSkeRaUSDBoGMv8UcD/oKdvr7SJETcsuNXYR2W/Jd8OjKWjOc03LUgNO7fK1n8Zl4JBXEtvWeq2Ef1O8XtLizxkWdIdd8uvYTlX35pNPckiIlwdB04t89/1O/w1cDnyilFU=",
  channelSecret: "8eb75af02e95fc976c5096b66ac2cb80",
};

const client = new line.Client(config);

// ===== Middleware สำหรับ Webhook =====
app.post("/webhook", line.middleware(config), async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === "message" && event.message.type === "text") {
      const msg = event.message.text.trim();

      // ✅ .ลอต
      if (msg === ".ลอต") {
        await sendImageFlex(
          event.replyToken,
          "https://raw.githubusercontent.com/bnpxz3e-crypto/flex/main/losex.png",
          "ปิดรับลาวEXTRA"
        );
      }

      // ✅ ..นชว
      else if (msg === "..นชว") {
        await sendImageFlex(
          event.replyToken,
          "https://raw.githubusercontent.com/bnpxz3e-crypto/flex/main/nikeivip.png",
          "ปิดรับนิเคอิเช้าVIP"
        );
      }

      // ✅ .นช
      else if (msg === ".นช") {
        await sendImageFlex(
          event.replyToken,
          "https://raw.githubusercontent.com/bnpxz3e-crypto/flex/main/nch.png",
          "ปิดรับนิเคอิเช้า"
        );
      }

      // ✅ .นอซ
      else if (msg === ".นอซ") {
        await sendImageFlex(
          event.replyToken,
          "https://raw.githubusercontent.com/bnpxz3e-crypto/flex/main/nos.png",
          "ปิดรับฮานอยอาเซียน"
        );
      }

      // ✅ ssl — ตรวจสอบใบรับรอง SSL
      else if (msg === "ssl") {
        const domain = "line-flex-bot-dmrl.onrender.com";

        https
          .get(`https://${domain}`, (res) => {
            const cert = res.socket.getPeerCertificate();
            if (!cert || !cert.valid_to) {
              client.replyMessage(event.replyToken, {
                type: "text",
                text: "❌ ไม่พบใบรับรอง SSL หรือไม่สามารถอ่านได้",
              });
              return;
            }

            // 🕒 แสดงวันหมดอายุ SSL
            const expireDate = new Date(cert.valid_to);
            const daysLeft = Math.round(
              (expireDate - new Date()) / (1000 * 60 * 60 * 24)
            );

            client.replyMessage(event.replyToken, {
              type: "text",
              text: `📅 ใบรับรอง SSL ของโดเมน:\n🔗 https://${domain}\nหมดอายุวันที่:\n🕒 ${cert.valid_to}\n⏳ เหลืออีก ${daysLeft} วัน`,
            });
          })
          .on("error", (e) => {
            client.replyMessage(event.replyToken, {
              type: "text",
              text: `❌ เกิดข้อผิดพลาด: ${e.message}`,
            });
          });
      }
    }
  }
  res.status(200).end();
});

// ===== ฟังก์ชันส่ง Flex Image =====
async function sendImageFlex(replyToken, imageUrl, altText) {
  const flexMsg = {
    type: "flex",
    altText: altText,
    contents: {
      type: "bubble",
      size: "giga",
      hero: {
        type: "image",
        url: imageUrl,
        animated: true,
        size: "full",
        aspectRatio: "20:10",
        aspectMode: "cover",
      },
    },
  };
  await client.replyMessage(replyToken, flexMsg);
}

// ===== หน้าเว็บหลัก (Optional) =====
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ LINE Flex Bot ทำงานปกติ!</h2>
    <p>พิมพ์คำสั่งใน LINE OA เพื่อทดสอบ:</p>
    <ul style="text-align:left;display:inline-block;">
      <li>.ลอต — ปิดรับลาวEXTRA</li>
      <li>..นชว — ปิดรับนิเคอิเช้าVIP</li>
      <li>.นช — ปิดรับนิเคอิเช้า</li>
      <li>.นอซ — ปิดรับฮานอยอาเซียน</li>
      <li>ssl — ตรวจสอบวันหมดอายุ SSL</li>
    </ul>
  `);
});

// ===== เริ่มรันเซิร์ฟเวอร์ =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server is running on http://localhost:${PORT}`)
);
