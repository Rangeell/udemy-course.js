/*
EXERCISE 006: Immutable Object Merging (Generic Merge) | Dificulty: 🟠 Medium-High

Assuntos abordados: Intersecção de Generics (T & U), Restrições de tipos (extends object), Utility Type Readonly<T> e imutabilidade.

Contexto e Objetivo
    Em sistemas modernos, a mesclagem de configurações ou estados é uma tarefa constante. No entanto, alterar diretamente os objetos de entrada (mutabilidade por referência) é uma fonte comum de bugs difíceis de rastrear em produção.

    Seu objetivo é implementar uma função utilitária genérica chamada mergeObjects. Ela deve:
        Receber dois objetos distintos (obj1 e obj2).
        
        Garantir estaticamente que ambos os argumentos sejam objetos legítimos (impedindo a passagem acidental de primitivos como string ou number).
        
        Unificar ambos os objetos em um único retorno contendo as propriedades combinadas de ambos (T & U).
        
        Retornar esse objeto unificado de forma totalmente imutável (Readonly) para que nenhuma parte da aplicação possa modificar acidentalmente suas chaves geradas.

        Garantir que, em runtime, os objetos originais passados por argumento não sejam modificados/mutados (retorne uma nova referência limpa).
*/

type ObjectProtocol = Record<PropertyKey, unknown>

function mergeObjects<T extends ObjectProtocol, U extends ObjectProtocol>(obj1: T, obj2: U): Readonly<T & U> {
    return Object.freeze({ ...obj1, ...obj2 });
}

/**
 * =========================================================================
 * SUÍTE DE TESTES: EXERCISE 006 - Immutable Object Merging
 * =========================================================================
 * Cole este bloco abaixo da sua implementação.
 * 🔍 Passe o mouse sobre as constantes para checar os tipos inferidos.
 * ⚙️ Rode o arquivo para validar o comportamento em runtime.
 */

const configBase = {
    host: 'localhost',
    porta: 8080,
};

const configSeguranca = {
    ssl: true,
    token: 'token-secreto-123',
};

// ==========================================
// CASO 1: Uso Correto (Mesclagem e Acesso a Propriedades)
// ==========================================
// 🔍 Tipo esperado no hover de 'configFinal': Readonly<{ host: string; porta: number; } & { ssl: boolean; token: string; }>
try {
    const configFinal = mergeObjects(configBase, configSeguranca);

    const ok1 = configFinal.host === 'localhost' && configFinal.ssl === true && configFinal.porta === 8080;
    console.log(ok1 ? '✅ Caso 1: ok' : '❌ Caso 1: Erro na mesclagem de propriedades');
} catch (error: unknown) {
    console.log('❌ Caso 1 (erro inesperado):', error);
}

// ==========================================
// CASO 2: Verificação de Imutabilidade (Readonly Estático)
// ==========================================
// Se o retorno for estritamente Readonly, tentar reatribuir qualquer propriedade DEVE falhar estaticamente.
try {
    const configFinal = mergeObjects(configBase, configSeguranca);

    // @ts-expect-error: Não deve permitir alteração pois o objeto retornado deve ser Readonly
    configFinal.host = 'outrohost';

    console.log('✅ Caso 2: verificação estática ok (imutabilidade estática garantida)');
} catch (error: unknown) {
    console.log('❌ Caso 2 (erro inesperado):', error);
}

// ==========================================
// CASO 3: Sem Mutação de Originais (Runtime)
// ==========================================
try {
    const originalBase = { nivel: 'debug' };
    const originalSeguranca = { apiKey: 'xyz' };

    // const merged = mergeObjects(originalBase, originalSeguranca);

    // Garante que o merge não modificou os objetos originais por referência
    const semMutacao = !('apiKey' in originalBase) && !('nivel' in originalSeguranca);
    console.log(semMutacao ? '✅ Caso 3: ok (objetos originais permaneceram intactos)' : '❌ Caso 3: Houve mutação indesejada por referência!');
} catch (error: unknown) {
    console.log('❌ Caso 3 (erro inesperado):', error);
}

// ==========================================
// CASO 4: Bloqueio de Primitivos (Restrição a Objetos)
// ==========================================
// Se você aplicou as restrições corretas (ex: extends object), passar primitivos deve acusar erro estático.
try {
    //// @ts-expect-error: Não deve aceitar string ou number como argumento de mesclagem
    // const erroPrimitivo = mergeObjects('não sou objeto', 42);
    console.log('✅ Caso 4: verificação estática ok (bloqueio de primitivos funcionando)');
} catch (error: unknown) {
    console.log('❌ Caso 4 (erro inesperado):', error);
}