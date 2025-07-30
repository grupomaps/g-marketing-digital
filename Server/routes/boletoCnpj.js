const express = require("express");
const getEfiPayInstance = require("../config/efipayConfig");

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    email,
    juridical_person,
    phone_number,
    items,
    shippingValue,
    account,
    dataVencimento,
    address
  } = req.body;

  if (!email || !items || !juridical_person || !dataVencimento) {
    return res.status(400).send("Missing required fields.");
  }

  // Criação da data de vencimento com validação
  let vencimentoDate;
  try {
    vencimentoDate = new Date(dataVencimento);
    if (isNaN(vencimentoDate)) {
      throw new Error("Invalid date");
    }
  } catch (error) {
    return res.status(400).send("Invalid date format for dataVencimento.");
  }

  const efipay = getEfiPayInstance(account);

  const body = {
    payment: {
      banking_billet: {
        expire_at: vencimentoDate.toISOString().split("T")[0], 
        customer: {
          email,
          phone_number,
          juridical_person,
          address 
        },
      },
    },
    items,
    // shippings: [
    //   {
    //     name: "Default Shipping Cost",
    //     value: shippingValue || 0,
    //   },
    // ],
  };

  try {
    const response = await efipay.createOneStepCharge([], body);
    res.status(200).send(response);
  } catch (error) {
    console.error(
      "Erro ao gerar boleto:",
      error.response?.data || error.message,
      error.config
    );
    res.status(500).send("Error generating boleto.");
  }
});

module.exports = router;
