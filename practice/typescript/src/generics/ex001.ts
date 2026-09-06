/*
EXERCISE 001 — Generic Array Mapper | Difficulty: 🟢 Easy

📝 Enunciado + Contrato 
    No TypeScript, frequentemente precisamos transformar coleções de dados mantendo a segurança estrita dos tipos de entrada e de saída. Seu objetivo é criar uma função genérica chamada mapearArray que simule o comportamento do método .map() do JavaScript.

    Sua implementação deve aceitar:
    - Um array de elementos de um tipo genérico T.
    
    - Uma função de callback que recebe um elemento do tipo T e retorna um novo elemento de um tipo genérico U.
    
    - A função deve retornar um novo array contendo os elementos transformados do tipo U.
    
    - Regra: Não utilize tipos amplos como any ou unknown na assinatura das coleções ou do callback. A inferência de tipo entre a entrada (T) e a saída (U) deve ser feita de forma 100% dinâmica pelo compilador.
*/

type MapProtocol<T, U> = (element: T, index?: number, fullArray?: T[]) => U;

function mapArray<T, U>(array: T[], cb: MapProtocol<T, U>): U[] {
    const newArray: U[] = [];

    for (let i = 0; i < array.length; i++) {
        const result = cb(array[i]!, i, array);

        newArray.push(result);
    }

    return newArray;
}

/**
 * =========================================================================
 * SUÍTE DE TESTES: Exercise 001
 * =========================================================================
 * Cole este bloco abaixo da sua implementação.
 * 🔍 Passe o mouse sobre as constantes para checar os tipos inferidos.
 * ⚙️ Rode o arquivo para validar o comportamento em runtime.
 */

// CASO 1: Transformando números em strings (T = number, U = string)
// Tipo esperado no hover de 'resultado1': string[]
try {
    const numeros = [1, 2, 3];
    const resultado1 = mapArray(numeros, (num) => `num_${num}`);

    // Teste de asserção de tipo estático (não deve compilar se o tipo de retorno estiver incorreto)
    // const checagemEstatica: string[] = resultado1;

    const esperado = JSON.stringify(['num_1', 'num_2', 'num_3']);
    const recebido = JSON.stringify(resultado1);

    console.log(
        recebido === esperado
            ? '✅ Caso 1: ok'
            : `❌ Caso 1: esperado ${esperado}, recebeu ${recebido}`,
    );
} catch (error: unknown) {
    console.log('❌ Caso 1 (erro inesperado):', error);
}

// CASO 2: Transformando objetos em números (T = { nome: string; idade: number }, U = number)
// Tipo esperado no hover de 'resultado2': number[]
try {
    const pessoas = [
        { nome: 'Luiz', idade: 30 },
        { nome: 'Maria', idade: 25 },
    ];
    const resultado2 = mapArray(pessoas, (p) => p.idade);

    // Teste de asserção de tipo estático
    // const checagemEstatica: number[] = resultado2;

    const esperado = JSON.stringify([30, 25]);
    const recebido = JSON.stringify(resultado2);

    console.log(
        recebido === esperado
            ? '✅ Caso 2: ok'
            : `❌ Caso 2: esperado ${esperado}, recebeu ${recebido}`,
    );
} catch (error: unknown) {
    console.log('❌ Caso 2 (erro inesperado):', error);
}