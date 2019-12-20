# es-autocomplete-api
Example of autocomplete suggestions API using NodeJs and Elasticsearch.

## Install

if you dont have elasticsearch running: `docker-compose up -d`

`yarn && yarn start`

## Usage

` curl -XGET 'http://localhost:3000/api/entities?q=chevy&size=1' `

q: term for the search                                                                                         
size: size of suggestions
