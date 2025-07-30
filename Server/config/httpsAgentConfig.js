const fs = require("fs");
const path = require("path");
const https = require("https");

const getHttpsAgent = (account) => {
  let certPath;
  let passphrase;

  switch (account) {
    case "equipe_6110":
      certPath = process.env.GN_CERT1;
      passphrase = process.env.GN_CERT_PASSPHRASE || "";
      break;
    case "equipe_2535":
      certPath = process.env.GN_CERT2;
      passphrase = process.env.GN_CERT_PASSPHRASE || "";
      break;
    case "equipe_9272":
      certPath = process.env.GN_CERT3;
      passphrase = process.env.GN_CERT_PASSPHRASE || "";
      break;
    default:
      certPath = process.env.GN_CERT;
      passphrase = process.env.GN_CERT_PASSPHRASE || "";
      break;
  }

  const cert = fs.readFileSync(path.resolve(__dirname, `../../certs/${certPath}`));

  return new https.Agent({
    pfx: cert,
    passphrase,
  });
};

module.exports = getHttpsAgent;
