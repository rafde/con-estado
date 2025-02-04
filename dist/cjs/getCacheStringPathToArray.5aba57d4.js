var $8fcb741dc81cd0aa$exports = require("./splitPath.3fd98539.js");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "default", () => $fb603c3c532f1444$export$2e2bcd8739ae039);

function $fb603c3c532f1444$export$2e2bcd8739ae039(map, stringPath) {
    const stringPathArray = map.get(stringPath);
    if (Array.isArray(stringPathArray)) return stringPathArray;
    const arr = (0, $8fcb741dc81cd0aa$exports.default)(stringPath);
    map.set(stringPath, arr);
    return arr;
}


//# sourceMappingURL=getCacheStringPathToArray.5aba57d4.js.map
