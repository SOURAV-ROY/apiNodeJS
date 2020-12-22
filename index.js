const HTTP = require('http');

const todos = [
    {id: 1, value: "One"},
    {id: 2, value: "Two"},
    {id: 3, value: "Three"},
    {id: 4, value: "Four"},
]

const SERVER = HTTP.createServer((req, res) => {
    // console.log(req.method);
    // const {headers, url, method} = req;
    // console.log(headers, url, method);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Powered-By', 'Node.js');
    res.write("<h1>Hello Sourav</h1>")
    res.write("<h2>Hello Sourav Again</h2>")
    res.end(JSON.stringify({
        success: true,
        data: todos
    }));
})

const PORT = 2020;
SERVER.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`)
});
