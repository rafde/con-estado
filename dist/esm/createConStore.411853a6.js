import $3adb1345d8f66221$export$2e2bcd8739ae039 from "./defaultSelector.127c1be1.js";
import $6f9dcaecb61600d2$export$2e2bcd8739ae039 from "./createConSubLis.6404b033.js";
import {strictDeepEqual as $dMD9n$strictDeepEqual} from "fast-equals";
import {useMemo as $dMD9n$useMemo, useRef as $dMD9n$useRef, useCallback as $dMD9n$useCallback, useSyncExternalStore as $dMD9n$useSyncExternalStore} from "react";





function $d7bad4ea869ebc5c$export$2e2bcd8739ae039(initial, options) {
    const { selector: selector = (0, $3adb1345d8f66221$export$2e2bcd8739ae039), ..._options } = options ?? {};
    const estadoSubLis = (0, $6f9dcaecb61600d2$export$2e2bcd8739ae039)(initial, {
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
        const _selector = (0, $dMD9n$useMemo)(()=>{
            if (typeof select === 'function') return select;
            return selector;
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        []);
        const resultRef = (0, $dMD9n$useRef)(null);
        const selectorCallback = (0, $dMD9n$useCallback)((snapshot)=>{
            const result = _selector(snapshot);
            if (!(0, $dMD9n$strictDeepEqual)(resultRef.current, result)) resultRef.current = result;
            return resultRef.current;
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        []);
        // @see {@link https://github.com/facebook/react/blob/main/packages/use-sync-external-store/src/useSyncExternalStoreShimClient.js}
        return (0, $dMD9n$useSyncExternalStore)(subscribe, ()=>selectorCallback(snapshot), ()=>selectorCallback(initialSnapshot));
    }
    return Object.assign(useConSelector, estado);
}


export {$d7bad4ea869ebc5c$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=createConStore.411853a6.js.map
