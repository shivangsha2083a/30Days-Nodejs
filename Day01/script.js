const http = require('http');
const { URL } = require('url');

function randomPasswordGenerator(passwordLength, isSymbols, isUppercase, islowercase, isNumber) {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const number = '1234567890';
    const symbols = '!@#$%^&*()';
    let password = '';
    let allowedChars = '';
    allowedChars += isSymbols ? symbols : '';
    allowedChars += isUppercase ? upper : '';
    allowedChars += islowercase ? lower : '';
    allowedChars += isNumber ? number : '';

    if (passwordLength <= 0) {
        return `(Password length must be 1 or higher)`;
    }
    if (allowedChars.length === 0) {
        return `(At least add 1 character set)`;
    }

    for (let i = 0; i < passwordLength; i++) {
        const randomText = Math.floor(Math.random() * allowedChars.length);
        password += allowedChars[randomText];
    }
    return password;
}

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url.startsWith('/password')) {
        const url = new URL(req.url, `http://${req.headers.host}`);

        const length = parseInt(url.searchParams.get('length')) || 12;
        const symbols = url.searchParams.get('symbols') === 'true';
        const uppercase = url.searchParams.get('uppercase') === 'true';
        const lowercase = url.searchParams.get('lowercase') === 'true';
        const number = url.searchParams.get('number') === 'true';

        const password = randomPasswordGenerator(length, symbols, uppercase, lowercase, number);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ password }));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('🚀 Server running at http://localhost:3000');
});

// use(http://localhost:3000/password?length=16&symbols=false&uppercase=true&lowercase=true&number=true)