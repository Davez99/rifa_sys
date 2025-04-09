let nomeRifa = "Rifa da Bicicleta";
let numeros = [];
let selecionados = []; // Armazena os números selecionados

async function carregarRifa() {
  const idRifa = 1; // ID da rifa
  const url = `https://script.google.com/macros/s/AKfycbzPjWTtweDQgRvwkzcy18v5afuq845-87SkgOJbRrxj_J-ZE9HNejZUUkzwP_v3zdH_IA/exec?action=viewRifa&idRifa=${idRifa}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    console.log("Dados da rifa:", data);

    // Renderiza os dados da rifa na página
    renderizarRifa(data);
  } catch (error) {
    console.error("Erro ao carregar a rifa:", error);
    alert("Não foi possível carregar os dados da rifa.");
  }
}

function renderizarRifa(data) {
  nomeRifa = data.nomeRifa;
  document.getElementById("nomeRifa").textContent = data.nomeRifa;
  document.getElementById("organizador").textContent = data.nomeOrganizador;
  document.getElementById(
    "whatsapp"
  ).innerHTML = `<a href="https://wa.me/${data.telefone}" target="_blank">${data.telefone}</a>`;
  document.getElementById("valor").textContent = data.valor.toFixed(2);

  const container = document.getElementById("numerosContainer");
  container.innerHTML = "";

  // Adiciona a classe 'row' ao container para o layout do grid
  container.className = "row g-2";

  numeros = data.numeros;

  numeros.forEach((n) => {
    // Cria um elemento div com classe 'col-auto' para o grid responsivo
    const col = document.createElement("div");
    col.className = "col-auto";

    const btn = document.createElement("button");
    btn.className = "btn btn-primary btn-lg numero";
    btn.textContent = n.numero;

    if (n.status === "reservado") {
      btn.classList.add("btn-danger");
      btn.disabled = true;
      btn.title = `Reservado por ${n.comprador}`;
    } else {
      btn.classList.add("btn-success");
      btn.onclick = () => toggleNumero(n.numero, btn);
    }

    col.appendChild(btn);
    container.appendChild(col);
  });
}

function toggleNumero(numero, botao) {
  if (selecionados.includes(numero)) {
    // Deselecionar número
    botao.classList.remove("btn-warning");
    botao.classList.add("btn-success");
    selecionados = selecionados.filter((n) => n !== numero);
  } else {
    // Selecionar número
    botao.classList.remove("btn-success");
    botao.classList.add("btn-warning");
    selecionados.push(numero);
  }

  // Atualiza os números na modal, sem fechá-la
  atualizarModal();
}

function atualizarModal() {
  const numerosSelecionadosDiv = document.getElementById("numerosSelecionados");

  // Atualiza os números selecionados na modal
  numerosSelecionadosDiv.textContent = selecionados.join(", ");

  // Garante que a modal permaneça visível enquanto há números selecionados
  if (selecionados.length > 0) {
    const modal = document.getElementById("modalSelecao");
    modal.style.display = "block";
  }
}

function abrirModal() {
  const modal = document.getElementById("modalSelecao");
  modal.style.display = "block";
}

function fecharModal() {
  const modal = document.getElementById("modalSelecao");
  modal.style.display = "none";

  // Deseleciona todos os números ao fechar a modal
  selecionados.forEach((numero) => {
    const botoes = document.querySelectorAll("button.numero");
    botoes.forEach((botao) => {
      if (botao.textContent === numero.toString()) {
        botao.classList.remove("btn-warning");
        botao.classList.add("btn-success");
      }
    });
  });

  selecionados = [];
  atualizarModal();
}
async function confirmarReserva() {
  if (selecionados.length === 0) {
    alert("Nenhum número selecionado!");
    return;
  }

  const nomeComprador = document.getElementById("comprador").value.trim();
  if (!nomeComprador) {
    alert("Por favor, insira seu nome completo!");
    return;
  }

  const url = `https://script.google.com/macros/s/AKfycbzPjWTtweDQgRvwkzcy18v5afuq845-87SkgOJbRrxj_J-ZE9HNejZUUkzwP_v3zdH_IA/exec`;

  const payload = {
    action: "reservarNumeros",
    nomeRifa: nomeRifa,
    numerosSelecionados: selecionados,
    nomeComprador: nomeComprador,
  };

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors", // Desativa a política de CORS
      body: JSON.stringify(payload),
    });

    alert("Reserva enviada com sucesso!");
    carregarRifa();
    fecharModal();
  } catch (error) {
    console.error("Erro ao reservar números:", error);
    alert("Erro ao tentar reservar os números.");
  }
}

// Função para tornar a modal arrastável
function tornarModalArrastavel() {
  const modalHeader = document.getElementById("modalHeader");
  const modal = document.getElementById("modalSelecao");

  let isDragging = false;
  let startX, startY, initialX, initialY;

  const iniciarArraste = (e) => {
    // Impede comportamentos padrão como seleção de texto ou rolagem
    e.preventDefault();

    isDragging = true;

    // Determina se é um evento de toque ou clique
    const evento = e.type.startsWith("touch") ? e.touches[0] : e;

    startX = evento.clientX;
    startY = evento.clientY;

    // Calcula a posição inicial considerando a posição real atual da modal
    const computedStyle = window.getComputedStyle(modal);
    initialX = parseFloat(computedStyle.left) || 0;
    initialY = parseFloat(computedStyle.top) || 0;

    // Adiciona os listeners para os movimentos e fim do arraste
    document.addEventListener("mousemove", moverModal);
    document.addEventListener("touchmove", moverModal, { passive: false });
    document.addEventListener("mouseup", pararArraste);
    document.addEventListener("touchend", pararArraste);
  };

  const moverModal = (e) => {
    if (!isDragging) return;

    // Determina se é um evento de toque ou clique
    const evento = e.type.startsWith("touch") ? e.touches[0] : e;

    const currentX = evento.clientX;
    const currentY = evento.clientY;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    // Atualiza a posição da modal
    modal.style.left = `${initialX + deltaX}px`;
    modal.style.top = `${initialY + deltaY}px`;
    modal.style.position = "absolute";

    // Impede a rolagem em dispositivos móveis enquanto arrasta
    if (e.type.startsWith("touch")) e.preventDefault();
  };

  const pararArraste = () => {
    isDragging = false;

    // Remove os listeners de movimento e fim do arraste
    document.removeEventListener("mousemove", moverModal);
    document.removeEventListener("touchmove", moverModal);
    document.removeEventListener("mouseup", pararArraste);
    document.removeEventListener("touchend", pararArraste);
  };

  // Adiciona os listeners para o início do arraste
  modalHeader.addEventListener("mousedown", iniciarArraste);
  modalHeader.addEventListener("touchstart", iniciarArraste, {
    passive: false,
  });
}

// Inicializa a funcionalidade ao carregar a página
window.onload = function () {
  carregarRifa(); // Carrega os dados da rifa
  tornarModalArrastavel(); // Torna a modal arrastável
};
