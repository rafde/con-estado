var $245e12e9eae8ef21$exports = require("./defaultSelector.e388f876.js");
var $257d3724e6fb79a5$exports = require("./createConSubLis.ada4a688.js");
var $hQIuc$fastequals = require("fast-equals");
var $hQIuc$react = require("react");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "default", () => $9be2f5720305def6$export$2e2bcd8739ae039);




function $9be2f5720305def6$export$2e2bcd8739ae039(initial, options) {
    const { selector: selector = (0, $245e12e9eae8ef21$exports.default), ..._options } = options ?? {};
    const estadoSubLis = (0, $257d3724e6fb79a5$exports.default)(initial, {
        ..._options,
        dispatcher (nextHistory) {
            snapshot = {
                ...nextHistory,
                ...estado
            };
            listeners.forEach((listener)=>listener(snapshot));
        }
    });
    const { subscribe: subscribe, listeners: listeners, ...estado } = estadoSubLis;
    const initialSnapshot = {
        ...estado.get(),
        ...estado
    };
    let snapshot = initialSnapshot;
    function useConSelector(select) {
        const _selector = (0, $hQIuc$react.useMemo)(()=>{
            if (typeof select === 'function') return select;
            return selector;
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        []);
        const resultRef = (0, $hQIuc$react.useRef)(null);
        const selectorCallback = (0, $hQIuc$react.useCallback)((snapshot)=>{
            const result = _selector(snapshot);
            if (!(0, $hQIuc$fastequals.strictDeepEqual)(resultRef.current, result)) resultRef.current = result;
            return resultRef.current;
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        []);
        // @see {@link https://github.com/facebook/react/blob/main/packages/use-sync-external-store/src/useSyncExternalStoreShimClient.js}
        return (0, $hQIuc$react.useSyncExternalStore)(subscribe, ()=>selectorCallback(snapshot), ()=>selectorCallback(initialSnapshot));
    }
    return Object.assign(useConSelector, estado);
}


//# sourceMappingURL=createConStore.c460eabb.js.map
