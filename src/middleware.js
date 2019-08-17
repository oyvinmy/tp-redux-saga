const actionListeners = new Map();
let i = 0;

let rootSaga = {
    generatorFunc: null,
    started: false,
};

const tpReduxSagaMiddleware = store => next => action => {
    console.log('received action', action, i++)
    let handler = actionListeners.get(action.type);
    if (!handler && rootSaga.started) {
        return next(action);
    }
    (async () => {
        if (!rootSaga.started) {
            const g = rootSaga.generatorFunc();
            rootSaga.started = true;
            console.log('starting root saga', i++);
            runUntilgeneratorIsDoneOrEffectIsTake(g, store);
            console.log('rootsaga finished', i++);
            handler = actionListeners.get(action.type);
        }
        if (handler) {
            actionListeners.delete(action.type);
            runUntilgeneratorIsDoneOrEffectIsTake(handler, store);
        }
        console.log('action finished', action, i++);
    })();
    console.log('end of middleware', i++);
    return next(action);
}


async function runUntilgeneratorIsDoneOrEffectIsTake(handler, store) {
    let take = false;
    let yieldedValue = handler.next();
    while (!yieldedValue.done && !take) {
        console.log(i++);
        const effect = yieldedValue.value;
        switch (effect.type) {
            case 'effect/CALL':
                try {
                    const response = await effect.payload.fn(...effect.payload.args);
                    const json = await response.json();
                    yieldedValue = handler.next(json);
                } catch (err) {
                    yieldedValue = handler.next(err);
                }
                break;
            case 'effect/PUT':
                store.dispatch(effect.payload.action);
                yieldedValue = handler.next();
                break;
            case 'effect/FORK':
                const newlyAddedGenerator = effect.payload.fn;
                const g = newlyAddedGenerator();
                runUntilgeneratorIsDoneOrEffectIsTake(g, store);
                yieldedValue = handler.next();
                console.log('fork finished', g, i++);
                debugger;
                break;
            case 'effect/TAKE':
                const action = effect.payload.action;
                actionListeners.set(action, handler);
                console.log('action listener registered', action, handler, i++);
                take = true;
                break;
        }
    }
    return;
}



const createTpReduxSagaMiddleware = () => {

    const run = (_rootSaga) => {
        if (rootSaga.generatorFunc) {
            throw 'rootsaga already given!!';
        }
        rootSaga.generatorFunc = _rootSaga;
    }

    return {
        middleware: tpReduxSagaMiddleware,
        run,
    }
}


export const call = (fn, ...args) => ({
    type: 'effect/CALL',
    payload: {
        fn,
        args
    }
})

export const put = (action) => ({
    type: 'effect/PUT',
    payload: {
        action,
    }
})

export const fork = (generatorFn) => ({
    type: 'effect/FORK',
    payload: {
        fn: generatorFn,
    }
})

export const take = (action) => ({
    type: 'effect/TAKE',
    payload: {
        action,
    }
})

export default createTpReduxSagaMiddleware;
