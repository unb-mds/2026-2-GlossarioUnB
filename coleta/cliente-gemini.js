// O cliente do Gemini que o classificador usa (#58). Não importa o SDK: recebe a classe GoogleGenAI por
// parâmetro. Só o scripts/classificar.mjs carrega o SDK, e só quando existe chave; nos testes entra uma classe
// falsa. Assim nenhum teste toca a rede, e trocar de provedor é escrever outro arquivo com o mesmo `gerar`.

export const MODELO_PADRAO = "gemini-3.8-flash";
// Usado só quando o principal responde que está sobrecarregado (decisão 48). Em 21/11/2026, com as mesmas
// 30 siglas do teste, ele barrou as 12 de fora da UnB e aceitou as 12 da UnB.
export const MODELO_RESERVA = "gemini-3.5-flash-lite";

// O 503 é sobrecarga passageira do modelo. Chave inválida (400) e cota (429) não são: a reserva não resolve.
export function ehSobrecarga(erro) {
  return /"code":\s*503|\b503\b|UNAVAILABLE|high demand/i.test(String(erro?.message ?? erro));
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

// Junta dois clientes: usa o principal e, na primeira sobrecarga, passa para a reserva até o fim da rodada,
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
          if (!ehSobrecarga(erro)) throw erro;
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
