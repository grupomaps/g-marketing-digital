const cron = require("node-cron");
const { fetchMarketingData } = require("./marketingService");
const { writeToSheet } = require("./googleSheetsService");

const checkForChanges = async () => {
  try {
    const marketingData = await fetchMarketingData();

    const newData = marketingData.filter((item) => {
      return (
        !item.dataAlteracao ||
        new Date(item.dataAlteracao).getTime() > Date.now() - 60 * 60 * 1000
      );
    });

    if (newData.length > 0) {
      await writeToSheet(newData);
      console.log("Planilha atualizada com novos dados!");
    } else {
      console.log("Nenhuma alteração detectada.");
    }
  } catch (error) {
    console.error("Erro ao verificar alterações no marketing:", error);
  }
};

cron.schedule("0 */3 * * *", async () => {
  try {
    await checkForChanges();
  } catch (error) {
    console.error("Erro ao sincronizar os dados:", error);
  }
});

module.exports = { checkForChanges };
