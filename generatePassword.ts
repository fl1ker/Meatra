import bcrypt from 'bcrypt';

async function generateHashedPassword(password: string): Promise<string> {
    const saltRounds = 10; // Количество раундов для соли
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

async function main() {
    const password = 'Meatra_2025'; // Замените на желаемый пароль
    const hashedPassword = await generateHashedPassword(password);
    console.log('Захэшированный пароль:', hashedPassword);
}

main()
    .catch((e) => console.error('Ошибка:', e))
    .finally(() => process.exit(0));