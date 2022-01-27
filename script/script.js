// Dados Iniciais

const QUADROORIGINAL = {
    a1: "",
    a2: "",
    a3: "",
    b1: "",
    b2: "",
    b3: "",
    c1: "",
    c2: "",
    c3: "",
};
const posicoes = ["a1",
    "a2",
    "a3",
    "b1",
    "b2",
    "b3",
    "c1",
    "c2",
    "c3",
]



const COMBINACOESVITORIA = [
    "a1,a2,a3",
    "b1,b2,b3",
    "c1,c2,c3",
    "a1,b1,c1",
    "a2,b2,c2",
    "a3,b3,c3",
    "a1,b2,c3",
    "c1,b2,a3",
];

let WARNING = "";
let PLAYING = {
    status: [false, true],
    index: 1,
    trocar() {
        this.index === 0 ? (this.index = 1) : (this.index = 0);
    },
};

let PLAYER_1 = "",
    PLAYER_2 = "",
    PLAYERVEZ = "",
    NUNJOGADAS = 0,
    TEMPOCOMPUTADOR = 2000;


let pontosPlayer_1 = localStorage.getItem('pontosPlayer_1') || 0;;
let pontosPlayer_2 = localStorage.getItem('pontosPlayer_2') || 0;


let CORVERDE = "2, 129, 40",
    CORVERMELHO = "238, 68, 68";

let novoJogoElement = `<button class="novo-jogo">Novo Jogo</button>`;
let simNaoElement = `<div class="simNao">
<button class="sim">Sim</button>
<button class="nao">Não</button>
</div>`;

let msgElement = ` <div class="msg"></div>`;

// //Eventos

function addEvent(element, funcao) {
    document
        .querySelectorAll(`.${element}`)
        .forEach((elemento) => elemento.addEventListener("click", funcao));
}

function removeEvent(element, funcao) {
    document
        .querySelectorAll(`.${element}`)
        .forEach((elemento) => elemento.removeEventListener("click", funcao));
}

// funções hendle

function showElement(element, nome) {
    document.querySelector(element).classList.add(nome);
}

function hidenElement(element, nome) {
    document.querySelector(element).classList.remove(nome);
}

function handleQuadro() {
    for (let posicao in QUADROORIGINAL) {
        elemento = document.querySelector(`[data-item="${posicao}"]`);
        elemento.innerHTML = `${QUADROORIGINAL[posicao]}`;

        if (QUADROORIGINAL[posicao] !== "") elemento.setAttribute("value", "X");
        if (QUADROORIGINAL[posicao] === "X") elemento.classList.add("X");
        if (QUADROORIGINAL[posicao] === "O") elemento.classList.add("O");
    }
}

function handlePlayer() {
    if (PLAYERVEZ === PLAYER_1) {
        hidenElement(".player-2", "mostrar");
        showElement(".player-1", "mostrar");
    } else {
        hidenElement(".player-1", "mostrar");
        showElement(".player-2", "mostrar");
    }
}

function handleModalAviso(msg, botao) {
    limparAviso();
    showElement(".modal-avisos", "mostrar");
    document.querySelector(".modal-avisos .msg").innerHTML = msg;
    addEvent("container-geral", () => fecharModalAviso);
    handleButton(botao);
}

function handleButton(botao) {
    let element = document.querySelector(".modal-avisos");
    element.innerHTML += botao;
    if (botao === simNaoElement) {
        addEvent("simNao", simNao);
    }
    if (botao === novoJogoElement) {
        addEvent("novo-jogo", resetar);
    }
}

// funções Logicas

init();

function init() {
    escolherJogador();
}

function escolherJogador() {
    showElement(".escolha-jogador", "mostrar");
    addEvent("botao", setJogador);
}

function setJogador() {
    PLAYER_1 = event.target.innerHTML;

    PLAYER_1 == "X" ? (PLAYER_2 = "O") : (PLAYER_2 = "X");

    const voceElement = document.querySelector(".voce");
    voceElement.classList.add(`${PLAYER_1}`);
    voceElement.querySelector("span").innerHTML = PLAYER_1;
    voceElement.querySelector(".pontos").innerHTML = pontosPlayer_1;


    const voceSpanElement = document.querySelector(".voce-span");
    voceSpanElement.classList.add(`${PLAYER_1}`);
    voceSpanElement.innerHTML = PLAYER_1;

    const computadorElement = document.querySelector(".computador");
    computadorElement.classList.add(`${PLAYER_2}`);
    computadorElement.querySelector("span").innerHTML = PLAYER_2;
    computadorElement.querySelector(".pontos").innerHTML = pontosPlayer_2;

    const computadorSpanElement = document.querySelector(".computador-span");
    computadorSpanElement.classList.add(`${PLAYER_2}`);
    computadorSpanElement.innerHTML = PLAYER_2;

    // atualizaPontos(player);

    if (PLAYER_1 === "X") {
        document.body.style.setProperty("--cor-player-1", `${CORVERMELHO}`);
        document.body.style.setProperty("--cor-player-2", `${CORVERDE}`);
    } else {
        document.body.style.setProperty("--cor-player-1", `${CORVERDE}`);
        document.body.style.setProperty("--cor-player-2", `${CORVERMELHO}`);
    }

    document.body.style.setProperty("--Player-1", `"${PLAYER_1}"`);

    hidenElement(".escolha-jogador", "mostrar");
    sortearPlayer();
}

function sortearPlayer() {
    showElement(".modal-sorteio", "mostrar");
    showElement(".cartas", "mostrar");

    const players = [PLAYER_1, PLAYER_2];

    let random = Math.floor(Math.random() * 2);

    PLAYERVEZ = players[random];
    if (PLAYERVEZ === "X") {
        document.body.style.setProperty("--cor-playerVez", `${CORVERMELHO}`);
    } else {
        document.body.style.setProperty("--cor-playerVez", `${CORVERDE}`);
    }
    animarSorteio();
    setTimeout(() => {
        iniciaPatida();
    }, 3000);
}

function iniciaPatida() {

    Object.keys(QUADROORIGINAL).forEach((casa) => {
        QUADROORIGINAL[casa] = "";
        let element = document.querySelector(`[data-item=${casa}]`);
        element.classList.remove("X", "O");
        element.setAttribute("value", "");
        element.setAttribute("data-vitoria", "");
    });
    hidenElement(".computador .pontos", "mostrar");
    hidenElement(".voce .pontos", "mostrar");

    NUNJOGADAS = 0;
    PLAYING.trocar;
    handleQuadro();
    if (PLAYER_2 === PLAYERVEZ) {
        document.querySelector(".grid-jogo").removeAttribute("value");
        removeEvent("item", jogar);
        jogadaMaquina();
    } else {
        document.querySelector(".grid-jogo").setAttribute("value", "X");
        addEvent("item", jogar);
    }
}

function animarSorteio() {

    (PLAYERVEZ == "X") ? document.body.style.setProperty("--rotation", "540deg"):
        document.body.style.setProperty("--rotation", "630deg");

    setTimeout(() => {
        hidenElement(".modal-sorteio", "mostrar");
        if (PLAYERVEZ == PLAYER_1) {
            showElement(".player-1", "mostra-player-sorteado");
        } else {
            showElement(".player-2", "mostra-player-sorteado");
        }
        setTimeout(() => {
            hidenElement(".player-1", "mostra-player-sorteado");
            hidenElement(".player-2", "mostra-player-sorteado");
            showElement(".playin", "mostrar");
            addEvent("reset", questionarResetar);
            addEvent("voltar", voltar);
            handlePlayer();
        }, 1500);
    }, 2400);
}

function animarVitoria(combinacao) {
    document.body.style.setProperty(
        "--rotation-vitoria",
        verificarSentido(combinacao)
    );

    combinacao.forEach((casa) => {
        let element = document.querySelector(`[data-item=${casa}]`);
        element.setAttribute("data-vitoria", "X");
    });
}

function verificarSentido(combinacao) {
    let posicoes = combinacao.toString().split("");

    if (posicoes[0] == posicoes[3]) {
        document.body.style.setProperty("--tamanhoBefore", "105px");
        return "90deg";
    }
    if (posicoes[1] == posicoes[4]) {
        document.body.style.setProperty("--tamanhoBefore", "105px");
        return "0";
    }
    if (posicoes[1] < posicoes[4] && posicoes[0] === "a") {

        document.body.style.setProperty("--tamanhoBefore", "140px");
        return "135deg";
    }
    if (posicoes[1] < posicoes[4]) {

        document.body.style.setProperty("--tamanhoBefore", "140px");
        return "45deg";
    }
}

function jogar({ target }) {


    if (PLAYING.status[PLAYING.index] && target.innerHTML === "") {
        let casa = target.getAttribute("data-item");
        adicionaElemento(casa);
    }
}

function adicionaElemento(casa) {

    QUADROORIGINAL[casa] = PLAYERVEZ;
    handleQuadro();

    if (verificarVitoria(PLAYERVEZ)) {
        if (PLAYERVEZ === PLAYER_1) {
            pontosPlayer_1++;
            atualizaPontos();
            showElement(".voce .pontos", "mostrar");
            setTimeout(() => {
                handleModalAviso(`Parabéns você ganhou!!`, novoJogoElement);

            }, 2000);

        } else {
            pontosPlayer_2++;
            atualizaPontos();
            showElement(".computador .pontos", "mostrar");
            setTimeout(() => {
                handleModalAviso(`Você perdeu!!`, novoJogoElement);

            }, 2000);
        }
        PLAYING.trocar();
    } else if (NUNJOGADAS == 8) {

        WARNING = "JOGO EMPATADO";
        handleModalAviso("Jogo<br>empatou!", novoJogoElement);
        // PLAYING.trocar();
    }
    trocarPlayer();
    NUNJOGADAS++;

}

function trocarPlayer() {

    if (NUNJOGADAS <= 9) {
        if (PLAYERVEZ === PLAYER_1) {
            document.querySelector(".grid-jogo").removeAttribute("value");
            removeEvent("item", jogar);
            PLAYERVEZ = PLAYER_2;
            jogadaMaquina();
            handlePlayer();
        } else {
            PLAYERVEZ = PLAYER_1;
            document.querySelector(".grid-jogo").setAttribute("value", "X");
            addEvent("item", jogar);
            handlePlayer();
        }

        if (PLAYERVEZ === "X") {
            document.body.style.setProperty("--cor-playerVez", `${CORVERMELHO}`);
        } else {
            document.body.style.setProperty("--cor-playerVez", `${CORVERDE}`);
        }
    }
}

function fecharModalAviso() {
    hidenElement(".modal-avisos", "mostrar");
    limparAviso();
}

function simNao({ target }) {
    if (target.className === "sim") {
        pontosPlayer_2++;
        atualizaPontos();
        resetar()
    }
    fecharModalAviso();
}

function limparAviso() {
    document.querySelector(".modal-avisos").innerHTML = msgElement;
}

function verificarVitoria(player) {

    for (combinacao of COMBINACOESVITORIA) {
        let combinacaoArray = combinacao.split(",");
        let temVendecor = combinacaoArray.every(
            (casa) => QUADROORIGINAL[casa] === player
        );
        if (temVendecor) {
            animarVitoria(combinacaoArray);

            return true;
        }
    }
    return false;
}

function ehGameOver() {

    return NUNJOGADAS === 8;
}

function questionarResetar() {
    if (!ehGameOver() || !PLAYING.status[PLAYING.index]) {

        let msg = "O jogo não terminou<br>se resetar vai perder a partida!";

        handleModalAviso(msg, simNaoElement);
    } else {
        resetar();
    }
}

function resetar() {
    fecharModalAviso();
    iniciaPatida();
    PLAYING.index = 1;
    sortearPlayer();
    handleQuadro(QUADROORIGINAL);
}

function voltar() {
    hidenElement(".playin", "mostrar");
    hidenElement(".player-1", "mostrar");
    fecharModalAviso();
    hidenElement(".player-2", "mostrar");
    showElement(".escolha-jogador", "mostrar");

    const voceElement = document.querySelector(".voce-span");
    voceElement.classList.remove("X", "O");

    const computadorElement = document.querySelector(".computador-span");
    computadorElement.classList.remove("X", "O");


    const voce = document.querySelector(".placar.voce");
    voce.classList.remove("X", "O");

    const computador = document.querySelector(".placar.voce");
    computador.classList.remove("X", "O");

}

function atualizaPontos() {
    localStorage.setItem("pontosPlayer_1", pontosPlayer_1);
    localStorage.setItem("pontosPlayer_2", pontosPlayer_2);

    document.querySelector(".voce .pontos").innerHTML = pontosPlayer_1;
    document.querySelector(".computador .pontos").innerHTML = pontosPlayer_2;
}



// melhorar code

function jogadaMaquina() {

    setTimeout(() => {

        if (PLAYING) {

            if (NUNJOGADAS == 0) {
                adicionaElemento(posicoes[Math.floor(Math.random() * 9)]);
                return;
            }

            if ((NUNJOGADAS == 1 && QUADROORIGINAL.b2 == "")) {
                adicionaElemento("b2");
                return;
            }
            jogadas = possibilidadeVitoria(PLAYER_2, QUADROORIGINAL);

            if (jogadas) {
                adicionaElemento(jogadas.join(""));
            } else {
                jogadas = possibilidadeVitoria(PLAYER_1, QUADROORIGINAL);
                if (jogadas) {
                    adicionaElemento(jogadas.join(""));
                } else {
                    jogadas = simulaJogada();
                    casa = melhorjogadasMaquina(jogadas);
                    adicionaElemento(casa);
                }
            }
        }
    }, TEMPOCOMPUTADOR);
}

function melhorjogadasMaquina(jogadas) {
    let max = Object.keys(jogadas).reduce((prev, current) =>
        jogadas[prev] >= jogadas[current] ? prev : current
    );
    return max;
}

function simulaJogada() {
    let possivelJogadas = ({} = Object.keys(QUADROORIGINAL).filter(
        (casa) => QUADROORIGINAL[casa] === ""
    ));
    let jogadas;

    possivelJogadas.forEach((casa) => {
        let quadroSimulacao = {...QUADROORIGINAL };
        quadroSimulacao[casa] = PLAYER_2;
        if (!possibilidadeVitoria(PLAYER_2, quadroSimulacao)) {
            jogadas = {...jogadas, [casa]: 10 };
        } else {
            jogadas = {...jogadas, [casa]: 20 };
        }
    });
    return jogadas;
}

function jogadasRealizadas(jogador) {
    return Object.keys(QUADROORIGINAL).reduce(
        (a, e, i) => (QUADROORIGINAL[e] === jogador ? a.concat(e) : a), []
    );
}

function possibilidadeVitoria(jogador, quadro) {
    let jogadas = "";

    for (let w in COMBINACOESVITORIA) {
        let pArray = COMBINACOESVITORIA[w].split(",");

        let posivVit = pArray.filter((casa) => quadro[casa] === jogador);

        let todosCheios = pArray.every((casa) => QUADROORIGINAL[casa] !== "");

        if (!todosCheios) {
            if (posivVit.length > 1) {
                jogadas = pArray.filter((casa) => quadro[casa] === "");
                if (jogadas.length) {
                    return jogadas;
                }
            }
        }
    }
}

function apareceMais() {
    let maisChance = []
    Object.keys(QUADROORIGINAL).forEach((casa) => {
        let contador = 0;

        COMBINACOESVITORIA.forEach((combinacao) => {

            if (combinacao.split(",").includes(casa)) {
                contador++;
            };

        });
        maisChance[casa] = contador;


    });
}