var produtos = [];

async function getProdutosDaDB(){
    const dados = await fetch('/produtos').then(response => response.json());
    produtos = dados.sort(() => Math.random() - 0.5);
}

var cacheStorage = window.localStorage;

function usuarioEhAutenticado(){
    let usuarioEhVerificado = JSON.parse(cacheStorage.getItem("usuarioEhAutenticado"));
    if(usuarioEhVerificado)
        return true;
    else
        return false;
}

if (document.querySelector("body").id == "index") {
    window.onload = async ()=>{ 
        await getProdutosDaDB(); 
        renderizaProdutosNaInterface(produtos); 
        mudaANavBarSeLogado();
    }
} else if (document.querySelector("body").id == "carrinho") {
    var formDeDadosDoUsuario = document.getElementById("dadosUsuario");
    formDeDadosDoUsuario.addEventListener('submit', atualizarDadosDoUsuarioNoDB);
    window.onload = ()=>{
        renderizaListaDeProdutosNoCarrinho();
        autentificaFinalizacaoDaCompra();
        if(usuarioEhAutenticado())
            preencheInfoDoUsuarioNoFormulario();
    }
} else if (document.querySelector("body").id == "final") {
    window.onload = ()=>{finalizacaoDaCompra();}
}

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

function persisteCarrinho(carrinho){
    cacheStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function listaConstrutor(produto) {
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

function renderizaListaDeProdutosNoCarrinho() {

    if(existemProdutosNoCarrinho()){
        let carrinho = JSON.parse(localStorage.getItem("carrinho"));
        for (var produto of carrinho) {
            listaConstrutor(produto);
        }
    }else{
        document.querySelector(".produtos").innerHTML = ""
    }

}

function limpaOCarrinho() {
    persisteCarrinho(null);
    if(document.body.id == "carrinho"){
        renderizaListaDeProdutosNoCarrinho();
        autentificaFinalizacaoDaCompra();
    }
}

function listaResumoDaCompra(){
    let carrinho = JSON.parse(cacheStorage.getItem("carrinho"));
    console.log(carrinho);

    var containerDoResumo = document.getElementById("produtos");

    for (var produto of carrinho) {
        var produtoNome = document.createElement("span");
        produtoNome.textContent = produto.nome;
        containerDoResumo.appendChild(produtoNome);
    }
}

function calculaTempoDeEntrega(){
    document.getElementById("tempoEntrega").textContent = "O tempo previsto de entrega é de " +
    (Math.floor(Math.random() * (8 - 3)) + 3) + " dias.";
}

function finalizacaoDaCompra() {
    listaResumoDaCompra();
    calculaTempoDeEntrega();
    limpaOCarrinho();
}

async function atualizarDadosDoUsuarioNoDB(event) {

    var data = new FormData(event.target);
    var userDataUpdate = {
        nome: data.get("fpNome"),
        numero: data.get("fnumero"),
        complemento: data.get("fcomplemento"),
        cep: data.get("fcep"),
        cpf: data.get("fCPF")
    }

    await fetch('/updateuserinfo', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDataUpdate)});

    window.location.href="/finalizado"

}

function autentificaFinalizacaoDaCompra(){

    if(existemProdutosNoCarrinho() == false || usuarioEhAutenticado() == false){
        var submitBtn = document.getElementById("sendSubmit");
            submitBtn.disabled = true;
    }

}

function existemProdutosNoCarrinho() {
    let carrinho = JSON.parse(cacheStorage.getItem("carrinho"));
    if (carrinho == null || carrinho.length < 1 ) {
        return false;
    }
    return true;
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


async function enviaDadosDeCadastro(data){
    await fetch('/cadastrar', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if(response.status == 406){alert("CPF ou Email ja cadastrado, tente outro.")}
        else window.location.reload();
    }).catch((reason) => {console.log("REASON : " + reason)});
}

function cadastrarUsuario(){
    let form = document.querySelector("#inputs-user-reg");
    let formData = new FormData(form);
    let userData = {cpf: formData.get('cpf'), nome: formData.get('nome'), email: formData.get('email'), senha: formData.get('password')};

    enviaDadosDeCadastro(userData);
}

function logarUsuario(){
    validaUsuario();
    mudaANavBarSeLogado();
    if(usuarioEhAutenticado() == true){
        window.location.reload();
    }else if(usuarioEhAutenticado == false){
        alert("Email ou senha incorretos, tente novamente.");
    }
}

function fadeOutOnClose(element){
    return new Promise((resolve, reject) =>{
        let op = 1;
        
        const fadeEffect = setInterval(()=>{
            element.target.style.opacity = op;
            op -= 0.1;
            if(op <= 0.0) {
                clearInterval(fadeEffect);
                resolve();
            }
        }, 25);
    })
}

function deslogarUsuario(){
    cacheStorage.setItem("usuarioEhAutenticado", false);
    cacheStorage.setItem("user", null);
    window.location.reload();
}

function mudaANavBarSeLogado(){
    if(usuarioEhAutenticado()){
        let btnDeEntrarESair = document.querySelector("#entrar");
        btnDeEntrarESair.textContent = "Sair";
        btnDeEntrarESair.id = "sair";
        btnDeEntrarESair.removeEventListener('click', ()=>{renderizaModalDeLoginECadastro()});
        btnDeEntrarESair.addEventListener('click', ()=>{deslogarUsuario()});
    }else{
        let btnDeEntrarESair = document.querySelector("#entrar");
        btnDeEntrarESair.textContent = "Entrar";
        btnDeEntrarESair.id = "entrar";
        btnDeEntrarESair.removeEventListener('click', ()=>{deslogarUsuario()});
        btnDeEntrarESair.addEventListener('click', ()=>{renderizaModalDeLoginECadastro()});
    }
}

async function preencheInfoDoUsuarioNoFormulario(){

    let userEmail = {email: JSON.parse(cacheStorage.getItem("user"))}

    await fetch('/userinfo',{ 
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userEmail)
    }).then(response => response.json()
    ).then((data)=>{
        let cep = document.querySelector("#fcep");
        let autoPreenchido = false;
        if(data.cep){
            cep.value = data.cep;
            autoPreenchido = true;
        }

        setTimeout(()=>{
            let change = new Event('change');
            cep.dispatchEvent(change);
        }, 50)
        
        cep.addEventListener('change', ()=>{
            if(cep.value.length == 8){
                let script = document.createElement('script');
                script.src = 'https://viacep.com.br/ws/'+ cep.value + '/json/?callback=preencheEnderecoNoFormulario';
                document.body.appendChild(script);
                setTimeout(()=>{script.parentNode.removeChild(script)}, 200);
            }
        })
        document.querySelector("#fpNome").value = data.nome;
        document.querySelector("#fCPF").value = data.id;
        if(autoPreenchido){
            let addinfo = JSON.parse(data.addinfo);
            document.querySelector("#fcomplemento").value = addinfo.complemento;
            document.querySelector("#fnumero").value = addinfo.numero;
        }

    });
}

function preencheEnderecoNoFormulario(endereco){
    document.querySelector("#fendereco").value = endereco.logradouro;
    document.querySelector("#fcidade").value = endereco.localidade;
    document.querySelector("#fbairro").value = endereco.bairro;
}

async function validaUsuario(){
    
    let form = document.querySelector("#inputs-user");
    let formData = new FormData(form);
    let userData = {email: formData.get('email'), senha: formData.get('password')};

    await fetch('/logar',{ 
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    }).then(response => response.json()
    ).then((data)=>{
        if(data.email == undefined)
            cacheStorage.setItem("usuarioEhAutenticado", JSON.stringify(false));
        else if(data.email){
            cacheStorage.setItem("usuarioEhAutenticado", JSON.stringify(true));
            cacheStorage.setItem("user", JSON.stringify(formData.get('email')))
        }
    });
}
