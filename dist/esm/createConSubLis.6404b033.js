import $a44c0da974c26edd$export$2e2bcd8739ae039 from "./createConBase.459a9e9e.js";


function $6f9dcaecb61600d2$export$2e2bcd8739ae039(initial, options) {
    const estado = (0, $a44c0da974c26edd$export$2e2bcd8739ae039)(initial, options);
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


export {$6f9dcaecb61600d2$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=createConSubLis.6404b033.js.map
