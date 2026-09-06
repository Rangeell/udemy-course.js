/*
EXERCISE 007: The Generic Queue (FIFO Queue) | Dificulty: 🟠 Medium-High

Assuntos abordados: Generics com Classes, Index Signatures ([key: number]: T), lógica FIFO (First-In, First-Out).

Contexto e Objetivo
    Em estruturas de dados, uma Pilha (Stack) segue a lógica LIFO (Last-In, First-Out — o último que entra é o primeiro que sai). 
    
    Já uma Fila (Queue) segue a lógica FIFO (First-In, First-Out — o primeiro que entra é o primeiro que sai), exatamente como uma fila de banco.

    Seu objetivo é criar uma classe genérica chamada Fila<T>. Para exercitar a tipagem e manipulação de objetos dinâmicos:
        Você não pode utilizar arrays ([]) para armazenar os elementos internamente. Use um objeto com Index Signature do tipo { [key: number]: T } para simular a memória.

        Você deve controlar o início e o fim da fila usando duas propriedades numéricas privadas auxiliares (ex: inicio e fim).

        Quando um elemento for desenfileirado, ele deve ser removido fisicamente do objeto de memória interna usando o operador delete (para evitar vazamento de memória).

    Métodos que sua classe deve conter:
        - enfileirar(elemento: T): void — Adiciona um elemento ao final da fila.
        - desenfileirar(): T | undefined — Remove e retorna o elemento que está no início da fila. Retorna undefined se a fila estiver vazia.
        - tamanho(): number — Retorna a quantidade atual de elementos na fila.
        - estaVazia(): boolean — Retorna se a fila está ou não vazia.
*/

interface QueueProtocol<T> {
    toLineUp(data: T): void;
    deQueue(): T | undefined;
    length(): number;
    isEmpity(): boolean;
}

class Queue<T> implements QueueProtocol<T> {
    private memory: { [key: number]: T } = {};
    private start: number = 0;
    private end: number = 0;

    toLineUp(data: T): void {
        this.memory[this.end] = data;
        this.end++;
    }

    deQueue(): T | undefined {
        if (this.isEmpity()) return;

        const firstElement = this.memory[this.start];
        delete this.memory[this.start];
        this.start++;

        if (this.isEmpity()) {
            this.start = 0;
            this.end = 0;
            this.memory = {};
        }

        return firstElement;
    }

    length(): number { return this.end - this.start; }
    isEmpity(): boolean { return this.length() === 0; }
}

/**
 * =========================================================================
 * SUÍTE DE TESTES: EXERCISE 007 - The Generic Queue (FIFO)
 * =========================================================================
 * Cole este bloco abaixo da sua implementação.
 * 🔍 Passe o mouse sobre as constantes para checar os tipos inferidos.
 * ⚙️ Rode o arquivo para validar o comportamento em runtime.
 */

// Instanciamos uma fila que aceita apenas números
const filaDeNumeros = new Queue<number>();

// ==========================================
// CASO 1: Enfileirar e Desenfileirar (Lógica FIFO)
// ==========================================
// 🔍 Tipo esperado no hover de 'itemRemovido': number | undefined
try {
    filaDeNumeros.toLineUp(10);
    filaDeNumeros.toLineUp(20);
    filaDeNumeros.toLineUp(30);

    const tamanhoInicial = filaDeNumeros.length(); // Deve ser 3
    const itemRemovido = filaDeNumeros.deQueue(); // Deve ser 10 (o primeiro que entrou)
    const tamanhoFinal = filaDeNumeros.length(); // Deve ser 2

    const ok1 = tamanhoInicial === 3 && itemRemovido === 10 && tamanhoFinal === 2;
    console.log(ok1 ? '✅ Caso 1: ok (comportamento FIFO e tamanhos corretos)' : '❌ Caso 1: Comportamento FIFO incorreto!');
} catch (error: unknown) {
    console.log('❌ Caso 1 (erro inesperado):', error);
}

// ==========================================
// CASO 2: Bloqueio Estático de Tipos Incompatíveis
// ==========================================
try {
    // @ts-expect-error: Queue foi instanciada como number, não deve aceitar strings
    filaDeNumeros.toLineUp('texto-invalido');
    console.log('✅ Caso 2: verificação estática ok (bloqueio de tipo incompatível funcionando)');
} catch (error: unknown) {
    console.log('❌ Caso 2 (erro inesperado):', error);
}

// ==========================================
// CASO 3: Comportamento de Queue Vazia
// ==========================================
try {
    const filaVazia = new Queue<string>();
    const item = filaVazia.deQueue(); // Deve retornar undefined sem quebrar em runtime
    const vazia = filaVazia.isEmpity(); // Deve ser true

    const ok3 = item === undefined && vazia === true;
    console.log(ok3 ? '✅ Caso 3: ok (comportamento de fila vazia correto)' : '❌ Caso 3: Falha ao lidar com fila vazia');
} catch (error: unknown) {
    console.log('❌ Caso 3 (erro inesperado):', error);
}