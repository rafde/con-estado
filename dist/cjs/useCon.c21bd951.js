var $4d0492d47854ee67$exports = require("./createCon.37c4a8ae.js");
var $62af15b286d6e3ed$exports = require("./createConActs.61f676e1.js");
var $245e12e9eae8ef21$exports = require("./defaultSelector.e388f876.js");
var $8fvci$react = require("react");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "default", () => $63cd764aded4707e$export$2e2bcd8739ae039);




function $63cd764aded4707e$export$2e2bcd8739ae039(initial, options) {
    const [state, setState] = (0, $8fvci$react.useState)(()=>{
        const { selector: selector = (0, $245e12e9eae8ef21$exports.default), ..._options } = options ?? {};
        const conProps = (0, $4d0492d47854ee67$exports.default)(initial, _options);
        const conActProps = {
            ...conProps,
            getDraft (...args) {
                const [draft, _finalize] = conProps.getDraft(...args);
                function finalize() {
                    const oldHistory = conProps.get();
                    const results = _finalize();
                    const newHistory = conProps.get();
                    if (oldHistory === newHistory) return results;
                    setState(selector({
                        ...propsConActs.get(),
                        ...propsConActs
                    }));
                    return results;
                }
                return [
                    draft,
                    finalize
                ];
            },
            reset () {
                const oldHistory = conProps.get();
                const results = conProps.reset();
                const newHistory = conProps.get();
                if (oldHistory === newHistory) return results;
                setState(selector({
                    ...propsConActs.get(),
                    ...propsConActs
                }));
                return results;
            },
            set (...args) {
                const oldHistory = conProps.get();
                const results = conProps.set(...args);
                const newHistory = conProps.get();
                if (oldHistory === newHistory) return results;
                setState(selector({
                    ...propsConActs.get(),
                    ...propsConActs
                }));
                return results;
            }
        };
        const propsConActs = (0, $62af15b286d6e3ed$exports.default)(conActProps, options?.acts);
        return selector({
            ...propsConActs,
            ...conActProps.get()
        });
    });
    return state;
}


//# sourceMappingURL=useCon.c21bd951.js.map
