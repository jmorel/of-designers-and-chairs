'use strict';

// Consts

var baseUrl = 'https://jmorel.opendatasoft.com';
var datasetId = 'of-designers-and-chairs';

// Helpers

var buildGetUrl = function (url, params) {
    var encodedParams = Object.keys(params).reduce(function (previousEncodedParams, paramName) {
        var paramValues = params[paramName];
        if (!Array.isArray(paramValues)) {
            paramValues = [paramValues];
        }
        var encodedParam = paramValues.map(function (paramValue) {
            return encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue)
        });
        return previousEncodedParams.concat(encodedParam);
    }, []);
    return url + '?' + encodedParams.join('&');
};

// Vue application

var app = new Vue({
    el: '#app',
    data: {
        currentDesigner: decodeURIComponent(window.location.hash.substr(1))
    },
    components: {
        'navigation': {
            props: ['currentDesigner'],
            template: '' +
            '<nav v-bind:class="{expanded: expanded}">' +
            '   <button class="nav-toggle" v-on:click="expanded = !expanded">' +
            '       <i class="icon-menu"></i>' +
            '   </button>' +
            '   <div>' +
            '       <div class="current-designer">{{ currentDesigner || \'Select a designer\' }}</div>' +
            '       <div class="designer-index">' +
            '           <div class="designer-index-section" v-for="(designers, letter) in designerIndex">' +
            '               <div class="designer-index-section-title">{{ letter }}</div>' +
            '               <ul class="designer-index-designers">' +
            '                   <li class="designer" v-for="designer in designers">' +
            '                       <a :href="\'#\' + designer">{{ designer }}</a>' +
            '                   </li>' +
            '               </ul>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</nav>',
            data: function () {
                return {
                    designerIndex: 'abcdefghijklmnopqrstuvwxyz'
                        .split('')
                        .reduce(function (object, letter) {
                            object[letter] = [];
                            return object;
                        }, {}),
                    expanded: !this.currentDesigner
                }
            },
            created: function () {
                var designersUrl = buildGetUrl(baseUrl + '/api/records/1.0/analyze/', {
                    'dataset': datasetId,
                    'x': ['last_name', 'full_name'],
                    'sort': 'x.last_name,x.full_name',
                    'y.serie1-1.func': 'COUNT'
                });
                var that = this;
                fetch(designersUrl)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (designers) {
                        designers.forEach(function (designer) {
                            that.designerIndex[designer.x.last_name[0].toLowerCase()].push(designer.x.full_name);
                        });
                    });
            },
            watch: {
                'currentDesigner': function () {
                    this.expanded = false;
                }
            }

        },
        'chairs': {
            props: ['currentDesigner'],
            template: '' +
            '<div>' +
            '   <figure v-for="chairRecord in chairRecords">' +
            '       <img v-bind:src="chairRecord.fields.chair_picture.url"' +
            '            v-bind:alt="chairRecord.fields.chair_caption_text">' +
            '       <figcaption v-html="chairRecord.fields.chair_caption_html"></figcaption>' +
            '   </figure>' +
            '</div>',
            data: function () {
                return {
                    chairRecords: []
                }
            },
            created: function () {
                this.fetchImages();
            },
            watch: {
                'currentDesigner': 'fetchImages',
            },
            methods: {
                fetchImages: function () {
                    var that = this;
                    this.chairRecords = [];
                    var imagesUrl = buildGetUrl(baseUrl + '/api//records/1.0/search', {
                        'dataset': datasetId,
                        'sort': 'last_name',
                        'rows': 10000,
                        'q': 'full_name:' + this.currentDesigner
                    });
                    fetch(imagesUrl)
                        .then(function (response) {
                            return response.json()
                        })
                        .then(function (response) {
                            response.records.forEach(function (record) {
                                record.fields.chair_picture.url = baseUrl + '/explore/dataset/' + datasetId + '/files/' + record.fields.chair_picture.id + '/300/';
                            });
                            that.chairRecords = response.records;
                        });
                }
            }
        }
    }
});

// Routing

window.addEventListener('hashchange', function () {
    app.currentDesigner = decodeURIComponent(window.location.hash.substr(1));
});
