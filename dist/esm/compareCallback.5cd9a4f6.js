import {strictDeepEqual as $5oiCz$strictDeepEqual} from "fast-equals";


function $305a480c841798c0$export$2e2bcd8739ae039(compare) {
    if (typeof compare !== 'function') return function cmp(previousValue, nextValue) {
        return (0, $5oiCz$strictDeepEqual)(previousValue, nextValue);
    };
    return function cmp(previousValue, nextValue, key, keys) {
        return Boolean(compare(previousValue, nextValue, {
            cmp: (0, $5oiCz$strictDeepEqual),
            key: key,
            keys: keys
        }));
    };
}


export {$305a480c841798c0$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=compareCallback.5cd9a4f6.js.map
