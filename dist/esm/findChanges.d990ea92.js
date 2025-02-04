import $a3ce00f3b8bc7d2a$export$2e2bcd8739ae039 from "./isPlainObject.1b7ee824.js";


function $f29a2162fe66edb3$var$setChanges(a, b, changes, key, compare) {
    if (!compare(a, b, key, [
        key
    ])) {
        Reflect.set(changes, key, b);
        return true;
    }
    return false;
}
function $f29a2162fe66edb3$export$2e2bcd8739ae039(a, b, compare) {
    let changes = {};
    let hasChanges = false;
    if (Array.isArray(a) && Array.isArray(b)) {
        const arr = a.length > b.length ? a : b;
        changes = new Array(arr.length);
        for(let key = 0; key < arr.length; key++){
            changes[key] = undefined;
            const _hasChanges = $f29a2162fe66edb3$var$setChanges(Reflect.get(a, key), Reflect.get(b, key), changes, key, compare);
            if (_hasChanges) hasChanges = true;
        }
    } else if ((0, $a3ce00f3b8bc7d2a$export$2e2bcd8739ae039)(a) && (0, $a3ce00f3b8bc7d2a$export$2e2bcd8739ae039)(b)) for(const key in a){
        const _hasChanges = $f29a2162fe66edb3$var$setChanges(Reflect.get(a, key), Reflect.get(b, key), changes, key, compare);
        if (_hasChanges) hasChanges = true;
    }
    if (!hasChanges) return {
        changes: undefined
    };
    return {
        changes: changes
    };
}


export {$f29a2162fe66edb3$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=findChanges.d990ea92.js.map
