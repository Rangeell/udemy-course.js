/*
EXERCISE 005: The Dynamic Object Manipulator | Dificulty: 🟡 Medium

Assuntos abordados: Restrições em Generics (extends), Operador keyof, Tipagem indexada (O[K]).

Contexto e Objetivo
    Em grandes sistemas, frequentemente criamos funções utilitárias que modificam ou leem propriedades de objetos dinamicamente. Na aula de Restrições em Generics (Constraints), vimos que se tentarmos acessar uma propriedade usando uma chave genérica sem restringi-la, o TypeScript gera um erro porque a chave "pode ser literalmente qualquer tipo".

    Seu objetivo é implementar duas funções utilitárias genéricas e estritas:
        obterPropriedade: Recebe um objeto e uma chave. Ela deve retornar o valor contido naquela chave, garantindo estaticamente que a chave informada existe no objeto e que o retorno possui exatamente o tipo da propriedade correspondente.

        atualizarPropriedade: Recebe um objeto, uma chave e um novo valor. Ela deve atualizar o objeto com o novo valor, garantindo que o novo valor passado seja estritamente compatível com o tipo original da propriedade.
*/

function getProperty<O, K extends keyof O>(obj: O, key: K): O[K] { return obj[key]; }
function attProperty<O, K extends keyof O>(obj: O, key: K, value: O[K]): void { obj[key] = value; }

/**
 * =========================================================================
 * SUÍTE DE TESTES: EXERCISE 005 - The Dynamic Object Manipulator
 * =========================================================================
 * Cole este bloco abaixo da sua implementação.
 * 🔍 Passe o mouse sobre as constantes para checar os tipos inferidos.
 * ⚙️ Rode o arquivo para validar o comportamento em runtime.
 */

interface Produto {
    id: number;
    nome: string;
    disponivel: boolean;
    tags: string[];
}

const celular: Produto = {
    id: 101,
    nome: 'Smartphone Pro',
    disponivel: true,
    tags: ['tecnologia', 'lancamento'],
};

// ==========================================
// CASO 1: Leitura de Propriedades com Tipo Correto
// ==========================================
// 🔍 Tipo esperado no hover de 'nomeCelular': string
// 🔍 Tipo esperado no hover de 'statusCelular': boolean
try {
    const nomeCelular = getProperty(celular, 'nome');
    const statusCelular = getProperty(celular, 'disponivel');

    const ok1 = nomeCelular === 'Smartphone Pro' && statusCelular === true;
    console.log(ok1 ? '✅ Caso 1: ok' : '❌ Caso 1: Leitura incorreta ou tipos de retorno incompatíveis');
} catch (error: unknown) {
    console.log('❌ Caso 1 (erro inesperado):', error);
}

// ==========================================
// CASO 2: Restrição de Chaves Inexistentes
// ==========================================
// Se a tipagem estiver correta, a linha com @ts-expect-error DEVE acusar erro estático,
// pois a propriedade 'preco' não existe no tipo 'Produto'.
try {
    //// @ts-expect-error: 'preco' não existe na interface Produto
    //// const preco = getProperty(celular, 'preco');
    console.log('✅ Caso 2: verificação estática ok (chave inexistente bloqueada)');
} catch (error: unknown) {
    console.log('❌ Caso 2 (erro inesperado):', error);
}

// ==========================================
// CASO 3: Atualização Segura de Propriedades
// ==========================================
// 🔍 'atualizarPropriedade' deve permitir atualizar chaves com seus respectivos tipos e bloquear tipos incompatíveis.
try {
    // Modificação válida
    attProperty(celular, 'disponivel', false);

    // @ts-expect-error: Não deve permitir atualizar 'id' (number) passando uma string 'cento-e-dois'
    attProperty(celular, 'id', 'cento-e-dois');

    // @ts-expect-error: Não deve permitir atualizar 'nome' (string) passando um boolean
    attProperty(celular, 'nome', true);

    const ok3 = celular.disponivel === false;
    console.log(ok3 ? '✅ Caso 3: ok (atualização de runtime sucedida e verificações estáticas corretas)' : '❌ Caso 3: Mudança de valor falhou');
} catch (error: unknown) {
    console.log('❌ Caso 3 (erro inesperado):', error);
}