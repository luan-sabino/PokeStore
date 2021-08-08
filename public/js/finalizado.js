function calculaTempoDeEntrega(){
    document.getElementById("tempoEntrega").textContent = "O tempo previsto de entrega é de " +
    (Math.floor(Math.random() * (8 - 3)) + 3) + " dias.";
}

function finalizacaoDaCompra() {
    listaResumoDaCompra();
    calculaTempoDeEntrega();
    limpaOCarrinho();
}