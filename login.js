// ===============================
// VERIFICA SE JÁ ESTÁ LOGADO
// ===============================
if (localStorage.getItem("logado") === "true") {
    window.location.href = "index.html";
}

// ===============================
// ELEMENTOS
// ===============================
const form = document.getElementById("loginForm");

if (form) {

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();
        const erro = document.getElementById("erro");

        // limpa erro anterior
        erro.textContent = "";

        // validação básica
        if (!email || !senha) {
            erro.textContent = "Preencha todos os campos!";
            return;
        }

        // ===============================
        // LOGIN SIMPLES (PADRÃO ATUAL)
        // ===============================
        // ===============================
        // LOGIN REAL
        // ===============================
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuario = usuarios.find(u => u.email === email && u.senha === senha);

        // verifica se já está logado
if (localStorage.getItem("logado") === "true") {
    window.location.href = "index.html";
}

const form = document.getElementById("loginForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const erro = document.getElementById("erro");

    erro.textContent = "";

            if (!email || !senha) {
                erro.textContent = "Preencha todos os campos!";
                return;
            }

            // 🔥 AQUI ENTRA SEU CÓDIGO
            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

            const usuario = usuarios.find(
                u => u.email === email && u.senha === senha
            );

            if (usuario) {
                localStorage.setItem("logado", "true");
                window.location.href = "index.html";
            } else {
                erro.textContent = "E-mail ou senha inválidos!";
            }

        });

    });

}