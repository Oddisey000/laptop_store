// Load filesystem module for using it in the project
const fs = require('fs');

// Http module for creating a web server
const http = require('http');

// Connect standard url module to the app
const url = require('url');

// Parse json into object
const json = fs.readFileSync(`${__dirname}/assets/js/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

// Create a web server
const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url, true).pathname;
    
    // Create object from url request
    const id = url.parse(req.url, true).query.id;

    // Products rout
    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, {'Content-type': 'text/html'});

        // Replace data inside html template
        fs.readFile(`${__dirname}/templates/overview.html`, 'utf-8', (err, data) => {
            let output = data;

            fs.readFile(`${__dirname}/templates/card.html`, 'utf-8', (err, data) => {
                const cardOutput = laptopData.map(element => replaceTemplate(data, element)).join('');
                
                output = output.replace('{%CARDS%}', cardOutput)
                res.end(output);
            });
        });

    // Laptops rout
    } else if (pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, {'Content-type': 'text/html'});

        // Replace data inside html template
        fs.readFile(`${__dirname}/templates/laptop.html`, 'utf-8', (err, data) => {
            const laptopID = laptopData[id];
            const output = replaceTemplate(data, laptopID);
            
            res.end(output);
        });
    
    // Images rout
    } else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/assets/img${pathName}`, (err, data) => {
            res.writeHead(200, {'Content-type': 'image/jpeg'});
            res.end(data);
        });
    } else {
        res.writeHead(404, {'Content-type': 'text/html'});
        res.end('URL was not found on the server');
    }
});

// Setting IP address and port for web server
server.listen(1337, '127.0.0.1', () => {});

// Function to replace content
function replaceTemplate(originalHtml, laptopID) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptopID.productName);
    output = output.replace(/{%IMAGE%}/g, laptopID.image);
    output = output.replace(/{%PRICE%}/g, laptopID.price);
    output = output.replace(/{%SCREEN%}/g, laptopID.screen);
    output = output.replace(/{%CPU%}/g, laptopID.cpu);
    output = output.replace(/{%STORAGE%}/g, laptopID.storage);
    output = output.replace(/{%RAM%}/g, laptopID.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptopID.description);
    output = output.replace(/{%ID%}/g, laptopID.id);

    return output;
}