App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  //Inicializa a aplicação
  init: function() {
    return App.initWeb3();
  },
  /*
    Inicializa o web3
    É ele que vai permitir o lado do cliente se conectar ao
    blockchain em outra rede sem a necessidade de se tornar um nó.
  */
  initWeb3: function() {
    // TODO:
    if (typeof web3 !== 'undefined') {
      /*
       Definindo um provedor, serve como intermediario entre o cliente e o
       bockchain, ele tentará se conectar ao metamask. Nele estará definido o
       endereço rpc de um ponto na rede ethereum, o padrão que é a rede oficial
       ou outra personalizada, neste caso, um ip na rede interna que esteja
       conectado ao ethereum e com rpc habilitado.
      */
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      /*
        Caso não se conecte ao metamask será conectado a um provedor definido manualmente.
      */
      App.web3Provider = new Web3.providers.HttpProvider('http://10.10.2.204:8545');
      web3 = new Web3(App.web3Provider);
    }
    //Solicita a inicialização do contrato
    return App.initContract();
  },

  /*
    Inicializa o contrato
    Aqui ele vai carregar o contrato.json, assim teremos na aplicação
    uma abstração do contrato para interagir com ele.
  */
  initContract: function() {
    $.getJSON("Eleicao.json", function(eleicao) {
      /*
        Instancia o contrato juntamente com truffle, que possibilita a interação
        dentro da aplicação
      */
      App.contracts.Election = TruffleContract(eleicao);
      // Conecta ao provedor.
      App.contracts.Election.setProvider(App.web3Provider);
      /*
        Após isso o front-end é inicializado
      */
      App.listenForEvents();
      return App.render();
    });
  },

  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      instance.eventoVoto({}, {
        //toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("Evento disparado: ", event);
        App.render();
      });
    });
  },

  //Inicializa o conteudo da pagina
  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Carrega a conta local
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Seu endereço: " + account);
      }
    });

    /*
        Carrega os dados de cada candidados existente no contrato
    */
    //Cria uma abstração do contrato
    App.contracts.Election.deployed().then(function(eleicao) {
      //Instancia o candidatos
      instanciaEleicao = eleicao;
      //retorna a quantidade de candidatos cadastrados para o proximo passo
      return instanciaEleicao.contCandidatos();
    }).then(function(countCandidatos) {
      //Exibe no front-end o numero de candidatos
      var resultCandidatos = $("#resultCandidatos");
      resultCandidatos.empty();

      var selectCandidatos = $('#selectCandidatos');
      selectCandidatos.empty();

      //Loop para listar cada candidato
      for (var i = 1; i <= countCandidatos; i++) {
        /*
          Busca utilizando a função de mapeamento do contrato
          o candidato com o id correspondente ao contador do for
          e injeta seus dados no parametro
        */
        instanciaEleicao.candidatos(i).then(function(candidato) {
          //Seta os dados dos candidatos
          var id = candidato[0];
          var codigo = candidato[1];
          var nome = candidato[2];
          var countVoto = candidato[3];

          // Renderiza as informações na tabela do front-end
          var candidatoTemplate = "<tr><th>" + id + "</th><td>" + codigo + "</td><td>" + nome + "</td><td>" + countVoto + "</td></tr>"
          resultCandidatos.append(candidatoTemplate);

          // Popula o select com cada candidato
          var candidatoOption = "<option value='" + id + "' >" + nome + "</ option>"
          selectCandidatos.append(candidatoOption);
        });
      }
      return instanciaEleicao.eleitores(App.account);
    }).then(function(hasVotado) {
      if(hasVotado) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var candidatoId = $('#selectCandidatos').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.votar (candidatoId, { from: App.account });
    }).then(function(result) {
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
