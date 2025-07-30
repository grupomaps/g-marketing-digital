const express = require("express");
const axios = require("axios");

const router = express.Router();

const API_KEYS = {
  equipe_6110: "1749062899810-4d3d47b6958bbe6987b9f1f57d8144bd",
  equipe_2535: "1749054839108-6374ad027a51b301e3aa920fe57ac497",
  equipe_9272: "1749054775632-0c626b56257e2a6f22c8aad15406fc81",
};

router.post("/enviar-texto", async (req, res) => {
  try {
    const { phone, message, equipeMsg } = req.body;

    if (!phone || !message || !equipeMsg) {
      return res.status(400).json({
        success: false,
        message: "Campos phone, message e equipeMsg são obrigatórios",
      });
    }

    const API_KEY = API_KEYS[equipeMsg];

    if (!API_KEY) {
      return res.status(400).json({
        success: false,
        message: `Equipe ${equipeMsg} não possui chave de API configurada.`,
      });
    }

    const url = `https://api-whatsapp.wascript.com.br/api/enviar-texto/${API_KEY}`;

    const response = await axios.post(
      url,
      { phone, message },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Mensagem enviada com sucesso",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Erro ao enviar mensagem:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      message: "Erro ao enviar mensagem",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
