function renderizarCardDoProduto(produto) {
    var containerDeProdutos = document.getElementById("produtos");
    
    var produtoCard = document.createElement("div");
    produtoCard.className = "produto";

    var idDoProduto = (produto.imgpath).slice(4, 7);
    produtoCard.id = idDoProduto;

    var imgref = document.createElement("img");
    imgref.setAttribute("src", produto.imgpath);

    var containerDaDescricaoDoProduto = document.createElement("div");
    containerDaDescricaoDoProduto.className = "desc-produto";

    var nomeDoProduto = document.createElement("span");
    nomeDoProduto.textContent = produto.nome;

    var categoriaDoProduto = document.createElement("span");
    categoriaDoProduto.textContent = produto.categoria;

    var precoDoProduto = document.createElement("span");
    precoDoProduto.textContent = "R$" + produto.preco;

    containerDaDescricaoDoProduto.appendChild(nomeDoProduto);
    containerDaDescricaoDoProduto.appendChild(categoriaDoProduto);
    containerDaDescricaoDoProduto.appendChild(precoDoProduto);

    produtoCard.appendChild(imgref);
    produtoCard.appendChild(containerDaDescricaoDoProduto);

    var btnDeAdicionarProdutoAoCarrinho = document.createElement("a");
    btnDeAdicionarProdutoAoCarrinho.addEventListener('click', (ev)=>{
        adicionaProdutoAoCarrinho(ev.target.parentNode.id);
    })
    btnDeAdicionarProdutoAoCarrinho.textContent = "Adicionar ao carrinho";

    produtoCard.appendChild(btnDeAdicionarProdutoAoCarrinho);

    containerDeProdutos.appendChild(produtoCard);
}

function renderizaProdutosNaInterface(arrayDeProdutos) {
    for (var produto of arrayDeProdutos) {
        renderizarCardDoProduto(produto);
    }
}

function renderizaListaDeProdutosNoCarrinho() {

    if(existemProdutosNoCarrinho()){
        let carrinho = JSON.parse(localStorage.getItem("carrinho"));
        for (var produto of carrinho) {
            renderizaProdutoNaLista(produto);
        }
    }else{
        document.querySelector(".produtos").innerHTML = ""
    }

}

function renderizaProdutoNaLista(produto) {
    var containerDaListaDeProdutos = document.getElementById("produtos");

    var produtoCard = document.createElement("div");
    produtoCard.className = "produto";

    var imgref = document.createElement("img");
    imgref.setAttribute("src", produto.imgpath);

    var containerDaDescricaoDoProduto = document.createElement("div");

    var nomeDoProduto = document.createElement("span");
    nomeDoProduto.textContent = produto.nome;

    var precoDoProduto = document.createElement("span");
    precoDoProduto.textContent = "R$" + produto.preco;

    produtoCard.appendChild(imgref);
    containerDaDescricaoDoProduto.appendChild(nomeDoProduto);
    containerDaDescricaoDoProduto.appendChild(precoDoProduto);

    produtoCard.appendChild(containerDaDescricaoDoProduto);
    containerDaListaDeProdutos.appendChild(produtoCard);
}

function renderizaModalDeLoginECadastro(modalValue = "entrar"){
    
    let body = document.querySelector('body');
    if(document.querySelector("#modalHandler") == null){
        let modalHandler = document.createElement("div");
        modalHandler.id="modalHandler";
        body.appendChild(modalHandler);
    }

    let modalCardLogin = `
    <div class="modal-bg">
        <div class="modal">
            <form class="inputs-user" id="inputs-user" action="javascript:void(0);" onsubmit="logarUsuario();" method="POST">
                <input type="email" name="email" id="emailCadastro" placeholder="Email" required autocomplete="username">
                <input type="password" name="password" id="senhaCadastro" placeholder="Senha" required minlength="5" autocomplete="current-password">
            </form>        
            <div>
                <input type="submit" form="inputs-user" value="Entrar"/>
                <a onclick="renderizaModalDeLoginECadastro('cadastrar')">Cadastrar</a>
            </div>
        </div>
    </div>`

    let regexCPF = "([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})";
    let modalCardCadastro = `
    <div class="modal-bg">
        <div class="modal">
            <form class="inputs-user" id="inputs-user-reg" action="javascript:void(0);" onsubmit="cadastrarUsuario();" method="POST">
                <input type="text" name="nome" id="nomeCompleto" placeholder="Nome Completo" required minlength="5">
                <input type="text" name="cpf" id="cpfCadastro" placeholder="CPF" pattern="${regexCPF}" required>
                <input type="email" name="email" id="emailCadastro" placeholder="Email" required autocomplete="username">
                <input type="password" name="password" id="senhaCadastro" placeholder="Senha" required minlength="5" autocomplete="current-password">
            </form>
            <div>
            <input type="submit" form="inputs-user-reg" value="Cadastrar"/>
            </div>
        </div>
    </div>`


    if(modalValue == "entrar"){
        document.querySelector("#modalHandler").insertAdjacentHTML('beforeend', modalCardLogin);
        document.querySelector(".modal-bg").addEventListener('click', fechaModal);

        
    }
    else if(modalValue == "cadastrar"){
        document.querySelector("#modalHandler").innerHTML = "";
        document.querySelector("#modalHandler").innerHTML = modalCardCadastro;
        document.querySelector(".modal-bg").addEventListener('click', fechaModal);
    }

}

function fechaModal(e){
    if(e.target == document.querySelector(".modal-bg")){
        fadeOutOnClose(e).then(
            ()=>{
                if(e.target == document.querySelector(".modal-bg"))
                        document.querySelector("#modalHandler").innerHTML = "";
            }
        );
    }
}

function listaResumoDaCompra(){
    let carrinho = JSON.parse(cacheStorage.getItem("carrinho"));

    var containerDoResumo = document.getElementById("produtos");

    for (var produto of carrinho) {
        var produtoNome = document.createElement("span");
        produtoNome.textContent = produto.nome;
        containerDoResumo.appendChild(produtoNome);
    }
}