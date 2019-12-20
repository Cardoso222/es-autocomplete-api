const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    http = require('http'),
    config = require('./config');

const elasticsearch = require('./src/controllers/elasticsearch');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


elasticsearch.indexExists().then(function (status) {
    if (status) {
        return elasticsearch.deleteIndex();
    }
}).then(function () {
    console.log('Index deleted');

    return elasticsearch.createIndex().then(function () {
        console.log('Index created');

        elasticsearch.indexMapping().then(function () {
            console.log('Index mapping has been updated');

            elasticsearch.bulkAddDocument().then(function () {
                console.log('Dummy documents have been bulk imported');
            },
                function (err) {
                    console.log('Could not import dummy documents', err);
                }
            )
        },
            function (err) {
                console.log('Could not create index', err);
            }
        )
    },
        function (err) {
            console.log('Could not create index', err);
        }
    );
});


require('./src/routes')(app)
const port = config.port
app.set('port', port)

const server = http.createServer(app)
server.listen(port)
console.log('Your server is running on port ' + port)

