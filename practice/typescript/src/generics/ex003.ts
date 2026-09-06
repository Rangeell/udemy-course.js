/*
Exercise 003 — Generic Property Accessor | Difficulty: 🟡 Medium

📝 Enunciado + Contrato

Crie uma função genérica chamada getProperty que receba:

    1. Um objeto de tipo genérico T.
    2. Uma chave desse objeto, representada por um segundo tipo genérico U.

A função deve retornar o valor existente naquela propriedade.

O segundo Generic U deve ser restringido de forma que só seja possível
passar chaves que realmente existam em T.

Este exercício testa:
    - uso de múltiplos Generics;
    - Generic Constraint com keyof;
    - relação entre T, U e o tipo de retorno;
    - inferência de tipos a partir dos argumentos.

A função deve preservar o tipo específico da propriedade acessada.

Não utilize any, unknown ou type assertions para contornar o sistema de tipos.
*/

const getProperty = <T, U extends keyof T>(obj: T, key: U): T[U] => obj[key];

/**
 * =========================================================================
 * SUÍTE DE TESTES: Exercise 003
 * =========================================================================
 * Cole este bloco abaixo da sua implementação.
 *
 * Observações sobre os testes:
 * - 🔍 Passe o mouse sobre as constantes para checar os tipos inferidos.
 * - ⚙️ Rode o arquivo para validar o comportamento em runtime.
 */

// CASO 1: Acessando uma propriedade string
// Tipo esperado no hover de 'nome': string
try {
    const user = {
        id: 1,
        nome: 'Rangel',
        ativo: true,
    };

    const nome = getProperty(user, 'nome');

    // Checagem estática
    const checagemEstatica: string = nome;

    console.log(
        nome === 'Rangel'
            ? '✅ Caso 1: ok'
            : `❌ Caso 1: esperado Rangel, recebeu ${nome}`,
    );
} catch (error: unknown) {
    console.log('❌ Caso 1 (erro inesperado):', error);
}

// CASO 2: Acessando propriedades de tipos diferentes
// Tipos esperados:
// 'id' → number
// 'ativo' → boolean
try {
    const user = {
        id: 42,
        nome: 'Maria',
        ativo: true,
    };

    const id = getProperty(user, 'id');
    const ativo = getProperty(user, 'ativo');

    // Checagens estáticas
    const checagemId: number = id;
    const checagemAtivo: boolean = ativo;

    console.log(
        id === 42 && ativo === true
            ? '✅ Caso 2: ok'
            : `❌ Caso 2: resultado inesperado — id=${id}, ativo=${ativo}`,
    );
} catch (error: unknown) {
    console.log('❌ Caso 2 (erro inesperado):', error);
}

// CASO 3: A chave precisa pertencer ao objeto
// Este caso é principalmente um teste ESTÁTICO.
//
// A linha abaixo DEVE gerar erro de TypeScript.
// Descomente temporariamente para verificar se o compilador rejeita.
//
// const erro = getProperty(user, 'email');
// Tipo esperado: erro de compilação porque 'email' não é uma chave de user.

// CASO 4: União de tipos de propriedade
// Tipo esperado no hover de 'resultado': string | number
try {
    const product = {
        name: 'Keyboard',
        price: 250,
    };

    const chave: 'name' | 'price' =
        Math.random() > 0.5 ? 'name' : 'price';

    const resultado = getProperty(product, chave);

    // Checagem estática:
    // o retorno precisa ser string | number
    const checagemEstatica: string | number = resultado;

    console.log(
        resultado === 'Keyboard' || resultado === 250
            ? '✅ Caso 4: ok'
            : `❌ Caso 4: resultado inesperado — ${resultado}`,
    );
} catch (error: unknown) {
    console.log('❌ Caso 4 (erro inesperado):', error);
}

// CASO 5: Preservação do tipo específico da propriedade
// Tipo esperado no hover de 'email': string
// Tipo esperado no hover de 'age': number
try {
    const person = {
        name: 'Carlos',
        email: 'carlos@email.com',
        age: 30,
    };

    const email = getProperty(person, 'email');
    const age = getProperty(person, 'age');

    // Checagens estáticas
    const checagemEmail: string = email;
    const checagemAge: number = age;

    console.log(
        email === 'carlos@email.com' && age === 30
            ? '✅ Caso 5: ok'
            : `❌ Caso 5: resultado inesperado — email=${email}, age=${age}`,
    );
} catch (error: unknown) {
    console.log('❌ Caso 5 (erro inesperado):', error);
}