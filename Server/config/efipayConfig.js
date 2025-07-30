const EfiPay = require("sdk-node-apis-efi");

const getEfiPayInstance = (account) => {
  let efipayOptions;

  switch (account) {
    case "equipe_6110":
      efipayOptions = {
        client_id: process.env.EFI_ACCOUNT1_CLIENT_ID,
        client_secret: process.env.EFI_ACCOUNT1_CLIENT_SECRET,
        sandbox: process.env.EFI_SANDBOX === "true",
      };
      break;
    case "equipe_2535":
      efipayOptions = {
        client_id: process.env.EFI_ACCOUNT2_CLIENT_ID,
        client_secret: process.env.EFI_ACCOUNT2_CLIENT_SECRET,
        sandbox: process.env.EFI_SANDBOX === "true",
      };
      break;
    case "equipe_9272":
      efipayOptions = {
        client_id: process.env.EFI_ACCOUNT3_CLIENT_ID,
        client_secret: process.env.EFI_ACCOUNT3_CLIENT_SECRET,
        sandbox: process.env.EFI_SANDBOX === "true",
      };
      break;
    case "equipe_recebe":
      efipayOptions = {
        client_id: process.env.EFI_ACCOUNT_RECEBE_CLIENT_ID,
        client_secret: process.env.EFI_ACCOUNT_RECEBE_CLIENT_SECRET,
        sandbox: process.env.EFI_SANDBOX === "true",
      };
      break;
    default:
      efipayOptions = {
        client_id: process.env.EFI_DEFAULT_CLIENT_ID,
        client_secret: process.env.EFI_DEFAULT_CLIENT_SECRET,
        sandbox: process.env.EFI_SANDBOX === "true",
      };
      break;
  }

  // Log para depuração
  console.log(`[Efipay] Configuração usada para conta '${account}':`, efipayOptions);

  if (!efipayOptions.client_id || !efipayOptions.client_secret) {
    console.error(`[Efipay] Erro: credenciais incompletas para a conta '${account}'`);
    return null; // ou lançar erro, se preferir
  }

  try {
    return new EfiPay(efipayOptions);
  } catch (error) {
    console.error(`[Efipay] Erro ao criar instância para a conta '${account}':`, error);
    return null;
  }
};

module.exports = getEfiPayInstance;
