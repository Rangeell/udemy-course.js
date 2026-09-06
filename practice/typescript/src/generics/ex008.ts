/*
Exercise 008: O Conversor de Entidades (Utility Types) | Dificulty: 🟠 Medium-High
Assuntos abordados: Pick<T, K>, Exclude<T, U>, Intersecção de tipos (&), Utility Type Readonly<T>, restrições genéricas (extends).

Contexto e Objetivo
    Bancos de dados NoSQL (como o MongoDB) utilizam a convenção de chave primária com underline (_id). Contudo, no front-end ou na API pública, a convenção padrão é expor apenas id. Além disso, objetos de banco de dados costumam carregar campos sensíveis (como senhaHash ou dados internos) que nunca devem ser expostos.

Seu objetivo é criar um utilitário de tipagem e uma função genérica chamada mapearEntidade que resolva isso de forma automatizada e tipada:

    Tipo Genérico RemoverIdESensiveis<T, K extends keyof T>: Deve usar as utilidades nativas do TypeScript Pick e Exclude para produzir um tipo baseado em T, porém sem a chave _id e sem nenhuma das chaves contidas no tipo união K.

    Tipo Genérico EntidadeAPI<T, K extends keyof T>: Deve pegar o tipo resultante do passo 1, fazer uma intersecção com { id: string } e envelopar tudo em Readonly para garantir a imutabilidade estática.

    Função mapearEntidade: Deve receber um objeto entidade: T (que possua obrigatoriamente a propriedade _id: string) e um array de chaves do tipo K[] para remoção. A função deve retornar o objeto mapeado com id (recebendo o valor de _id), sem as chaves indicadas para exclusão, e o objeto resultante deve ser congelado dinamicamente com Object.freeze em runtime.
*/

// Seleciona todas as chaves de T, exceto `_id` e as chaves presentes em K (Excluídas)
type RemoveIdSentive<T, K extends keyof T> = Pick<T, Exclude<keyof T, '_id' | K>>
type ApiEntity<T, K extends keyof T> = Readonly<RemoveIdSentive<T, K> & { id: string }> // Chaves presentes no tipo acima + `id`

function mapEntity<T extends { _id: string }, K extends keyof T>(obj: T, keyArray: K[]): ApiEntity<T, K> {
    const { _id, ...objRemainder } = obj;

    for (const key of keyArray) { // Remove as chaves enviadas no array
        // Type Assertion para garantir ao compilador que `objRemainder` seja um objeto válido
        delete (objRemainder as Record<PropertyKey, unknown>)[key]; 
    }

    return Object.freeze({ id: _id, ...objRemainder }) as ApiEntity<T, K>;
}

/**
 * =========================================================================
 * SUÍTE DE TESTES: Exercise 008 - O Conversor de Entidades
 * =========================================================================
 * Cole este bloco abaixo da sua implementação.
 * 🔍 Passe o mouse sobre as constantes para checar os tipos inferidos.
 * ⚙️ Rode o arquivo para validar o comportamento em runtime.
 */

interface UsuarioBanco {
    _id: string;
    nome: string;
    email: string;
    senhaHash: string;
    criadoEm: Date;
}

const usuarioDb: UsuarioBanco = {
    _id: 'usr_12345',
    nome: 'Alice Silva',
    email: 'alice@email.com',
    senhaHash: '$2b$12$K3y9uX...',
    criadoEm: new Date(),
};

// ==========================================
// CASO 1: Mapeamento de Propriedades e Exclusão Correta
// ==========================================
// 🔍 Tipo esperado no hover de 'usuarioApi': Readonly<{ nome: string; email: string; } & { id: string; }>
try {
    const usuarioApi = mapEntity(usuarioDb, ['senhaHash', 'criadoEm']);

    const temId = 'id' in usuarioApi;
    const naoTemIdUnderline = !('_id' in usuarioApi);
    const naoTemSenha = !('senhaHash' in usuarioApi);
    const naoTemCriadoEm = !('criadoEm' in usuarioApi);
    const valoresCorretos = usuarioApi.id === 'usr_12345' && usuarioApi.nome === 'Alice Silva';

    const ok1 = temId && naoTemIdUnderline && naoTemSenha && naoTemCriadoEm && valoresCorretos;
    console.log(ok1 ? '✅ Caso 1: ok (mapeamento de id e exclusão de chaves bem-sucedida)' : '❌ Caso 1: Falha no mapeamento das chaves!');
} catch (error: unknown) {
    console.log('❌ Caso 1 (erro inesperado):', error);
}

// ==========================================
// CASO 2: Garantia de Imutabilidade (Readonly Estático e Runtime)
// ==========================================
/* eslint-disable */
try {
    const usuarioApi = mapEntity(usuarioDb, ['senhaHash', 'criadoEm']);
    let tentouAlterarERejeitou = false;

    try {
        // @ts-expect-error: Não deve ser possível alterar propriedades pois o retorno é Readonly
        usuarioApi.nome = 'Outro Nome';
    } catch {
        // Em runtime, Object.freeze lança um TypeError em Strict Mode
        tentouAlterarERejeitou = true;
    }

    console.log('✅ Caso 2: verificação estática ok (objeto retornado é Readonly)');
} catch (error: unknown) {
    console.log('❌ Caso 2 (erro inesperado):', error);
}

// ==========================================
// CASO 3: Sem Alteração de Dados Originais (Runtime)
// ==========================================
try {
    const backupDb = { ...usuarioDb };
    const usuarioApi = mapEntity(usuarioDb, ['senhaHash']);

    const dbIntacto = usuarioDb._id === 'usr_12345' && usuarioDb.senhaHash === '$2b$12$K3y9uX...';
    console.log(dbIntacto ? '✅ Caso 3: ok (objeto original de banco de dados permaneceu intacto)' : '❌ Caso 3: O objeto original foi mutado!');
} catch (error: unknown) {
    console.log('❌ Caso 3 (erro inesperado):', error);
}

// ==========================================
// CASO 4: Bloqueio de Objetos sem Chave _id
// ==========================================
try {
    const configInvalida = { host: 'localhost', porta: 8080 };

    // @ts-expect-error: O objeto passado não possui a chave obrigatória '_id'
    const erroMapeamento = mapEntity(configInvalida, []);

    console.log('✅ Caso 4: verificação estática ok (bloqueio de objetos sem _id funcionando)');
} catch (error: unknown) {
    console.log('❌ Caso 4 (erro inesperado):', error);
}