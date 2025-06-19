import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'HARDCODED_TEST_SECRET';

// Создаём токен
const token = jwt.sign({ foo: 'bar' }, SECRET, { expiresIn: '1h' });

console.log('👉 Токен:', token);

// Проверяем токен
const decoded = jwt.verify(token, SECRET);
console.log('✅ Декодировано:', decoded);