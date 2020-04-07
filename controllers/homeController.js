const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const homeController = {
  index: (req, res) => {
    let servicos = [
      {nome: 'Dev full stack', imagem: '/imagens/undraw_dev_focus.svg'},
      {nome: 'Consultoria UX', imagem: '/imagens/undraw_mobile_apps.svg'},
      {nome: 'Marketing Digital', imagem: '/imagens/undraw_social_dashboard.svg'},
      {nome: 'Suporte tecnico', imagem: '/imagens/undraw_dev_focus.svg'},
      {nome: 'Data Science', imagem: '/imagens/undraw_mobile_apps.svg'},
    ];

    let banners = [
      '/imagens/banner2.jpg',
      '/imagens/banner3.jpg',
      '/imagens/banner4.jpg',
      '/imagens/banner.jpg',
    ];

    res.render('index', { title: 'Home', listaServicos: servicos, listaBanners: banners });
  },
  contato: (req,res)=>{
    console.log("ENTROU AQUI 1111111");
    let {nome, email, mensagem} =  req.body;

    // novo conteudo arquivo
    let infoContato = { nome, email, mensagem }
    // caminho do arquivo
    let fileContato = path.join('db', 'contatos.json'); //Primeiro parâmetro é a pasta e a segunda é o arquivo
  
    let listaContato = [];
    // verifica se o arquivo existe
    if (fs.existsSync(fileContato)){
      listaContato = fs.readFileSync(fileContato, {encoding: 'utf-8'});
      listaContato = JSON.parse(listaContato);
    } 
    listaContato.push(infoContato);
    // cria arquivo e guarda conteúdo
    fs.writeFileSync(fileContato, JSON.stringify(listaContato));

    res.render('contato', { nome, email, mensagem, title: "Contato" });
  },
  newsletter: (req, res) => {
    let {email} = req.query;

    let fileNoticias = path.join('db', 'newsletter.json');
    let listaNoticiados = [];
    if (fs.existsSync(fileNoticias)){
      listaNoticiados = fs.readFileSync(fileNoticias, {encoding: 'utf-8'});
      listaNoticiados = JSON.parse(listaNoticiados);
    }

    let data = new Date();
    listaNoticiados.push(
      { 
        email, 
        Data_Inscricao: data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear() + " " + data.getHours() + ":" + data.getMinutes()
    });

    fs.writeFileSync(fileNoticias, JSON.stringify(listaNoticiados));
    
    // POST - req.body
    // GET - req.query
    // GET /:email - req.params

    res.render('newsletter', {email, title: 'Newsletter'});
  },
  painelcontrole: (req, res) => {
    let contatos = [];
    let caminho;
    caminho = path.join('db', 'usuarios.json');
    if (fs.existsSync(caminho)){
      contatos = fs.readFileSync(caminho, {encoding: 'utf-8'});
      contatos = JSON.parse(contatos);
    }

    let noticiados = [];
    caminho = path.join('db', 'newsletter.json');
    if (fs.existsSync(caminho)){
      noticiados = fs.readFileSync(caminho, {encoding: 'utf-8'});
      noticiados = JSON.parse(noticiados);
    }    

    res.render('painelcontrole', { contatos, noticiados, title: 'Painel de controle' });
  },
  cadastrousuario: (req, res) => {
    res.render('cadastroUsuario', { title: 'Cadastro de usuário' });
  },
  salvarusuario: (req, res) => {

    let { nome, email, senha } = req.body;

    console.log('BODY');
    console.log(req.body);

    let hash = bcrypt.hashSync(senha, 10);

    let usuario = { nome: nome, email: email, senha: hash, imagem: req.files[0].filename };
    
    console.log(usuario);

    let caminho = path.join('db', 'usuarios.json');

    let cadastrados = [];

    if (fs.existsSync(caminho)){
      cadastrados = fs.readFileSync(caminho, {encoding: 'utf-8'});
      cadastrados = JSON.parse(cadastrados);
    }

    cadastrados.push(usuario);

    fs.writeFileSync(caminho, JSON.stringify(cadastrados));

    res.render('sucesso', { title: 'Deu certo', mensagem: `Usuario com email ${email} cadastrado com sucesso!` });
  },

  loginsistema: (req, res) => {

    let cadastrados = [];
    let { email, senha } = req.body;

    let caminho = path.join('db', 'usuarios.json');
  
    if (fs.existsSync(caminho)){
      cadastrados = fs.readFileSync(caminho, {encoding: 'utf-8'});
      cadastrados = JSON.parse(cadastrados);
    }
  
    let userBuscado = cadastrados.filter((cadastrado) => {
      return cadastrado.email == email;
    });

    console.log(userBuscado);    
    if (userBuscado[0] && bcrypt.compareSync(senha, userBuscado[0].senha)){
      req.session.nome = userBuscado[0].nome;
      req.session.email = userBuscado[0].email;
      res.redirect('/painelcontrole');
    } else {
      res.render('login', { title: 'Login', mensagem: 'E-mail ou senha não encontrado' });
    }

  },

  login: (req, res) => {
    res.render('login', { title: 'Logar no sistema' });
  }
};

module.exports = homeController;