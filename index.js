const HTTP = require('http');

const SERVER = HTTP.createServer((req, res) => {
    // console.log(req.method);
    const {headers, url, method} = req;
    console.log(headers, url, method);
    res.end();
})

const PORT = 2020;
SERVER.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`)
});
