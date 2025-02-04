var $895ad942dc0f1d82$exports = require("./isPlainObject.573ed53a.js");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "default", () => $c5da10901162cf4d$export$2e2bcd8739ae039);

function $c5da10901162cf4d$export$2e2bcd8739ae039(state, arrayPath, cleanKey) {
    if (state == null) return [
        undefined,
        undefined
    ];
    const _cleanKey = typeof cleanKey === 'function' ? cleanKey : (key)=>key;
    let parent;
    let value = state;
    for (const key of arrayPath){
        const isObj = (0, $895ad942dc0f1d82$exports.default)(value);
        const isArray = Array.isArray(value);
        if (isObj && isArray) break;
        const ck = _cleanKey(key);
        parent = value;
        value = parent[ck];
    }
    return [
        value,
        parent
    ];
}


//# sourceMappingURL=getDeepValueParentByArray.de9c2d96.js.map
