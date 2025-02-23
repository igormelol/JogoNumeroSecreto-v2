// let numeroSecreto = parseInt(Math.random() * 11)
// let tentativas = 1
// let chute

// while (chute != numeroSecreto) {
//     let chute = prompt('Escolha um número entre 1 e 10')
//     if (chute == numeroSecreto) {
//         break
//     } else {
//         if (chute > numeroSecreto) {
//             alert('O número secreto é menor')
//         } else {
//             alert('O número secreto é maior')
//         }
//     }
//     tentativas++
// }

// let palavraTentativa = tentativas > 1 ? 'tentativas' : 'tentativa' 
// alert(`O número secreto era ${numeroSecreto} e você acertou com apenas ${tentativas} ${palavraTentativa}`)

let numeroSecreto;
let tentativas = 0;
let gameTimer;
let seconds = 0;
let maxNumber = 5000;
let isGameActive = true;

// Sound effects
const successSound = new Audio('success.mp3');
const errorSound = new Audio('error.mp3');
// Configurações do jogo
const DIFICULDADES = {
    easy: { max: 100, dicas: 3, nome: 'Fácil' },
    medium: { max: 1000, dicas: 2, nome: 'Médio' },
    hard: { max: 5000, dicas: 1, nome: 'Difícil' }
};

// Estado do jogo
const estado = {
    numeroSecreto: 0,
    tentativas: 0,
    dicasRestantes: 0,
    dificuldade: 'medium',
    tempoInicio: 0,
    intervaloTimer: null
};
// Adicionar às configurações do jogo
const TEMPO_LIMITE = {
    easy: 60,    // 60 segundos para modo fácil
    medium: 90,  // 90 segundos para modo médio
    hard: 120    // 120 segundos para modo difícil
};

// Adicionar ao estado do jogo
estado.modoTempo = false;
estado.tempoRestante = 0;

function iniciarModoTempo() {
    estado.modoTempo = true;
    setDifficulty('easy'); // Começa com o modo fácil
}
// Adicionar função setDifficulty que estava faltando
function setDifficulty(nivel) {
    if (DIFICULDADES[nivel]) {
        estado.dificuldade = nivel;
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        document.getElementById('victory-screen').style.display = 'none';
        document.getElementById('high-scores').style.display = 'none';
        iniciarJogo();
    }
}

// Adicionar função iniciarJogo que estava faltando
function iniciarJogo() {
    estado.numeroSecreto = Math.floor(Math.random() * DIFICULDADES[estado.dificuldade].max) + 1;
    estado.tentativas = 0;
    estado.tempoInicio = Date.now();
    estado.dicasRestantes = DIFICULDADES[estado.dificuldade].dicas;

    atualizarInterface();
    iniciarTimer();
    console.log("Número secreto:", estado.numeroSecreto); // Para debug
}

// Adicionar função atualizarInterface que estava faltando
function atualizarInterface() {
    document.getElementById('attempts').textContent = '0';
    document.getElementById('timer').textContent = '0:00';
    document.getElementById('game-message').textContent = 
        `Escolha um número entre 1 e ${DIFICULDADES[estado.dificuldade].max}`;
}
// Adicionar no início do arquivo, após as configurações iniciais
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('user-guess');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkGuess();
                e.preventDefault(); // Previne o comportamento padrão do Enter
            }
        });
    }
    mostrarTelaInicial();
});
function reiniciarJogo() {
    if (estado.intervaloTimer) {
        clearInterval(estado.intervaloTimer);
    }
    estado.modoTempo = false;
    estado.tempoRestante = 0;
    document.getElementById('timer').classList.remove('timer-warning');
    mostrarTelaInicial();
}
function iniciarTimer() {
    if (estado.intervaloTimer) clearInterval(estado.intervaloTimer);
    let segundos = 0;
    
    if (estado.modoTempo) {
        segundos = TEMPO_LIMITE[estado.dificuldade];
        estado.tempoRestante = segundos;
    }
    
    estado.intervaloTimer = setInterval(() => {
        if (estado.modoTempo) {
            segundos--;
            if (segundos <= 0) {
                clearInterval(estado.intervaloTimer);
                gameOver();
            }
            if (segundos <= 10) {
                document.getElementById('timer').classList.add('timer-warning');
            }
        } else {
            segundos++;
        }
        
        const minutos = Math.floor(Math.abs(segundos) / 60);
        const segsRestantes = Math.abs(segundos) % 60;
        document.getElementById('timer').textContent = 
            `${minutos}:${segsRestantes.toString().padStart(2, '0')}`;
    }, 1000);
}
function gameOver() {
    clearInterval(estado.intervaloTimer);
    alert('Tempo esgotado! O número secreto era ' + estado.numeroSecreto);
    mostrarTelaInicial();
}
// Atualizar a função calcularPontuacao
function calcularPontuacao() {
    const tempoTotal = (Date.now() - estado.tempoInicio) / 1000;
    const pontuacaoBase = DIFICULDADES[estado.dificuldade].max;
    let pontuacao = Math.round(
        pontuacaoBase * (1 - (estado.tentativas / 50)) * (1 - (tempoTotal / 300))
    );
    
    // Bônus para modo tempo
    if (estado.modoTempo) {
        const tempoRestante = estado.tempoRestante;
        pontuacao += Math.round(tempoRestante * 10); // Bônus por tempo restante
    }
    
    return Math.max(pontuacao, 0);
}
// Atualizar a função checkGuess
function checkGuess() {
    const input = document.getElementById('user-guess');
    const chute = parseInt(input.value);
    const gameMessage = document.getElementById('game-message');
    
    // Limpar o input imediatamente após pegar o valor
    input.value = '';
    input.focus();
    
    if (!chute || chute < 1 || chute > DIFICULDADES[estado.dificuldade].max) {
        errorSound.play().catch(err => console.log('Erro ao tocar som:', err));
        alert('Por favor, digite um número válido!');
        return;
    }

    estado.tentativas++;
    document.getElementById('attempts').textContent = estado.tentativas;

    if (chute === estado.numeroSecreto) {
        successSound.play().catch(err => console.log('Erro ao tocar som:', err));
        vitoria();
    } else {
        errorSound.play().catch(err => console.log('Erro ao tocar som:', err));
        const ehMaior = chute > estado.numeroSecreto;
        const dica = ehMaior ? 'MENOR' : 'MAIOR';
        
        // Remove classes antigas
        gameMessage.classList.remove('pulse-grow', 'pulse-shrink');
        
        // Adiciona nova classe baseada na dica
        gameMessage.classList.add(ehMaior ? 'pulse-shrink' : 'pulse-grow');
        
        gameMessage.textContent = `O número secreto é ${dica} que ${chute}`;
        atualizarBarraProgresso(chute);
        
        // Reinicia a animação após um breve delay
        setTimeout(() => {
            gameMessage.classList.remove('pulse-grow', 'pulse-shrink');
            void gameMessage.offsetWidth; // Força o reflow
            gameMessage.classList.add(ehMaior ? 'pulse-shrink' : 'pulse-grow');
        }, 100);
    }
}
function atualizarBarraProgresso(chute) {
    const distanciaMaxima = DIFICULDADES[estado.dificuldade].max;
    const distanciaAtual = Math.abs(chute - estado.numeroSecreto);
    const porcentagem = 100 - (distanciaAtual / distanciaMaxima * 100);
    
    const barra = document.getElementById('progress-bar');
    const textoTemperatura = document.querySelector('.temperature-text');
    const gameMessage = document.getElementById('game-message');
    
    barra.style.width = `${porcentagem}%`;
    
    // Feedback visual melhorado baseado na proximidade
    if (porcentagem > 95) {
        barra.style.backgroundColor = '#ff0000';
        barra.style.boxShadow = '0 0 20px #ff0000';
        textoTemperatura.textContent = 'FERVENDO! 🔥🔥🔥';
        gameMessage.style.color = '#ff0000';
        gameMessage.style.fontSize = '28px';
    } else if (porcentagem > 85) {
        barra.style.backgroundColor = '#ff4400';
        barra.style.boxShadow = '0 0 15px #ff4400';
        textoTemperatura.textContent = 'Muito Quente! 🔥🔥';
        gameMessage.style.color = '#ff4400';
        gameMessage.style.fontSize = '26px';
    } else if (porcentagem > 70) {
        barra.style.backgroundColor = '#ff6600';
        barra.style.boxShadow = '0 0 10px #ff6600';
        textoTemperatura.textContent = 'Quente! 🔥';
        gameMessage.style.color = '#ff6600';
        gameMessage.style.fontSize = '24px';
    } else if (porcentagem > 50) {
        barra.style.backgroundColor = '#ffcc00';
        barra.style.boxShadow = '0 0 5px #ffcc00';
        textoTemperatura.textContent = 'Morno 😊';
        gameMessage.style.color = '#ffcc00';
        gameMessage.style.fontSize = '22px';
    } else {
        barra.style.backgroundColor = '#00ccff';
        barra.style.boxShadow = 'none';
        textoTemperatura.textContent = 'Frio ❄️';
        gameMessage.style.color = '#00ccff';
        gameMessage.style.fontSize = '20px';
    }

    // Adiciona animação de pulso quando estiver muito próximo
    if (porcentagem > 95) {
        barra.classList.add('pulse');
        textoTemperatura.classList.add('pulse');
    } else {
        barra.classList.remove('pulse');
        textoTemperatura.classList.remove('pulse');
    }
}
// Adicionar após as configurações iniciais
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Atualizar a função vitoria
function vitoria() {
    clearInterval(estado.intervaloTimer);
    const tempoTotal = Math.floor((Date.now() - estado.tempoInicio) / 1000);
    const pontuacao = calcularPontuacao();
    
    salvarRecorde(pontuacao);
    createConfetti(); // Adicionar confetes
    
    const gameScreen = document.getElementById('game-screen');
    const victoryScreen = document.getElementById('victory-screen');
    
    gameScreen.classList.remove('screen-active');
    setTimeout(() => {
        gameScreen.style.display = 'none';
        victoryScreen.style.display = 'block';
        createConfetti();
        setTimeout(() => victoryScreen.classList.add('screen-active'), 50);
    }, 500);
    
    document.getElementById('victory-message').innerHTML = `
        <div class="victory-content">
            🎉 Número secreto: ${estado.numeroSecreto}<br>
            🎯 Tentativas: ${estado.tentativas}<br>
            ⏱️ Tempo: ${Math.floor(tempoTotal / 60)}m ${tempoTotal % 60}s<br>
            ⭐ Pontuação: ${pontuacao} pontos
        </div>
    `;
}
function showHighScores() {
    const recordes = JSON.parse(localStorage.getItem('recordes') || '[]');
    const highScoresScreen = document.getElementById('high-scores');
    
    // Reset any previous content
    highScoresScreen.innerHTML = `
        <h1>🏆 Recordes</h1>
        <div id="scores-list">
            ${recordes.length === 0 ? 
                '<p class="score-item">Nenhum recorde ainda!</p>' : 
                recordes.map((recorde, index) => `
                    <div class="score-item">
                        <span class="position">#${index + 1}</span>
                        <div class="details">
                            <span>Número: ${recorde.numeroSecreto}</span>
                            <span>Tentativas: ${recorde.tentativas}</span>
                            <span>Tempo: ${Math.floor(recorde.tempo / 60)}:${(recorde.tempo % 60).toString().padStart(2, '0')}</span>
                            <span>Dificuldade: ${DIFICULDADES[recorde.dificuldade].nome}</span>
                            <span>Data: ${recorde.data}</span>
                        </div>
                        <span class="score">${recorde.pontuacao} pts</span>
                    </div>
                `).join('')
            }
        </div>
        <button class="container__botao" onclick="hideHighScores()">Voltar</button>
    `;

    // Hide other screens
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('victory-screen').style.display = 'none';
    
    // Show high scores screen with animation
    highScoresScreen.style.display = 'block';
    setTimeout(() => highScoresScreen.classList.add('screen-active'), 50);
}
function hideHighScores() {
    document.getElementById('high-scores').style.display = 'none';
    mostrarTelaInicial();
}
// Função para calcular pontuação
function calcularPontuacao() {
    const tempoTotal = (Date.now() - estado.tempoInicio) / 1000;
    const pontuacaoBase = DIFICULDADES[estado.dificuldade].max;
    const pontuacao = Math.round(
        pontuacaoBase * (1 - (estado.tentativas / 50)) * (1 - (tempoTotal / 300))
    );
    return Math.max(pontuacao, 0);
}
// Move as funções de recordes para fora da função vitoria
function salvarRecorde(pontuacao) {
    const recordes = JSON.parse(localStorage.getItem('recordes') || '[]');
    const novoRecorde = {
        pontuacao,
        tentativas: estado.tentativas,
        tempo: Math.round((Date.now() - estado.tempoInicio) / 1000),
        dificuldade: estado.dificuldade,
        data: new Date().toLocaleString('pt-BR'),
        numeroSecreto: estado.numeroSecreto
    };

    recordes.push(novoRecorde);
    recordes.sort((a, b) => b.pontuacao - a.pontuacao);
    localStorage.setItem('recordes', JSON.stringify(recordes.slice(0, 10)));
}
function mostrarTelaInicial() {
    const screens = ['start-screen', 'game-screen', 'victory-screen', 'high-scores'];
    screens.forEach(screen => {
        const element = document.getElementById(screen);
        if (screen === 'start-screen') {
            element.style.display = 'block';
            setTimeout(() => element.classList.add('screen-active'), 50);
        } else {
            element.classList.remove('screen-active');
            setTimeout(() => element.style.display = 'none', 500);
        }
    });
}
// Corrigir a função iniciarTimer para suportar modo tempo
function setDifficulty(nivel) {
    if (DIFICULDADES[nivel]) {
        estado.dificuldade = nivel;
        const startScreen = document.getElementById('start-screen');
        const gameScreen = document.getElementById('game-screen');
        
        startScreen.classList.remove('screen-active');
        setTimeout(() => {
            startScreen.style.display = 'none';
            gameScreen.style.display = 'block';
            setTimeout(() => gameScreen.classList.add('screen-active'), 50);
        }, 500);
        
        iniciarJogo();
    }
}


