import { classificarCandidatos } from "./classificador.js";

// Etapa do pipeline da coleta automática (#59, ADR 0009): a deduplicação vem antes do LLM.
// Só os termos que ainda não estão no glossário gastam chamadas do classificador, então a lista
// anda a cada semana em vez de repetir os mesmos candidatos até o limite de 100 chamadas.
// Devolve a lista classificada na mesma ordem de `resultado.novos` e grava a classificação de volta
// em cada registro, para o relatório e o `atualizar-termos` continuarem vendo `registro.candidato.classificacao`.
export async function classificarNovos(resultado, opcoes) {
  const candidatos = resultado.novos.map((registro) => registro.candidato);
  const classificados = await classificarCandidatos(candidatos, opcoes);
  resultado.novos.forEach((registro, indice) => {
    registro.candidato = classificados[indice];
  });
  return classificados;
}
