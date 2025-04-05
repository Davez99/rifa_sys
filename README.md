
# 📋 Sistema de Rifas com Google Apps Script + HTML/CSS/JS

## 💡 Escopo

### 1. Cadastro de nova rifa (via planilha/admin)
- Nome da rifa
- Nome do organizador
- WhatsApp
- Valor por número
- Quantidade de números disponíveis

### 2. Visualização/interação (usuário via frontend)
- Ver nome da rifa
- Ver organizador e número do WhatsApp
- Ver e escolher números disponíveis
- Soma/subtração do valor conforme seleção
- Ao confirmar, gerar link para WhatsApp com mensagem

---

## 📊 Estrutura da Planilha

### Aba `RIFAS`

| ID | Nome da Rifa | Organizador | WhatsApp   | Valor | Quantidade |
|----|---------------|-------------|------------|--------|-------------|
| 1  | Rifa Teste    | João        | 55999999999 | 10     | 100         |

---

### Aba `NUMEROS`

| RIFA_ID | Número | Nome comprador | Status     |
|---------|--------|----------------|------------|
| 1       | 1      |                | disponível |
| 1       | 2      | Maria          | reservado  |
| ...     | ...    | ...            | ...        |

---

## ⚙️ Funcionalidades (Google Apps Script)

- `listarRifas()` → Retorna as rifas disponíveis
- `detalhesRifa(rifaId)` → Retorna info da rifa e os números
- `reservarNumeros(rifaId, numerosSelecionados, nomeComprador)` → Reserva os números
- (Opcional) `liberarNumerosTemporarios()` → Se quiser "travar" temporariamente

---

## 🌐 Frontend (HTML + JS)

### Página Inicial
- Lista de rifas disponíveis

### Página da Rifa
- Dados da rifa (nome, organizador, whatsapp)
- Lista de números disponíveis (ex: botões ou checkboxes)
- Soma total em tempo real conforme números são selecionados
- Botão “Confirmar” → Redireciona para WhatsApp com link:

```
https://wa.me/55SEUNUMERO?text=Olá, gostaria de reservar os números: 12, 13, 14...
```

---

## ✅ Próximos Passos

1. Criar **Google Apps Script** (backend)
2. Criar **HTML + JS** para consumir os dados e interagir com a planilha

---
