const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bp = require('body-parser');

app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/', router);
app.listen(process.env.port || 3000);
console.log('Running at Port 3000');


var db = new sqlite3.Database('db/loja.db', (err)=>{
    if(err)
        console.log(err.message);
    console.log("Connected to db");
})


router.get('/produtos', (req, res)=>{

    function request(req){

        let data = [];
        return new Promise(function(resolve, reject){
            db.each(sql, (err, row)=>{
                if(err){
                    reject(err);}
                else{
                    data.push(row);}
            }, function(err){
                if(err){
                    reject(err);}
                else{   
                    resolve(data);}
            })
        })
    }

    let sql = `SELECT id, nome, categoria, preco, imgpath
        FROM produtos`;  

    (async ()=>{
        const response = await request(sql);
        res.json(response);
    })();

});

router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname+'/index.html'));
})

router.get('/carrinho', (req, res)=>{
    res.sendFile(path.join(__dirname+'/carrinho.html'));
})

router.get('/finalizado', (req, res)=>{
    res.sendFile(path.join(__dirname+'/finalizado.html'));
})

router.post('/userinfo', (req, res) =>{

    let userEmail = req.body;

    let sql = `SELECT id, nome, email, cep, addinfo FROM usuarios WHERE email = '${userEmail.email}'`;
    
    async function request(sql){
        db.get(sql, (err, row)=>{
            if(err)
                return console.log(err);
            return row ? res.json(row) : res.json({});
        });
    }

    (async ()=>{
        await request(sql);
    })();

});

router.post('/logar', (req, res) =>{

    let userToTrust = req.body;
    let sql = `SELECT email FROM usuarios WHERE email = '${userToTrust.email}' AND senha = '${userToTrust.senha}'`;
    
    async function request(sql){
        db.get(sql, (err, row)=>{
            if(err)
                return console.log(err);
            return row ? res.json(row) : res.json({});
        });
    }

    (async ()=>{
        await request(sql);
    })();

});

router.post('/cadastrar', (req, res)=>{
    let userData = req.body;
    let sql = `INSERT INTO usuarios VALUES (${userData.cpf}, '${userData.nome}', '${userData.email}', '${userData.senha}', null)`;

    db.run(sql, (error)=>{
        if(error != null){
            res.status(406).send("Nao foi possivel completar");
        }else res.send();
    });
    

})

router.post('/updateuserinfo', (req, res) =>{

    let userData = req.body;
    let addInfo = {complemento: userData.complemento, numero: userData.numero};

    let sql = `UPDATE usuarios 
                SET 
                    nome = '${userData.nome}',
                    cep = '${userData.cep}',
                    addinfo = '${JSON.stringify(addInfo)}'
                WHERE id = '${userData.cpf}'`;
    
    function request(sql){
        db.run(sql, (error)=>{
            if(error != null){
                res.status(406).send("Nao foi possivel completar");
            }else res.send();
        });
    }


    (async ()=>{
        await request(sql);
    })();

});