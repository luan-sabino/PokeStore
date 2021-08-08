document.querySelector("#index > div.filtros > div.categorias").addEventListener('click', (ev)=>{
    if(ev.target.className != "categorias")
        filtraProdutosPorCategoria(ev.target.textContent);
})

function filtraProdutosPorCategoria(ctg) {

    if (ctg == "Todos") {
        document.getElementById("produtos").innerHTML = '';
        renderizaProdutosNaInterface(produtos);
    }
    else {
        var produtosFiltrados = produtos.filter(function (el) { return el.categoria == ctg });
        document.getElementById("produtos").innerHTML = '';
        for (var produto of produtosFiltrados) {
            renderizarCardDoProduto(produto);
        }
    }

}

function adicionaProdutoAoCarrinho(event) {
    var produtoCard = document.getElementById(event);

    var nomeDoProduto = produtoCard.querySelector(".desc-produto > span").textContent;

    if(!existemProdutosNoCarrinho()){
        let carrinho = [];
        carrinho.push(produtos.find(function (el) { return el.nome == nomeDoProduto }))
        persisteCarrinho(carrinho)
    }else{
        let carrinho = JSON.parse(cacheStorage.getItem("carrinho"));
        carrinho.push(produtos.find(function (el) { return el.nome == nomeDoProduto }))
        persisteCarrinho(carrinho)
    }

}

var ordenacao = document.querySelector("#ordernar_por");
ordenacao.addEventListener('change', (ev)=>{ 
    value = ev.target.value;
    document.querySelector(".produtos").innerHTML = "";

    if(value == 'menor'){
        organizaArrayDoMenorProMaior(produtos);
        renderizaProdutosNaInterface(produtos);
    }else if( value == 'maior'){
        organizaArrayDoMenorProMaior(produtos);
        produtos.reverse();
        renderizaProdutosNaInterface(produtos);
    }else{
        renderizaProdutosNaInterface(produtos);
    }
});

function organizaArrayDoMenorProMaior(array){
    array.sort((a, b)=>{
        return a.preco - b.preco;
    })
}