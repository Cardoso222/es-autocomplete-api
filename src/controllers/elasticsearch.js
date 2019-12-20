'use strict';

const fs = require('fs');
const elasticsearch = require('elasticsearch');
const es = elasticsearch.Client({
    log: 'trace'
});

const INDEX_NAME = 'cars';
const INDEX_TYPE = 'details';

module.exports = {

    readDataFile() {
        require.extensions['.json'] = function (module, filename) {
            module.exports = fs.readFileSync(filename, 'utf8');
        };
        return require("../data/cars.json")
    },

    indexExists() {
        return es.indices.exists({
            index: INDEX_NAME
        });
    },

    createIndex() {
        return es.indices.create({
            index: INDEX_NAME
        });
    },

    deleteIndex() {
        return es.indices.delete({
            index: INDEX_NAME
        });
    },

    indexMapping() {
        return es.indices.putMapping({
            index: INDEX_NAME,
            type: INDEX_TYPE,
            body: {
                properties: {
                    Name: {
                        type: "completion",
                        analyzer: "simple",
                        search_analyzer: "simple"
                    },
                    Miles_per_Gallon: {
                        type: "integer"
                    },
                    Cylinders: {
                        type: "integer",
                        fields: {
                            keyword: {
                                type: "keyword",
                                ignore_above: 256
                            }
                        }
                    },
                    Displacement: {
                        type: "integer"
                    },
                    Horsepower: {
                        type: "integer",
                        fields: {
                            keyword: {
                                type: "keyword",
                                ignore_above: 256
                            }
                        }
                    },
                    Weight_in_lbs: {
                        type: "long",
                        fields: {
                            keyword: {
                                type: "keyword",
                                ignore_above: 256
                            }
                        }
                    },
                    Acceleration: {
                        type: "float",
                        fields: {
                            keyword: {
                                type: "keyword",
                                ignore_above: 256
                            }
                        }
                    },
                    Origin: {
                        type: "text"
                    }
                }
            }
        });
    },

    bulkAddDocument() {
        return es.bulk({
            index: INDEX_NAME,
            type: INDEX_TYPE,
            body: [
                this.readDataFile()
            ],
            refresh: "true"
        });
    },

    getSuggestions(text, size) {
        return es.search({
            index: INDEX_NAME,
            type: INDEX_TYPE,
            body: {
                suggest: {
                    NameSuggester: {
                        prefix: text,
                        completion: {
                            field: "Name",
                            size: size,
                            fuzzy: {
                                fuzziness: "auto"
                            }
                        }
                    },
                }

            }
        });
    },

    getStat(id) {
        return es.search({
            index: INDEX_NAME,
            type: INDEX_TYPE,
            body: {
                query: {
                    term: {
                        "_id": id
                    }
                }
            }
        });
    }
}
