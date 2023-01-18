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
    const {method, url} = req;
    // console.log(headers, url, method);
    // res.statusCode = 404;
    // res.setHeader('Content-Type', 'text/html');
    // res.setHeader('Content-Type', 'application/json');
    // res.setHeader('X-Powered-By', 'Node.js');

    // res.writeHead(200, {
    //     'Content-Type': 'application/json',
    //     'X-Powered-By': 'Node.js'
    // })

    // res.write("<h1>Hello Sourav</h1>")
    // res.write("<h2>Hello Sourav Again</h2>")

    // console.log("Authorization Code : " + req.headers.authorization);

    let body = [];

    req.on('data', chunk => {
        body.push(chunk)
    }).on('end', () => {
        body = Buffer.concat(body).toString();

        let status = 404;
        const response = {
            success: false,
            data: null,
            error: null
        }

        if (method === 'GET' && url === '/todos') {
            status = 200;
            response.success = true;
            response.data = todos
        }

        if (method === 'POST' && url === '/todos') {
            const {id, text} = JSON.parse(body);

            if (!id || !text) {
                status = 400;
                response.error = "Please enter ID & TEXT";
            } else {
                todos.push({id, text});
                status = 201;
                response.success = true;
                response.data = todos;
            }
        }
        res.writeHead(status, {
            'Content-Type': 'application/json',
            'X-Powered-By': 'Node.js'
        });
        res.end(JSON.stringify(response));

        // console.log(body);
    })
    // res.end(JSON.stringify({
    //     success: true,
    //     // success: false,
    //     // error: "Not Found",
    //     // error: "Bad Request",
    //     // data: todos,
    //     data: todos
    // }));
})

const PORT = 2020;
SERVER.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`)
});
