
async function getProdutosDaDB(){
    const dados = await fetch('/produtos').then(response => response.json());
    produtos = dados.sort(() => Math.random() - 0.5);
}

async function atualizarInfoDoUsuarioNaDB(userDataUpdated){
    await fetch('/updateuserinfo', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: userDataUpdated});
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

async function getInfoDoUsuarioNoDB(userEmail){
    let userData;

    await fetch('/userinfo',{ 
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: userEmail
    }).then(response => response.json()
    ).then((data)=> userData = data)

    return userData;
}

async function verificaExistenciaDoUsuarioNaDB(userData){
    let user;
    
    await fetch('/logar',{ 
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: userData
    }).then(response => response.json()
    ).then((data)=> user = data);

    return user;
}

function requestEnderecoNaAPIdeCEP(cep){
    let script = document.createElement('script');
    script.src = 'https://viacep.com.br/ws/'+ cep.value + '/json/?callback=preencheEnderecoNoFormulario';
    document.body.appendChild(script);
    setTimeout(()=>{script.parentNode.removeChild(script)}, 200);
}