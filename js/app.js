let state = loadState();

let filtro = "";

const $ = seletor => document.querySelector(seletor);

const escapeHtml = (valor = "") => {

  return String(valor).replace(
    /[&<>'"]/g,
    caractere => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    })[caractere]
  );

};

function navegar(id) {

  document.querySelectorAll(".menu-item").forEach(botao => {

    botao.classList.toggle(
      "active",
      botao.dataset.page === id
    );

  });

  document.querySelectorAll(".page").forEach(pagina => {

    pagina.classList.toggle(
      "active",
      pagina.id === id
    );

  });

}

document.querySelectorAll(".menu-item").forEach(botao => {

  botao.addEventListener("click", () => {

    navegar(botao.dataset.page);

  });

});

function updateDashboard() {

  $("#totalPPC").textContent = state.ppcs.length;

  $("#totalElaboracao").textContent = state.ppcs.filter(
    ppc => ppc.situacao === "Em elaboração"
  ).length;

  $("#totalRevisao").textContent = state.ppcs.filter(
    ppc => ppc.situacao === "Em revisão"
  ).length;

  $("#totalConcluidos").textContent = state.ppcs.filter(
    ppc => ppc.situacao === "Concluído"
  ).length;

}

function renderPPCs() {

  const termo = Utils.normalizarTexto(filtro);

  const lista = state.ppcs.filter(ppc => {

    const texto = `${ppc.nome} ${ppc.curso}`;

    return Utils.normalizarTexto(texto).includes(termo);

  });

  if (!lista.length) {

    $("#listaPPCs").innerHTML = `
      <div class="empty">
        <h3>Nenhum PPC encontrado</h3>
        <p>
          Clique em “Novo PPC” para fazer o primeiro cadastro.
        </p>
      </div>
    `;

    return;

  }

  $("#listaPPCs").innerHTML = lista.map(ppc => {

    const campos = Array.isArray(ppc.campos)
      ? ppc.campos
      : [];

    const camposHtml = campos.length
      ? `
        <div class="chips">
          ${campos.slice(0, 4).map(campo => `
            <span>
              ${escapeHtml(campo.nome)}:
              ${escapeHtml(campo.valor || "—")}
            </span>
          `).join("")}
        </div>
      `
      : "";

    return `
      <article class="ppc-card">

        <div>

          <div class="card-top">

            <h3>${escapeHtml(ppc.nome)}</h3>

            <span class="badge">
              ${escapeHtml(ppc.situacao)}
            </span>

          </div>

          <p>
            <strong>Curso:</strong>
            ${escapeHtml(ppc.curso)}
            ·
            ${escapeHtml(ppc.grau)}
            ·
            ${escapeHtml(ppc.modalidade)}
          </p>

          ${camposHtml}

        </div>

        <div class="card-actions">

          <button
            class="secondary"
            onclick="editarPPC('${ppc.id}')"
          >
            Editar
          </button>

          <button
            class="danger"
            onclick="excluirPPC('${ppc.id}')"
          >
            Excluir
          </button>

        </div>

      </article>
    `;

  }).join("");

}

function renderAll() {

  updateDashboard();

  renderPPCs();

}

function abrirModal(ppc = null) {

  $("#formPPC").reset();

  $("#camposPersonalizados").innerHTML = "";

  $("#ppcId").value = ppc?.id || "";

  $("#modalTitulo").textContent = ppc
    ? "Editar PPC"
    : "Novo PPC";

  if (ppc) {

    $("#nomePPC").value = ppc.nome || "";

    $("#cursoPPC").value = ppc.curso || "";

    $("#grauPPC").value = ppc.grau || "Bacharelado";

    $("#modalidadePPC").value =
      ppc.modalidade || "Presencial";

    $("#situacaoPPC").value =
      ppc.situacao || "Em elaboração";

    const campos = Array.isArray(ppc.campos)
      ? ppc.campos
      : [];

    campos.forEach(campo => {

      adicionarCampo(campo);

    });

  }

  $("#modal").classList.remove("hidden");

  $("#nomePPC").focus();

}

function fecharModal() {

  $("#modal").classList.add("hidden");

}

function adicionarCampo(campo = {}) {

  const linha = document.createElement("div");

  linha.className = "custom-row";

  linha.innerHTML = `

    <input
      class="campo-nome"
      placeholder="Nome do campo"
      value="${escapeHtml(campo.nome || "")}"
      required
    >

    <input
      class="campo-valor"
      placeholder="Valor"
      value="${escapeHtml(campo.valor || "")}"
    >

    <button
      type="button"
      class="danger icon-button remover-campo"
      title="Remover"
    >
      ×
    </button>

  `;

  linha
    .querySelector(".remover-campo")
    .addEventListener("click", () => {

      linha.remove();

    });

  $("#camposPersonalizados").appendChild(linha);

}

$("#novoPPC").addEventListener("click", () => {

  abrirModal();

});

$("#adicionarCampo").addEventListener("click", () => {

  adicionarCampo();

});

$("#cancelarModal").addEventListener("click", fecharModal);

$("#fecharModal").addEventListener("click", fecharModal);

$("#modal").addEventListener("click", evento => {

  if (evento.target.id === "modal") {

    fecharModal();

  }

});

$("#buscaPPC").addEventListener("input", evento => {

  filtro = evento.target.value;

  renderPPCs();

});

$("#formPPC").addEventListener("submit", evento => {

  evento.preventDefault();

  const id =
    $("#ppcId").value ||
    Utils.gerarId("ppc");

  const campos = [
    ...document.querySelectorAll(".custom-row")
  ]
    .map(linha => {

      return {
        nome: linha
          .querySelector(".campo-nome")
          .value
          .trim(),

        valor: linha
          .querySelector(".campo-valor")
          .value
          .trim()
      };

    })
    .filter(campo => campo.nome);

  const existente = state.ppcs.find(
    ppc => ppc.id === id
  );

  const ppc = {

    id,

    nome: $("#nomePPC").value.trim(),

    curso: $("#cursoPPC").value.trim(),

    grau: $("#grauPPC").value,

    modalidade: $("#modalidadePPC").value,

    situacao: $("#situacaoPPC").value,

    campos,

    criadoEm:
      existente?.criadoEm ||
      new Date().toISOString(),

    atualizadoEm:
      new Date().toISOString()

  };

  if (existente) {

    state.ppcs = state.ppcs.map(item => {

      return item.id === id
        ? ppc
        : item;

    });

  } else {

    state.ppcs.unshift(ppc);

  }

  saveState(state);

  fecharModal();

  navegar("ppcs");

  renderAll();

});

function editarPPC(id) {

  const ppc = state.ppcs.find(
    item => item.id === id
  );

  if (!ppc) {

    return;

  }

  abrirModal(ppc);

}

function excluirPPC(id) {

  const ppc = state.ppcs.find(
    item => item.id === id
  );

  if (!ppc) {

    return;

  }

  const confirmou = confirm(
    `Excluir o PPC “${ppc.nome}”?`
  );

  if (!confirmou) {

    return;

  }

  state.ppcs = state.ppcs.filter(
    item => item.id !== id
  );

  saveState(state);

  renderAll();

}

window.editarPPC = editarPPC;

window.excluirPPC = excluirPPC;

renderAll();
