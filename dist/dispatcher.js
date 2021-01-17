"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dispatcher = void 0;
var dotenv_1 = require("dotenv");
var errors_1 = require("./errors");
// require our environment variables
dotenv_1.config();
var Dispatcher = /** @class */ (function () {
    function Dispatcher() {
    }
    Dispatcher.initialize = function (_a) {
        var serviceName = _a.serviceName, environment = _a.environment, instance = _a.instance, emit = _a.emit, register = _a.register;
        Dispatcher._serviceName = serviceName || process.env.SERVICE_NAME;
        if (!Dispatcher._serviceName || Dispatcher._serviceName === '') {
            throw new Error(errors_1.ERROR_MESSAGES.MISSING_SERVICE_NAME);
        }
        Dispatcher._environment = environment || process.env.ENVIRONMENT;
        if (!Dispatcher._environment || Dispatcher._environment === '') {
            throw new Error(errors_1.ERROR_MESSAGES.MISSING_ENVIRONMENT);
        }
        if (!emit || typeof emit !== 'function') {
            throw new Error(errors_1.ERROR_MESSAGES.MISSING_EMIT_FUNCTION);
        }
        Dispatcher._emit = emit;
        if (!register || typeof register !== 'function') {
            throw new Error(errors_1.ERROR_MESSAGES.MISSING_REGISTER_HANDLER);
        }
        Dispatcher._register = register;
        if (instance) {
            Dispatcher._instance = instance;
        }
        else {
            Dispatcher._instance = Dispatcher._environment + "-" + Dispatcher._serviceName + "-" + process.pid;
        }
    };
    Dispatcher.getServiceName = function () {
        if (!Dispatcher.isInitialized()) {
            throw new Error(errors_1.ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
        }
        return Dispatcher._serviceName;
    };
    Dispatcher.getEnvironment = function () {
        if (!Dispatcher.isInitialized()) {
            throw new Error(errors_1.ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
        }
        return Dispatcher._environment;
    };
    Dispatcher.getInstance = function () {
        if (!Dispatcher.isInitialized()) {
            throw new Error(errors_1.ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
        }
        return Dispatcher._instance;
    };
    Dispatcher.isInitialized = function () {
        return !!(Dispatcher._serviceName
            && Dispatcher._environment
            && Dispatcher._instance
            && Dispatcher._emit
            && Dispatcher._register);
    };
    Dispatcher.emitEvent = function (transactionId, event, payload) {
        if (!Dispatcher.isInitialized()) {
            throw new Error(errors_1.ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
        }
        var topic = Dispatcher._environment + "." + event;
        Dispatcher._emit(topic, {
            transactionId: transactionId,
            payload: payload,
            service: {
                environment: Dispatcher._environment,
                serviceName: Dispatcher._serviceName,
                instance: Dispatcher._instance,
            },
        });
    };
    Dispatcher.emitTask = function (transactionId, service, task, payload) {
        if (!Dispatcher.isInitialized()) {
            throw new Error(errors_1.ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
        }
        var topic = Dispatcher._environment + "." + service + "." + task;
        Dispatcher._emit(topic, {
            transactionId: transactionId,
            payload: payload,
            service: {
                environment: Dispatcher._environment,
                serviceName: Dispatcher._serviceName,
                instance: Dispatcher._instance,
            },
        });
    };
    Dispatcher.emitInstanceTask = function (transactionId, instance, service, task, payload) {
        if (!Dispatcher.isInitialized()) {
            throw new Error(errors_1.ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
        }
        var topic = Dispatcher._environment + "." + service + "." + instance + "." + task;
        Dispatcher._emit(topic, {
            transactionId: transactionId,
            payload: payload,
            service: {
                environment: Dispatcher._environment,
                serviceName: Dispatcher._serviceName,
                instance: Dispatcher._instance,
            },
        });
    };
    Dispatcher.registerEventHandler = function (event, handler) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!Dispatcher.isInitialized()) {
                    throw new Error(errors_1.ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
                }
                try {
                    Dispatcher._register(Dispatcher._environment + "." + event, function (data) {
                        try {
                            handler(data);
                        }
                        catch (error) {
                            error(errors_1.ERROR_MESSAGES.HANDLING_EVENT, event, error.message);
                        }
                    });
                }
                catch (error) {
                    error(errors_1.ERROR_MESSAGES.REGISTERING_EVENT, event, error.message);
                }
                return [2 /*return*/];
            });
        });
    };
    Dispatcher.registerTaskHandler = function (task, handler) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!Dispatcher.isInitialized()) {
                    throw new Error(errors_1.ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
                }
                try {
                    Dispatcher._register(Dispatcher._environment + "." + Dispatcher._serviceName + "." + task, function (data) {
                        try {
                            handler(data);
                        }
                        catch (error) {
                            error(errors_1.ERROR_MESSAGES.HANDLING_EVENT, task, error.message);
                        }
                    });
                }
                catch (error) {
                    error(errors_1.ERROR_MESSAGES.REGISTERING_TASK, task, error.message);
                }
                return [2 /*return*/];
            });
        });
    };
    Dispatcher.registerInstanceTaskHandler = function (task, handler) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!Dispatcher.isInitialized()) {
                    throw new Error(errors_1.ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
                }
                try {
                    Dispatcher._register(Dispatcher._environment + "." + Dispatcher._serviceName + "." + Dispatcher._instance + "." + task, function (data) {
                        try {
                            handler(data);
                        }
                        catch (error) {
                            error(errors_1.ERROR_MESSAGES.HANDLING_EVENT, task, error.message);
                        }
                    });
                }
                catch (error) {
                    error(errors_1.ERROR_MESSAGES.REGISTERING_TASK, task, error.message);
                }
                return [2 /*return*/];
            });
        });
    };
    return Dispatcher;
}());
exports.Dispatcher = Dispatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzcGF0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9kaXNwYXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlDQUFpRTtBQVFqRSxtQ0FBMEM7QUFFMUMsb0NBQW9DO0FBQ3BDLGVBQTZCLEVBQUUsQ0FBQztBQUVoQztJQUFBO0lBc05BLENBQUM7SUEvTWUscUJBQVUsR0FBeEIsVUFDRSxFQU1jO1lBTFosV0FBVyxpQkFBQSxFQUNYLFdBQVcsaUJBQUEsRUFDWCxRQUFRLGNBQUEsRUFDUixJQUFJLFVBQUEsRUFDSixRQUFRLGNBQUE7UUFHVixVQUFVLENBQUMsWUFBWSxHQUFHLFdBQVcsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztRQUNsRSxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksSUFBSSxVQUFVLENBQUMsWUFBWSxLQUFLLEVBQUUsRUFBRTtZQUM5RCxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUFjLENBQUMsb0JBQW9CLENBQUMsQ0FBQztTQUN0RDtRQUVELFVBQVUsQ0FBQyxZQUFZLEdBQUcsV0FBVyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxJQUFJLFVBQVUsQ0FBQyxZQUFZLEtBQUssRUFBRSxFQUFFO1lBQzlELE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQ3JEO1FBRUQsSUFBSSxDQUFDLElBQUksSUFBSSxPQUFPLElBQUksS0FBSyxVQUFVLEVBQUU7WUFDdkMsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBYyxDQUFDLHFCQUFxQixDQUFDLENBQUM7U0FDdkQ7UUFDRCxVQUFVLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUV4QixJQUFJLENBQUMsUUFBUSxJQUFJLE9BQU8sUUFBUSxL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Y0FBYyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7eUJBQzNEO29CQUNILENBQUMsQ0FDRixDQUFDO2lCQUNIO2dCQUFDLE9BQU8sS0FBSyxFQUFFO29CQUNkLEtBQUssQ0FBQyx1QkFBYyxDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzdEOzs7O0tBQ0Y7SUFDSCxpQkFBQztBQUFELENBQUMsQUF0TkQsSUFzTkM7QUF0TlksZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb25maWcgYXMgY29uZmlndXJlRW52aXJvbm1lbnRWYXJpYWJsZXMgfSBmcm9tICdkb3RlbnYnO1xuaW1wb3J0IHtcbiAgUGF5bG9hZERhdGEsXG4gIEhhbmRsZXJCYXNlLFxuICBFbWl0RnVuY3Rpb24sXG4gIFJlZ2lzdGVySGFuZGxlcixcbiAgSW5pdE9wdGlvbnMsXG59IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgRVJST1JfTUVTU0FHRVMgfSBmcm9tICcuL2Vycm9ycyc7XG5cbi8vIHJlcXVpcmUgb3VyIGVudmlyb25tZW50IHZhcmlhYmxlc1xuY29uZmlndXJlRW52aXJvbm1lbnRWYXJpYWJsZXMoKTtcblxuZXhwb3J0IGNsYXNzIERpc3BhdGNoZXIge1xuICBwcml2YXRlIHN0YXRpYyBfc2VydmljZU5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSBzdGF0aWMgX2Vudmlyb25tZW50OiBzdHJpbmc7XG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogc3RyaW5nO1xuICBwcml2YXRlIHN0YXRpYyBfZW1pdDogRW1pdEZ1bmN0aW9uO1xuICBwcml2YXRlIHN0YXRpYyBfcmVnaXN0ZXI6IFJlZ2lzdGVySGFuZGxlcjtcblxuICBwdWJsaWMgc3RhdGljIGluaXRpYWxpemUoXG4gICAge1xuICAgICAgc2VydmljZU5hbWUsXG4gICAgICBlbnZpcm9ubWVudCxcbiAgICAgIGluc3RhbmNlLFxuICAgICAgZW1pdCxcbiAgICAgIHJlZ2lzdGVyLFxuICAgIH06IEluaXRPcHRpb25zLFxuICApOiB2b2lkIHtcbiAgICBEaXNwYXRjaGVyLl9zZXJ2aWNlTmFtZSA9IHNlcnZpY2VOYW1lIHx8IHByb2Nlc3MuZW52LlNFUlZJQ0VfTkFNRTtcbiAgICBpZiAoIURpc3BhdGNoZXIuX3NlcnZpY2VOYW1lIHx8IERpc3BhdGNoZXIuX3NlcnZpY2VOYW1lID09PSAnJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKEVSUk9SX01FU1NBR0VTLk1JU1NJTkdfU0VSVklDRV9OQU1FKTtcbiAgICB9XG5cbiAgICBEaXNwYXRjaGVyLl9lbnZpcm9ubWVudCA9IGVudmlyb25tZW50IHx8IHByb2Nlc3MuZW52LkVOVklST05NRU5UO1xuICAgIGlmICghRGlzcGF0Y2hlci5fZW52aXJvbm1lbnQgfHwgRGlzcGF0Y2hlci5fZW52aXJvbm1lbnQgPT09ICcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoRVJST1JfTUVTU0FHRVMuTUlTU0lOR19FTlZJUk9OTUVOVCk7XG4gICAgfVxuXG4gICAgaWYgKCFlbWl0IHx8IHR5cGVvZiBlbWl0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoRVJST1JfTUVTU0FHRVMuTUlTU0lOR19FTUlUX0ZVTkNUSU9OKTtcbiAgICB9XG4gICAgRGlzcGF0Y2hlci5fZW1pdCA9IGVtaXQ7XG5cbiAgICBpZiAoIXJlZ2lzdGVyIHx8IHR5cGVvZiByZWdpc3RlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKEVSUk9SX01FU1NBR0VTLk1JU1NJTkdfUkVHSVNURVJfSEFORExFUik7XG4gICAgfVxuICAgIERpc3BhdGNoZXIuX3JlZ2lzdGVyID0gcmVnaXN0ZXI7XG5cbiAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgIERpc3BhdGNoZXIuX2luc3RhbmNlID0gaW5zdGFuY2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIERpc3BhdGNoZXIuX2luc3RhbmNlID0gYCR7RGlzcGF0Y2hlci5fZW52aXJvbm1lbnR9LSR7RGlzcGF0Y2hlci5fc2VydmljZU5hbWV9LSR7cHJvY2Vzcy5waWR9YDtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGdldFNlcnZpY2VOYW1lKCk6IHN0cmluZyB7XG4gICAgaWYgKCFEaXNwYXRjaGVyLmlzSW5pdGlhbGl6ZWQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKEVSUk9SX01FU1NBR0VTLlNFUlZJQ0VfTk9UX0lOSVRJQUxJWkVEKTtcbiAgICB9XG4gICAgcmV0dXJuIERpc3BhdGNoZXIuX3NlcnZpY2VOYW1lO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBnZXRFbnZpcm9ubWVudCgpOiBzdHJpbmcge1xuICAgIGlmICghRGlzcGF0Y2hlci5pc0luaXRpYWxpemVkKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihFUlJPUl9NRVNTQUdFUy5TRVJWSUNFX05PVF9JTklUSUFMSVpFRCk7XG4gICAgfVxuICAgIHJldHVybiBEaXNwYXRjaGVyLl9lbnZpcm9ubWVudDtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogc3RyaW5nIHtcbiAgICBpZiAoIURpc3BhdGNoZXIuaXNJbml0aWFsaXplZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoRVJST1JfTUVTU0FHRVMuU0VSVklDRV9OT1RfSU5JVElBTElaRUQpO1xuICAgIH1cbiAgICByZXR1cm4gRGlzcGF0Y2hlci5faW5zdGFuY2U7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGlzSW5pdGlhbGl6ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhKFxuICAgICAgRGlzcGF0Y2hlci5fc2VydmljZU5hbWVcbiAgICAgICYmIERpc3BhdGNoZXIuX2Vudmlyb25tZW50XG4gICAgICAmJiBEaXNwYXRjaGVyLl9pbnN0YW5jZVxuICAgICAgJiYgRGlzcGF0Y2hlci5fZW1pdFxuICAgICAgJiYgRGlzcGF0Y2hlci5fcmVnaXN0ZXJcbiAgICApO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBlbWl0RXZlbnQoXG4gICAgdHJhbnNhY3Rpb25JZDogc3RyaW5nLFxuICAgIGV2ZW50OiBzdHJpbmcsXG4gICAgcGF5bG9hZDogUGF5bG9hZERhdGEsXG4gICk6IHZvaWQge1xuICAgIGlmICghRGlzcGF0Y2hlci5pc0luaXRpYWxpemVkKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihFUlJPUl9NRVNTQUdFUy5TRVJWSUNFX05PVF9JTklUSUFMSVpFRCk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9waWMgPSBgJHtEaXNwYXRjaGVyLl9lbnZpcm9ubWVudH0uJHtldmVudH1gO1xuICAgIERpc3BhdGNoZXIuX2VtaXQoXG4gICAgICB0b3BpYyxcbiAgICAgIHtcbiAgICAgICAgdHJhbnNhY3Rpb25JZCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgICAgc2VydmljZToge1xuICAgICAgICAgIGVudmlyb25tZW50OiBEaXNwYXRjaGVyLl9lbnZpcm9ubWVudCxcbiAgICAgICAgICBzZXJ2aWNlTmFtZTogRGlzcGF0Y2hlci5fc2VydmljZU5hbWUsXG4gICAgICAgICAgaW5zdGFuY2U6IERpc3BhdGNoZXIuX2luc3RhbmNlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBlbWl0VGFzayhcbiAgICB0cmFuc2FjdGlvbklkOiBzdHJpbmcsXG4gICAgc2VydmljZTogc3RyaW5nLFxuICAgIHRhc2s6IHN0cmluZyxcbiAgICBwYXlsb2FkOiBQYXlsb2FkRGF0YSxcbiAgKTogdm9pZCB7XG4gICAgaWYgKCFEaXNwYXRjaGVyLmlzSW5pdGlhbGl6ZWQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKEVSUk9SX01FU1NBR0VTLlNFUlZJQ0VfTk9UX0lOSVRJQUxJWkVEKTtcbiAgICB9XG5cbiAgICBjb25zdCB0b3BpYyA9IGAke0Rpc3BhdGNoZXIuX2Vudmlyb25tZW50fS4ke3NlcnZpY2V9LiR7dGFza31gO1xuICAgIERpc3BhdGNoZXIuX2VtaXQoXG4gICAgICB0b3BpYyxcbiAgICAgIHtcbiAgICAgICAgdHJhbnNhY3Rpb25JZCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgICAgc2VydmljZToge1xuICAgICAgICAgIGVudmlyb25tZW50OiBEaXNwYXRjaGVyLl9lbnZpcm9ubWVudCxcbiAgICAgICAgICBzZXJ2aWNlTmFtZTogRGlzcGF0Y2hlci5fc2VydmljZU5hbWUsXG4gICAgICAgICAgaW5zdGFuY2U6IERpc3BhdGNoZXIuX2luc3RhbmNlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBlbWl0SW5zdGFuY2VUYXNrKFxuICAgIHRyYW5zYWN0aW9uSWQ6IHN0cmluZyxcbiAgICBpbnN0YW5jZTogc3RyaW5nLFxuICAgIHNlcnZpY2U6IHN0cmluZyxcbiAgICB0YXNrOiBzdHJpbmcsXG4gICAgcGF5bG9hZDogUGF5bG9hZERhdGEsXG4gICk6IHZvaWQge1xuICAgIGlmICghRGlzcGF0Y2hlci5pc0luaXRpYWxpemVkKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihFUlJPUl9NRVNTQUdFUy5TRVJWSUNFX05PVF9JTklUSUFMSVpFRCk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9waWMgPSBgJHtEaXNwYXRjaGVyLl9lbnZpcm9ubWVudH0uJHtzZXJ2aWNlfS4ke2luc3RhbmNlfS4ke3Rhc2t9YDtcbiAgICBEaXNwYXRjaGVyLl9lbWl0KFxuICAgICAgdG9waWMsXG4gICAgICB7XG4gICAgICAgIHRyYW5zYWN0aW9uSWQsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICAgIHNlcnZpY2U6IHtcbiAgICAgICAgICBlbnZpcm9ubWVudDogRGlzcGF0Y2hlci5fZW52aXJvbm1lbnQsXG4gICAgICAgICAgc2VydmljZU5hbWU6IERpc3BhdGNoZXIuX3NlcnZpY2VOYW1lLFxuICAgICAgICAgIGluc3RhbmNlOiBEaXNwYXRjaGVyLl9pbnN0YW5jZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgYXN5bmMgcmVnaXN0ZXJFdmVudEhhbmRsZXIoZXZlbnQ6IHN0cmluZywgaGFuZGxlcjogSGFuZGxlckJhc2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIURpc3BhdGNoZXIuaXNJbml0aWFsaXplZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoRVJST1JfTUVTU0FHRVMuU0VSVklDRV9OT1RfSU5JVElBTElaRUQpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBEaXNwYXRjaGVyLl9yZWdpc3RlcihcbiAgICAgICAgYCR7RGlzcGF0Y2hlci5fZW52aXJvbm1lbnR9LiR7ZXZlbnR9YCxcbiAgICAgICAgKGRhdGEpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaGFuZGxlcihkYXRhKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZXJyb3IoRVJST1JfTUVTU0FHRVMuSEFORExJTkdfRVZFTlQsIGV2ZW50LCBlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlcnJvcihFUlJPUl9NRVNTQUdFUy5SRUdJU1RFUklOR19FVkVOVCwgZXZlbnQsIGVycm9yLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgYXN5bmMgcmVnaXN0ZXJUYXNrSGFuZGxlcih0YXNrOiBzdHJpbmcsIGhhbmRsZXI6IEhhbmRsZXJCYXNlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFEaXNwYXRjaGVyLmlzSW5pdGlhbGl6ZWQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKEVSUk9SX01FU1NBR0VTLlNFUlZJQ0VfTk9UX0lOSVRJQUxJWkVEKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgRGlzcGF0Y2hlci5fcmVnaXN0ZXIoXG4gICAgICAgIGAke0Rpc3BhdGNoZXIuX2Vudmlyb25tZW50fS4ke0Rpc3BhdGNoZXIuX3NlcnZpY2VOYW1lfS4ke3Rhc2t9YCxcbiAgICAgICAgKGRhdGEpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaGFuZGxlcihkYXRhKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZXJyb3IoRVJST1JfTUVTU0FHRVMuSEFORExJTkdfRVZFTlQsIHRhc2ssIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGVycm9yKEVSUk9SX01FU1NBR0VTLlJFR0lTVEVSSU5HX1RBU0ssIHRhc2ssIGVycm9yLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgYXN5bmMgcmVnaXN0ZXJJbnN0YW5jZVRhc2tIYW5kbGVyKFxuICAgIHRhc2s6IHN0cmluZyxcbiAgICBoYW5kbGVyOiBIYW5kbGVyQmFzZSxcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFEaXNwYXRjaGVyLmlzSW5pdGlhbGl6ZWQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKEVSUk9SX01FU1NBR0VTLlNFUlZJQ0VfTk9UX0lOSVRJQUxJWkVEKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgRGlzcGF0Y2hlci5fcmVnaXN0ZXIoXG4gICAgICAgIGAke0Rpc3BhdGNoZXIuX2Vudmlyb25tZW50fS4ke0Rpc3BhdGNoZXIuX3NlcnZpY2VOYW1lfS4ke0Rpc3BhdGNoZXIuX2luc3RhbmNlfS4ke3Rhc2t9YCxcbiAgICAgICAgKGRhdGEpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaGFuZGxlcihkYXRhKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZXJyb3IoRVJST1JfTUVTU0FHRVMuSEFORExJTkdfRVZFTlQsIHRhc2ssIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGVycm9yKEVSUk9SX01FU1NBR0VTLlJFR0lTVEVSSU5HX1RBU0ssIHRhc2ssIGVycm9yLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufVxuIl19