// ===============================
// ELEMENTOS
// ===============================
const form = document.getElementById("cadastroForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const erro = document.getElementById("erro");

    // limpa mensagem
    erro.textContent = "";
    erro.style.color = "red";

    // ===============================
    // VALIDAÇÃO
    // ===============================
    if (!nome || !telefone || !cpf || !email || !senha) {
        erro.textContent = "Preencha todos os campos!";
        return;
    }

    // valida tamanho básico
    if (telefone.length < 10) {
        erro.textContent = "Telefone inválido!";
        return;
    }

    if (cpf.length !== 11) {
        erro.textContent = "CPF deve ter 11 números!";
        return;
    }

    // ===============================
    // BUSCAR USUÁRIOS
    // ===============================
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // verifica email duplicado
    const emailExiste = usuarios.find(u => u.email === email);
    if (emailExiste) {
        erro.textContent = "Email já cadastrado!";
        return;
    }

    // verifica CPF duplicado
    const cpfExiste = usuarios.find(u => u.cpf === cpf);
    if (cpfExiste) {
        erro.textContent = "CPF já cadastrado!";
        return;
    }

    // ===============================
    // CRIAR USUÁRIO
    // ===============================
    const novoUsuario = {
        nome,
        telefone,
        cpf,
        email,
        senha
    };

    usuarios.push(novoUsuario);

    // ===============================
    // SALVAR
    // ===============================
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // ===============================
    // SUCESSO
    // ===============================
    erro.style.color = "green";
    erro.textContent = "Cadastro realizado com sucesso!";

    // limpa formulário
    form.reset();

    // volta para login
    setTimeout(() => {
        window.location.href = "login.html";
    }, 800);

    // remover caracteres (caso usuário digite com pontos/traço)
const cpfLimpo = cpf.replace(/\D/g, "");

// CPF
if (cpfLimpo.length !== 11) {
    erro.textContent = "CPF deve ter 11 números!";
    return;
}

// SENHA (sem limite máximo 🚀)
const senhaForte = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;

if (!senhaForte.test(senha)) {
    erro.textContent = "Senha deve ter letra maiúscula, número e caractere especial!";
    return;
}

});