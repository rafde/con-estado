var $419219214aba1cb9$exports = require("./compareCallback.2079ce47.js");
var $1bd0cdd18502aba8$exports = require("./createArrayPathProxy.ab328523.js");
var $069d12a0bf52ad58$exports = require("./createHistory.ec8bc7ac.js");
var $dac5af36f6b384ef$exports = require("./findChanges.511fd29d.js");
var $fb603c3c532f1444$exports = require("./getCacheStringPathToArray.5aba57d4.js");
var $f44519dee7c350e3$exports = require("./getDeepArrayPath.d10a740a.js");
var $c5da10901162cf4d$exports = require("./getDeepValueParentByArray.de9c2d96.js");
var $498b0625b1b9d996$exports = require("./noop.9290b904.js");
var $2GNbJ$mutative = require("mutative");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "default", () => $4d0492d47854ee67$export$2e2bcd8739ae039);









const $4d0492d47854ee67$var$opts = Object.freeze({});
function $4d0492d47854ee67$export$2e2bcd8739ae039(initial, options = $4d0492d47854ee67$var$opts) {
    if (initial == null || typeof initial !== 'object') throw new Error(`createCon can only work with plain objects \`{}\` or arrays \`[]. Value is ${initial} of type ${typeof initial}`);
    let history = (0, $069d12a0bf52ad58$exports.default)({
        initial: initial
    });
    const { afterChange: afterChange = (0, $498b0625b1b9d996$exports.default), dispatcher: dispatcher = (0, $498b0625b1b9d996$exports.default) } = options;
    const compare = (0, $419219214aba1cb9$exports.default)(options.compare);
    const arrayPathMap = new Map();
    function setHistory(nextHistory) {
        history = nextHistory;
        dispatcher(history);
        Promise.resolve().then(()=>afterChange(history));
        return nextHistory;
    }
    function getDraft(stateHistoryPath) {
        const [_draft, _finalize] = (0, $2GNbJ$mutative.create)({
            initial: history.initial,
            state: history.state
        }, {
            strict: true
        });
        function finalize() {
            const next = _finalize();
            let { initial: initial, state: state } = next;
            const hasNoStateChanges = compare(history.state, state, 'state', [
                'state'
            ]);
            const hasNoInitialChanges = compare(history.initial, initial, 'initial', [
                'initial'
            ]);
            if (hasNoStateChanges && hasNoInitialChanges) return history;
            if (hasNoStateChanges) state = history.state;
            if (hasNoInitialChanges) initial = history.initial;
            const { changes: changes } = (0, $dac5af36f6b384ef$exports.default)(initial, state, compare);
            const nextHistory = {
                changes: changes,
                priorInitial: initial !== history.initial ? history.initial : history.priorInitial,
                state: state,
                initial: initial,
                priorState: state !== history.state ? history.state : history.priorState
            };
            return setHistory(nextHistory);
        }
        const draft = _draft;
        if (typeof stateHistoryPath === 'string') {
            const value = (0, $f44519dee7c350e3$exports.default)(_draft, (0, $fb603c3c532f1444$exports.default)(arrayPathMap, stateHistoryPath));
            if (value == null || !(0, $2GNbJ$mutative.isDraft)(value)) throw new Error(`Key path ${stateHistoryPath} cannot be a draft. It's value is ${draft} of type ${typeof draft}`);
            return [
                value,
                finalize
            ];
        }
        return [
            draft,
            finalize
        ];
    }
    function _set(...args) {
        const [targetStatePath, ...props] = args;
        const [draft, finalize] = getDraft(targetStatePath);
        const [statePath, nextState] = props;
        if (props.length === 1) {
            if (typeof statePath === 'function') {
                const callBackProps = {
                    ...history,
                    draft: draft
                };
                statePath(callBackProps);
            }
        } else if (typeof statePath === 'string' || Array.isArray(statePath)) {
            const arrayPath = typeof statePath === 'string' ? (0, $fb603c3c532f1444$exports.default)(arrayPathMap, statePath) : statePath;
            const penPath = arrayPath.at(-1);
            const [value, parent] = (0, $c5da10901162cf4d$exports.default)(draft, arrayPath);
            if (typeof nextState === 'function' && value && typeof value === 'object') nextState((0, $1bd0cdd18502aba8$exports.default)(value, history, arrayPath.slice(1)));
            else if (parent && typeof parent === 'object' && typeof penPath !== 'undefined' && penPath in parent) {
                if (typeof nextState === 'function') {
                    const result = nextState((0, $1bd0cdd18502aba8$exports.default)(parent, history, arrayPath.slice(1)));
                    Reflect.set(parent, penPath, result);
                } else Reflect.set(parent, penPath, nextState);
            }
        }
        return finalize();
    }
    const props = {
        get (stateHistoryPath) {
            if (stateHistoryPath == null) // No argument version
            return history;
            return (0, $f44519dee7c350e3$exports.default)(history, (0, $fb603c3c532f1444$exports.default)(arrayPathMap, stateHistoryPath));
        },
        getDraft: getDraft,
        reset () {
            if (history.changes == null) return history;
            return setHistory({
                initial: history.initial,
                changes: undefined,
                priorInitial: history.priorInitial == null ? undefined : history.initial,
                priorState: history.priorState == null ? undefined : history.state,
                state: history.initial
            });
        },
        set (...args) {
            return _set(undefined, ...args);
        }
    };
    return props;
}


//# sourceMappingURL=createCon.37c4a8ae.js.map
