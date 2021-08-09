
function autentificaFinalizacaoDaCompra(){

    if(existemProdutosNoCarrinho() == false || usuarioEhAutenticado() == false){
        var submitBtn = document.getElementById("sendSubmit");
            submitBtn.disabled = true;
    }

}

function getInfoDoUsuarioNoForm(event){
    var data = new FormData(event.target);

    var userDataUpdated = {
        nome: data.get("fpNome"),
        numero: data.get("fnumero"),
        complemento: data.get("fcomplemento"),
        cep: data.get("fcep"),
        cpf: data.get("fCPF")
    }

    return userDataUpdated;
}

async function preencheInfoDoUsuarioNoFormulario(){

    let userEmail = {email: JSON.parse(cacheStorage.getItem("user"))}

    let userData = await getInfoDoUsuarioNoDB(JSON.stringify(userEmail));

    let cep = document.querySelector("#fcep");
    let autoPreenchido = false;
    if(userData.cep){
        cep.value = userData.cep;
        autoPreenchido = true;
    }

    disparaEvento('change', cep);
        
    cep.addEventListener('change', ()=>{
        if(cep.value.length == 8){
            requestEnderecoNaAPIdeCEP(cep);
        }
    })
    
    document.querySelector("#fpNome").value = userData.nome;
    document.querySelector("#fCPF").value = userData.id;

    if(autoPreenchido){
        let addinfo = JSON.parse(userData.addinfo);
        document.querySelector("#fcomplemento").value = addinfo.complemento;
        document.querySelector("#fnumero").value = addinfo.numero;
    }

}

function preencheEnderecoNoFormulario(endereco){
    document.querySelector("#fendereco").value = endereco.logradouro;
    document.querySelector("#fcidade").value = endereco.localidade;
    document.querySelector("#fbairro").value = endereco.bairro;
}

async function finalizarCompraEAtualizarDados(event) {

    event.preventDefault();

    var userDataUpdated = getInfoDoUsuarioNoForm(event);

    await atualizarInfoDoUsuarioNaDB(JSON.stringify(userDataUpdated)).then(()=>{
        window.location.href="/finalizado"
    });


}

