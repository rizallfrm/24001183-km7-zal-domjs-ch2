const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const PUBLIC_DIRECTORY = path.join(__dirname, "../public");
const PORT = 8000;

const requestHandler = (req, res) => {
    if (req.url === "/") {
        req.url = "/index.html";
    } else if (req.url === '/cars') {
        req.url = '/cars.html';
    }

    const parsedURL = url.parse(req.url);
    const pathName = `${parsedURL.pathname}`;
    const extension = path.parse(pathName).ext;
    const absolutePath = path.join(PUBLIC_DIRECTORY, pathName);

    // Set content type based on extension
    const contentTypes = {
        ".css": "text/css",
        ".png": "image/png",
        ".svg": "image/svg+xml",
        ".html": "text/html",
        ".js": "application/javascript",
    };

    // Read file and send response
    fs.readFile(absolutePath, (err, data) => {
        if (err) {
            res.statusCode = 404;
            res.end("File not found ...");
        } else {
            res.setHeader("Content-Type", contentTypes[extension] || "text/plain");
            res.end(data);
        }
    });
};

http.createServer(requestHandler).listen(PORT);
console.log(`Server is running http://localhost:${PORT}`);
