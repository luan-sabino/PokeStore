var produtos = [];

var cacheStorage = window.localStorage;

function usuarioEhAutenticado(){
    let usuarioEhVerificado = JSON.parse(cacheStorage.getItem("usuarioEhAutenticado"));
    if(usuarioEhVerificado)
        return true;
    else
        return false;
}

var bodyElementId = document.querySelector("body").id;

switch (bodyElementId) {
    case "index":
        window.onload = async ()=>{ 
            await getProdutosDaDB(); 
            renderizaProdutosNaInterface(produtos); 
            mudaANavBarSeLogado();
        }
        break;
    case "carrinho":
        var formDeDadosDoUsuario = document.getElementById("dadosUsuario");
        formDeDadosDoUsuario.addEventListener('submit', finalizarCompraEAtualizarDados);
        window.onload = ()=>{
            renderizaListaDeProdutosNoCarrinho();
            autentificaFinalizacaoDaCompra();
            if(usuarioEhAutenticado())
                preencheInfoDoUsuarioNoFormulario();
        }
        break;
    case "final":
        if(existemProdutosNoCarrinho())
            window.onload = ()=>{finalizacaoDaCompra();}
        else window.location.href = '/';
}

function limpaOCarrinho() {
    persisteCarrinho(null);
    if(document.body.id == "carrinho"){
        renderizaListaDeProdutosNoCarrinho();
        autentificaFinalizacaoDaCompra();
    }
}

function existemProdutosNoCarrinho() {
    let carrinho = JSON.parse(cacheStorage.getItem("carrinho"));
    if (carrinho == null || carrinho.length < 1 ) {
        return false;
    }
    return true;
}

function persisteCarrinho(carrinho){
    cacheStorage.setItem("carrinho", JSON.stringify(carrinho));
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

function disparaEvento(ev, element){
    setTimeout(()=>{
        let event = new Event(ev);
        element.dispatchEvent(event);
    }, 50)
}

async function validaUsuario(){
    
    let form = document.querySelector("#inputs-user");
    let formData = new FormData(form);
    let userData = {email: formData.get('email'), senha: formData.get('password')};

    let userDataVerificado = await verificaExistenciaDoUsuarioNaDB(JSON.stringify(userData));

    if(userDataVerificado.email == undefined)
        cacheStorage.setItem("usuarioEhAutenticado", JSON.stringify(false));
    else if(userDataVerificado.email){
        cacheStorage.setItem("usuarioEhAutenticado", JSON.stringify(true));
        cacheStorage.setItem("user", JSON.stringify(formData.get('email')))
    }
}
