import {
  faCheckCircle,
  faLeftLong,
  faRightLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase/firebaseConfig";
import { QRCodeSVG } from "qrcode.react";

export const Condicoes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clientData, setClientData] = useState<any>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (id) {
          const docRef = doc(db, "vendas", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setClientData(docSnap.data());
          } else {
            console.log("Não encontrado");
          }
        }
      } catch (error) {
        console.error("Erro ao buscar os dados do cliente: ", error);
      }
    };

    fetchClientData();
  }, [id]);
  const formatValor = (value: string | number | undefined): string => {
    if (!value) return "0,00";
    const num =
      typeof value === "number" ? value.toFixed(2) : value.replace(/\D/g, "");
    return num.replace(/(\d)(\d{2})$/, "$1,$2");
  };
  return (
    clientData && (
      <div className="condicoes text-uppercase d-flex flex-column justify-content-between">
        <h5 className="text-center">Visualize sua página no Google</h5>
        <div className="">
          <p className="text-cond">
            G.MAPS CONTACT CENTER LTDA CNPJ: 40.407.753/0001-30 Endereço: Rua
            Coronel José Eusébio, 95 Higienópolis, São Paulo – SP E-mail:
            marketing@grupomapsempresas.com.br 1. OBJETO O presente Termo de Uso
            regula a contratação dos serviços prestados pela G.MAPS CONTACT
            CENTER LTDA, consistentes em ações de marketing digital, com foco em
            otimização, atualização e manutenção de perfis comerciais no Google
            Maps (Google Business Profile). 2. ACEITE E NATUREZA DA CONTRATAÇÃO
            Ao aceitar este termo, o CONTRATANTE declara ciência de que está
            contratando um serviço personalizado e sob demanda, com início da
            execução imediata, o que o exclui da aplicação do artigo 49 do
            Código de Defesa do Consumidor, conforme previsão legal para
            serviços personalizados com execução iniciada. 3. ESCOPO DOS
            SERVIÇOS Os serviços incluem, mas não se limitam a: a) Criação ou
            otimização de ficha comercial no Google Maps; b) Inclusão e
            atualização de dados comerciais (endereço, telefone, website,
            horários etc.); c) Vinculação com redes sociais; d) Criação de
            cartão digital; e) Ações para melhoria de visibilidade do perfil na
            busca local; f) Suporte via WhatsApp ou e-mail. 4. CONDIÇÕES DE
            PAGAMENTO As informações sobre a descrição do plano com os itens
            contratados, valor e periodicidade de pagamento, bem como a cópia
            deste contrato serão enviados automaticamente para o e-mail do
            CLIENTE, após o aceite verbal ou assinatura contratual digital que
            será apresentado antes da tela do primeiro pagamento. 4.1 O
            pagamento deverá ser efetuado na data de vencimento conforme
            combinado no momento da adesão, O Boleto para pagamento será enviado
            através das opções existentes no e-mail e whatsapp, que será enviado
            ao CLIENTE pela G MAPS CONTACT CENTER LTDA, nominado como “LEMBRETE
            DE VENCIMENTO ”. Este e-mail/mensagem será disparado aos e-mails de
            cadastro do CLIENTE em no mínimo 3 dias antes da data do vencimento,
            o valor do plano refere-se somente para a gestão e otimização da
            página, a responsabiliade dos envios de informações são
            exclusivamente do CONTRATANTE. 4.2 O atraso no pagamento de qualquer
            parcela implicará, no vencimento antecipado do saldo devedor e o
            envio aos Orgãos de Proteção ao Crédito(SPC/SERASA)e ( Protesto em
            Cartório) em casos de atraso no pagamento por 7 dias ou mais. Os
            serviços contratados serão suspensos até que haja a devida
            regularização por parte do CLIENTE ,não havendo regularização do
            debito, estará suspensos todos os serviços.partes. O não pagamento
            poderá acarretar a suspensão imediata dos serviços. 5. PRAZO DE
            EXECUÇÃO E RENOVAÇÃO Os serviços serão prestados pelo prazo
            contratado, podendo ser renovados automaticamente se não houver
            manifestação expressa em contrário por qualquer das partes, com
            antecedência mínima de 30 (Trinta) dias do término do contrato. 6.
            LIMITAÇÕES DE RESPONSABILIDADE A G.MAPS CONTACT CENTER LTDA não se
            responsabiliza por alterações, suspensões ou bloqueios realizados
            diretamente pelo Google em perfis de empresas, tampouco por
            políticas ou critérios de indexação e ranqueamento definidos pela
            plataforma. O serviço contratado é de meio e não de resultado, ou
            seja, não há garantia de posicionamento específico na busca do
            Google Maps. 7. CONFIDENCIALIDADE E DADOS Todas as informações
            trocadas entre as partes serão tratadas com confidencialidade. Os
            dados fornecidos pelo CONTRATANTE serão utilizados apenas para fins
            de execução dos serviços contratados, em conformidade com a LGPD
            (Lei nº 13.709/2018). 8. RESCISÃO Este contrato poderá ser
            rescindido por qualquer das partes, a qualquer momento, mediante
            aviso prévio de 7 (sete) dias. Não haverá devolução de valores em
            caso de rescisão após o início da execução dos serviços, por se
            tratar de serviço personalizado. 9. FORO Fica eleito o foro da
            Comarca de São Paulo – SP para dirimir quaisquer dúvidas ou
            controvérsias oriundas deste termo. DECLARAÇÃO DE CIÊNCIA E ACEITE
            Declaro que li, compreendi e aceito integralmente os termos aqui
            expostos, ciente de que se trata de um serviço personalizado, com
            execução imediata, não aplicando-se o direito de arrependimento
            previsto no art. 49 do Código de Defesa do Consumidor.
          </p>
        </div>
        <div className="assinatura-section justify-content-center d-flex flex-column">
          <div className="assinatura-section justify-content-center d-flex flex-column">
            <div className="d-flex align-items-center">
              <p className="mb-0 ms-1">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  color="#007bff"
                  size="lg"
                />
                {"  "}
                CONCORDO COM OS TERMOS DE SERVIÇOS;
              </p>
            </div>
            <div className="linha-assinatura mt-5"></div>
          </div>
        </div>
        <h5 className="mt-2 text-center">CENTRAL DE ATENDIMENTO</h5>
        <div className="text-center">
          <p>
            0800 580 2766
            <br />
            <a href="mailto:MARKETING@GRUPOMAPSEMPRESAS.com.br">
              MARKETING@GRUPOMAPSEMPRESAS.com.br
            </a>
            <br />
            <a href="mailto:CONTATO@GRUPOMAPSEMPRESAS.com.br">
              CONTATO@GRUPOMAPSEMPRESAS.com.br
            </a>
          </p>
        </div>
      </div>
    )
  );
};
