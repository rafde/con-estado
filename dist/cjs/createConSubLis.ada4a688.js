var $54fa5710c099c43b$exports = require("./createConBase.dd541a1b.js");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "default", () => $257d3724e6fb79a5$export$2e2bcd8739ae039);

function $257d3724e6fb79a5$export$2e2bcd8739ae039(initial, options) {
    const estado = (0, $54fa5710c099c43b$exports.default)(initial, options);
    const listeners = new Set();
    function subscribe(listener) {
        listeners.add(listener);
        return ()=>{
            listeners.delete(listener);
        };
    }
    return {
        ...estado,
        subscribe: subscribe,
        listeners: listeners
    };
}


//# sourceMappingURL=createConSubLis.ada4a688.js.map
