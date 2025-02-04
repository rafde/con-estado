import $fac07949b04643d2$export$2e2bcd8739ae039 from "./createCon.b965a764.js";
import $3e626f038f0b1baf$export$2e2bcd8739ae039 from "./createConActs.e32eb34a.js";
import $3adb1345d8f66221$export$2e2bcd8739ae039 from "./defaultSelector.127c1be1.js";
import {useState as $cPMDf$useState} from "react";





function $302fdae48f0d70d4$export$2e2bcd8739ae039(initial, options) {
    const [state, setState] = (0, $cPMDf$useState)(()=>{
        const { selector: selector = (0, $3adb1345d8f66221$export$2e2bcd8739ae039), ..._options } = options ?? {};
        const conProps = (0, $fac07949b04643d2$export$2e2bcd8739ae039)(initial, _options);
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
        const propsConActs = (0, $3e626f038f0b1baf$export$2e2bcd8739ae039)(conActProps, options?.acts);
        return selector({
            ...propsConActs,
            ...conActProps.get()
        });
    });
    return state;
}


export {$302fdae48f0d70d4$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=useCon.b43f920e.js.map
