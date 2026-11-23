// Regras do tema claro e escuro. O tema salvo é aplicado por um script curto no <head> de cada página (evita
// piscar); o app.js só trata o botão. Sem DOM, para serem testadas no Node (tests/tema.test.js).

// Com prefixo: unb-mds.github.io é uma origem compartilhada por todos os projetos da organização.
export const CHAVE_TEMA = "glossario-unb:tema";

// O tema escolhido vale mais que o do sistema; sem escolha, vale o do sistema.
export function escuroAtivo(temaEscolhido, sistemaPrefereEscuro) {
  return temaEscolhido === "escuro" || (!temaEscolhido && sistemaPrefereEscuro);
}

export const proximoTema = (escuro) => (escuro ? "claro" : "escuro");

// Sem localStorage (modo privado, bloqueio do navegador), o tema funciona na página e só não fica salvo.
// O armazenamento vem por uma função porque até ler window.localStorage pode falhar.
export function salvarTema(obterArmazenamento, tema, avisar = console.warn) {
  try {
    obterArmazenamento().setItem(CHAVE_TEMA, tema);
    return true;
  } catch (erro) {
    avisar("Não foi possível salvar a preferência de tema:", erro);
    return false;
  }
}
