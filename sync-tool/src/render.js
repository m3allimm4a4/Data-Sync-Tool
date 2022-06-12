const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");
const env = require("./environment");

let prisma = new PrismaClient();

const username = document.querySelector(".username");
const password = document.querySelector(".password");
const api = document.querySelector(".api");
const email = document.querySelector(".email");
const syncButton = document.querySelector(".btn");
const result = document.querySelector(".result");

api.value = env.api_url;

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: env.email_host,
    port: env.email_port,
    auth: {
      user: env.email_username,
      pass: env.email_password,
    },
  });

  const emailOptions = {
    from: "Sync Tool",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(emailOptions);
};

const syncToDb = async (model, apiPath, include = null) => {
  await fetch(`${api.value}/${apiPath}`, {
    method: "DELETE",
  });

  let count = 0;
  while (true) {
    const query =
      include == null
        ? { take: count + 100, skip: count }
        : { take: count + 100, skip: count, include: include };

    const data = await prisma[model].findMany(query);
    if (data.length === 0) break;

    const response = await fetch(`${api.value}/${apiPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: data }),
    });
    if (response.status <= 200 || response.status >= 300) {
      throw new Error(`Error syncing data: ${response.message}`);
    }
    count += 100;
  }
};

const syncHandler = async (event) => {
  event.preventDefault();
  if (email.value === "") {
    alert("Please enter an email address");
    return;
  }

  syncButton.disabled = true;

  if (username.value !== "" && password.value !== "") {
    prisma.$disconnect();
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: `mysql://${username}:${password}@localhost:3306/not-online`,
        },
      },
    });
  }
  prisma.$connect();

  result.innerHTML = "Syncing data...";
  result.classList.remove("hidden");

  try {
    await Promise.all([
      syncToDb("banannatoppings", "toppings"),
      syncToDb("orders", "orders", { orderitems: true }),
    ]);

    result.innerHTML = "Successfully synced data";

    await sendEmail({
      email: email.value,
      subject: "Data Sync",
      message: "Successfully synced data to online Database",
    });
  } catch (error) {
    result.innerHTML = error.message;
  } finally {
    syncButton.disabled = false;
  }
};

syncButton.addEventListener("click", syncHandler);
