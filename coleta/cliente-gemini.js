// O cliente do Gemini que o classificador usa (#58). Não importa o SDK: recebe a classe GoogleGenAI por
// parâmetro. Só o scripts/classificar.mjs carrega o SDK, e só quando existe chave; nos testes entra uma classe
// falsa. Assim nenhum teste toca a rede, e trocar de provedor é escrever outro arquivo com o mesmo `gerar`.

export const MODELO_PADRAO = "gemini-3.8-flash";
// Usado só quando o principal está sobrecarregado ou sem cota (decisões 48 e 49). Em 21/11/2026, com as mesmas
// 30 siglas do teste, ele barrou as 12 de fora da UnB e aceitou as 12 da UnB.
export const MODELO_RESERVA = "gemini-3.5-flash-lite";

// Sobrecarga (503) e cota esgotada (429) são do modelo: no Gemini gratuito, cada modelo tem a sua cota, então a
// reserva continua respondendo (em 21/11/2026, o principal deu 429 e o reserva seguiu). Chave inválida (400) ou
// modelo inexistente (404) não pedem a reserva: ela falharia do mesmo jeito.
const INDISPONIVEL = /"code":\s*(503|429)|\b(503|429)\b|UNAVAILABLE|RESOURCE_EXHAUSTED|high demand|exceeded your current quota/i;

export function deveUsarReserva(erro) {
  if (erro === undefined || erro === null) return false;
  return INDISPONIVEL.test(String(erro?.message ?? erro));
}

export function criarClienteGemini({ chave, GoogleGenAI, modelo = MODELO_PADRAO } = {}) {
  if (!chave) return null;
  if (typeof GoogleGenAI !== "function") {
    throw new Error("criarClienteGemini precisa da classe GoogleGenAI do SDK do Gemini");
  }

  const ia = new GoogleGenAI({ apiKey: chave });
  return {
    modelo,
    // Pede a resposta em JSON, presa ao schema. O Gemini 3.8 não aceita mais `temperature`.
    async gerar(prompt, esquema) {
      const resposta = await ia.models.generateContent({
        model: modelo,
        contents: prompt,
        config: { responseMimeType: "application/json", responseJsonSchema: esquema },
      });
      if (typeof resposta?.text !== "string") throw new Error("a API não devolveu texto");
      return resposta.text;
    },
  };
}

// Junta dois clientes: usa o principal e, na primeira sobrecarga ou cota esgotada, passa para a reserva até o fim da rodada,
// para não insistir num modelo ocupado a cada termo. `ultimoModelo` diz quem respondeu o último pedido.
export function comReserva(principal, reserva) {
  if (!principal || !reserva || reserva.modelo === principal.modelo) return principal;
  let usarReserva = false;
  const cliente = {
    modelo: principal.modelo,
    modeloReserva: reserva.modelo,
    ultimoModelo: null,
    async gerar(prompt, esquema) {
      if (!usarReserva) {
        try {
          const texto = await principal.gerar(prompt, esquema);
          cliente.ultimoModelo = principal.modelo;
          return texto;
        } catch (erro) {
          if (!deveUsarReserva(erro)) throw erro;
          usarReserva = true;
        }
      }
      const texto = await reserva.gerar(prompt, esquema);
      cliente.ultimoModelo = reserva.modelo;
      return texto;
    },
  };
  return cliente;
}
