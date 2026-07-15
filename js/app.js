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
        <p>Clique em “Novo PPC” para fazer o primeiro cadastro.</p>
      </div>
    `;

    return;
  }

  $("#listaPPCs").innerHTML = lista.map(ppc => {
    const campos = Array.isArray(ppc.campos)
      ? ppc.campos
      : [];

    const secoes = Array.isArray(ppc.secoes)
      ? ppc.secoes
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
        <div class="ppc-card-content">
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

          <p class="section-count">
            ${secoes.length} tópico(s) cadastrado(s)
          </p>

          ${camposHtml}
        </div>

        <div class="card-actions">
          <button
            class="primary"
            onclick="abrirEstruturaPPC('${ppc.id}')"
          >
            Abrir PPC
          </button>

          <button
            class="secondary"
            onclick="editarPPC('${ppc.id}')"
          >
            Editar cadastro
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

    secoes: existente?.secoes || [],

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

/* =========================================================
   ESTRUTURA E TÓPICOS DO PPC
========================================================= */

function criarModalEstrutura() {
  if ($("#modalEstrutura")) {
    return;
  }

  const modal = document.createElement("div");

  modal.id = "modalEstrutura";
  modal.className = "modal hidden";

  modal.innerHTML = `
    <div class="modal-content modal-grande">
      <div class="modal-header">
        <div>
          <h2 id="estruturaTitulo">Estrutura do PPC</h2>
          <p id="estruturaCurso" class="modal-subtitle"></p>
        </div>

        <button
          id="fecharEstrutura"
          class="icon-button"
          aria-label="Fechar"
        >
          ×
        </button>
      </div>

      <input id="estruturaPpcId" type="hidden">

      <div class="estrutura-toolbar">
        <button
          id="novoTopico"
          class="primary"
          type="button"
        >
          + Novo tópico
        </button>
      </div>

      <div id="listaTopicos"></div>
    </div>
  `;

  document.body.appendChild(modal);

  $("#fecharEstrutura").addEventListener(
    "click",
    fecharEstruturaPPC
  );

  $("#novoTopico").addEventListener(
    "click",
    () => abrirFormularioTopico()
  );

  modal.addEventListener("click", evento => {
    if (evento.target.id === "modalEstrutura") {
      fecharEstruturaPPC();
    }
  });
}

function abrirEstruturaPPC(id) {
  criarModalEstrutura();

  const ppc = state.ppcs.find(
    item => item.id === id
  );

  if (!ppc) {
    return;
  }

  $("#estruturaPpcId").value = id;
  $("#estruturaTitulo").textContent = ppc.nome;
  $("#estruturaCurso").textContent = ppc.curso;

  $("#modalEstrutura").classList.remove("hidden");

  renderTopicos();
}

function fecharEstruturaPPC() {
  $("#modalEstrutura")?.classList.add("hidden");
}

function obterPpcAberto() {
  const id = $("#estruturaPpcId")?.value;

  return state.ppcs.find(
    ppc => ppc.id === id
  );
}

function renderTopicos() {
  const ppc = obterPpcAberto();

  if (!ppc) {
    return;
  }

  const secoes = Array.isArray(ppc.secoes)
    ? ppc.secoes
    : [];

  if (!secoes.length) {
    $("#listaTopicos").innerHTML = `
      <div class="empty">
        <h3>Nenhum tópico cadastrado</h3>
        <p>
          Clique em “Novo tópico” para começar a montar o PPC.
        </p>
      </div>
    `;

    return;
  }

  $("#listaTopicos").innerHTML = secoes.map(
    (secao, indice) => `
      <article class="topico-card">
        <div class="topico-numero">
          ${indice + 1}
        </div>

        <div class="topico-conteudo">
          <h3>${escapeHtml(secao.titulo)}</h3>

          <div class="topico-texto">
            ${
              secao.conteudo
                ? escapeHtml(secao.conteudo)
                    .replace(/\n/g, "<br>")
                : "<em>Conteúdo ainda não preenchido.</em>"
            }
          </div>
        </div>

        <div class="topico-acoes">
          <button
            class="secondary"
            onclick="moverTopico('${secao.id}', -1)"
            ${indice === 0 ? "disabled" : ""}
            title="Mover para cima"
          >
            ↑
          </button>

          <button
            class="secondary"
            onclick="moverTopico('${secao.id}', 1)"
            ${indice === secoes.length - 1 ? "disabled" : ""}
            title="Mover para baixo"
          >
            ↓
          </button>

          <button
            class="secondary"
            onclick="editarTopico('${secao.id}')"
          >
            Editar
          </button>

          <button
            class="danger"
            onclick="excluirTopico('${secao.id}')"
          >
            Excluir
          </button>
        </div>
      </article>
    `
  ).join("");
}

function criarFormularioTopico() {
  if ($("#modalTopico")) {
    return;
  }

  const modal = document.createElement("div");

  modal.id = "modalTopico";
  modal.className = "modal hidden modal-secundario";

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="topicoModalTitulo">Novo tópico</h2>

        <button
          id="fecharTopico"
          class="icon-button"
          type="button"
        >
          ×
        </button>
      </div>

      <form id="formTopico">
        <input id="topicoId" type="hidden">

        <label>
          Título do tópico

          <input
            id="topicoTitulo"
            required
            placeholder="Ex.: Perfil do egresso"
          >
        </label>

        <label class="campo-conteudo">
          Conteúdo

          <textarea
            id="topicoConteudo"
            rows="14"
            placeholder="Digite o conteúdo deste tópico..."
          ></textarea>
        </label>

        <div class="acoes">
          <button
            id="cancelarTopico"
            type="button"
            class="secondary"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="primary"
          >
            Salvar tópico
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  $("#fecharTopico").addEventListener(
    "click",
    fecharFormularioTopico
  );

  $("#cancelarTopico").addEventListener(
    "click",
    fecharFormularioTopico
  );

  $("#formTopico").addEventListener(
    "submit",
    salvarTopico
  );
}

function abrirFormularioTopico(secao = null) {
  criarFormularioTopico();

  $("#formTopico").reset();

  $("#topicoId").value = secao?.id || "";

  $("#topicoModalTitulo").textContent = secao
    ? "Editar tópico"
    : "Novo tópico";

  $("#topicoTitulo").value =
    secao?.titulo || "";

  $("#topicoConteudo").value =
    secao?.conteudo || "";

  $("#modalTopico").classList.remove("hidden");

  $("#topicoTitulo").focus();
}

function fecharFormularioTopico() {
  $("#modalTopico")?.classList.add("hidden");
}

function salvarTopico(evento) {
  evento.preventDefault();

  const ppc = obterPpcAberto();

  if (!ppc) {
    return;
  }

  if (!Array.isArray(ppc.secoes)) {
    ppc.secoes = [];
  }

  const id =
    $("#topicoId").value ||
    Utils.gerarId("topico");

  const secao = {
    id,

    titulo:
      $("#topicoTitulo").value.trim(),

    conteudo:
      $("#topicoConteudo").value.trim(),

    atualizadoEm:
      new Date().toISOString()
  };

  const existente = ppc.secoes.find(
    item => item.id === id
  );

  if (existente) {
    ppc.secoes = ppc.secoes.map(item => {
      return item.id === id
        ? secao
        : item;
    });
  } else {
    ppc.secoes.push(secao);
  }

  ppc.atualizadoEm = new Date().toISOString();

  saveState(state);

  fecharFormularioTopico();
  renderTopicos();
  renderAll();
}

function editarTopico(id) {
  const ppc = obterPpcAberto();

  if (!ppc) {
    return;
  }

  const secao = ppc.secoes.find(
    item => item.id === id
  );

  if (!secao) {
    return;
  }

  abrirFormularioTopico(secao);
}

function excluirTopico(id) {
  const ppc = obterPpcAberto();

  if (!ppc) {
    return;
  }

  const secao = ppc.secoes.find(
    item => item.id === id
  );

  if (!secao) {
    return;
  }

  const confirmou = confirm(
    `Excluir o tópico “${secao.titulo}”?`
  );

  if (!confirmou) {
    return;
  }

  ppc.secoes = ppc.secoes.filter(
    item => item.id !== id
  );

  ppc.atualizadoEm = new Date().toISOString();

  saveState(state);
  renderTopicos();
  renderAll();
}

function moverTopico(id, direcao) {
  const ppc = obterPpcAberto();

  if (!ppc) {
    return;
  }

  const indiceAtual = ppc.secoes.findIndex(
    item => item.id === id
  );

  const novoIndice = indiceAtual + direcao;

  if (
    indiceAtual < 0 ||
    novoIndice < 0 ||
    novoIndice >= ppc.secoes.length
  ) {
    return;
  }

  const itemMovido = ppc.secoes.splice(
    indiceAtual,
    1
  )[0];

  ppc.secoes.splice(
    novoIndice,
    0,
    itemMovido
  );

  ppc.atualizadoEm = new Date().toISOString();

  saveState(state);
  renderTopicos();
}

window.editarPPC = editarPPC;
window.excluirPPC = excluirPPC;
window.abrirEstruturaPPC = abrirEstruturaPPC;
window.editarTopico = editarTopico;
window.excluirTopico = excluirTopico;
window.moverTopico = moverTopico;

renderAll();
