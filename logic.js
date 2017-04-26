'use strict';

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

var base_url = 'https://jmorel.opendatasoft.com/api';

// Vue application

new Vue({
    el: '#app',
    data: {
        expanded: false
    },
    components: {
        'designer-index': {
            template: '' +
            '<div class="designer-index">' +
            '    <div class="designer-index-section"' +
            '         v-for="(designers, letter) in designerIndex">' +
            '        <div class="designer-index-section-title">{{ letter }}</div>' +
            '        <ul class="designer-index-designers">' +
            '            <li class="designer" v-for="designer in designers"><a :href="designer">{{ designer }}</a></li>' +
            '        </ul>' +
            '    </div>' +
            '</div>',
            data: function () {
                // init designer index
                var emptyDesignerIndex = 'abcdefghijklmnopqrstuvwxyz'.split('').reduce(function (object, letter) {
                    object[letter] = [];
                    return object;
                }, {});
                var that = this;
                // fetch remote data
                fetch(buildGetUrl(base_url + '/records/1.0/analyze/', {
                    'dataset': 'of-designers-and-chairs',
                    'x': ['last_name', 'full_name'],
                    'sort': 'x.last_name,x.full_name',
                    'y.serie1-1.func': 'COUNT'
                }), { method: 'GET' })
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (designers) {
                        designers.forEach(function (designer) {
                            that.designerIndex[designer.x.last_name[0].toLowerCase()].push(designer.x.full_name);
                        });
                    });
                return {
                    designerIndex: emptyDesignerIndex
                }
            }
        }
    }
});
