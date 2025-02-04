import $a3ce00f3b8bc7d2a$export$2e2bcd8739ae039 from "./isPlainObject.1b7ee824.js";


function $4c453324a2f6c347$export$2e2bcd8739ae039(state, arrayPath, cleanKey) {
    if (state == null) return [
        undefined,
        undefined
    ];
    const _cleanKey = typeof cleanKey === 'function' ? cleanKey : (key)=>key;
    let parent;
    let value = state;
    for (const key of arrayPath){
        const isObj = (0, $a3ce00f3b8bc7d2a$export$2e2bcd8739ae039)(value);
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


export {$4c453324a2f6c347$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=getDeepValueParentByArray.f21614ef.js.map
