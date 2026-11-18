// O cliente do Gemini que o classificador usa (#58). Não importa o SDK: recebe a classe GoogleGenAI por
// parâmetro. Só o scripts/classificar.mjs carrega o SDK, e só quando existe chave; nos testes entra uma classe
// falsa. Assim nenhum teste toca a rede, e trocar de provedor é escrever outro arquivo com o mesmo `gerar`.

export const MODELO_PADRAO = "gemini-3.8-flash";

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
