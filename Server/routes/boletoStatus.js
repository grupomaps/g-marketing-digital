const express = require("express");
const getEfiPayInstance = require("../config/efipayConfig");

const router = express.Router();

router.get("/:id", async (req, res) => {
    const { id } = req.params; 
    const { account } = req.query; 
  
    if (!id) {
      return res.status(400).send("O ID do boleto é obrigatório.");
    }
  
    if (!account || !["equipe_marcio", "equipe_kaio", "equipe_antony"].includes(account)) {
      return res.status(400).send("Account selection is required and must be valid.");
    }
  
    const efipay = getEfiPayInstance(account);
  
    try {
      const response = await efipay.detailCharge({ id });
      
      if (!response || !response.data) {
        throw new Error("Detalhes do boleto não encontrados.");
      }
  
      res.status(200).json(response.data); 
    } catch (error) {
      console.error("Erro ao buscar informações do boleto:", error.response?.data || error.message);
      
      if (error.response && error.response.data) {
        return res.status(error.response.status || 500).json(error.response.data);
      }
  
      res.status(500).send("Erro ao buscar informações do boleto.");
    }
  });
  
module.exports = router;
