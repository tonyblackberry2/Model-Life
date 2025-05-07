// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYxDkIixX2krkTMxHJ9Y3tT1AYBXzl4yI",
  authDomain: "model-life-787ad.firebaseapp.com",
  projectId: "model-life-787ad",
  storageBucket: "model-life-787ad.firebasestorage.app",
  messagingSenderId: "891446817307",
  appId: "1:891446817307:web:920234012e2425b44a7ebe",
  measurementId: "G-GRW3RPQK7P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Variáveis globais
let servicoSelecionado = '';
let usuarioLogado = null;

// Funções globais
window.abrirModalOpcoes = function(servico) {
    const modal = document.getElementById('modalOpcoes');
    modal.style.display = 'flex';
    servicoSelecionado = servico;
    const titulo = modal.querySelector('h3');
    titulo.textContent = `${servico} - Como deseja proceder?`;
}

window.abrirFormulario = function(tipo) {
    const modalOpcoes = document.getElementById('modalOpcoes');
    const modalFormulario = document.getElementById('modalFormulario');
    const formLogin = document.getElementById('formLogin');
    const formCadastro = document.getElementById('formCadastro');
    const titulo = document.getElementById('formTitulo');

    modalOpcoes.style.display = 'none';
    modalFormulario.style.display = 'flex';

    if (tipo === 'cadastro') {
        formLogin.classList.add('hidden');
        formCadastro.classList.remove('hidden');
        titulo.textContent = 'Cadastro';
    } else {
        formLogin.classList.remove('hidden');
        formCadastro.classList.add('hidden');
        titulo.textContent = 'Login';
    }

    modalFormulario.dataset.tipo = tipo;
}

window.alternarFormulario = function() {
    const login = document.getElementById('formLogin');
    const cadastro = document.getElementById('formCadastro');
    const titulo = document.getElementById('formTitulo');

    if (login.classList.contains('hidden')) {
        login.classList.remove('hidden');
        cadastro.classList.add('hidden');
        titulo.textContent = 'Login';
    } else {
        login.classList.add('hidden');
        cadastro.classList.remove('hidden');
        titulo.textContent = 'Cadastro';
    }
}

window.voltarEscolha = function() {
    const modalFormulario = document.getElementById('modalFormulario');
    const modalOpcoes = document.getElementById('modalOpcoes');
    modalFormulario.style.display = 'none';
    modalOpcoes.style.display = 'flex';
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
    const modalOpcoes = document.getElementById('modalOpcoes');
    const modalFormulario = document.getElementById('modalFormulario');

    if (event.target === modalOpcoes) {
        modalOpcoes.style.display = 'none';
    }
    if (event.target === modalFormulario) {
        modalFormulario.style.display = 'none';
    }
}

// Função para cadastrar usuário no Firestore
window.cadastrarUsuario = async function(e) {
    e.preventDefault();

    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    try {
        const docRef = await addDoc(collection(db, "usuarios"), {
            nome: document.getElementById('nome').value,
            dataNascimento: document.getElementById('dataNascimento').value,
            email: document.getElementById('email').value,
            senha: senha, // Nota: Em produção, você deve usar hash para senhas
            perguntaSecreta: document.getElementById('perguntaSecreta').value,
            respostaSecreta: document.getElementById('respostaSecreta').value,
            tipo: document.getElementById('modalFormulario').dataset.tipo,
            servico: servicoSelecionado,
            dataCadastro: new Date()
        });

        // Simular armazenamento do usuário
        usuarioLogado = {
            nome: document.getElementById('nome').value,
            tipo: document.getElementById('modalFormulario').dataset.tipo,
            servico: servicoSelecionado
        };

        alert('Cadastro realizado com sucesso!');
        
        // Fechar o modal de cadastro e limpar o formulário
        document.getElementById('modalFormulario').style.display = 'none';
        document.getElementById('formCadastro').reset();

        // Atualizar interface para mostrar o perfil do usuário
        exibirPerfil();
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        alert("Erro ao cadastrar usuário. Por favor, tente novamente.");
    }
}

// Exibir o perfil do usuário logado
window.exibirPerfil = function() {
    if (usuarioLogado) {
        const perfilContainer = document.getElementById('perfilContainer');
        perfilContainer.innerHTML = `
            <div class="perfil-info">
                <p>Bem-vindo, ${usuarioLogado.nome}</p>
                <p>Tipo: ${usuarioLogado.tipo}</p>
                <p>Serviço: ${usuarioLogado.servico || 'Nenhum'}</p>
            </div>
        `;
    }
}

// Manipula envio do formulário de login
document.getElementById('formLogin').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;

    // Simulação de login
    if (email && senha) {
        // Caso o login seja bem-sucedido
        usuarioLogado = { nome: 'Usuário', tipo: 'Usar Serviço', servico: 'Psicologia' }; // Simulação
        alert('Login realizado com sucesso!');
        exibirPerfil();
        // Fechar modal
        document.getElementById('modalFormulario').style.display = 'none';
    } else {
        alert('E-mail ou senha inválidos!');
    }
});

// Funcionalidade de escolha de serviço
function selecionarServicos() {
    const servicosSelecionados = [];
    const checkboxes = document.querySelectorAll('.servico-checkbox:checked');

    checkboxes.forEach(checkbox => {
        servicosSelecionados.push(checkbox.value);
    });

    console.log('Serviços selecionados:', servicosSelecionados);
}

// Manipula a seleção de horários para "Prestar Serviço"
function selecionarHorariosPrestarServico() {
    const horarios = document.querySelectorAll('.horario-checkbox:checked');
    const horariosSelecionados = [];

    horarios.forEach(horario => {
        horariosSelecionados.push(horario.value);
    });

    console.log('Horários selecionados:', horariosSelecionados);
}

// Manipula a seleção de horários para "Usar Serviço"
function selecionarHorariosUsarServico() {
    const horarios = document.querySelectorAll('.horario-checkbox:checked');
    const horariosSelecionados = [];

    horarios.forEach(horario => {
        horariosSelecionados.push(horario.value);
    });

    console.log('Horários selecionados:', horariosSelecionados);
}
