/*
Exercise 002 — Generic Repository | Difficulty: 🟢 Easy

📝 Enunciado + Contrato
    Crie uma interface genérica chamada RepositoryProtocol<T> para representar um repositório simples de dados.

    Ela deve possuir os seguintes métodos:
        add(item: T): void
        getAll(): T[]
        findById(id: number): T | undefined

    Em seguida, crie uma classe genérica Repository<T> que implemente essa interface.

    Para este exercício, assuma que todo tipo T utilizado no repositório possui uma propriedade id: number.

    Este exercício testa: o uso correto de Generics com interfaces, garantindo que o mesmo tipo genérico T seja preservado entre os métodos da interface e da classe.

    Não use any nem crie implementações específicas para User, Product ou outros tipos concretos.
*/

interface RepositoryProtocol<T> {
    add(item: T): void;
    getAll(): T[];
    findById(id: number): T | undefined;
}

class Repository<T extends { id: number }> implements RepositoryProtocol<T> {
    private repository: T[] = [];

    add(item: T): void { this.repository.push(item); }
    getAll(): T[] { return [... this.repository]; }

    findById(id: number): T | undefined {
        const requiredElement = this.repository.find(v => v.id === id);

        return requiredElement;
    }
}

/**
 * =========================================================================
 * SUÍTE DE TESTES: Exercise 002
 * =========================================================================
 * Cole este bloco abaixo da sua implementação.
 *
 * Observações sobre os testes:
 * - 🔍 Passe o mouse sobre as constantes para checar os tipos inferidos.
 * - ⚙️ Rode o arquivo para validar o comportamento em runtime.
 */

// CASO 1: Repository de usuários — Tipo esperado no hover: User[]
try {
    type User = {
        id: number;
        name: string;
    };

    const userRepository = new Repository<User>();

    userRepository.add({ id: 1, name: 'Rangel' });
    userRepository.add({ id: 2, name: 'Maria' });

    const users = userRepository.getAll();

    // Checagem estática: deve aceitar User[]
    const checagemEstatica: User[] = users;

    const esperado = JSON.stringify([
        { id: 1, name: 'Rangel' },
        { id: 2, name: 'Maria' },
    ]);
    const recebido = JSON.stringify(users);

    console.log(
        recebido === esperado
            ? '✅ Caso 1: ok'
            : `❌ Caso 1: esperado ${esperado}, recebeu ${recebido}`,
    );
} catch (error: unknown) {
    console.log('❌ Caso 1 (erro inesperado):', error);
}

// CASO 2: findById encontra o tipo correto — Tipo esperado no hover: User | undefined
try {
    type User = {
        id: number;
        name: string;
    };

    const userRepository = new Repository<User>();

    userRepository.add({ id: 1, name: 'Rangel' });
    userRepository.add({ id: 2, name: 'Maria' });

    const user = userRepository.findById(2);

    // Checagem estática: deve aceitar User | undefined
    const checagemEstatica: User | undefined = user;

    console.log(
        user?.name === 'Maria'
            ? '✅ Caso 2: ok'
            : `❌ Caso 2: esperado Maria, recebeu ${user?.name}`,
    );
} catch (error: unknown) {
    console.log('❌ Caso 2 (erro inesperado):', error);
}

// CASO 3: O mesmo Repository funciona com outro tipo — Tipo esperado no hover: Product | undefined
try {
    type Product = {
        id: number;
        price: number;
    };

    const productRepository = new Repository<Product>();

    productRepository.add({ id: 1, price: 100 });
    productRepository.add({ id: 2, price: 250 });

    const product = productRepository.findById(1);

    // Checagem estática: deve aceitar Product | undefined
    const checagemEstatica: Product | undefined = product;

    console.log(
        product?.price === 100
            ? '✅ Caso 3: ok'
            : `❌ Caso 3: esperado preço 100, recebeu ${product?.price}`,
    );
} catch (error: unknown) {
    console.log('❌ Caso 3 (erro inesperado):', error);
}