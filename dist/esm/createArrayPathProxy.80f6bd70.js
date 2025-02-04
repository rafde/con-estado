import $4c453324a2f6c347$export$2e2bcd8739ae039 from "./getDeepValueParentByArray.f21614ef.js";


function $60ecca530494c287$export$2e2bcd8739ae039(targetState, history, arrayPath) {
    return new Proxy({
        ...history,
        draft: targetState
    }, {
        get (target, prop) {
            if (prop in target) return Reflect.get(target, prop);
            switch(prop){
                case 'changesProp':
                    {
                        const [prop] = (0, $4c453324a2f6c347$export$2e2bcd8739ae039)(history.changes, arrayPath);
                        target.changesProp = prop;
                        return prop;
                    }
                case 'initialProp':
                    {
                        const [prop] = (0, $4c453324a2f6c347$export$2e2bcd8739ae039)(history.initial, arrayPath);
                        target.initialProp = prop;
                        return prop;
                    }
                case 'priorInitialProp':
                    {
                        const [prop] = (0, $4c453324a2f6c347$export$2e2bcd8739ae039)(history.priorInitial, arrayPath);
                        target.priorInitialProp = prop;
                        return prop;
                    }
                case 'priorStateProp':
                    {
                        const [prop] = (0, $4c453324a2f6c347$export$2e2bcd8739ae039)(history.priorState, arrayPath);
                        target.priorStateProp = prop;
                        return prop;
                    }
                case 'stateProp':
                    {
                        const [prop] = (0, $4c453324a2f6c347$export$2e2bcd8739ae039)(history.state, arrayPath);
                        target.stateProp = prop;
                        return prop;
                    }
                default:
                    return Reflect.get(target, prop);
            }
        }
    });
}


export {$60ecca530494c287$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=createArrayPathProxy.80f6bd70.js.map
