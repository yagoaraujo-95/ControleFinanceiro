// ELEMENTOS
const form = document.getElementById("form");
const lista = document.getElementById("lista");
const filtroMes = document.getElementById("mes");

// EVENTO FILTRO
filtroMes.addEventListener("change", renderizar);

// GRÁFICOS
let grafico;
let graficoLinha;

// DADOS
let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let editIndex = null;

/*
==================================================
FUNÇÕES AUXILIARES
==================================================
*/

// Salvar no LocalStorage
function salvarLocal() {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

// Formatar data
function formatarData(data) {
    if (!data) return "";
    const d = new Date(data);
    return isNaN(d) ? data : d.toLocaleDateString("pt-BR");
}

// Converter valor BR → number
function converterValor(valor) {
    return parseFloat(
        valor
            .replace(/\./g, "")
            .replace(",", ".")
    );
}

// Formatar moeda BR
function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

/*
==================================================
RESUMO
==================================================
*/
function atualizarResumo() {
    let receitas = 0;
    let despesas = 0;

    transacoes.forEach(t => {
        if (!t || !t.tipo) return;

        if (t.tipo === "receita") {
            receitas += t.valor;
        } else {
            despesas += t.valor;
        }
    });

    document.getElementById("total-receita").textContent = formatarMoeda(receitas);
    document.getElementById("total-despesa").textContent = formatarMoeda(despesas);
    document.getElementById("saldo").textContent = formatarMoeda(receitas - despesas);
}

/*
==================================================
GRÁFICO PIZZA
==================================================
*/
function atualizarGrafico() {

    const receitas = transacoes
        .filter(t => t && t.tipo === "receita")
        .reduce((acc, t) => acc + t.valor, 0);

    const despesas = transacoes
        .filter(t => t && t.tipo === "despesa")
        .reduce((acc, t) => acc + t.valor, 0);

    const ctx = document.getElementById("grafico").getContext("2d");

    if (grafico) {
        grafico.destroy();
    }

    grafico = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Receitas", "Despesas"],
            datasets: [{
                data: [receitas, despesas],
                backgroundColor: ["#22c55e", "#ef4444"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

/*
==================================================
GRÁFICO LINHA (POR MÊS)
==================================================
*/
function atualizarGraficoLinha() {

    const dadosPorMes = {};

    transacoes.forEach(t => {
        if (!t || !t.data) return;

        const mes = t.data.slice(0, 7);

        if (!dadosPorMes[mes]) {
            dadosPorMes[mes] = { receita: 0, despesa: 0 };
        }

        if (t.tipo === "receita") {
            dadosPorMes[mes].receita += t.valor;
        } else {
            dadosPorMes[mes].despesa += t.valor;
        }
    });

    const labels = Object.keys(dadosPorMes).sort();

    const receitas = labels.map(m => dadosPorMes[m].receita);
    const despesas = labels.map(m => dadosPorMes[m].despesa);

    const ctx = document.getElementById("graficoLinha").getContext("2d");

    if (graficoLinha) {
        graficoLinha.destroy();
    }

    graficoLinha = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Receitas",
                    data: receitas,
                    borderColor: "#22c55e",
                    backgroundColor: "#22c55e33",
                    tension: 0.3
                },
                {
                    label: "Despesas",
                    data: despesas,
                    borderColor: "#ef4444",
                    backgroundColor: "#ef444433",
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

/*
==================================================
RENDERIZAR
==================================================
*/
function renderizar() {
    lista.innerHTML = "";

    const mesSelecionado = filtroMes.value;

    transacoes.forEach((t, index) => {

        if (!t || !t.descricao) return;

        if (mesSelecionado) {
            const mesTransacao = t.data.slice(0, 7);
            if (mesTransacao !== mesSelecionado) return;
        }

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${t.descricao}</td>
            <td>${formatarData(t.data)}</td>
            <td class="${t.tipo}">${formatarMoeda(t.valor)}</td>
            <td>${t.tipo === "receita" ? "Receita" : "Despesa"}</td>
            <td>
                <button onclick="editar(${index})">✏️</button>
                <button onclick="excluir(${index})">🗑️</button>
            </td>
        `;

        lista.appendChild(tr);
    });

    atualizarResumo();
    atualizarGrafico();
    atualizarGraficoLinha();
}

/*
==================================================
SUBMIT
==================================================
*/
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const descricao = document.getElementById("descricao").value.trim();
    const valorInput = document.getElementById("valor").value;
    const valor = converterValor(valorInput);
    const tipo = document.getElementById("tipo").value;
    const data = document.getElementById("data").value;

    if (!descricao || !valorInput || isNaN(valor) || valor <= 0 || !tipo || !data) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    if (editIndex !== null) {
        transacoes[editIndex] = { descricao, valor, tipo, data };
        editIndex = null;
    } else {
        transacoes.push({ descricao, valor, tipo, data });
    }

    salvarLocal();
    renderizar();
    form.reset();
});

/*
==================================================
EXCLUIR
==================================================
*/
function excluir(index) {
    if (confirm("Deseja realmente excluir?")) {
        transacoes.splice(index, 1);
        salvarLocal();
        renderizar();
    }
}

/*
==================================================
EDITAR
==================================================
*/
function editar(index) {
    const t = transacoes[index];

    document.getElementById("descricao").value = t.descricao;
    document.getElementById("valor").value = t.valor;
    document.getElementById("tipo").value = t.tipo;
    document.getElementById("data").value = t.data;

    editIndex = index;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// INICIAR
renderizar();