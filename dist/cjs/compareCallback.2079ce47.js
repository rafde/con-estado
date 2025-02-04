var $jF9Zi$fastequals = require("fast-equals");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "default", () => $419219214aba1cb9$export$2e2bcd8739ae039);

function $419219214aba1cb9$export$2e2bcd8739ae039(compare) {
    if (typeof compare !== 'function') return function cmp(previousValue, nextValue) {
        return (0, $jF9Zi$fastequals.strictDeepEqual)(previousValue, nextValue);
    };
    return function cmp(previousValue, nextValue, key, keys) {
        return Boolean(compare(previousValue, nextValue, {
            cmp: (0, $jF9Zi$fastequals.strictDeepEqual),
            key: key,
            keys: keys
        }));
    };
}


//# sourceMappingURL=compareCallback.2079ce47.js.map
