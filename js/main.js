myStorage = window.localStorage;

var carrinho = [];

function loadStorage() {
    myStorage.setItem("carrinho", JSON.stringify(carrinho));
}

if (document.querySelector("body").id == "index") {
    window.onload = adcProdutos;
    window.onunload = loadStorage;
} else if (document.querySelector("body").id == "carrinho") {
    var submit = document.getElementById("dadosUsuario");
    submit.addEventListener('submit', vaiProFim);
    window.onload = listaProdutos;
    window.onunload = loadStorage;
} else if (document.querySelector("body").id == "final") {
    window.onload = listaResumo;
}

var produtos = [
    { nome: "Araquanid", categoria: "Agua", preco: 75.20, imgpath: "img/752Araquanid.png" },
    { nome: "Barraskewda", categoria: "Agua", preco: 84.70, imgpath: "img/847Barraskewda.png" },
    { nome: "Cramorant", categoria: "Agua", preco: 84.50, imgpath: "img/845Cramorant.png" },
    { nome: "Dracovish", categoria: "Agua", preco: 88.20, imgpath: "img/882Dracovish.png" },
    { nome: "Empoleon", categoria: "Agua", preco: 39.50, imgpath: "img/395Empoleon.png" },
    { nome: "Blaziken", categoria: "Fogo", preco: 25.70, imgpath: "img/257Blaziken.png" },
    { nome: "Cyndaquil", categoria: "Fogo", preco: 15.50, imgpath: "img/155Cyndaquil.png" },
    { nome: "Flareon", categoria: "Fogo", preco: 13.60, imgpath: "img/136Flareon.png" },
    { nome: "Growlithe", categoria: "Fogo", preco: 5.80, imgpath: "img/058Growlithe.png" },
    { nome: "Houndoom", categoria: "Fogo", preco: 22.90, imgpath: "img/229Houndoom.png" },
    { nome: "Bayleef", categoria: "Grama", preco: 15.30, imgpath: "img/153Bayleef.png" },
    { nome: "Celebi", categoria: "Grama", preco: 25.10, imgpath: "img/251Celebi.png" },
    { nome: "Gogoat", categoria: "Grama", preco: 67.30, imgpath: "img/673Gogoat.png" },
    { nome: "Leafeon", categoria: "Grama", preco: 47.00, imgpath: "img/470Leafeon.png" },
    { nome: "Maractus", categoria: "Grama", preco: 55.60, imgpath: "img/556Maractus.png" },
    { nome: "Armaldo", categoria: "Inseto", preco: 34.80, imgpath: "img/348Armaldo.png" },
    { nome: "Beautifly", categoria: "Inseto", preco: 26.70, imgpath: "img/267Beautifly.png" },
    { nome: "Charjabug", categoria: "Inseto", preco: 73.70, imgpath: "img/737Charjabug.png" },
    { nome: "Dottler", categoria: "Inseto", preco: 82.50, imgpath: "img/825Dottler.png" },
    { nome: "Escavalier", categoria: "Inseto", preco: 58.90, imgpath: "img/589Escavalier.png" }
]

produtos.sort(() => Math.random() - 0.5);

function filtraProduto(ctg) {

    if (ctg == "Todos") {
        document.getElementById("produtos").innerHTML = '';
        adcProdutos();
    }
    else {
        var produtosFiltrados = produtos.filter(function (el) { return el.categoria == ctg });
        document.getElementById("produtos").innerHTML = '';
        for (var produto of produtosFiltrados) {
            divConstrutor(produto);
        }
    }

}

function divConstrutor(produto) {
    var divProdutos = document.getElementById("produtos");
    var divProduto = document.createElement("div");
    divProduto.className = "produto";
    var id = (produto.imgpath).slice(4, 7);
    divProduto.id = id;
    var imgref = document.createElement("img");
    imgref.setAttribute("src", produto.imgpath);

    var divDescProduto = document.createElement("div");
    divDescProduto.className = "desc-produto";

    var spanNome = document.createElement("span");
    spanNome.textContent = produto.nome;

    var spanCtg = document.createElement("span");
    spanCtg.textContent = produto.categoria;

    var spanPreco = document.createElement("span");
    spanPreco.textContent = "R$" + produto.preco;

    divDescProduto.appendChild(spanNome);
    divDescProduto.appendChild(spanCtg);
    divDescProduto.appendChild(spanPreco);

    divProduto.appendChild(imgref);
    divProduto.appendChild(divDescProduto);

    var addCarBtn = document.createElement("a");
    addCarBtn.setAttribute("onClick", "getProduto(this.parentNode.id);");
    addCarBtn.textContent = "Adicionar ao carrinho";

    divProduto.appendChild(addCarBtn);

    divProdutos.appendChild(divProduto);
}

function adcProdutos() {
    for (var produto of produtos) {
        divConstrutor(produto);
    }
    carrinho = JSON.parse(localStorage.getItem("carrinho"));
}

function getProduto(event) {
    var divProduto = document.getElementById(event);
    var nomeProduto = divProduto.querySelector(".desc-produto");
    nomeProduto = nomeProduto.querySelector("span").textContent;
    console.log(nomeProduto);
    carrinho.push(produtos.find(function (el) { return el.nome == nomeProduto }));
    myStorage.setItem("carrinho", JSON.stringify(carrinho));

}

function listaConstrutor(produto) {
    var divProdutos = document.getElementById("produtos");

    var divProduto = document.createElement("div");
    divProduto.className = "produto";

    var imgref = document.createElement("img");
    imgref.setAttribute("src", produto.imgpath);

    var div = document.createElement("div");

    var nome = document.createElement("span");
    nome.textContent = produto.nome;

    var preco = document.createElement("span");
    preco.textContent = "R$" + produto.preco;

    divProduto.appendChild(imgref);
    div.appendChild(nome);
    div.appendChild(preco);

    divProduto.appendChild(div);
    divProdutos.appendChild(divProduto);
}

function listaProdutos() {

    carrinho = JSON.parse(localStorage.getItem("carrinho"));
    verificaCarrinho();
    for (var produto of carrinho) {
        listaConstrutor(produto);
    }

}

function limpaCarrinho() {
    carrinho = [];
    document.getElementById("produtos").innerHTML = '';
    verificaCarrinho();
}

function listaResumo() {

    carrinho = JSON.parse(localStorage.getItem("carrinho"));

    var divProdutos = document.getElementById("produtos");

    for (var produto of carrinho) {
        var produtoNome = document.createElement("span");
        produtoNome.textContent = produto.nome;
        divProdutos.appendChild(produtoNome);
    }

    document.getElementById("tempoEntrega").textContent = "O tempo previsto de entrega é de " +
        (Math.floor(Math.random() * (8 - 3)) + 3) + " dias.";

    carrinho = [];
    myStorage.setItem("carrinho", carrinho);

}

function vaiProFim(event) {
    event.preventDefault();
    window.location.href = "finalizado.html";

    var data = new FormData(event.target);
    var usuario = {
        nome: data.get("fpNome"),
        sobrenome: data.get("fsNome"),
        cpf: data.get("fCPF"),
        cidade: data.get("fcidade"),
        bairro: data.get("fbairro"),
        endereco: data.get("fendereco"),
        numero: data.get("fnumero"),
        complemento: data.get("fcomplemento"),
        cep: data.get("fcep")
    }

    myStorage.setItem("usuario", JSON.stringify(usuario));

}

function verificaCarrinho() {
    if (carrinho.length < 1) {
        var submitBtn = document.getElementById("sendSubmit");
        submitBtn.disabled = true;
    }
}