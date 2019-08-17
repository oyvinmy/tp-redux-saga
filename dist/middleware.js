"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.take = exports.fork = exports.put = exports.call = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var actionListeners = new Map();
var i = 0;
var rootSaga = {
  generatorFunc: null,
  started: false
};

var tpReduxSagaMiddleware = function tpReduxSagaMiddleware(store) {
  return function (next) {
    return function (action) {
      console.log('received action', action, i++);
      var handler = actionListeners.get(action.type);

      if (!handler && rootSaga.started) {
        return next(action);
      }

      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var g;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!rootSaga.started) {
                  g = rootSaga.generatorFunc();
                  rootSaga.started = true;
                  console.log('starting root saga', i++);
                  runUntilgeneratorIsDoneOrEffectIsTake(g, store);
                  console.log('rootsaga finished', i++);
                  handler = actionListeners.get(action.type);
                }

                if (handler) {
                  actionListeners["delete"](action.type);
                  runUntilgeneratorIsDoneOrEffectIsTake(handler, store);
                }

                console.log('action finished', action, i++);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();

      console.log('end of middleware', i++);
      return next(action);
    };
  };
};

function runUntilgeneratorIsDoneOrEffectIsTake(_x, _x2) {
  return _runUntilgeneratorIsDoneOrEffectIsTake.apply(this, arguments);
}

function _runUntilgeneratorIsDoneOrEffectIsTake() {
  _runUntilgeneratorIsDoneOrEffectIsTake = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(handler, store) {
    var take, yieldedValue, effect, newlyAddedGenerator, g, action;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            take = false;
            yieldedValue = handler.next();

          case 2:
            if (!(!yieldedValue.done && !take)) {
              _context2.next = 27;
              break;
            }

            console.log(i++);
            effect = yieldedValue.value;
            _context2.t0 = effect.type;
            _context2.next = _context2.t0 === 'effect/CALL' ? 8 : _context2.t0 === 'effect/PUT' ? 10 : _context2.t0 === 'effect/FORK' ? 13 : _context2.t0 === 'effect/TAKE' ? 20 : 25;
            break;

          case 8:
            handler.next('json');
            return _context2.abrupt("break", 25);

          case 10:
            store.dispatch(effect.payload.action);
            yieldedValue = handler.next();
            return _context2.abrupt("break", 25);

          case 13:
            newlyAddedGenerator = effect.payload.fn;
            g = newlyAddedGenerator();
            runUntilgeneratorIsDoneOrEffectIsTake(g, store);
            yieldedValue = handler.next();
            console.log('fork finished', g, i++);
            debugger;
            return _context2.abrupt("break", 25);

          case 20:
            action = effect.payload.action;
            actionListeners.set(action, handler);
            console.log('action listener registered', action, handler, i++);
            take = true;
            return _context2.abrupt("break", 25);

          case 25:
            _context2.next = 2;
            break;

          case 27:
            return _context2.abrupt("return");

          case 28:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _runUntilgeneratorIsDoneOrEffectIsTake.apply(this, arguments);
}

var createTpReduxSagaMiddleware = function createTpReduxSagaMiddleware() {
  var run = function run(_rootSaga) {
    if (rootSaga.generatorFunc) {
      throw 'rootsaga already given!!';
    }

    rootSaga.generatorFunc = _rootSaga;
  };

  return {
    middleware: tpReduxSagaMiddleware,
    run: run
  };
};

var call = function call(fn) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return {
    type: 'effect/CALL',
    payload: {
      fn: fn,
      args: args
    }
  };
};

exports.call = call;

var put = function put(action) {
  return {
    type: 'effect/PUT',
    payload: {
      action: action
    }
  };
};

exports.put = put;

var fork = function fork(generatorFn) {
  return {
    type: 'effect/FORK',
    payload: {
      fn: generatorFn
    }
  };
};

exports.fork = fork;

var take = function take(action) {
  return {
    type: 'effect/TAKE',
    payload: {
      action: action
    }
  };
};

exports.take = take;
var _default = createTpReduxSagaMiddleware;
exports["default"] = _default;