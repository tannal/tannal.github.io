---
title: Promise.try
date: 2024-09-02T10:51:56+08:00
categories:
    - Javascript Engine
tags:
    - C/C++

image: "https://tannal.github.io/comment.png"

---

<script src="/pacman-canvas.js" type="module"></script>

<pacman-canvas></pacman-canvas>


# tc39

[ECMAScript proposal: Promise.try](
https://github.com/tc39/proposal-promise-try/tree/main
): A proposal for a Promise.try method that allows you to safely call a function and get a promise that either resolves with the result or rejects with an error thrown in the function.


# Standards

https://tc39.es/proposal-promise-try/#sec-promise.try

Promise.try
1 Promise.try ( callbackfn, ...args )

When the try method is called with argument callbackfn, the following steps are taken:

  1. Let C be the this value.
  2. If C is not an Object, throw a TypeError exception.
  3. Let promiseCapability be ? NewPromiseCapability(C).
  4. Let status be Completion(Call(callbackfn, undefined, args)).
  5. If status is an abrupt completion, then
      a. Perform ? Call(promiseCapability.[[Reject]], undefined, « status.[[Value]] »).
  6. Else,
      a. Perform ? Call(promiseCapability.[[Resolve]], undefined, « status.[[Value]] »).
  7. Return promiseCapability.[[Promise]].

# Implementations

## v8

- [Chromium Bug](https://bugs.chromium.org/p/v8/issues/detail?id=11600)
- [V8 tracking bug](https://bugs.chromium.org/p/v8/issues/detail?id=11600)
- [V8 CL](https://chromium-review.googlesource.com/c/v8/v8/+/2870000)
- [V8 API CL](https://chromium-review.googlesource.com/c/v8/v8/+/2870001)
- [V8 Test CL](https://chromium-review.googlesource.com/c/v8/v8/+/2870002)

## Babel

## TypeScript

## SpiderMonkey

The first thing to do is enable or writing the tests.

js/src/tests/test262-update.py
You can update FEATURE_CHECK_NEEDED array, then run the script to update the test262 tests.

If test262 doesn't cover the feature, we need to write a test for it under non262.

E.G. js/src/tests/non262/Promise/try.js

The tests has some header comments that explain how to run them.

```js
// |reftest| shell-option(--enable-promise-try) skip-if(!Promise.try||!xulRuntime.shell)
```

The `shell-option` is used to enable the feature in the shell.

The `skip-if` is used to skip the test if the feature is not enabled.

The `xulRuntime.shell` is used to enable the feature in the shell.

The `reftest` is used to compare the output of the test with the expected output.

The test is written in the form of a function that is called with the `Promise.try` method.

For The `--enable-promise-try` option, it is used to enable the feature in the shell.

Which is written in `js/src/shell/js.cpp` file.

```cpp

if (op.getBoolOption("enable-promise-try")) {
  JS::Prefs::setAtStartup_experimental_promise_try(true);
}
```
In firefox, new features often are enabled in the nightly build with some perfs.

modules/libpref/init/StaticPrefList.yaml

```yaml

# Experimental support for Promise.try in JavaScript.
-   name: javascript.options.experimental.promise_try
  type: bool
  value: false
  mirror: always
  set_spidermonkey_pref: startup
```

When the test suite is ready, you can run the tests with the following command.

```bash
./mach test js/src/tests/non262/Promise/try.js
```

The next step is to implement the feature.

Note that there is a cool project called `core-js` that provides polyfills for new features.

For the `Promise.try` method, it is implemented in the `core-js` library.

```js
// `Promise.try` method
// https://github.com/tc39/proposal-promise-try
$({ target: 'Promise', stat: true, forced: FORCED }, {
  'try': function (callbackfn /* , ...args */) {
    var args = arguments.length > 1 ? slice(arguments, 1) : [];
    var promiseCapability = newPromiseCapabilityModule.f(this);
    var result = perform(function () {
      return apply(aCallable(callbackfn), undefined, args);
    });
    (result.error ? promiseCapability.reject : promiseCapability.resolve)(result.value);
    return promiseCapability.promise;
  }
});
```

In javascript engines, the `Promise.try` method is just a engine specific implementation of the js code above.

Let's see how spidermoneky express this in their C++ code.

The implementation is done in the `js/src/builtin/Promise.cpp` file.

```cpp
static bool Promise_static_try(JSContext* cx, unsigned argc, Value* vp) {
  CallArgs args = CallArgsFromVp(argc, vp);

  // 1. Let C be the this value.
  RootedValue cVal(cx, args.thisv());

  // 2. If C is not an Object, throw a TypeError exception.
  if (!cVal.isObject()) {
    JS_ReportErrorNumberASCII(cx, GetErrorMessage, nullptr,
                              JSMSG_OBJECT_REQUIRED,
                              "Receiver of Promise.try call");
    return false;
  }

  // 3. Let promiseCapability be ? NewPromiseCapability(C).
  RootedObject c(cx, &cVal.toObject());
  Rooted<PromiseCapability> promiseCapability(cx);
  if (!NewPromiseCapability(cx, c, &promiseCapability, false)) {
    return false;
  }
  HandleObject promiseObject = promiseCapability.promise();

  // 4. Let status be Completion(Call(callbackfn, undefined, args)).
  HandleValueArray iargs = HandleValueArray::subarray(args, 1, args.length() - 1);

  HandleValue callbackfn = args.get(0);
  RootedValue rval(cx);
  bool ok = Call(cx, callbackfn, UndefinedHandleValue, iargs, &rval);

  // 5. If status is an abrupt completion, then
  if (!ok) {
    RootedValue reason(cx);
    Rooted<SavedFrame*> stack(cx);

    if (!MaybeGetAndClearExceptionAndStack(cx, &reason, &stack)) {
      return false;
    }

    // 5.a. Perform ? Call(promiseCapability.[[Reject]], undefined, «
    // status.[[Value]] »).
    if (!CallPromiseRejectFunction(cx, promiseCapability.reject(), reason,
                                   promiseObject, stack,
                                   UnhandledRejectionBehavior::Report)) {
      return false;
    }
  } else {
    // 6. Else,
    // 6.a. Perform ? Call(promiseCapability.[[Resolve]], undefined, «
    // status.[[Value]] »).
    if (!CallPromiseResolveFunction(cx, promiseCapability.resolve(), rval,
                                    promiseObject)) {
      return false;
    }
  }

  // 7. Return promiseCapability.[[Promise]].
  args.rval().setObject(*promiseObject);
  return true;
}
```

It's quite complicated right? But it's just a translation of the js code above.

The `NewPromiseCapability` function is used to create a new promise capability.

The `Call` function is used to call the callback function.

The `CallPromiseRejectFunction` and `CallPromiseResolveFunction` functions are used to call the resolve and reject functions of the promise capability.

The `MaybeGetAndClearExceptionAndStack` function is used to get the exception and stack if an error occurs.

The `SavedFrame` is used to store the stack trace.

The `UnhandledRejectionBehavior::Report` is used to report the error.

The `args.rval().setObject(*promiseObject);` is used to return the promise object.

## JSC

https://github.com/WebKit/WebKit/commit/6d51d579af47028306a003653150ade5d395f942
