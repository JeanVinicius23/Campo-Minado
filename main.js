const botaoIniciar = document.getElementById("iniciar-jogo");
const botaoReiniciar = document.getElementById("reiniciar-jogo");
const areaJogo = document.getElementById("area-jogo");
const tabuleiro = document.getElementById("tabuleiro");
const minasRestantes = document.getElementById("minas-restantes");
const tempo = document.getElementById("tempo");
const mensagem = document.getElementById("mensagem");

let tamanho = 10;
let quantidadeMinas = 10;
let campo = [];
let segundos = 0;
let intervaloTempo;
let jogoAcabou = false;

botaoIniciar.addEventListener("click", iniciarJogo);
botaoReiniciar.addEventListener("click", iniciarJogo);

function iniciarJogo() {
    const dificuldade = document.querySelector('input[name="dificuldade"]:checked');

    if (!dificuldade) {
        alert("Escolha uma dificuldade!");
        return;
    }

    jogoAcabou = false;
    areaJogo.classList.remove("escondido");

    if (dificuldade.value === "facil") {
        tamanho = 10;
        quantidadeMinas = 10;
    } else if (dificuldade.value === "medio") {
        tamanho = 16;
        quantidadeMinas = 40;
    } else {
        tamanho = 20;
        quantidadeMinas = 80;
    }

    campo = [];
    mensagem.textContent = "";
    mensagem.style.color = "black";

    minasRestantes.textContent = quantidadeMinas;

    segundos = 0;
    tempo.textContent = segundos;

    clearInterval(intervaloTempo);
    intervaloTempo = setInterval(() => {
        segundos++;
        tempo.textContent = segundos;
    }, 1000);

    criarCampo();
}

function criarCampo() {
    tabuleiro.innerHTML = "";
    tabuleiro.style.gridTemplateColumns = `repeat(${tamanho}, 35px)`;

    for (let i = 0; i < tamanho; i++) {
        campo[i] = [];

        for (let j = 0; j < tamanho; j++) {
            campo[i][j] = {
                mina: false,
                aberta: false
            };

            const celula = document.createElement("div");
            celula.classList.add("celula");

            celula.dataset.linha = i;
            celula.dataset.coluna = j;

            celula.addEventListener("click", abrirCelula);

            tabuleiro.appendChild(celula);
        }
    }

    colocarMinas();
}

function colocarMinas() {
    let minasColocadas = 0;

    while (minasColocadas < quantidadeMinas) {
        let linha = Math.floor(Math.random() * tamanho);
        let coluna = Math.floor(Math.random() * tamanho);

        if (!campo[linha][coluna].mina) {
            campo[linha][coluna].mina = true;
            minasColocadas++;
        }
    }
}

function contarMinasVizinhas(linha, coluna) {
    let contador = 0;

    linha = Number(linha);
    coluna = Number(coluna);

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let novaLinha = linha + i;
            let novaColuna = coluna + j;

            if (
                novaLinha >= 0 &&
                novaLinha < tamanho &&
                novaColuna >= 0 &&
                novaColuna < tamanho &&
                campo[novaLinha][novaColuna].mina
            ) {
                contador++;
            }
        }
    }

    return contador;
}

function abrirCelula(event) {
    if (jogoAcabou) {
        return;
    }

    const linha = event.target.dataset.linha;
    const coluna = event.target.dataset.coluna;

    if (campo[linha][coluna].aberta) {
        return;
    }

    campo[linha][coluna].aberta = true;

    if (campo[linha][coluna].mina) {
        event.target.textContent = "💣";
        event.target.style.backgroundColor = "red";
        event.target.style.color = "white";

        mensagem.textContent = "Você perdeu!";
        mensagem.style.color = "red";

        jogoAcabou = true;
        clearInterval(intervaloTempo);

        revelarBombas();
        bloquearTabuleiro();
    } else {
        let minasAoRedor = contarMinasVizinhas(linha, coluna);

        event.target.classList.add("aberta");

        if (minasAoRedor > 0) {
            event.target.textContent = minasAoRedor;
        } else {
            event.target.textContent = "0";
        }
    }
}

function revelarBombas() {
    const celulas = document.querySelectorAll(".celula");

    celulas.forEach((celula) => {
        const linha = celula.dataset.linha;
        const coluna = celula.dataset.coluna;

        if (campo[linha][coluna].mina) {
            celula.textContent = "💣";
            celula.style.backgroundColor = "red";
            celula.style.color = "white";
        }
    });
}

function bloquearTabuleiro() {
    const celulas = document.querySelectorAll(".celula");

    celulas.forEach((celula) => {
        celula.style.pointerEvents = "none";
    });
}