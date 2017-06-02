const baseUrl = 'https://jmorel.opendatasoft.com';
const datasetId = 'of-designers-and-chairs';

var buildGetUrl  = (url, params) => {

    const encodedParams = Object.keys(params).reduce(function (previousEncodedParams, paramName) {
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


export {
    buildGetUrl,
    baseUrl,
    datasetId
}