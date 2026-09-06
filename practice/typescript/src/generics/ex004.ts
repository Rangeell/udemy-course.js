/*
EXERCISE 004: Mixed Collection Filter | Dificulty: 🟡 Medium
Assuntos abordados: Generics básicos, Type Predicates (value is T), Tipagem de Arrays.

O que você precisa implementar:
    Um Type Predicate customizado chamado isString que recebe um valor unknown e diz ao TypeScript se ele é uma string utilizando a sintaxe de predicado (value is string).

    A função genérica filtrarColecao<T, U> que recebe um array T[] e uma função de callback guardiã (valor is U), retornando um array refinado U[].
*/

type CbProtocol<T, U extends T> = (value: T) => value is U;

const isString = (value: unknown): value is string => typeof value === 'string';

function filterCollection<T, U extends T>(array: T[], cb: CbProtocol<T, U>): U[] {
    const newArray: U[] = [];

    for (const element of array) {
        if (cb(element)) newArray.push(element);
    }

    return newArray;
}

/**
 * =========================================================================
 * SUÍTE DE TESTES: Exercise 004 - Mixed Collection Filter
 * =========================================================================
 * Cole este bloco abaixo da sua implementação.
 * 🔍 Passe o mouse sobre as constantes para checar os tipos inferidos.
 * ⚙️ Rode o arquivo para validar o comportamento em runtime.
 */
/* eslint-disable */

// Dados de entrada para os Casos 1 e 2
const dadosMistos = ['TypeScript', 10, 'Generics', null, 20, undefined, 'Obsidian'];

// ==========================================
// CASO 1: Uso Correto (Filtragem de Primitivos)
// ==========================================
// 🔍 Tipo esperado no hover de 'caso1': string[]
try {
    const caso1 = filterCollection(dadosMistos, isString);
    const esperado1 = ['TypeScript', 'Generics', 'Obsidian'];

    const ok = JSON.stringify(caso1) === JSON.stringify(esperado1);
    console.log(ok ? '✅ Caso 1: ok' : `❌ Caso 1: esperado ${JSON.stringify(esperado1)}, recebeu ${JSON.stringify(caso1)}`);
} catch (error: unknown) {
    console.log('❌ Caso 1 (erro inesperado):', error);
}

// ==========================================
// CASO 2: Erro Comum (Callback sem Type Predicate)
// ==========================================
// 🔍 Tipo esperado no hover de 'caso2': NÃO deve inferir string[] de forma segura.
// Se sua função genérica estiver bem restrita, a linha abaixo deve acusar erro estático 
// de compilação se você remover o comentário do @ts-expect-error.
try {
    const isStringSemPredicado = (valor: unknown): boolean => typeof valor === 'string';

    // @ts-expect-error: O compilador deve reclamar porque 'isStringSemPredicado' retorna 'boolean' comum e não um Type Predicate
    const caso2 = filterCollection(dadosMistos, isStringSemPredicado);

    // Se compilar mesmo assim, o hover de 'caso2' deve apontar para unknown[] ou (string | number | null | undefined)[]
    console.log('✅ Caso 2: verificação estática ok (certifique-se de que o hover NÃO inferiu como string[])');
} catch (error: unknown) {
    console.log('❌ Caso 2 (erro inesperado):', error);
}

// ==========================================
// CASO 3: Caso Avançado (Filtro de Uniões de Objetos)
// ==========================================
// 🔍 Tipo esperado no hover de 'caso3': Gato[]
interface Cao { tipo: 'cao'; latir: () => string; }
interface Gato { tipo: 'gato'; miar: () => string; }
type Pet = Cao | Gato;

const pets: Pet[] = [
    { tipo: 'cao', latir: () => 'Au au!' },
    { tipo: 'gato', miar: () => 'Miau!' },
    { tipo: 'cao', latir: () => 'Wuff!' },
    { tipo: 'gato', miar: () => 'Ronrom!' },
];

// Type guard para filtrar apenas felinos
const isGato = (pet: Pet): pet is Gato => pet.tipo === 'gato';

try {
    const caso3 = filterCollection(pets, isGato);

    // Como o hover inferiu 'Gato[]', podemos chamar com segurança o método .miar() sem fazer type casting!
    const miados = caso3.map(g => g.miar());
    const esperado3 = ['Miau!', 'Ronrom!'];

    const ok = JSON.stringify(miados) === JSON.stringify(esperado3);
    console.log(ok ? '✅ Caso 3: ok' : `❌ Caso 3: esperado ${JSON.stringify(esperado3)}, recebeu ${JSON.stringify(miados)}`);
} catch (error: unknown) {
    console.log('❌ Caso 3 (erro inesperado):', error);
}
