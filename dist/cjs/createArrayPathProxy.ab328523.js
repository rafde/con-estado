var $c5da10901162cf4d$exports = require("./getDeepValueParentByArray.de9c2d96.js");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "default", () => $1bd0cdd18502aba8$export$2e2bcd8739ae039);

function $1bd0cdd18502aba8$export$2e2bcd8739ae039(targetState, history, arrayPath) {
    return new Proxy({
        ...history,
        draft: targetState
    }, {
        get (target, prop) {
            if (prop in target) return Reflect.get(target, prop);
            switch(prop){
                case 'changesProp':
                    {
                        const [prop] = (0, $c5da10901162cf4d$exports.default)(history.changes, arrayPath);
                        target.changesProp = prop;
                        return prop;
                    }
                case 'initialProp':
                    {
                        const [prop] = (0, $c5da10901162cf4d$exports.default)(history.initial, arrayPath);
                        target.initialProp = prop;
                        return prop;
                    }
                case 'priorInitialProp':
                    {
                        const [prop] = (0, $c5da10901162cf4d$exports.default)(history.priorInitial, arrayPath);
                        target.priorInitialProp = prop;
                        return prop;
                    }
                case 'priorStateProp':
                    {
                        const [prop] = (0, $c5da10901162cf4d$exports.default)(history.priorState, arrayPath);
                        target.priorStateProp = prop;
                        return prop;
                    }
                case 'stateProp':
                    {
                        const [prop] = (0, $c5da10901162cf4d$exports.default)(history.state, arrayPath);
                        target.stateProp = prop;
                        return prop;
                    }
                default:
                    return Reflect.get(target, prop);
            }
        }
    });
}


//# sourceMappingURL=createArrayPathProxy.ab328523.js.map
