# Skill: Docker

> Issue #12 · Sprint 01. Estudo aplicado ao Glossário UnB. **Nada aqui está implementado**: containerizar o projeto é uma história da Release 2 no Story Map.

## 1. Conceitos

| Conceito | O que é | Analogia |
|---|---|---|
| **Imagem** | Pacote somente leitura com tudo o que um programa precisa: sistema base, dependências, arquivos | A receita |
| **Contêiner** | Uma imagem em execução, isolada do resto da máquina | O bolo pronto |
| **Dockerfile** | Arquivo de texto com os passos para montar a imagem | A receita escrita |
| **Registro** (ex.: Docker Hub) | Onde as imagens ficam guardadas e são baixadas | O livro de receitas |

Com isso, todo mundo roda **o mesmo ambiente**, e acaba o "na minha máquina funciona".

## 2. Como o Docker poderia ser usado no Glossário UnB

O projeto hoje é um **site estático sem dependências** (ADRs 0001 e 0002). Para rodar, basta ter o Node e fazer `npm run dev`. Por isso o Docker **não é necessário** agora.

Ele passaria a valer a pena em três situações:
1. **Versões diferentes de Node** entre os integrantes, que era a motivação da issue #12.
2. **Publicar fora do GitHub Pages**, por exemplo num servidor da universidade.
3. **Um backend no futuro.** Se o formulário no site (RF10) exigir um servidor, o Docker ajudaria a rodar servidor e site juntos.

Um exemplo (não adicionado ao repositório) de como seria servir as duas páginas com o servidor web nginx, no mesmo layout do GitHub Pages:

```dockerfile
# Imagem pequena com o servidor web nginx
FROM nginx:alpine
# Mesmas pastas do repositório e do GitHub Pages: /frontend/, /sobre/ e o index.html da raiz
COPY index.html /usr/share/nginx/html/
COPY frontend/ /usr/share/nginx/html/frontend/
COPY sobre/ /usr/share/nginx/html/sobre/
EXPOSE 80
```

```bash
docker build -t glossario-unb .
docker run -p 8080:80 glossario-unb   # abre em http://localhost:8080
```

## 3. Custo de adotar

- Todo o time precisaria instalar o Docker, que é pesado no Windows e no Mac.
- Seria mais um arquivo para manter.
- O GitHub Pages não usa Docker, então seriam dois jeitos de publicar.

**Conclusão:** manter fora da Release 1 e reavaliar na Release 2, junto da história "queremos que o app seja containerizado com Docker" do Story Map. Se for adotado, registrar numa ADR.

## Revisão

- [ ] Revisado por: _______ (preencher no PR)
