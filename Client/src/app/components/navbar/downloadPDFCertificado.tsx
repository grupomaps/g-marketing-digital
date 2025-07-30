import html2pdf from "html2pdf.js";

interface DownloadPDFOptions {
  elementId: string;
  filename: string;
  buttonId?: string;
}

export const downloadPDFCertificado = ({ elementId, filename, buttonId }: DownloadPDFOptions) => {
  const contratoElement = document.getElementById(elementId);
  const btn = buttonId ? document.getElementById(buttonId) : null;

  if (btn) {
    btn.style.display = "none";
  }

  if (contratoElement) {
    contratoElement.classList.add("modo-pdf");

    const rect = contratoElement.getBoundingClientRect();
    const widthInInches = rect.width / 96;
    const heightInInches = rect.height / 96;

    const opt: any = {
      margin: 0,
      filename: `${filename}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
      },
      jsPDF: {
        unit: "in",
        format: [widthInInches, heightInInches],
        orientation: widthInInches > heightInInches ? "landscape" : "portrait",
      },
    };

    html2pdf()
      .set(opt)
      .from(contratoElement)
      .save()
      .then(() => {
        contratoElement.classList.remove("modo-pdf");
        if (btn) btn.style.display = "flex";
      })
      .catch((error: unknown) => {
        contratoElement.classList.remove("modo-pdf");
        console.error("Erro ao gerar PDF:", error);
        alert("Houve um erro ao gerar o PDF. Tente novamente.");
        if (btn) btn.style.display = "flex";
      });
  } else {
    alert("Erro: Um ou mais elementos não foram encontrados.");
  }
};
