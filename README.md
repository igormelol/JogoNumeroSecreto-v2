
**Um simples jogo de adivinhação em JavaScript.**

## Como Jogar
1. **Inicie o arquivo:** Abra este arquivo em um navegador compatível com JavaScript.
2. **Adivinhe o número:** Siga as instruções na tela e digite seu chute.
3. **Receba dicas:** O jogo fornecerá dicas sobre se seu chute foi alto ou baixo.
4. **Continue tentando:** Adivinhe até acertar o número secreto!

## Como Funciona
Este jogo gera um número aleatório entre 0 e 5000. O jogador precisa adivinhar esse número em quantas tentativas conseguir. A cada tentativa, o jogador recebe uma dica indicando se o número secreto é maior ou menor que o chute.

## Código
O código fonte está escrito em JavaScript puro e é relativamente simples de entender. As principais partes do código incluem:

* **Geração do número secreto:** Utiliza a função `Math.random()` para gerar um número aleatório.
* **Loop principal:** Um loop `while` continua até que o jogador acerte o número.
* **Verificação do chute:** Compara o chute do jogador com o número secreto e fornece feedback.
* **Contagem de tentativas:** Conta o número de tentativas que o jogador levou para acertar.


