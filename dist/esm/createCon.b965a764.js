import $305a480c841798c0$export$2e2bcd8739ae039 from "./compareCallback.5cd9a4f6.js";
import $60ecca530494c287$export$2e2bcd8739ae039 from "./createArrayPathProxy.80f6bd70.js";
import $6d626219173ff37f$export$2e2bcd8739ae039 from "./createHistory.6c4d087b.js";
import $f29a2162fe66edb3$export$2e2bcd8739ae039 from "./findChanges.d990ea92.js";
import $338fa7ab84f437b3$export$2e2bcd8739ae039 from "./getCacheStringPathToArray.c500db8b.js";
import $2693155445455cee$export$2e2bcd8739ae039 from "./getDeepArrayPath.2c7c45e3.js";
import $4c453324a2f6c347$export$2e2bcd8739ae039 from "./getDeepValueParentByArray.f21614ef.js";
import $5c25839d6e26919c$export$2e2bcd8739ae039 from "./noop.a2eee869.js";
import {create as $1lDdP$create, isDraft as $1lDdP$isDraft} from "mutative";










const $fac07949b04643d2$var$opts = Object.freeze({});
function $fac07949b04643d2$export$2e2bcd8739ae039(initial, options = $fac07949b04643d2$var$opts) {
    if (initial == null || typeof initial !== 'object') throw new Error(`createCon can only work with plain objects \`{}\` or arrays \`[]. Value is ${initial} of type ${typeof initial}`);
    let history = (0, $6d626219173ff37f$export$2e2bcd8739ae039)({
        initial: initial
    });
    const { afterChange: afterChange = (0, $5c25839d6e26919c$export$2e2bcd8739ae039), dispatcher: dispatcher = (0, $5c25839d6e26919c$export$2e2bcd8739ae039) } = options;
    const compare = (0, $305a480c841798c0$export$2e2bcd8739ae039)(options.compare);
    const arrayPathMap = new Map();
    function setHistory(nextHistory) {
        history = nextHistory;
        dispatcher(history);
        Promise.resolve().then(()=>afterChange(history));
        return nextHistory;
    }
    function getDraft(stateHistoryPath) {
        const [_draft, _finalize] = (0, $1lDdP$create)({
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
            const { changes: changes } = (0, $f29a2162fe66edb3$export$2e2bcd8739ae039)(initial, state, compare);
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
            const value = (0, $2693155445455cee$export$2e2bcd8739ae039)(_draft, (0, $338fa7ab84f437b3$export$2e2bcd8739ae039)(arrayPathMap, stateHistoryPath));
            if (value == null || !(0, $1lDdP$isDraft)(value)) throw new Error(`Key path ${stateHistoryPath} cannot be a draft. It's value is ${draft} of type ${typeof draft}`);
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
            const arrayPath = typeof statePath === 'string' ? (0, $338fa7ab84f437b3$export$2e2bcd8739ae039)(arrayPathMap, statePath) : statePath;
            const penPath = arrayPath.at(-1);
            const [value, parent] = (0, $4c453324a2f6c347$export$2e2bcd8739ae039)(draft, arrayPath);
            if (typeof nextState === 'function' && value && typeof value === 'object') nextState((0, $60ecca530494c287$export$2e2bcd8739ae039)(value, history, arrayPath.slice(1)));
            else if (parent && typeof parent === 'object' && typeof penPath !== 'undefined' && penPath in parent) {
                if (typeof nextState === 'function') {
                    const result = nextState((0, $60ecca530494c287$export$2e2bcd8739ae039)(parent, history, arrayPath.slice(1)));
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
            return (0, $2693155445455cee$export$2e2bcd8739ae039)(history, (0, $338fa7ab84f437b3$export$2e2bcd8739ae039)(arrayPathMap, stateHistoryPath));
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


export {$fac07949b04643d2$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=createCon.b965a764.js.map
