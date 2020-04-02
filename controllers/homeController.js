const path = require('path');
const fs = require('fs');

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
    caminho = path.join('db', 'contatos.json');
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
  }
};

module.exports = homeController;
