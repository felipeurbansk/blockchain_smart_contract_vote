/*
    Deve sempre declarar a versão do compilador em que o contrato foi desenvolvido, afim de
    garantir a funcionalidade correta do contrato sem quebra do codigo
    motivados por novas versões .
*/
pragma solidity ^0.4.2;
/*
    Declaração do contrato, pode ser assimilado a uma classe
    Aqui também será declarado herança de outro contrato caso necessario,
    esse contrato pode ser tanto interno quanto externo.
 */
contract Eleicao{

    /*
        Modelar o candidato
        Solidity permite criar estrutura com conjunto de variaveis de estado conforme a
        necessidade do projeto. Variaveis de estado são gravadas permanentemente no blockchain.
        Essa estrutura dinamica ficara salva no blockchain, bem parecido com
        uma tabela de banco sql.
    */
    struct Candidato {
        /*
          Variaveis do tipo uint permite apenas numeros inteiros sem sinal de
          256 bits, isso é numeros não negativos
        */
        uint id;
        uint codigo;
        string nome;
        uint contadorVoto;
    }
    /*
      Mapeamento para controlar endereços que já votarão
    */
    mapping (address => bool) public eleitores;

    /*
        Mapeamento interage diretamente com a camada de dados do blockchain
        e é o que vai possibilitar a busca de candidatos no blockchain
        buscando o candidato pelo um valor uint que será seu ID e trazendo
        seus dados utilizando a estrutura Candidato.
    */
    mapping (uint => Candidato) public candidatos;

    /*
        Atributo publico global que contabiliza a quantidade de candidatos, e
        que também denomina o id de cada candidato, futuramente será alterado
        para o id ser o numero do registro de voto.
    */
    uint public contCandidatos;
    /*
      Event são gatilhos que são executados quando uma função é executada
      dentro do contrato
    */
    event eventoVoto(uint _candidato);

    /*
        Função para adicionar um candidato
     */
    function addCandidato(string _nome, uint _codigo) private {
        contCandidatos ++;
        candidatos[contCandidatos] = Candidato(contCandidatos, _codigo, _nome, 0);
    }

    /*
      Função Votar
      Essa função será bem básica, sem muitas validações.
    */
    function votar(uint _candidato) public {
      //Verifica se o eleitor já votou.
      require(!eleitores[msg.sender]);
      //Verifica se o candidato informado é valido
      require(_candidato > 0 && _candidato <= contCandidatos);
      /* Altera para verdadeiro o mapeamento de eleitor para o
      edereço que solicitou a função */
      eleitores[msg.sender] = true;
      //Atualiza a contagem de voto do candidato
      candidatos[_candidato].contadorVoto ++;
      //Emite um evento que pode ser monitorado na aplicação front-end
      emit eventoVoto(_candidato);
    }

    /*
        Metodo construtor que é executado apenas uma vez, que é quando o contrato é submetido ao blockchain
    */
    constructor () public {
      /*
        Adicionando candidatos no momento em que o contrato é submetido a rede.
      */
        addCandidato("Candidato 1", 20);
        addCandidato("Candidato 2", 21);
        addCandidato("Candidato 3", 22);
        addCandidato("Candidato 4", 23);
        addCandidato("Candidato 5", 24);
    }
}
