import $ff6b69735ad772bf$export$2e2bcd8739ae039 from "./splitPath.c7e2ae48.js";


function $338fa7ab84f437b3$export$2e2bcd8739ae039(map, stringPath) {
    const stringPathArray = map.get(stringPath);
    if (Array.isArray(stringPathArray)) return stringPathArray;
    const arr = (0, $ff6b69735ad772bf$export$2e2bcd8739ae039)(stringPath);
    map.set(stringPath, arr);
    return arr;
}


export {$338fa7ab84f437b3$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=getCacheStringPathToArray.c500db8b.js.map
