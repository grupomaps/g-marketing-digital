const firebaseAdmin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

if (!firebaseAdmin.apps.length) {
  const serviceAccount = {
    type: process.env.TYPE_2,
    project_id: process.env.PROJECT_ID_2,
    private_key_id: process.env.PRIVATE_KEY_ID_2,
    private_key: process.env.PRIVATE_KEY_2,
    client_email: process.env.CLIENT_EMAIL_2,
    client_id: process.env.CLIENT_ID_2,
    auth_uri: process.env.AUTH_URI_2,
    token_uri: process.env.SERVICE_TOKEN_URI_2,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL_2,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL_2,
    universe_domain: process.env.UNIVERSE_DOMAIN_2
  };
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
  });
} else {
  firebaseAdmin.app();
}

module.exports = firebaseAdmin;
