// Verificação periódica das fontes (#60, RF07): agrupamento por link, redirecionamento suspeito, Last-Modified,
// deduplicação das issues e o fluxo completo com robots.txt, espera entre pedidos e falhas de rede.
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  INTERVALO_MINIMO_MS,
  TITULO_DO_PROBLEMA,
  agruparPorFonte,
  atualizarVerificados,
  chaveDaFonte,
  corpoDaIssue,
  dominioBase,
  hojeEmBrasilia,
  marcadorDaFonte,
  marcadorDoCorpo,
  mudouDepoisDaVerificacao,
  planejarIssues,
  redirecionamentoSuspeito,
  tituloDaIssue,
  verificarFontes,
} from "../coleta/verificacao.js";

const termo = (id, fonte, extra = {}) => ({ id, termo: id.toUpperCase(), fonte, ...extra });
const agora = new Date("2026-11-24T12:00:00Z");

function respostaFalsa(opcoes = {}) {
  const { status = 200, texto = "", url, lastModified, comCorpo = true, falhaAoCancelar = false, semHeaders = false } = opcoes;
  return {
    ok: status >= 200 && status < 300,
    status,
    url,
    text: async () => texto,
    ...(semHeaders ? {} : { headers: { get: (nome) => (nome.toLowerCase() === "last-modified" ? (lastModified ?? null) : null) } }),
    ...(comCorpo
      ? {
          body: {
            cancel: async () => {
              if (falhaAoCancelar) throw new Error("stream já consumido");
            },
          },
        }
      : {}),
  };
}

test("chaveDaFonte ignora o trecho da página, mas mantém o resto da URL", () => {
  assert.equal(chaveDaFonte("https://unb.br/pagina#decanatos"), "https://unb.br/pagina");
  assert.equal(chaveDaFonte("https://unb.br/pagina#outro"), "https://unb.br/pagina");
  assert.equal(chaveDaFonte("https://unb.br/pagina?ano=2026#x"), "https://unb.br/pagina?ano=2026");
});

test("dominioBase compara a organização, não o subdomínio", () => {
  assert.equal(dominioBase("unb.br"), "unb.br");
  assert.equal(dominioBase("deg.unb.br"), "unb.br");
  assert.equal(dominioBase("www.fcte.unb.br"), "unb.br");
  assert.equal(dominioBase("exemplo.com.br"), "exemplo.com.br");
  assert.equal(dominioBase("a.exemplo.com.br"), "exemplo.com.br");
  assert.equal(dominioBase("sub.exemplo.com"), "exemplo.com");
});

test("redirecionamentoSuspeito: outro domínio e queda para http contam; www e subdomínio não", () => {
  assert.equal(redirecionamentoSuspeito("https://unb.br/a", "https://unb.br/b"), null);
  assert.equal(redirecionamentoSuspeito("https://unb.br/a", "https://www.unb.br/a"), null);
  assert.equal(redirecionamentoSuspeito("https://fcte.unb.br/a", "https://unb.br/b"), null);
  assert.match(redirecionamentoSuspeito("https://unb.br/a", "https://exemplo.com/a"), /outro domínio/);
  assert.match(redirecionamentoSuspeito("https://unb.br/a", "http://unb.br/a"), /http/);
  assert.equal(redirecionamentoSuspeito("não é uma URL", "https://unb.br/a"), null);
});

test("mudouDepoisDaVerificacao só confia em Last-Modified mais velho que 24 h", () => {
  const opcoes = { verificadoEm: "2026-10-01", agora };
  assert.ok(mudouDepoisDaVerificacao({ ...opcoes, ultimaModificacao: "2026-11-01T00:00:00Z" }));
  assert.equal(mudouDepoisDaVerificacao({ ...opcoes, ultimaModificacao: "2026-11-24T11:00:00Z" }), null);
  assert.equal(mudouDepoisDaVerificacao({ ...opcoes, ultimaModificacao: "2026-09-01T00:00:00Z" }), null);
  assert.equal(mudouDepoisDaVerificacao({ ...opcoes, ultimaModificacao: "data inválida" }), null);
  assert.equal(mudouDepoisDaVerificacao({ ...opcoes, ultimaModificacao: null }), null);
  assert.equal(mudouDepoisDaVerificacao({ ...opcoes, verificadoEm: "2026-13-01", ultimaModificacao: "2026-11-01" }), null);
  assert.equal(mudouDepoisDaVerificacao({ ...opcoes, verificadoEm: undefined, ultimaModificacao: "2026-11-01" }), null);
});

test("agruparPorFonte junta os termos que apontam para a mesma página e ignora fonte em texto", () => {
  const { fontes, ignoradas } = agruparPorFonte([
    termo("a", "https://unb.br/pagina#topo"),
    termo("b", "https://unb.br/pagina#meio", { verificado_em: "2026-11-01" }),
    termo("c", "conhecimento comum verificado pelo grupo"),
    termo("d", "javascript:alert(1)"),
    termo("e", "http://unb.br/pagina"),
  ]);

  assert.deepEqual(fontes.map((fonte) => fonte.url), ["https://unb.br/pagina", "http://unb.br/pagina"]);
  assert.deepEqual(fontes[0].termos.map((item) => item.id), ["a", "b"]);
  assert.equal(fontes[0].termos[1].verificado_em, "2026-11-01");
  assert.deepEqual(ignoradas.map((item) => item.id), ["c", "d"]);
});

test("título e corpo da issue citam os termos e levam o marcador da fonte", () => {
  const termos = [
    termo("a", "https://unb.br/pagina"),
    termo("b", "https://unb.br/pagina"),
    { id: "c", fonte: "https://unb.br/pagina" },
    termo("d", "https://unb.br/pagina"),
    termo("e", "https://unb.br/pagina", { verificado_em: "2026-11-01" }),
  ];
  assert.equal(tituloDaIssue(termos), `${TITULO_DO_PROBLEMA}: A, B, c e mais 2`);

  const corpo = corpoDaIssue({ url: "https://unb.br/pagina", termos, motivos: ["a fonte respondeu 404"] });
  assert.ok(corpo.includes(marcadorDaFonte("https://unb.br/pagina")));
  assert.match(corpo, /a fonte respondeu 404/);
  assert.match(corpo, /verificado em 01\/11\/2026/);
  assert.match(corpo, /`frontend\/data\/termos\.json`/);
  assert.match(corpo, /`verificado_em`/);
});

test("marcador da fonte é lido do corpo sem confundir com outra issue", () => {
  assert.equal(marcadorDoCorpo(`texto\n${marcadorDaFonte("https://unb.br/pagina")}`), "https://unb.br/pagina");
  assert.equal(marcadorDoCorpo("texto sem marcador"), null);
  assert.equal(marcadorDoCorpo(null), null);
});

test("planejarIssues abre só a fonte que ainda não tem issue aberta", () => {
  const problema = {
    url: "https://unb.br/pagina",
    termos: [termo("a", "https://unb.br/pagina")],
    motivos: ["a fonte respondeu 404"],
  };
  const nova = planejarIssues([problema], [{ number: 1, body: "outro assunto" }]);
  assert.equal(nova.abrir.length, 1);
  assert.equal(nova.abrir[0].url, problema.url);
  assert.deepEqual(nova.existentes, []);

  const repetida = planejarIssues([problema], [{ number: 2, body: marcadorDaFonte(problema.url) }]);
  assert.deepEqual(repetida.abrir, []);
  assert.deepEqual(repetida.existentes, [problema.url]);
});

test("atualizarVerificados grava a data só nos termos cuja fonte foi conferida", () => {
  const termos = [
    { id: "a", termo: "A" },
    { id: "b", termo: "B", verificado_em: "2020-01-01" },
  ];
  const atualizados = atualizarVerificados(termos, { data: "2026-11-24", verificados: ["a"] });
  assert.deepEqual(atualizados[0], { id: "a", termo: "A", verificado_em: "2026-11-24" });
  assert.equal(atualizados[1].verificado_em, "2020-01-01");
});

test("hojeEmBrasilia usa o fuso de Brasília, não o UTC do runner", () => {
  assert.equal(hojeEmBrasilia(new Date("2026-11-24T02:00:00Z")), "2026-11-23");
  assert.equal(hojeEmBrasilia(new Date("2026-11-24T12:00:00Z")), "2026-11-24");
});

test("verificarFontes: uma vez por fonte, robots antes, espera de 1 s e problemas agrupados", async () => {
  const termos = [
    termo("a", "https://unb.br/pagina#topo", { verificado_em: "2026-11-01" }),
    termo("b", "https://unb.br/pagina#meio", { verificado_em: "2026-11-01" }),
    termo("c", "https://unb.br/quebrada"),
    termo("d", "https://unb.br/antiga"),
    termo("e", "https://unb.br/velha", { verificado_em: "2026-09-01" }),
    termo("f", "https://unb.br/nova", { verificado_em: "2026-11-20" }),
  ];
  const paginas = {
    "https://unb.br/robots.txt": respostaFalsa({ texto: "User-agent: *\nDisallow: /private/\n" }),
    "https://unb.br/pagina": respostaFalsa({ lastModified: "2026-10-01T00:00:00Z" }),
    "https://unb.br/quebrada": respostaFalsa({ status: 404, comCorpo: false, semHeaders: true }),
    "https://unb.br/antiga": respostaFalsa({ url: "https://outrodominio.com/nova" }),
    "https://unb.br/velha": respostaFalsa({ lastModified: "2026-10-01T00:00:00Z" }),
    "https://unb.br/nova": respostaFalsa({ lastModified: "2026-11-01T00:00:00Z", falhaAoCancelar: true }),
  };
  const pedidos = [];
  const esperas = [];

  const resultado = await verificarFontes(termos, {
    buscar: async (url, opcoes) => {
      pedidos.push({ url, agente: opcoes.headers["User-Agent"], redirecionamento: opcoes.redirect });
      return paginas[url];
    },
    esperar: async (ms) => esperas.push(ms),
    agora,
    data: "2026-11-24",
    intervaloMs: 10,
  });

  assert.deepEqual(pedidos.map((pedido) => pedido.url), [
    "https://unb.br/robots.txt",
    "https://unb.br/pagina",
    "https://unb.br/quebrada",
    "https://unb.br/antiga",
    "https://unb.br/velha",
    "https://unb.br/nova",
  ]);
  assert.ok(pedidos.every((pedido) => pedido.agente && pedido.redirecionamento === "follow"));
  assert.equal(esperas.length, 5);
  assert.ok(esperas.every((ms) => ms >= INTERVALO_MINIMO_MS));

  assert.deepEqual(resultado.problemas.map((problema) => problema.url), [
    "https://unb.br/quebrada",
    "https://unb.br/antiga",
    "https://unb.br/velha",
  ]);
  const quebrada = resultado.problemas.find((problema) => problema.url === "https://unb.br/quebrada");
  assert.deepEqual(quebrada.motivos, ["a fonte respondeu 404"]);
  const redirect = resultado.problemas.find((problema) => problema.url === "https://unb.br/antiga");
  assert.match(redirect.motivos[0], /outro domínio/);
  const velha = resultado.problemas.find((problema) => problema.url === "https://unb.br/velha");
  assert.deepEqual(velha.termos.map((item) => item.id), ["e"]);
  assert.match(velha.motivos[0], /depois da verificação de 01\/09\/2026/);

  assert.deepEqual(resultado.verificados, ["a", "b", "f"]);
  assert.equal(resultado.data, "2026-11-24");
  assert.deepEqual(resultado.ignoradas, []);
  assert.deepEqual(resultado.erros, []);
});

test("verificarFontes: robots bloqueado ou com erro vira aviso, não issue", async () => {
  const termos = [
    termo("a", "https://bloqueado.br/private/x"),
    termo("b", "https://instavel.br/pagina"),
    termo("c", "https://fora.br/pagina"),
  ];
  const pedidos = [];

  const resultado = await verificarFontes(termos, {
    buscar: async (url) => {
      pedidos.push(url);
      if (url === "https://bloqueado.br/robots.txt") return respostaFalsa({ texto: "User-agent: *\nDisallow: /private/\n" });
      if (url === "https://instavel.br/robots.txt") return respostaFalsa({ status: 500 });
      throw new Error("DNS não resolve");
    },
    esperar: async () => {},
    agora,
  });

  assert.deepEqual(pedidos, [
    "https://bloqueado.br/robots.txt",
    "https://instavel.br/robots.txt",
    "https://fora.br/robots.txt",
  ]);
  assert.deepEqual(resultado.problemas, []);
  assert.deepEqual(resultado.verificados, []);
  assert.match(resultado.erros[0], /não permite verificar https:\/\/bloqueado\.br\/private\/x/);
  assert.match(resultado.erros[1], /robots\.txt de https:\/\/instavel\.br respondeu 500/);
  assert.match(resultado.erros[2], /robots\.txt de https:\/\/fora\.br: DNS não resolve/);
  assert.ok(resultado.fontes.every((fonte) => fonte.ok === false && fonte.status === null));
});

test("verificarFontes: erro de rede em uma fonte não impede as outras", async () => {
  const termos = [
    termo("a", "https://unb.br/timeout"),
    termo("b", "https://unb.br/abortada"),
    termo("c", "https://unb.br/sem-rede"),
    termo("d", "https://unb.br/desconhecido"),
    termo("e", "https://unb.br/ok", { verificado_em: "2026-11-01" }),
  ];
  const erroComNome = (nome) => Object.assign(new Error(nome), { name: nome });

  const resultado = await verificarFontes(termos, {
    buscar: async (url) => {
      if (url === "https://unb.br/robots.txt") return respostaFalsa({ status: 404 });
      if (url === "https://unb.br/timeout") throw erroComNome("TimeoutError");
      if (url === "https://unb.br/abortada") throw erroComNome("AbortError");
      if (url === "https://unb.br/sem-rede") throw new Error("fetch failed");
      if (url === "https://unb.br/desconhecido") throw null;
      return respostaFalsa({ lastModified: "2026-10-01T00:00:00Z" });
    },
    esperar: async () => {},
    agora,
    tempoLimiteMs: 5000,
  });

  assert.equal(resultado.problemas.length, 4);
  assert.deepEqual(resultado.problemas.map((problema) => problema.motivos[0]), [
    "a fonte não respondeu em 5 s",
    "a fonte não respondeu em 5 s",
    "não foi possível acessar a fonte: fetch failed",
    "não foi possível acessar a fonte: erro desconhecido",
  ]);
  assert.deepEqual(resultado.verificados, ["e"]);
  assert.deepEqual(resultado.erros.map((erro) => erro.split(": ")[0]), [
    "fonte https://unb.br/timeout",
    "fonte https://unb.br/abortada",
    "fonte https://unb.br/sem-rede",
    "fonte https://unb.br/desconhecido",
  ]);
});

test("verificarFontes: Last-Modified recente é ignorado e não acusa mudança", async () => {
  const resultado = await verificarFontes([termo("a", "https://unb.br/pagina", { verificado_em: "2026-01-01" })], {
    buscar: async (url) => {
      if (url.endsWith("/robots.txt")) return respostaFalsa();
      return respostaFalsa({ lastModified: "2026-11-24T11:00:00Z" });
    },
    esperar: async () => {},
    agora,
  });

  assert.deepEqual(resultado.problemas, []);
  assert.deepEqual(resultado.verificados, ["a"]);
});
