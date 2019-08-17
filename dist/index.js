"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "call", {
  enumerable: true,
  get: function get() {
    return _middleware.call;
  }
});
Object.defineProperty(exports, "put", {
  enumerable: true,
  get: function get() {
    return _middleware.put;
  }
});
Object.defineProperty(exports, "fork", {
  enumerable: true,
  get: function get() {
    return _middleware.fork;
  }
});
Object.defineProperty(exports, "take", {
  enumerable: true,
  get: function get() {
    return _middleware.take;
  }
});
exports["default"] = void 0;

var _middleware = _interopRequireWildcard(require("./middleware"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var _default = _middleware["default"];
exports["default"] = _default;