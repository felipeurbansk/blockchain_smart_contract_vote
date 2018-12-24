var Eleicao = artifacts.require("./Eleicao.sol");

contract("Eleicao", function(accounts){
    var contratoEleicao;

    it("Inicializado com 5 candidatos", function(){
        return Eleicao.deployed().then(function(instance){
            return instance.contCandidatos();
        }).then(function(count){
            assert.equal(count,5);
        });
    });

    it("Verificado se as informações estão corretas e a contagem de voto está zerado", function(){
      return Eleicao.deployed().then(function(instance){
        instEleicao = instance;
        return instEleicao.candidatos(1);
      }).then(function(candidato){
        assert.equal(candidato[0],1,"ID está correto");
        assert.equal(candidato[1],20,"Codigo está correto");
        assert.equal(candidato[2],"Candidato 1","Nome está correto");
        assert.equal(candidato[3],0,"Quatidade de votos zerado");
        return instEleicao.candidatos(2);
      }).then(function(candidato){
        assert.equal(candidato[0],2,"ID está correto");
        assert.equal(candidato[1],21,"Codigo está correto")
        assert.equal(candidato[2],"Candidato 2","Nome está correto");
        assert.equal(candidato[3],0,"Quantidade de votos zerado");
        return instEleicao.candidatos(3);
      }).then(function(candidato){
        assert.equal(candidato[0],3,"ID está correto");
        assert.equal(candidato[1],22,"Codigo está correto");
        assert.equal(candidato[2],"Candidato 3","Nome está correto");
        assert.equal(candidato[3],0,"Quantidade de votos zerado");
        return instEleicao.candidatos(4);
      }).then(function(candidato){
        assert.equal(candidato[0],4,"ID está correto");
        assert.equal(candidato[1],23,"Codigo está correto");
        assert.equal(candidato[2],"Candidato 4","Nome está correto");
        assert.equal(candidato[3],0,"Quantidade de votos zerado");
        return instEleicao.candidatos(5);
      }).then(function(candidato){
        assert.equal(candidato[0],5,"ID está correto");
        assert.equal(candidato[1],24,"Codigo está correto");
        assert.equal(candidato[2],"Candidato 5","Nome está correto");
        assert.equal(candidato[3],0,"Quantidade de votos zerado");
      });
    });
    it("Funções executando corretamente", function(){
      return Eleicao.deployed().then(function(i){
        instEleicao = i;
        candidatoId = 1;
        //Adiciona um voto ao candidato 1 com endereço da conta 0
        return instEleicao.votar(candidatoId, {from:accounts[0]});
      }).then(function(recibo){
        //Verifica se o eleitor foi adicionado ao mapeamente corretamente
        return instEleicao.eleitores(accounts[0]);
      }).then(function(voto){
          return instEleicao.candidatos(candidatoId);
      }).then(function(candidato){
          var voteCount = candidato[3];
          assert.equal(voteCount, 1, "Incremento funcionando corretamente");
      });
    });

});
