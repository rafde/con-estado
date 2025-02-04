var $895ad942dc0f1d82$exports = require("./isPlainObject.573ed53a.js");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "default", () => $dac5af36f6b384ef$export$2e2bcd8739ae039);

function $dac5af36f6b384ef$var$setChanges(a, b, changes, key, compare) {
    if (!compare(a, b, key, [
        key
    ])) {
        Reflect.set(changes, key, b);
        return true;
    }
    return false;
}
function $dac5af36f6b384ef$export$2e2bcd8739ae039(a, b, compare) {
    let changes = {};
    let hasChanges = false;
    if (Array.isArray(a) && Array.isArray(b)) {
        const arr = a.length > b.length ? a : b;
        changes = new Array(arr.length);
        for(let key = 0; key < arr.length; key++){
            changes[key] = undefined;
            const _hasChanges = $dac5af36f6b384ef$var$setChanges(Reflect.get(a, key), Reflect.get(b, key), changes, key, compare);
            if (_hasChanges) hasChanges = true;
        }
    } else if ((0, $895ad942dc0f1d82$exports.default)(a) && (0, $895ad942dc0f1d82$exports.default)(b)) for(const key in a){
        const _hasChanges = $dac5af36f6b384ef$var$setChanges(Reflect.get(a, key), Reflect.get(b, key), changes, key, compare);
        if (_hasChanges) hasChanges = true;
    }
    if (!hasChanges) return {
        changes: undefined
    };
    return {
        changes: changes
    };
}


//# sourceMappingURL=findChanges.511fd29d.js.map
