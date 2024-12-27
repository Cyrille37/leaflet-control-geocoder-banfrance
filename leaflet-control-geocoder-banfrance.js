/**
 * 
 */

const BanFrance = L.Class.extend({

    options: {
        serviceUrl: 'https://api-adresse.data.gouv.fr/search',
        reverseUrl: 'https://api-adresse.data.gouv.fr/reverse',
        geocodingQueryParams: {
            // https://addok.readthedocs.io/en/latest/api/
            autocomplete: 1,
            limit: 5,
            // lat: null,
            // lng: null
        },
        reverseQueryParams: {},
        htmlTemplate: function (geocoder, feature) {
            //console.debug('htmlTemplate', feature.properties);
            const parts = [];
            parts.push(geocoder._template('{building} {housenumber}', feature.properties));
            parts.push(geocoder._template('{street}', feature.properties));
            parts.push(geocoder._template('{postcode} {city}', feature.properties));
            parts.push(geocoder._template('{context}', feature.properties));
            return parts
                .map(el => el.replace(/\s+/g, ' ').trim())
                .filter(el => el !== '')
                .join(', ');
        }
    },

    initialize: function (options) {
        // L.Util.setOptions is not recursive
        // so users must full fil sub entries :-(
        //L.Util.setOptions(this, options);
        this._mergeDeep(this.options, options);
    },

    geocode: async function (query, cb, context) {
        const params = L.Util.extend({ q: query }, this.options.geocodingQueryParams);
        const data = await this._getJSON(this.options.serviceUrl, params);
        return this._parseResults(data);
    },

    suggest: function (query, cb, context) {
        return this.geocode(query);
    },

    reverse: async function (location, scale, cb, context) {
        const params = L.Util.extend({ lon: location.lng, lat: location.lat }, this.options.reverseQueryParams);
        const data = await this._getJSON(this.options.reverseUrl, params);
        return this._parseResults(data);
    },

    _parseResults: function (data) {
        //console.debug('_parseResults', data);
        const self = this;
        return (data.features || []).map((f) => {
            const c = f.geometry.coordinates;
            const center = L.latLng(c[1], c[0]);
            // No bbox in result.
            const bbox = L.latLngBounds(center, center);
            const p = f.properties;
            return {
                // "name" is mandatory for suggest()
                name: p.label,
                html: self.options.htmlTemplate ? self.options.htmlTemplate(self, f) : undefined,
                center,
                bbox,
                // give raw properties to listener.
                properties: p
            };
        });
    },

    /**
     * This function exists in leaflet-control-geocoder but it's not accessible.
     */
    _template: function (str, data) {

        //return str.replace(/\{ *([\w_]+) *\}/g, (str, key) => {
        //return str.replace(/\{(.+?)\}/g, (str, key) => {
        return str.replace(/\{(\w+)\}/g, (str, key) => {
            let value = data[key];
            if (value === undefined || value == '') {
                //value = '';
                return '';
            } else if (typeof value === 'function') {
                value = value(data);
            }
            return this._htmlEscape(value);
        });
    },

    _espacedChars: (chr) => {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '`': '&#x60;'
        }[chr]
    },

    /**
     * This function exists in leaflet-control-geocoder but it's not accessible.
     */
    _htmlEscape: function (string) {
        if (string == null) {
            return '';
        } else if (!string) {
            return string + '';
        }
        const possible = /[&<>"'`]/;
        string = '' + string;
        if (!possible.test(string)) {
            return string;
        }
        const badChars = /[&<>"'`]/g;
        return string.replace(badChars, this._espacedChars);
    },

    /**
     * This function exists in leaflet-control-geocoder but it's not accessible.
     */
    _getJSON: async function (url, params) {
        const headers = { Accept: 'application/json' };
        const request = new URL(url);
        Object.entries(params).forEach(([key, value]) => {
            (Array.isArray(value) ? value : [value]).forEach(v => {
                request.searchParams.append(key, v);
            });
        });
        return fetch(request.toString(), { headers }).then(response => response.json());
    },

    _isObject: function (item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    },

    /**
     * Recursivly copy sources 's entries into target.
     */
    _mergeDeep: function (target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this._isObject(target) && this._isObject(source)) {
            for (const key in source) {
                if (this._isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this._mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return this._mergeDeep(target, ...sources);
    }
});

/**
 * Plug it into "leaflet-control-geocoder"
 */
L.Util.extend(L.Control.Geocoder, {
    BanFrance: BanFrance,
    banFrance: function (options) {
        return new L.Control.Geocoder.BanFrance(options);
    }
});
