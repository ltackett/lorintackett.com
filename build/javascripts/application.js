//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisherâ€“Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);
/*! jQuery v2.1.0 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */

!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k="".trim,l={},m=a.document,n="2.1.0",o=function(a,b){return new o.fn.init(a,b)},p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};o.fn=o.prototype={jquery:n,constructor:o,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=o.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return o.each(this,a,b)},map:function(a){return this.pushStack(o.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},o.extend=o.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||o.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(o.isPlainObject(d)||(e=o.isArray(d)))?(e?(e=!1,f=c&&o.isArray(c)?c:[]):f=c&&o.isPlainObject(c)?c:{},g[b]=o.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},o.extend({expando:"jQuery"+(n+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===o.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){return a-parseFloat(a)>=0},isPlainObject:function(a){if("object"!==o.type(a)||a.nodeType||o.isWindow(a))return!1;try{if(a.constructor&&!j.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(b){return!1}return!0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(a){var b,c=eval;a=o.trim(a),a&&(1===a.indexOf("use strict")?(b=m.createElement("script"),b.text=a,m.head.appendChild(b).parentNode.removeChild(b)):c(a))},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=s(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:function(a){return null==a?"":k.call(a)},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?o.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:g.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=s(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(c=a[b],b=a,a=c),o.isFunction(a)?(e=d.call(arguments,2),f=function(){return a.apply(b||this,e.concat(d.call(arguments)))},f.guid=a.guid=a.guid||o.guid++,f):void 0},now:Date.now,support:l}),o.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=a.length,c=o.type(a);return"function"===c||o.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s="sizzle"+-new Date,t=a.document,u=0,v=0,w=eb(),x=eb(),y=eb(),z=function(a,b){return a===b&&(j=!0),0},A="undefined",B=1<<31,C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=D.indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(this[b]===a)return b;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",M=L.replace("w","w#"),N="\\["+K+"*("+L+")"+K+"*(?:([*^$|!~]?=)"+K+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+M+")|)|)"+K+"*\\]",O=":("+L+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+N.replace(3,8)+")*)|.*)\\)|)",P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(O),U=new RegExp("^"+M+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L.replace("w","w*")+")"),ATTR:new RegExp("^"+N),PSEUDO:new RegExp("^"+O),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=/'|\\/g,ab=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),bb=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)};try{G.apply(D=H.call(t.childNodes),t.childNodes),D[t.childNodes.length].nodeType}catch(cb){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function db(a,b,d,e){var f,g,h,i,j,m,p,q,u,v;if((b?b.ownerDocument||b:t)!==l&&k(b),b=b||l,d=d||[],!a||"string"!=typeof a)return d;if(1!==(i=b.nodeType)&&9!==i)return[];if(n&&!e){if(f=Z.exec(a))if(h=f[1]){if(9===i){if(g=b.getElementById(h),!g||!g.parentNode)return d;if(g.id===h)return d.push(g),d}else if(b.ownerDocument&&(g=b.ownerDocument.getElementById(h))&&r(b,g)&&g.id===h)return d.push(g),d}else{if(f[2])return G.apply(d,b.getElementsByTagName(a)),d;if((h=f[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(h)),d}if(c.qsa&&(!o||!o.test(a))){if(q=p=s,u=b,v=9===i&&a,1===i&&"object"!==b.nodeName.toLowerCase()){m=ob(a),(p=b.getAttribute("id"))?q=p.replace(_,"\\$&"):b.setAttribute("id",q),q="[id='"+q+"'] ",j=m.length;while(j--)m[j]=q+pb(m[j]);u=$.test(a)&&mb(b.parentNode)||b,v=m.join(",")}if(v)try{return G.apply(d,u.querySelectorAll(v)),d}catch(w){}finally{p||b.removeAttribute("id")}}}return xb(a.replace(P,"$1"),b,d,e)}function eb(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function fb(a){return a[s]=!0,a}function gb(a){var b=l.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function hb(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function ib(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||B)-(~a.sourceIndex||B);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function jb(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function kb(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function lb(a){return fb(function(b){return b=+b,fb(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function mb(a){return a&&typeof a.getElementsByTagName!==A&&a}c=db.support={},f=db.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},k=db.setDocument=function(a){var b,e=a?a.ownerDocument||a:t,g=e.defaultView;return e!==l&&9===e.nodeType&&e.documentElement?(l=e,m=e.documentElement,n=!f(e),g&&g!==g.top&&(g.addEventListener?g.addEventListener("unload",function(){k()},!1):g.attachEvent&&g.attachEvent("onunload",function(){k()})),c.attributes=gb(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=gb(function(a){return a.appendChild(e.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(e.getElementsByClassName)&&gb(function(a){return a.innerHTML="<div class='a'></div><div class='a i'></div>",a.firstChild.className="i",2===a.getElementsByClassName("i").length}),c.getById=gb(function(a){return m.appendChild(a).id=s,!e.getElementsByName||!e.getElementsByName(s).length}),c.getById?(d.find.ID=function(a,b){if(typeof b.getElementById!==A&&n){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ab,bb);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ab,bb);return function(a){var c=typeof a.getAttributeNode!==A&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return typeof b.getElementsByTagName!==A?b.getElementsByTagName(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return typeof b.getElementsByClassName!==A&&n?b.getElementsByClassName(a):void 0},p=[],o=[],(c.qsa=Y.test(e.querySelectorAll))&&(gb(function(a){a.innerHTML="<select t=''><option selected=''></option></select>",a.querySelectorAll("[t^='']").length&&o.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||o.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll(":checked").length||o.push(":checked")}),gb(function(a){var b=e.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&o.push("name"+K+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||o.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),o.push(",.*:")})),(c.matchesSelector=Y.test(q=m.webkitMatchesSelector||m.mozMatchesSelector||m.oMatchesSelector||m.msMatchesSelector))&&gb(function(a){c.disconnectedMatch=q.call(a,"div"),q.call(a,"[s!='']:x"),p.push("!=",O)}),o=o.length&&new RegExp(o.join("|")),p=p.length&&new RegExp(p.join("|")),b=Y.test(m.compareDocumentPosition),r=b||Y.test(m.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},z=b?function(a,b){if(a===b)return j=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===e||a.ownerDocument===t&&r(t,a)?-1:b===e||b.ownerDocument===t&&r(t,b)?1:i?I.call(i,a)-I.call(i,b):0:4&d?-1:1)}:function(a,b){if(a===b)return j=!0,0;var c,d=0,f=a.parentNode,g=b.parentNode,h=[a],k=[b];if(!f||!g)return a===e?-1:b===e?1:f?-1:g?1:i?I.call(i,a)-I.call(i,b):0;if(f===g)return ib(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)k.unshift(c);while(h[d]===k[d])d++;return d?ib(h[d],k[d]):h[d]===t?-1:k[d]===t?1:0},e):l},db.matches=function(a,b){return db(a,null,null,b)},db.matchesSelector=function(a,b){if((a.ownerDocument||a)!==l&&k(a),b=b.replace(S,"='$1']"),!(!c.matchesSelector||!n||p&&p.test(b)||o&&o.test(b)))try{var d=q.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return db(b,l,null,[a]).length>0},db.contains=function(a,b){return(a.ownerDocument||a)!==l&&k(a),r(a,b)},db.attr=function(a,b){(a.ownerDocument||a)!==l&&k(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!n):void 0;return void 0!==f?f:c.attributes||!n?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},db.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},db.uniqueSort=function(a){var b,d=[],e=0,f=0;if(j=!c.detectDuplicates,i=!c.sortStable&&a.slice(0),a.sort(z),j){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return i=null,a},e=db.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=db.selectors={cacheLength:50,createPseudo:fb,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ab,bb),a[3]=(a[4]||a[5]||"").replace(ab,bb),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||db.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&db.error(a[0]),a},PSEUDO:function(a){var b,c=!a[5]&&a[2];return V.CHILD.test(a[0])?null:(a[3]&&void 0!==a[4]?a[2]=a[4]:c&&T.test(c)&&(b=ob(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ab,bb).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=w[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&w(a,function(a){return b.test("string"==typeof a.className&&a.className||typeof a.getAttribute!==A&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=db.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),t=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&t){k=q[s]||(q[s]={}),j=k[a]||[],n=j[0]===u&&j[1],m=j[0]===u&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[u,n,m];break}}else if(t&&(j=(b[s]||(b[s]={}))[a])&&j[0]===u)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(t&&((l[s]||(l[s]={}))[a]=[u,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||db.error("unsupported pseudo: "+a);return e[s]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?fb(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I.call(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:fb(function(a){var b=[],c=[],d=g(a.replace(P,"$1"));return d[s]?fb(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),!c.pop()}}),has:fb(function(a){return function(b){return db(a,b).length>0}}),contains:fb(function(a){return function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:fb(function(a){return U.test(a||"")||db.error("unsupported lang: "+a),a=a.replace(ab,bb).toLowerCase(),function(b){var c;do if(c=n?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===m},focus:function(a){return a===l.activeElement&&(!l.hasFocus||l.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:lb(function(){return[0]}),last:lb(function(a,b){return[b-1]}),eq:lb(function(a,b,c){return[0>c?c+b:c]}),even:lb(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:lb(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:lb(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:lb(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=jb(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=kb(b);function nb(){}nb.prototype=d.filters=d.pseudos,d.setFilters=new nb;function ob(a,b){var c,e,f,g,h,i,j,k=x[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=Q.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?db.error(a):x(a,i).slice(0)}function pb(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function qb(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=v++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[u,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[s]||(b[s]={}),(h=i[d])&&h[0]===u&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function rb(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function sb(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function tb(a,b,c,d,e,f){return d&&!d[s]&&(d=tb(d)),e&&!e[s]&&(e=tb(e,f)),fb(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||wb(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:sb(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=sb(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I.call(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=sb(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ub(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],i=g||d.relative[" "],j=g?1:0,k=qb(function(a){return a===b},i,!0),l=qb(function(a){return I.call(b,a)>-1},i,!0),m=[function(a,c,d){return!g&&(d||c!==h)||((b=c).nodeType?k(a,c,d):l(a,c,d))}];f>j;j++)if(c=d.relative[a[j].type])m=[qb(rb(m),c)];else{if(c=d.filter[a[j].type].apply(null,a[j].matches),c[s]){for(e=++j;f>e;e++)if(d.relative[a[e].type])break;return tb(j>1&&rb(m),j>1&&pb(a.slice(0,j-1).concat({value:" "===a[j-2].type?"*":""})).replace(P,"$1"),c,e>j&&ub(a.slice(j,e)),f>e&&ub(a=a.slice(e)),f>e&&pb(a))}m.push(c)}return rb(m)}function vb(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,i,j,k){var m,n,o,p=0,q="0",r=f&&[],s=[],t=h,v=f||e&&d.find.TAG("*",k),w=u+=null==t?1:Math.random()||.1,x=v.length;for(k&&(h=g!==l&&g);q!==x&&null!=(m=v[q]);q++){if(e&&m){n=0;while(o=a[n++])if(o(m,g,i)){j.push(m);break}k&&(u=w)}c&&((m=!o&&m)&&p--,f&&r.push(m))}if(p+=q,c&&q!==p){n=0;while(o=b[n++])o(r,s,g,i);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=E.call(j));s=sb(s)}G.apply(j,s),k&&!f&&s.length>0&&p+b.length>1&&db.uniqueSort(j)}return k&&(u=w,h=t),r};return c?fb(f):f}g=db.compile=function(a,b){var c,d=[],e=[],f=y[a+" "];if(!f){b||(b=ob(a)),c=b.length;while(c--)f=ub(b[c]),f[s]?d.push(f):e.push(f);f=y(a,vb(e,d))}return f};function wb(a,b,c){for(var d=0,e=b.length;e>d;d++)db(a,b[d],c);return c}function xb(a,b,e,f){var h,i,j,k,l,m=ob(a);if(!f&&1===m.length){if(i=m[0]=m[0].slice(0),i.length>2&&"ID"===(j=i[0]).type&&c.getById&&9===b.nodeType&&n&&d.relative[i[1].type]){if(b=(d.find.ID(j.matches[0].replace(ab,bb),b)||[])[0],!b)return e;a=a.slice(i.shift().value.length)}h=V.needsContext.test(a)?0:i.length;while(h--){if(j=i[h],d.relative[k=j.type])break;if((l=d.find[k])&&(f=l(j.matches[0].replace(ab,bb),$.test(i[0].type)&&mb(b.parentNode)||b))){if(i.splice(h,1),a=f.length&&pb(i),!a)return G.apply(e,f),e;break}}}return g(a,m)(f,b,!n,e,$.test(a)&&mb(b.parentNode)||b),e}return c.sortStable=s.split("").sort(z).join("")===s,c.detectDuplicates=!!j,k(),c.sortDetached=gb(function(a){return 1&a.compareDocumentPosition(l.createElement("div"))}),gb(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||hb("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&gb(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||hb("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),gb(function(a){return null==a.getAttribute("disabled")})||hb(J,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),db}(a);o.find=t,o.expr=t.selectors,o.expr[":"]=o.expr.pseudos,o.unique=t.uniqueSort,o.text=t.getText,o.isXMLDoc=t.isXML,o.contains=t.contains;var u=o.expr.match.needsContext,v=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,w=/^.[^:#\[\.,]*$/;function x(a,b,c){if(o.isFunction(b))return o.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return o.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(w.test(b))return o.filter(b,a,c);b=o.filter(b,a)}return o.grep(a,function(a){return g.call(b,a)>=0!==c})}o.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?o.find.matchesSelector(d,a)?[d]:[]:o.find.matches(a,o.grep(b,function(a){return 1===a.nodeType}))},o.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(o(a).filter(function(){for(b=0;c>b;b++)if(o.contains(e[b],this))return!0}));for(b=0;c>b;b++)o.find(a,e[b],d);return d=this.pushStack(c>1?o.unique(d):d),d.selector=this.selector?this.selector+" "+a:a,d},filter:function(a){return this.pushStack(x(this,a||[],!1))},not:function(a){return this.pushStack(x(this,a||[],!0))},is:function(a){return!!x(this,"string"==typeof a&&u.test(a)?o(a):a||[],!1).length}});var y,z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,A=o.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:z.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||y).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof o?b[0]:b,o.merge(this,o.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:m,!0)),v.test(c[1])&&o.isPlainObject(b))for(c in b)o.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}return d=m.getElementById(c[2]),d&&d.parentNode&&(this.length=1,this[0]=d),this.context=m,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):o.isFunction(a)?"undefined"!=typeof y.ready?y.ready(a):a(o):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),o.makeArray(a,this))};A.prototype=o.fn,y=o(m);var B=/^(?:parents|prev(?:Until|All))/,C={children:!0,contents:!0,next:!0,prev:!0};o.extend({dir:function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&o(a).is(c))break;d.push(a)}return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),o.fn.extend({has:function(a){var b=o(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(o.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=u.test(a)||"string"!=typeof a?o(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&o.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?o.unique(f):f)},index:function(a){return a?"string"==typeof a?g.call(o(a),this[0]):g.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(o.unique(o.merge(this.get(),o(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function D(a,b){while((a=a[b])&&1!==a.nodeType);return a}o.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return o.dir(a,"parentNode")},parentsUntil:function(a,b,c){return o.dir(a,"parentNode",c)},next:function(a){return D(a,"nextSibling")},prev:function(a){return D(a,"previousSibling")},nextAll:function(a){return o.dir(a,"nextSibling")},prevAll:function(a){return o.dir(a,"previousSibling")},nextUntil:function(a,b,c){return o.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return o.dir(a,"previousSibling",c)},siblings:function(a){return o.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return o.sibling(a.firstChild)},contents:function(a){return a.contentDocument||o.merge([],a.childNodes)}},function(a,b){o.fn[a]=function(c,d){var e=o.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=o.filter(d,e)),this.length>1&&(C[a]||o.unique(e),B.test(a)&&e.reverse()),this.pushStack(e)}});var E=/\S+/g,F={};function G(a){var b=F[a]={};return o.each(a.match(E)||[],function(a,c){b[c]=!0}),b}o.Callbacks=function(a){a="string"==typeof a?F[a]||G(a):o.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(b=a.memory&&l,c=!0,g=e||0,e=0,f=h.length,d=!0;h&&f>g;g++)if(h[g].apply(l[0],l[1])===!1&&a.stopOnFalse){b=!1;break}d=!1,h&&(i?i.length&&j(i.shift()):b?h=[]:k.disable())},k={add:function(){if(h){var c=h.length;!function g(b){o.each(b,function(b,c){var d=o.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&g(c)})}(arguments),d?f=h.length:b&&(e=c,j(b))}return this},remove:function(){return h&&o.each(arguments,function(a,b){var c;while((c=o.inArray(b,h,c))>-1)h.splice(c,1),d&&(f>=c&&f--,g>=c&&g--)}),this},has:function(a){return a?o.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],f=0,this},disable:function(){return h=i=b=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,b||k.disable(),this},locked:function(){return!i},fireWith:function(a,b){return!h||c&&!i||(b=b||[],b=[a,b.slice?b.slice():b],d?i.push(b):j(b)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!c}};return k},o.extend({Deferred:function(a){var b=[["resolve","done",o.Callbacks("once memory"),"resolved"],["reject","fail",o.Callbacks("once memory"),"rejected"],["notify","progress",o.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return o.Deferred(function(c){o.each(b,function(b,f){var g=o.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&o.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?o.extend(a,d):d}},e={};return d.pipe=d.then,o.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&o.isFunction(a.promise)?e:0,g=1===f?a:o.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&o.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var H;o.fn.ready=function(a){return o.ready.promise().done(a),this},o.extend({isReady:!1,readyWait:1,holdReady:function(a){a?o.readyWait++:o.ready(!0)},ready:function(a){(a===!0?--o.readyWait:o.isReady)||(o.isReady=!0,a!==!0&&--o.readyWait>0||(H.resolveWith(m,[o]),o.fn.trigger&&o(m).trigger("ready").off("ready")))}});function I(){m.removeEventListener("DOMContentLoaded",I,!1),a.removeEventListener("load",I,!1),o.ready()}o.ready.promise=function(b){return H||(H=o.Deferred(),"complete"===m.readyState?setTimeout(o.ready):(m.addEventListener("DOMContentLoaded",I,!1),a.addEventListener("load",I,!1))),H.promise(b)},o.ready.promise();var J=o.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===o.type(c)){e=!0;for(h in c)o.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,o.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(o(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f};o.acceptData=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function K(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=o.expando+Math.random()}K.uid=1,K.accepts=o.acceptData,K.prototype={key:function(a){if(!K.accepts(a))return 0;var b={},c=a[this.expando];if(!c){c=K.uid++;try{b[this.expando]={value:c},Object.defineProperties(a,b)}catch(d){b[this.expando]=c,o.extend(a,b)}}return this.cache[c]||(this.cache[c]={}),c},set:function(a,b,c){var d,e=this.key(a),f=this.cache[e];if("string"==typeof b)f[b]=c;else if(o.isEmptyObject(f))o.extend(this.cache[e],b);else for(d in b)f[d]=b[d];return f},get:function(a,b){var c=this.cache[this.key(a)];return void 0===b?c:c[b]},access:function(a,b,c){var d;return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,o.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=this.key(a),g=this.cache[f];if(void 0===b)this.cache[f]={};else{o.isArray(b)?d=b.concat(b.map(o.camelCase)):(e=o.camelCase(b),b in g?d=[b,e]:(d=e,d=d in g?[d]:d.match(E)||[])),c=d.length;while(c--)delete g[d[c]]}},hasData:function(a){return!o.isEmptyObject(this.cache[a[this.expando]]||{})},discard:function(a){a[this.expando]&&delete this.cache[a[this.expando]]}};var L=new K,M=new K,N=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,O=/([A-Z])/g;function P(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(O,"-$1").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:N.test(c)?o.parseJSON(c):c}catch(e){}M.set(a,b,c)}else c=void 0;return c}o.extend({hasData:function(a){return M.hasData(a)||L.hasData(a)},data:function(a,b,c){return M.access(a,b,c)},removeData:function(a,b){M.remove(a,b)},_data:function(a,b,c){return L.access(a,b,c)},_removeData:function(a,b){L.remove(a,b)}}),o.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=M.get(f),1===f.nodeType&&!L.get(f,"hasDataAttrs"))){c=g.length;
while(c--)d=g[c].name,0===d.indexOf("data-")&&(d=o.camelCase(d.slice(5)),P(f,d,e[d]));L.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){M.set(this,a)}):J(this,function(b){var c,d=o.camelCase(a);if(f&&void 0===b){if(c=M.get(f,a),void 0!==c)return c;if(c=M.get(f,d),void 0!==c)return c;if(c=P(f,d,void 0),void 0!==c)return c}else this.each(function(){var c=M.get(this,d);M.set(this,d,b),-1!==a.indexOf("-")&&void 0!==c&&M.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){M.remove(this,a)})}}),o.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=L.get(a,b),c&&(!d||o.isArray(c)?d=L.access(a,b,o.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=o.queue(a,b),d=c.length,e=c.shift(),f=o._queueHooks(a,b),g=function(){o.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return L.get(a,c)||L.access(a,c,{empty:o.Callbacks("once memory").add(function(){L.remove(a,[b+"queue",c])})})}}),o.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?o.queue(this[0],a):void 0===b?this:this.each(function(){var c=o.queue(this,a,b);o._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&o.dequeue(this,a)})},dequeue:function(a){return this.each(function(){o.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=o.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=L.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var Q=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,R=["Top","Right","Bottom","Left"],S=function(a,b){return a=b||a,"none"===o.css(a,"display")||!o.contains(a.ownerDocument,a)},T=/^(?:checkbox|radio)$/i;!function(){var a=m.createDocumentFragment(),b=a.appendChild(m.createElement("div"));b.innerHTML="<input type='radio' checked='checked' name='t'/>",l.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",l.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var U="undefined";l.focusinBubbles="onfocusin"in a;var V=/^key/,W=/^(?:mouse|contextmenu)|click/,X=/^(?:focusinfocus|focusoutblur)$/,Y=/^([^.]*)(?:\.(.+)|)$/;function Z(){return!0}function $(){return!1}function _(){try{return m.activeElement}catch(a){}}o.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,p,q,r=L.get(a);if(r){c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=o.guid++),(i=r.events)||(i=r.events={}),(g=r.handle)||(g=r.handle=function(b){return typeof o!==U&&o.event.triggered!==b.type?o.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(E)||[""],j=b.length;while(j--)h=Y.exec(b[j])||[],n=q=h[1],p=(h[2]||"").split(".").sort(),n&&(l=o.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=o.event.special[n]||{},k=o.extend({type:n,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&o.expr.match.needsContext.test(e),namespace:p.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,p,g)!==!1||a.addEventListener&&a.addEventListener(n,g,!1)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),o.event.global[n]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,p,q,r=L.hasData(a)&&L.get(a);if(r&&(i=r.events)){b=(b||"").match(E)||[""],j=b.length;while(j--)if(h=Y.exec(b[j])||[],n=q=h[1],p=(h[2]||"").split(".").sort(),n){l=o.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&q!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||o.removeEvent(a,n,r.handle),delete i[n])}else for(n in i)o.event.remove(a,n+b[j],c,d,!0);o.isEmptyObject(i)&&(delete r.handle,L.remove(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,l,n,p=[d||m],q=j.call(b,"type")?b.type:b,r=j.call(b,"namespace")?b.namespace.split("."):[];if(g=h=d=d||m,3!==d.nodeType&&8!==d.nodeType&&!X.test(q+o.event.triggered)&&(q.indexOf(".")>=0&&(r=q.split("."),q=r.shift(),r.sort()),k=q.indexOf(":")<0&&"on"+q,b=b[o.expando]?b:new o.Event(q,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=r.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:o.makeArray(c,[b]),n=o.event.special[q]||{},e||!n.trigger||n.trigger.apply(d,c)!==!1)){if(!e&&!n.noBubble&&!o.isWindow(d)){for(i=n.delegateType||q,X.test(i+q)||(g=g.parentNode);g;g=g.parentNode)p.push(g),h=g;h===(d.ownerDocument||m)&&p.push(h.defaultView||h.parentWindow||a)}f=0;while((g=p[f++])&&!b.isPropagationStopped())b.type=f>1?i:n.bindType||q,l=(L.get(g,"events")||{})[b.type]&&L.get(g,"handle"),l&&l.apply(g,c),l=k&&g[k],l&&l.apply&&o.acceptData(g)&&(b.result=l.apply(g,c),b.result===!1&&b.preventDefault());return b.type=q,e||b.isDefaultPrevented()||n._default&&n._default.apply(p.pop(),c)!==!1||!o.acceptData(d)||k&&o.isFunction(d[q])&&!o.isWindow(d)&&(h=d[k],h&&(d[k]=null),o.event.triggered=q,d[q](),o.event.triggered=void 0,h&&(d[k]=h)),b.result}},dispatch:function(a){a=o.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(L.get(this,"events")||{})[a.type]||[],k=o.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=o.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(g.namespace))&&(a.handleObj=g,a.data=g.data,e=((o.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(a.result=e)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!==this;i=i.parentNode||this)if(i.disabled!==!0||"click"!==a.type){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?o(e,this).index(i)>=0:o.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||m,d=c.documentElement,e=c.body,a.pageX=b.clientX+(d&&d.scrollLeft||e&&e.scrollLeft||0)-(d&&d.clientLeft||e&&e.clientLeft||0),a.pageY=b.clientY+(d&&d.scrollTop||e&&e.scrollTop||0)-(d&&d.clientTop||e&&e.clientTop||0)),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},fix:function(a){if(a[o.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=W.test(e)?this.mouseHooks:V.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new o.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=m),3===a.target.nodeType&&(a.target=a.target.parentNode),g.filter?g.filter(a,f):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==_()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===_()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&o.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return o.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=o.extend(new o.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?o.event.trigger(e,null,b):o.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},o.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)},o.Event=function(a,b){return this instanceof o.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.getPreventDefault&&a.getPreventDefault()?Z:$):this.type=a,b&&o.extend(this,b),this.timeStamp=a&&a.timeStamp||o.now(),void(this[o.expando]=!0)):new o.Event(a,b)},o.Event.prototype={isDefaultPrevented:$,isPropagationStopped:$,isImmediatePropagationStopped:$,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=Z,a&&a.preventDefault&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=Z,a&&a.stopPropagation&&a.stopPropagation()},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=Z,this.stopPropagation()}},o.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){o.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!o.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),l.focusinBubbles||o.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){o.event.simulate(b,a.target,o.event.fix(a),!0)};o.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=L.access(d,b);e||d.addEventListener(a,c,!0),L.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=L.access(d,b)-1;e?L.access(d,b,e):(d.removeEventListener(a,c,!0),L.remove(d,b))}}}),o.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(g in a)this.on(g,b,c,a[g],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=$;else if(!d)return this;return 1===e&&(f=d,d=function(a){return o().off(a),f.apply(this,arguments)},d.guid=f.guid||(f.guid=o.guid++)),this.each(function(){o.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,o(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=$),this.each(function(){o.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){o.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?o.event.trigger(a,b,c,!0):void 0}});var ab=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bb=/<([\w:]+)/,cb=/<|&#?\w+;/,db=/<(?:script|style|link)/i,eb=/checked\s*(?:[^=]|=\s*.checked.)/i,fb=/^$|\/(?:java|ecma)script/i,gb=/^true\/(.*)/,hb=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ib={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ib.optgroup=ib.option,ib.tbody=ib.tfoot=ib.colgroup=ib.caption=ib.thead,ib.th=ib.td;function jb(a,b){return o.nodeName(a,"table")&&o.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function kb(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function lb(a){var b=gb.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function mb(a,b){for(var c=0,d=a.length;d>c;c++)L.set(a[c],"globalEval",!b||L.get(b[c],"globalEval"))}function nb(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(L.hasData(a)&&(f=L.access(a),g=L.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)o.event.add(b,e,j[e][c])}M.hasData(a)&&(h=M.access(a),i=o.extend({},h),M.set(b,i))}}function ob(a,b){var c=a.getElementsByTagName?a.getElementsByTagName(b||"*"):a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&o.nodeName(a,b)?o.merge([a],c):c}function pb(a,b){var c=b.nodeName.toLowerCase();"input"===c&&T.test(a.type)?b.checked=a.checked:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}o.extend({clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=o.contains(a.ownerDocument,a);if(!(l.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||o.isXMLDoc(a)))for(g=ob(h),f=ob(a),d=0,e=f.length;e>d;d++)pb(f[d],g[d]);if(b)if(c)for(f=f||ob(a),g=g||ob(h),d=0,e=f.length;e>d;d++)nb(f[d],g[d]);else nb(a,h);return g=ob(h,"script"),g.length>0&&mb(g,!i&&ob(a,"script")),h},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,k=b.createDocumentFragment(),l=[],m=0,n=a.length;n>m;m++)if(e=a[m],e||0===e)if("object"===o.type(e))o.merge(l,e.nodeType?[e]:e);else if(cb.test(e)){f=f||k.appendChild(b.createElement("div")),g=(bb.exec(e)||["",""])[1].toLowerCase(),h=ib[g]||ib._default,f.innerHTML=h[1]+e.replace(ab,"<$1></$2>")+h[2],j=h[0];while(j--)f=f.lastChild;o.merge(l,f.childNodes),f=k.firstChild,f.textContent=""}else l.push(b.createTextNode(e));k.textContent="",m=0;while(e=l[m++])if((!d||-1===o.inArray(e,d))&&(i=o.contains(e.ownerDocument,e),f=ob(k.appendChild(e),"script"),i&&mb(f),c)){j=0;while(e=f[j++])fb.test(e.type||"")&&c.push(e)}return k},cleanData:function(a){for(var b,c,d,e,f,g,h=o.event.special,i=0;void 0!==(c=a[i]);i++){if(o.acceptData(c)&&(f=c[L.expando],f&&(b=L.cache[f]))){if(d=Object.keys(b.events||{}),d.length)for(g=0;void 0!==(e=d[g]);g++)h[e]?o.event.remove(c,e):o.removeEvent(c,e,b.handle);L.cache[f]&&delete L.cache[f]}delete M.cache[c[M.expando]]}}}),o.fn.extend({text:function(a){return J(this,function(a){return void 0===a?o.text(this):this.empty().each(function(){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&(this.textContent=a)})},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=jb(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=jb(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?o.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||o.cleanData(ob(c)),c.parentNode&&(b&&o.contains(c.ownerDocument,c)&&mb(ob(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(o.cleanData(ob(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return o.clone(this,a,b)})},html:function(a){return J(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!db.test(a)&&!ib[(bb.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(ab,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(o.cleanData(ob(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,o.cleanData(ob(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,k=this.length,m=this,n=k-1,p=a[0],q=o.isFunction(p);if(q||k>1&&"string"==typeof p&&!l.checkClone&&eb.test(p))return this.each(function(c){var d=m.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(k&&(c=o.buildFragment(a,this[0].ownerDocument,!1,this),d=c.firstChild,1===c.childNodes.length&&(c=d),d)){for(f=o.map(ob(c,"script"),kb),g=f.length;k>j;j++)h=c,j!==n&&(h=o.clone(h,!0,!0),g&&o.merge(f,ob(h,"script"))),b.call(this[j],h,j);if(g)for(i=f[f.length-1].ownerDocument,o.map(f,lb),j=0;g>j;j++)h=f[j],fb.test(h.type||"")&&!L.access(h,"globalEval")&&o.contains(i,h)&&(h.src?o._evalUrl&&o._evalUrl(h.src):o.globalEval(h.textContent.replace(hb,"")))}return this}}),o.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){o.fn[a]=function(a){for(var c,d=[],e=o(a),g=e.length-1,h=0;g>=h;h++)c=h===g?this:this.clone(!0),o(e[h])[b](c),f.apply(d,c.get());return this.pushStack(d)}});var qb,rb={};function sb(b,c){var d=o(c.createElement(b)).appendTo(c.body),e=a.getDefaultComputedStyle?a.getDefaultComputedStyle(d[0]).display:o.css(d[0],"display");return d.detach(),e}function tb(a){var b=m,c=rb[a];return c||(c=sb(a,b),"none"!==c&&c||(qb=(qb||o("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=qb[0].contentDocument,b.write(),b.close(),c=sb(a,b),qb.detach()),rb[a]=c),c}var ub=/^margin/,vb=new RegExp("^("+Q+")(?!px)[a-z%]+$","i"),wb=function(a){return a.ownerDocument.defaultView.getComputedStyle(a,null)};function xb(a,b,c){var d,e,f,g,h=a.style;return c=c||wb(a),c&&(g=c.getPropertyValue(b)||c[b]),c&&(""!==g||o.contains(a.ownerDocument,a)||(g=o.style(a,b)),vb.test(g)&&ub.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function yb(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d="padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",e=m.documentElement,f=m.createElement("div"),g=m.createElement("div");g.style.backgroundClip="content-box",g.cloneNode(!0).style.backgroundClip="",l.clearCloneStyle="content-box"===g.style.backgroundClip,f.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",f.appendChild(g);function h(){g.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%",e.appendChild(f);var d=a.getComputedStyle(g,null);b="1%"!==d.top,c="4px"===d.width,e.removeChild(f)}a.getComputedStyle&&o.extend(l,{pixelPosition:function(){return h(),b},boxSizingReliable:function(){return null==c&&h(),c},reliableMarginRight:function(){var b,c=g.appendChild(m.createElement("div"));return c.style.cssText=g.style.cssText=d,c.style.marginRight=c.style.width="0",g.style.width="1px",e.appendChild(f),b=!parseFloat(a.getComputedStyle(c,null).marginRight),e.removeChild(f),g.innerHTML="",b}})}(),o.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var zb=/^(none|table(?!-c[ea]).+)/,Ab=new RegExp("^("+Q+")(.*)$","i"),Bb=new RegExp("^([+-])=("+Q+")","i"),Cb={position:"absolute",visibility:"hidden",display:"block"},Db={letterSpacing:0,fontWeight:400},Eb=["Webkit","O","Moz","ms"];function Fb(a,b){if(b in a)return b;var c=b[0].toUpperCase()+b.slice(1),d=b,e=Eb.length;while(e--)if(b=Eb[e]+c,b in a)return b;return d}function Gb(a,b,c){var d=Ab.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Hb(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=o.css(a,c+R[f],!0,e)),d?("content"===c&&(g-=o.css(a,"padding"+R[f],!0,e)),"margin"!==c&&(g-=o.css(a,"border"+R[f]+"Width",!0,e))):(g+=o.css(a,"padding"+R[f],!0,e),"padding"!==c&&(g+=o.css(a,"border"+R[f]+"Width",!0,e)));return g}function Ib(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=wb(a),g="border-box"===o.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=xb(a,b,f),(0>e||null==e)&&(e=a.style[b]),vb.test(e))return e;d=g&&(l.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Hb(a,b,c||(g?"border":"content"),d,f)+"px"}function Jb(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=L.get(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&S(d)&&(f[g]=L.access(d,"olddisplay",tb(d.nodeName)))):f[g]||(e=S(d),(c&&"none"!==c||!e)&&L.set(d,"olddisplay",e?c:o.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}o.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=xb(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=o.camelCase(b),i=a.style;return b=o.cssProps[h]||(o.cssProps[h]=Fb(i,h)),g=o.cssHooks[b]||o.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=Bb.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(o.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||o.cssNumber[h]||(c+="px"),l.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]="",i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=o.camelCase(b);return b=o.cssProps[h]||(o.cssProps[h]=Fb(a.style,h)),g=o.cssHooks[b]||o.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=xb(a,b,d)),"normal"===e&&b in Db&&(e=Db[b]),""===c||c?(f=parseFloat(e),c===!0||o.isNumeric(f)?f||0:e):e}}),o.each(["height","width"],function(a,b){o.cssHooks[b]={get:function(a,c,d){return c?0===a.offsetWidth&&zb.test(o.css(a,"display"))?o.swap(a,Cb,function(){return Ib(a,b,d)}):Ib(a,b,d):void 0},set:function(a,c,d){var e=d&&wb(a);return Gb(a,c,d?Hb(a,b,d,"border-box"===o.css(a,"boxSizing",!1,e),e):0)}}}),o.cssHooks.marginRight=yb(l.reliableMarginRight,function(a,b){return b?o.swap(a,{display:"inline-block"},xb,[a,"marginRight"]):void 0}),o.each({margin:"",padding:"",border:"Width"},function(a,b){o.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+R[d]+b]=f[d]||f[d-2]||f[0];return e}},ub.test(a)||(o.cssHooks[a+b].set=Gb)}),o.fn.extend({css:function(a,b){return J(this,function(a,b,c){var d,e,f={},g=0;if(o.isArray(b)){for(d=wb(a),e=b.length;e>g;g++)f[b[g]]=o.css(a,b[g],!1,d);return f}return void 0!==c?o.style(a,b,c):o.css(a,b)},a,b,arguments.length>1)},show:function(){return Jb(this,!0)},hide:function(){return Jb(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){S(this)?o(this).show():o(this).hide()})}});function Kb(a,b,c,d,e){return new Kb.prototype.init(a,b,c,d,e)}o.Tween=Kb,Kb.prototype={constructor:Kb,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(o.cssNumber[c]?"":"px")},cur:function(){var a=Kb.propHooks[this.prop];return a&&a.get?a.get(this):Kb.propHooks._default.get(this)},run:function(a){var b,c=Kb.propHooks[this.prop];return this.pos=b=this.options.duration?o.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Kb.propHooks._default.set(this),this}},Kb.prototype.init.prototype=Kb.prototype,Kb.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=o.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){o.fx.step[a.prop]?o.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[o.cssProps[a.prop]]||o.cssHooks[a.prop])?o.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},Kb.propHooks.scrollTop=Kb.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},o.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},o.fx=Kb.prototype.init,o.fx.step={};var Lb,Mb,Nb=/^(?:toggle|show|hide)$/,Ob=new RegExp("^(?:([+-])=|)("+Q+")([a-z%]*)$","i"),Pb=/queueHooks$/,Qb=[Vb],Rb={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=Ob.exec(b),f=e&&e[3]||(o.cssNumber[a]?"":"px"),g=(o.cssNumber[a]||"px"!==f&&+d)&&Ob.exec(o.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,o.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function Sb(){return setTimeout(function(){Lb=void 0}),Lb=o.now()}function Tb(a,b){var c,d=0,e={height:a};for(b=b?1:0;4>d;d+=2-b)c=R[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function Ub(a,b,c){for(var d,e=(Rb[b]||[]).concat(Rb["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function Vb(a,b,c){var d,e,f,g,h,i,j,k=this,l={},m=a.style,n=a.nodeType&&S(a),p=L.get(a,"fxshow");c.queue||(h=o._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,k.always(function(){k.always(function(){h.unqueued--,o.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[m.overflow,m.overflowX,m.overflowY],j=o.css(a,"display"),"none"===j&&(j=tb(a.nodeName)),"inline"===j&&"none"===o.css(a,"float")&&(m.display="inline-block")),c.overflow&&(m.overflow="hidden",k.always(function(){m.overflow=c.overflow[0],m.overflowX=c.overflow[1],m.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],Nb.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(n?"hide":"show")){if("show"!==e||!p||void 0===p[d])continue;n=!0}l[d]=p&&p[d]||o.style(a,d)}if(!o.isEmptyObject(l)){p?"hidden"in p&&(n=p.hidden):p=L.access(a,"fxshow",{}),f&&(p.hidden=!n),n?o(a).show():k.done(function(){o(a).hide()}),k.done(function(){var b;L.remove(a,"fxshow");for(b in l)o.style(a,b,l[b])});for(d in l)g=Ub(n?p[d]:0,d,k),d in p||(p[d]=g.start,n&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function Wb(a,b){var c,d,e,f,g;for(c in a)if(d=o.camelCase(c),e=b[d],f=a[c],o.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=o.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function Xb(a,b,c){var d,e,f=0,g=Qb.length,h=o.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Lb||Sb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:o.extend({},b),opts:o.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:Lb||Sb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=o.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(Wb(k,j.opts.specialEasing);g>f;f++)if(d=Qb[f].call(j,a,k,j.opts))return d;return o.map(k,Ub,j),o.isFunction(j.opts.start)&&j.opts.start.call(a,j),o.fx.timer(o.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}o.Animation=o.extend(Xb,{tweener:function(a,b){o.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],Rb[c]=Rb[c]||[],Rb[c].unshift(b)},prefilter:function(a,b){b?Qb.unshift(a):Qb.push(a)}}),o.speed=function(a,b,c){var d=a&&"object"==typeof a?o.extend({},a):{complete:c||!c&&b||o.isFunction(a)&&a,duration:a,easing:c&&b||b&&!o.isFunction(b)&&b};return d.duration=o.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in o.fx.speeds?o.fx.speeds[d.duration]:o.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){o.isFunction(d.old)&&d.old.call(this),d.queue&&o.dequeue(this,d.queue)},d},o.fn.extend({fadeTo:function(a,b,c,d){return this.filter(S).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=o.isEmptyObject(a),f=o.speed(b,c,d),g=function(){var b=Xb(this,o.extend({},a),f);(e||L.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=o.timers,g=L.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&Pb.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&o.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=L.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=o.timers,g=d?d.length:0;for(c.finish=!0,o.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),o.each(["toggle","show","hide"],function(a,b){var c=o.fn[b];o.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(Tb(b,!0),a,d,e)}}),o.each({slideDown:Tb("show"),slideUp:Tb("hide"),slideToggle:Tb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){o.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),o.timers=[],o.fx.tick=function(){var a,b=0,c=o.timers;for(Lb=o.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||o.fx.stop(),Lb=void 0},o.fx.timer=function(a){o.timers.push(a),a()?o.fx.start():o.timers.pop()},o.fx.interval=13,o.fx.start=function(){Mb||(Mb=setInterval(o.fx.tick,o.fx.interval))},o.fx.stop=function(){clearInterval(Mb),Mb=null},o.fx.speeds={slow:600,fast:200,_default:400},o.fn.delay=function(a,b){return a=o.fx?o.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a=m.createElement("input"),b=m.createElement("select"),c=b.appendChild(m.createElement("option"));a.type="checkbox",l.checkOn=""!==a.value,l.optSelected=c.selected,b.disabled=!0,l.optDisabled=!c.disabled,a=m.createElement("input"),a.value="t",a.type="radio",l.radioValue="t"===a.value}();var Yb,Zb,$b=o.expr.attrHandle;o.fn.extend({attr:function(a,b){return J(this,o.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){o.removeAttr(this,a)})}}),o.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===U?o.prop(a,b,c):(1===f&&o.isXMLDoc(a)||(b=b.toLowerCase(),d=o.attrHooks[b]||(o.expr.match.bool.test(b)?Zb:Yb)),void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=o.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void o.removeAttr(a,b))},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(E);if(f&&1===a.nodeType)while(c=f[e++])d=o.propFix[c]||c,o.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)},attrHooks:{type:{set:function(a,b){if(!l.radioValue&&"radio"===b&&o.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),Zb={set:function(a,b,c){return b===!1?o.removeAttr(a,c):a.setAttribute(c,c),c}},o.each(o.expr.match.bool.source.match(/\w+/g),function(a,b){var c=$b[b]||o.find.attr;$b[b]=function(a,b,d){var e,f;
return d||(f=$b[b],$b[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,$b[b]=f),e}});var _b=/^(?:input|select|textarea|button)$/i;o.fn.extend({prop:function(a,b){return J(this,o.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[o.propFix[a]||a]})}}),o.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!o.isXMLDoc(a),f&&(b=o.propFix[b]||b,e=o.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){return a.hasAttribute("tabindex")||_b.test(a.nodeName)||a.href?a.tabIndex:-1}}}}),l.optSelected||(o.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null}}),o.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){o.propFix[this.toLowerCase()]=this});var ac=/[\t\r\n\f]/g;o.fn.extend({addClass:function(a){var b,c,d,e,f,g,h="string"==typeof a&&a,i=0,j=this.length;if(o.isFunction(a))return this.each(function(b){o(this).addClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ac," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=o.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0===arguments.length||"string"==typeof a&&a,i=0,j=this.length;if(o.isFunction(a))return this.each(function(b){o(this).removeClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ac," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?o.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(o.isFunction(a)?function(c){o(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=o(this),f=a.match(E)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===U||"boolean"===c)&&(this.className&&L.set(this,"__className__",this.className),this.className=this.className||a===!1?"":L.get(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(ac," ").indexOf(b)>=0)return!0;return!1}});var bc=/\r/g;o.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=o.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,o(this).val()):a,null==e?e="":"number"==typeof e?e+="":o.isArray(e)&&(e=o.map(e,function(a){return null==a?"":a+""})),b=o.valHooks[this.type]||o.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=o.valHooks[e.type]||o.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(bc,""):null==c?"":c)}}}),o.extend({valHooks:{select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(l.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&o.nodeName(c.parentNode,"optgroup"))){if(b=o(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=o.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=o.inArray(o(d).val(),f)>=0)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),o.each(["radio","checkbox"],function(){o.valHooks[this]={set:function(a,b){return o.isArray(b)?a.checked=o.inArray(o(a).val(),b)>=0:void 0}},l.checkOn||(o.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})}),o.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){o.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),o.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var cc=o.now(),dc=/\?/;o.parseJSON=function(a){return JSON.parse(a+"")},o.parseXML=function(a){var b,c;if(!a||"string"!=typeof a)return null;try{c=new DOMParser,b=c.parseFromString(a,"text/xml")}catch(d){b=void 0}return(!b||b.getElementsByTagName("parsererror").length)&&o.error("Invalid XML: "+a),b};var ec,fc,gc=/#.*$/,hc=/([?&])_=[^&]*/,ic=/^(.*?):[ \t]*([^\r\n]*)$/gm,jc=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,kc=/^(?:GET|HEAD)$/,lc=/^\/\//,mc=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,nc={},oc={},pc="*/".concat("*");try{fc=location.href}catch(qc){fc=m.createElement("a"),fc.href="",fc=fc.href}ec=mc.exec(fc.toLowerCase())||[];function rc(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(E)||[];if(o.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function sc(a,b,c,d){var e={},f=a===oc;function g(h){var i;return e[h]=!0,o.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function tc(a,b){var c,d,e=o.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&o.extend(!0,a,d),a}function uc(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function vc(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}o.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:fc,type:"GET",isLocal:jc.test(ec[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":pc,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":o.parseJSON,"text xml":o.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?tc(tc(a,o.ajaxSettings),b):tc(o.ajaxSettings,a)},ajaxPrefilter:rc(nc),ajaxTransport:rc(oc),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=o.ajaxSetup({},b),l=k.context||k,m=k.context&&(l.nodeType||l.jquery)?o(l):o.event,n=o.Deferred(),p=o.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!f){f={};while(b=ic.exec(e))f[b[1].toLowerCase()]=b[2]}b=f[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?e:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return c&&c.abort(b),x(0,b),this}};if(n.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||fc)+"").replace(gc,"").replace(lc,ec[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=o.trim(k.dataType||"*").toLowerCase().match(E)||[""],null==k.crossDomain&&(h=mc.exec(k.url.toLowerCase()),k.crossDomain=!(!h||h[1]===ec[1]&&h[2]===ec[2]&&(h[3]||("http:"===h[1]?"80":"443"))===(ec[3]||("http:"===ec[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=o.param(k.data,k.traditional)),sc(nc,k,b,v),2===t)return v;i=k.global,i&&0===o.active++&&o.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!kc.test(k.type),d=k.url,k.hasContent||(k.data&&(d=k.url+=(dc.test(d)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=hc.test(d)?d.replace(hc,"$1_="+cc++):d+(dc.test(d)?"&":"?")+"_="+cc++)),k.ifModified&&(o.lastModified[d]&&v.setRequestHeader("If-Modified-Since",o.lastModified[d]),o.etag[d]&&v.setRequestHeader("If-None-Match",o.etag[d])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+pc+"; q=0.01":""):k.accepts["*"]);for(j in k.headers)v.setRequestHeader(j,k.headers[j]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(j in{success:1,error:1,complete:1})v[j](k[j]);if(c=sc(oc,k,b,v)){v.readyState=1,i&&m.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,c.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,f,h){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),c=void 0,e=h||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,f&&(u=uc(k,v,f)),u=vc(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(o.lastModified[d]=w),w=v.getResponseHeader("etag"),w&&(o.etag[d]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?n.resolveWith(l,[r,x,v]):n.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,i&&m.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),i&&(m.trigger("ajaxComplete",[v,k]),--o.active||o.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return o.get(a,b,c,"json")},getScript:function(a,b){return o.get(a,void 0,b,"script")}}),o.each(["get","post"],function(a,b){o[b]=function(a,c,d,e){return o.isFunction(c)&&(e=e||d,d=c,c=void 0),o.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),o.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){o.fn[b]=function(a){return this.on(b,a)}}),o._evalUrl=function(a){return o.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},o.fn.extend({wrapAll:function(a){var b;return o.isFunction(a)?this.each(function(b){o(this).wrapAll(a.call(this,b))}):(this[0]&&(b=o(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this)},wrapInner:function(a){return this.each(o.isFunction(a)?function(b){o(this).wrapInner(a.call(this,b))}:function(){var b=o(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=o.isFunction(a);return this.each(function(c){o(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){o.nodeName(this,"body")||o(this).replaceWith(this.childNodes)}).end()}}),o.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0},o.expr.filters.visible=function(a){return!o.expr.filters.hidden(a)};var wc=/%20/g,xc=/\[\]$/,yc=/\r?\n/g,zc=/^(?:submit|button|image|reset|file)$/i,Ac=/^(?:input|select|textarea|keygen)/i;function Bc(a,b,c,d){var e;if(o.isArray(b))o.each(b,function(b,e){c||xc.test(a)?d(a,e):Bc(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==o.type(b))d(a,b);else for(e in b)Bc(a+"["+e+"]",b[e],c,d)}o.param=function(a,b){var c,d=[],e=function(a,b){b=o.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=o.ajaxSettings&&o.ajaxSettings.traditional),o.isArray(a)||a.jquery&&!o.isPlainObject(a))o.each(a,function(){e(this.name,this.value)});else for(c in a)Bc(c,a[c],b,e);return d.join("&").replace(wc,"+")},o.fn.extend({serialize:function(){return o.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=o.prop(this,"elements");return a?o.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!o(this).is(":disabled")&&Ac.test(this.nodeName)&&!zc.test(a)&&(this.checked||!T.test(a))}).map(function(a,b){var c=o(this).val();return null==c?null:o.isArray(c)?o.map(c,function(a){return{name:b.name,value:a.replace(yc,"\r\n")}}):{name:b.name,value:c.replace(yc,"\r\n")}}).get()}}),o.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(a){}};var Cc=0,Dc={},Ec={0:200,1223:204},Fc=o.ajaxSettings.xhr();a.ActiveXObject&&o(a).on("unload",function(){for(var a in Dc)Dc[a]()}),l.cors=!!Fc&&"withCredentials"in Fc,l.ajax=Fc=!!Fc,o.ajaxTransport(function(a){var b;return l.cors||Fc&&!a.crossDomain?{send:function(c,d){var e,f=a.xhr(),g=++Cc;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)f.setRequestHeader(e,c[e]);b=function(a){return function(){b&&(delete Dc[g],b=f.onload=f.onerror=null,"abort"===a?f.abort():"error"===a?d(f.status,f.statusText):d(Ec[f.status]||f.status,f.statusText,"string"==typeof f.responseText?{text:f.responseText}:void 0,f.getAllResponseHeaders()))}},f.onload=b(),f.onerror=b("error"),b=Dc[g]=b("abort"),f.send(a.hasContent&&a.data||null)},abort:function(){b&&b()}}:void 0}),o.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return o.globalEval(a),a}}}),o.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),o.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(d,e){b=o("<script>").prop({async:!0,charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&e("error"===a.type?404:200,a.type)}),m.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Gc=[],Hc=/(=)\?(?=&|$)|\?\?/;o.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Gc.pop()||o.expando+"_"+cc++;return this[a]=!0,a}}),o.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Hc.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Hc.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=o.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Hc,"$1"+e):b.jsonp!==!1&&(b.url+=(dc.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||o.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Gc.push(e)),g&&o.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),o.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||m;var d=v.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=o.buildFragment([a],b,e),e&&e.length&&o(e).remove(),o.merge([],d.childNodes))};var Ic=o.fn.load;o.fn.load=function(a,b,c){if("string"!=typeof a&&Ic)return Ic.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=a.slice(h),a=a.slice(0,h)),o.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&o.ajax({url:a,type:e,dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?o("<div>").append(o.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,f||[a.responseText,b,a])}),this},o.expr.filters.animated=function(a){return o.grep(o.timers,function(b){return a===b.elem}).length};var Jc=a.document.documentElement;function Kc(a){return o.isWindow(a)?a:9===a.nodeType&&a.defaultView}o.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=o.css(a,"position"),l=o(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=o.css(a,"top"),i=o.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),o.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},o.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){o.offset.setOffset(this,a,b)});var b,c,d=this[0],e={top:0,left:0},f=d&&d.ownerDocument;if(f)return b=f.documentElement,o.contains(b,d)?(typeof d.getBoundingClientRect!==U&&(e=d.getBoundingClientRect()),c=Kc(f),{top:e.top+c.pageYOffset-b.clientTop,left:e.left+c.pageXOffset-b.clientLeft}):e},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===o.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),o.nodeName(a[0],"html")||(d=a.offset()),d.top+=o.css(a[0],"borderTopWidth",!0),d.left+=o.css(a[0],"borderLeftWidth",!0)),{top:b.top-d.top-o.css(c,"marginTop",!0),left:b.left-d.left-o.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||Jc;while(a&&!o.nodeName(a,"html")&&"static"===o.css(a,"position"))a=a.offsetParent;return a||Jc})}}),o.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(b,c){var d="pageYOffset"===c;o.fn[b]=function(e){return J(this,function(b,e,f){var g=Kc(b);return void 0===f?g?g[c]:b[e]:void(g?g.scrollTo(d?a.pageXOffset:f,d?f:a.pageYOffset):b[e]=f)},b,e,arguments.length,null)}}),o.each(["top","left"],function(a,b){o.cssHooks[b]=yb(l.pixelPosition,function(a,c){return c?(c=xb(a,b),vb.test(c)?o(a).position()[b]+"px":c):void 0})}),o.each({Height:"height",Width:"width"},function(a,b){o.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){o.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return J(this,function(b,c,d){var e;return o.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?o.css(b,c,g):o.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),o.fn.size=function(){return this.length},o.fn.andSelf=o.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return o});var Lc=a.jQuery,Mc=a.$;return o.noConflict=function(b){return a.$===o&&(a.$=Mc),b&&a.jQuery===o&&(a.jQuery=Lc),o},typeof b===U&&(a.jQuery=a.$=o),o});
/*jslint undef: true, browser: true, continue: true, eqeq: true, vars: true, forin: true, white: true, newcap: false, nomen: true, plusplus: true, maxerr: 50, indent: 4 */

/**
 * jGestures: a jQuery plugin for gesture events
 * Copyright 2010-2011 Neue Digitale / Razorfish GmbH
 * Copyright 2011-2012, Razorfish GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @fileOverview
 * Razorfish GmbH javascript library: add touch events such as 'pinch',
 * 'rotate', 'swipe', 'tap' and 'orientationchange' on capable user agents.
 * For incapable devices there's a basic event substitution: a "tapone" event
 * can be triggered by "clicking", a "swipeone" by performing a swipe-ish
 * gesture using the mouse (buttondown - mousemove - buttonup).
 *
 * This is still a beta version, bugfixes and improvements appreciated.
 *
 * @author martin.krause@razorfish.de
 * @version 0.90-shake
 *
 * @requires
 * jQuery JavaScript Library v1.4.2 - http://jquery.com/
 *  Copyright 2010, John Resig
 *  Dual licensed under the MIT or GPL Version 2 licenses.
 *  http://jquery.org/license
 *
 * @example jQuery('#swipe').bind('swipeone',eventHandler);
 *
 * Notification on native events:
 * On every native touchstart, touchend, gesturestart and gestureend-event,
 * jgestures triggers a corresponding custom event
 * ('jGestures.touchstart', 'jGestures.touchend;start', 'jGestures.touchend;processed',
 * 'jGestures.gesturestart', 'jGestures.gestureend;start', 'jGestures.gestureend;processed') on the event-element.
 * The  eventhandler's second argument represents the original touch event (yes: including all touchpoints).
 * Use this if you need very detailed control e.g. kinetic scrolling or implementing additional gestures.
 *
 * Every jGesture-eventhandler receives a custom object as second argument
 * containing the original event (originalEvent property) and processed
 * information (such as delta values and timesptamp).
 * Example:{
 *        type: eventtype e.g. "swipe","pinch",
 *        originalEvent: {DOM-Event},
 *        // default: just one entry on the delta-array - the first touchpoint
 *        // the first touchpoint is the reference point for every gesture,
 *        // because moving touchpoints in various directions would result in
 *        // a gesture.
 *        // delta and direction details are just provided for touch not for gesture / motion events
 *        delta : [
 *          {
 *            lastX:{Number} , // x-axis: relative to the last touchevent (e.g. touchmove!)
 *            lastY:{Number}, // y-axis: relative to the last touchevent (e.g. touchmove!)
 *            moved: {Number},  // distance: relative to the original touchpoint
 *            startX: {Number} , // relative to the original touchpoint
 *            startY: {Number} ,// relative to the original touchpoint
 *          } ],
 *        // based on the first touchpoint
 *        direction : { // relative to the last touchevent (e.g. touchmove!)
 *          vector: {Number}, // -1|+1, indicates the direction if necessary(pinch/rotate)
 *          orientation: {Number} // window.orientation: -90,0,90,180 || null (window.orienntation)
 *          lastX : {Number}, // -1,0,+1 || null (orientationchange) // relative to the last touchevent (e.g. touchmove!)
 *          lastY : {Number}, // -1,0,+1 || null (orientationchange)// relative to the last touchevent (e.g. touchmove!)
 *          startX: {Number} , // relative to the original touchpoint
 *          startY: {Number} ,// relative to the original touchpoint
 *        },
 *        rotation: {Number} || null, // gestureonly: amount of rotation relative to the current position NOT the original
 *        scale: {Number} || null, // gestureonly: amount of scaling relative to the current position NOT the original
 *        duration: {Number}, // ms: relative to the original touchpoint
 *        description : {String} // details as String: {TYPE *}:{TOUCHES 1|2|3|4}:{X-AXIS 'right'|'left'|'steady'}:{Y-AXIS 'down'|'up'|'steady'} e.g. "swipe:1:left:steady" relative to the last touchpoint
 *      };
 *
 * Available jGesture-events can be grouped into:
 *
 *
 * Device events:
 *  The jGesture-Events in this group are triggered by the device.
 *
 * @event 'orientationchange'
 *    The device is turned clockwise or counterclockwise. This event is triggered
 *    by the device and might use an internal gyroscope.
 *  obj.description:
 *    orientationchange:landscape:clockwise:-90
 *    orientationchange:portrait:default:0
 *    orientationchange:landscape:counterclockwise|portrait:90
 *    orientationchange:portrait:upsidedown:180
 *
 *
 * Move events:
 *  The jGesture-Events in this group are triggered during the touch/gesture
 *  execution whenever a touchpoint changes.
 *  In contrast to touchend/gestureend-events which are triggered after
 *  the touch/gesture has completed.
 *
 * @event 'pinch'
 *    Is triggered during a pinch gesture (two fingers moving away from or
 *    towards each other).
 *  obj.description:
 *    pinch:-1:close
 *    pinch:+1:open
 *
 * @event 'rotate'
 *    Is triggered during a rotation gesture (two fingers rotating clockwise
 *    or counterclockwise).
 *  obj.description:
 *    rotate:-1:counterclockwise
 *    rotate:+1:+clockwise
 *
 * @event 'swipemove'
 *    Is triggered during a swipe move gesture (finger(s) being moved around
 *    the device, e.g. dragging)
 *  obj.description:
 *    swipemove:1:left:down
 *    swipemove:1:left:up
 *    swipemove:1:left:steady
 *    swipemove:1:right:down
 *    swipemove:1:right:up
 *    swipemove:1:right:steady
 *    swipemove:2:left:down
 *    swipemove:2:left:up
 *    swipemove:2:left:steady
 *    swipemove:2:right:down
 *    swipemove:2:right:up
 *    swipemove:2:right:steady
 *    swipemove:2:left:down
 *    swipemove:3:left:up
 *    swipemove:3:left:steady
 *    swipemove:3:right:down
 *    swipemove:3:right:up
 *    swipemove:3:right:steady
 *    swipemove:3:left:down
 *    swipemove:4:left:up
 *    swipemove:4:left:steady
 *    swipemove:4:right:down
 *    swipemove:4:right:up
 *    swipemove:4:right:steady
 *
 *
 * Toucheend events:
 *  The jGesture-Events in this group are triggered after the touch/gesture
 *  has completed.
 *  In contrast to touchmove-events which are triggered during the touch/gesture
 *  execution whenever a touchpoint changes.
 *
 * @event 'swipeone'
 *    Is triggered after a swipe move gesture with one touchpoint (one finger
 *    was moved around the device)
 *  obj.description:
 *    swipeone:1:left:down
 *    swipeone:1:left:up
 *    swipeone:1:left:steady
 *    swipeone:1:right:down
 *    swipeone:1:right:up
 *    swipeone:1:right:steady
 *
 * @event 'swipetwo'
 *    Is triggered after a swipe move gesture with two touchpoints (two fingers
 *    were moved around the device)
 *  obj.description:
 *    swipetwo:2:left:down
 *    swipetwo:2:left:up
 *    swipetwo:2:left:steady
 *    swipetwo:2:right:down
 *    swipetwo:2:right:up
 *    swipetwo:2:right:steady
 *
 * @event 'swipethree'
 *    Is triggered after a swipe move gesture with three touchpoints (three
 *    fingers were moved around the device)
 *  obj.description:
 *    swipethree:3:left:down
 *    swipethree:3:left:up
 *    swipethree:3:left:steady
 *    swipethree:3:right:down
 *    swipethree:3:right:up
 *    swipethree:3:right:steady
 *
 * @event 'swipefour'
 *    Is triggered after a swipe move gesture with four touchpoints (four
 *    fingers were moved around the device)
 *  obj.description:
 *    swipefour:4:left:down
 *    swipefour:4:left:up
 *    swipefour:4:left:steady
 *    swipefour:4:right:down
 *    swipefour:4:right:up
 *    swipefour:4:right:steady
 *
 *
 * @event 'swipeup'
 *    Is triggered after an  strict upwards swipe move gesture
 *  obj.description:
 *    swipe:1:steady:up
 *    swipe:2:steady:up
 *    swipe:3:steady:up
 *    swipe:4:steady:up
 *
 * @event 'swiperightup'
 *    Is triggered after a rightwards and upwards swipe move gesture
 *  obj.description:
 *    swipe:1:right:up
 *    swipe:2:right:up
 *    swipe:3:right:up
 *    swipe:4:right:up
 *
 * @event 'swiperight'
 *    Is triggered after a  strict rightwards swipe move gesture
 *  obj.description:
 *    swipe:1:right:steady
 *    swipe:2:right:steady
 *    swipe:3:right:steady
 *    swipe:4:right:steady
 *
 * @event 'swiperightdown'
 *    Is triggered after a rightwards and downwards swipe move gesture
 *  obj.description:
 *    swipe:1:right:down
 *    swipe:2:right:down
 *    swipe:3:right:down
 *    swipe:4:right:down
 *
 * @event 'swipedown'
 *    Is triggered after a  strict downwards swipe move gesture
 *  obj.description:
 *    swipe:1:steady:down
 *    swipe:2:steady:down
 *    swipe:3:steady:down
 *    swipe:4:steady:down
 *
 * @event 'swipeleftdown'
 *    Is triggered after a leftwards and downwards swipe move gesture
 *  obj.description:
 *    swipe:1:left:down
 *    swipe:2:left:down
 *    swipe:3:left:down
 *    swipe:4:left:down
 *
 * @event 'swipeleft'
 *    Is triggered after a strict leftwards swipe move gesture
 *  obj.description:
 *    swipe:1:left:steady
 *    swipe:2:left:steady
 *    swipe:3:left:steady
 *    swipe:4:left:steady
 *
 * @event 'swipeleftup'
 *    Is triggered after a leftwards and upwards swipe move gesture
 *  obj.description:
 *    swipe:1:left:up
 *    swipe:2:left:up
 *    swipe:3:left:up
 *    swipe:4:left:up
 *
 * @event 'tapone'
 *    Is triggered after a single (one finger) tap gesture
 *  obj.description:
 *    tapone
 *
 * @event 'taptwo'
 *    Is triggered after a double (two finger) tap gesture
 *  obj.description:
 *    taptwo
 * *
 * @event 'tapthree'
 *    Is triggered after a tripple (three finger) tap gesture
 *  obj.description:
 *    tapthree
 *
 *
 * Gestureend events:
 *  A gesture is an interpretation of different touchpoints.
 *  The jGesture-Events in this group are triggered when a gesture has finished
 *  and the touchpoints are removed from the device.
 *
 * @event 'pinchopen'
 *    Is triggered when a pinchopen gesture (two fingers moving away from each
 *    other) occured and the touchpoints (fingers) are removed the device.
 *  obj.description:
 *    pinch:+1:open
 *
 * @event 'pinchclose'
 *    Is triggered when a pinchclose gesture (two fingers moving towards each
 *    other) occured and the touchpoints (fingers) are removed the device.
 *  obj.description:
 *    pinch:-1:close
 *
 * @event 'rotatecw'
 *    Is triggered when a clockwise rotation gesture (two fingers rotating
 *    clockwise) occured and the touchpoints (fingers) are removed the device.
 *  obj.description:
 *    rotate:+1:+clockwise
 *
 * @event 'rotateccw'
 *    Is triggered when a counterclockwise rotation gesture (two fingers
 *    rotating counterclockwise) occured and the touchpoints (fingers) are
 *    removed the device.
 *  obj.description:
 *    rotate:-1:+counterclockwise
 *
 *
 * Motion events:
 *  A "motion event" is an interpretation of changes in space, e.g. a "shaking motion"
 *  consists of a specified number of acceleration changes in a given interval.
 * For understanding "directions", place your mobile device on a table with the bottom
 * (home button) close to you:
 *  - x-axis: horizontal left / right
 *  - y-axis: horizontal front / back (through the home button)
 *  - z-axis: vertical through your device
 *
 *  Note: Devicemotion / deviceorientation don't send custom event (such as: jGestures.touchstart).
 *  Note: Devicemotion should be bound on the "window-element" - because the whole device moves
 *
 * @event 'shake'
 *    Is triggered when a shaking motion is detected
 *  obj.description:
 *    shake:leftright:x-axisfrontback:y-axis:updown:z-axis
 *
 * @event 'shakefrontback'
 *    Is triggered when a shaking motion is detected and the gesture can be interpreted as a mainly front-back movement.
  * obj.description:
 *    shakefrontback:shakefrontback:y-axis
 *
 * @event 'shakeleftright'
 *    Is triggered when a shaking motion is detected and the gesture can be interpreted as a mainly left-right movement.
 *    Additional major movements are mentioned in the obj.description.
 *  obj.description:
 *    shakeleftright:leftright:x-axis
 *
 * @event 'shakeupdown'
 *    Is triggered when a shaking motion is detected and the gesture can be interpreted as a mainly up-down movement.
 *    Additional major movements are mentioned in the obj.description.
 *  obj.description:
 *    shake:shakeupdown:updown:z-axis
 *
 * @example
 *    .bind( eventType, [ eventData ], handler(eventObject) )
 * jQuery('body').bind('tapone',function(){alert(arguments[1].description);})
 *
 */


 (function($) {

  /**
  * General thresholds.
  */
  // @TODO: move to $...defaults
  // @TODO: shake to defaults freeze etc
  // change of x deg in y ms


  $.jGestures = {};
  $.jGestures.defaults = {};
  $.jGestures.defaults.thresholdShake =  {
    requiredShakes : 10,
    freezeShakes: 100,
    frontback : {
      sensitivity: 10
     },
    leftright : {
      sensitivity: 10
    },
    updown : {
      sensitivity: 10
    }
  };

  $.jGestures.defaults.thresholdPinchopen = 0.05;
  $.jGestures.defaults.thresholdPinchmove = 0.05;
  $.jGestures.defaults.thresholdPinch = 0.05;
  $.jGestures.defaults.thresholdPinchclose = 0.05;
  $.jGestures.defaults.thresholdRotatecw = 5; //deg
  $.jGestures.defaults.thresholdRotateccw = 5; // deg
  // a tap becomes a swipe if x/y values changes are above this threshold
  $.jGestures.defaults.thresholdMove = 20;
  $.jGestures.defaults.thresholdSwipe = 100;
  // get capable user agents
  $.jGestures.data = {};
  $.jGestures.data.capableDevicesInUserAgentString = ['iPad','iPhone','iPod','Mobile Safari']; // basic functionality such as swipe, pinch, rotate, tap should work on every mobile safari, e.g. GalaxyTab
  $.jGestures.data.hasGestures = (function () { var _i; for(_i = 0; _i < $.jGestures.data.capableDevicesInUserAgentString.length; _i++ ) {  if (navigator.userAgent.indexOf($.jGestures.data.capableDevicesInUserAgentString[_i]) !== -1 ) {return true;} } return false; } )();
  $.hasGestures = $.jGestures.data.hasGestures;
  $.jGestures.events = {
    touchstart : 'jGestures.touchstart',
    touchendStart: 'jGestures.touchend;start',
    touchendProcessed: 'jGestures.touchend;processed',
    gesturestart: 'jGestures.gesturestart',
    gestureendStart: 'jGestures.gestureend;start',
    gestureendProcessed: 'jGestures.gestureend;processed'
  };

  jQuery
    .each({
      // "first domevent necessary"_"touch event+counter" : "exposed as"
      // event: orientationchange
      orientationchange_orientationchange01: "orientationchange",
      // event: gestures
      gestureend_pinchopen01: "pinchopen",
      gestureend_pinchclose01: "pinchclose",
      gestureend_rotatecw01 : 'rotatecw',
      gestureend_rotateccw01 : 'rotateccw',
      // move events
      gesturechange_pinch01: 'pinch',
      gesturechange_rotate01: 'rotate',
      touchstart_swipe13: 'swipemove',
      // event: touches
      touchstart_swipe01: "swipeone",
      touchstart_swipe02: "swipetwo",
      touchstart_swipe03: "swipethree",
      touchstart_swipe04: "swipefour",
      touchstart_swipe05: 'swipeup',
      touchstart_swipe06: 'swiperightup',
      touchstart_swipe07: 'swiperight',
      touchstart_swipe08: 'swiperightdown',
      touchstart_swipe09: 'swipedown',
      touchstart_swipe10: 'swipeleftdown',
      touchstart_swipe11: 'swipeleft',
      touchstart_swipe12: 'swipeleftup',
      touchstart_tap01: 'tapone',
      touchstart_tap02: 'taptwo',
      touchstart_tap03: 'tapthree',
      touchstart_tap04: 'tapfour',

      devicemotion_shake01: 'shake',
      devicemotion_shake02: 'shakefrontback',
      devicemotion_shake03: 'shakeleftright',
      devicemotion_shake04: 'shakeupdown'

    },

    /**
    * Add gesture events inside the jQuery.event.special namespace
    */
    function( sInternal_, sPublicFN_ ) {

      // add as funciton to jQuery.event.special.sPublicFN_
      jQuery.event.special[ sPublicFN_ ] = {

        /**
        * When the first event handler is bound, jQuery executes the setup function.
        * This plugin just uses one eventhandler per element, regardless of the number of bound events.
        * All Events are stored internally as properties on the dom-element using the $.data api.
        * The setup-function adds the eventlistener, acting as a proxy function for the internal events.
        * $.data.ojQueryGestures[_sDOMEvent ('tap') ] = {Boolean}
        * @return {Void}
        */
        setup: function () {
          // split the arguments to necessary controll arguements
          var _aSplit = sInternal_.split('_');
          var _sDOMEvent = _aSplit[0]; //
          // get the associated gesture event and strip the counter: necessary for distinguisihng similliar events such as tapone-tapfour
          var _sGestureEvent = _aSplit[1].slice(0,_aSplit[1].length-2);
          var _$element = jQuery(this);
          var _oDatajQueryGestures ;
          var oObj;
          // bind the event handler on the first $.bind() for a gestureend-event, set marker
          if (!_$element.data('ojQueryGestures') || !_$element.data('ojQueryGestures')[_sDOMEvent])  {
            // setup pseudo event
            _oDatajQueryGestures = _$element.data('ojQueryGestures') || {};
            oObj = {};
            // marker for:  domEvent being set on this element
            // e.g.: $.data.oGestureInternals['touchstart'] = true;
            // since they're grouped, i'm just marking the first one being added
            oObj[_sDOMEvent] = true;
            $.extend(true,_oDatajQueryGestures,oObj);
            _$element.data('ojQueryGestures' ,_oDatajQueryGestures);
            // add gesture events
            if($.hasGestures) {
              switch(_sGestureEvent) {

                // event: orientationchange
                case 'orientationchange':
                  _$element.get(0).addEventListener('orientationchange', _onOrientationchange, false);
                break;

                // event:
                // - shake
                // - tilt
                case 'shake':
                case 'shakefrontback':
                case 'shakeleftright':
                case 'shakeupdown':
                case 'tilt':
                  //$.hasGyroscope = true //!window.DeviceOrientationEvent;
                  //_$element.get(0).addEventListener('devicemotion', _onDevicemotion, false);
                  //_$element.get(0).addEventListener('deviceorientation', _onDeviceorientation, false);
                  _$element.get(0).addEventListener('devicemotion', _onDevicemotion, false);
                break;

                // event:
                // - touchstart
                // - touchmove
                // - touchend
                case 'tap':
                case 'swipe':
                case 'swipeup':
                case 'swiperightup':
                case 'swiperight':
                case 'swiperightdown':
                case 'swipedown':
                case 'swipeleftdown':
                case 'swipeleft':
                  _$element.get(0).addEventListener('touchstart', _onTouchstart, false);
                break;

                // event: gestureend
                case 'pinchopen':
                case 'pinchclose' :
                case 'rotatecw' :
                case 'rotateccw' :
                  _$element.get(0).addEventListener('gesturestart', _onGesturestart, false);
                  _$element.get(0).addEventListener('gestureend', _onGestureend, false);
                break;

                // event: gesturechange
                case 'pinch':
                case 'rotate':
                  _$element.get(0).addEventListener('gesturestart', _onGesturestart, false);
                  _$element.get(0).addEventListener('gesturechange', _onGesturechange, false);
                break;
              }
            }
            // create substitute for gesture events
            else {
              switch(_sGestureEvent) {
                // event substitutes:
                // - touchstart: mousedown
                // - touchmove: none
                // - touchend: mouseup
                case 'tap':
                case 'swipe':
                  // _$element.get(0).addEventListener('mousedown', _onTouchstart, false);
                   _$element.bind('mousedown', _onTouchstart);
                break;

                // no substitution
                case 'orientationchange':
                case 'pinchopen':
                case 'pinchclose' :
                case 'rotatecw' :
                case 'rotateccw' :
                case 'pinch':
                case 'rotate':
                case 'shake':
                case 'tilt':

                break;
              }
            }

          }
          return false;
        },

        /**
        * For every $.bind(GESTURE) the add-function will be called.
        * Instead of binding an actual eventlister, the event is stored as $.data on the element.
        * The handler will be triggered using $.triggerHandler(GESTURE) if the internal
        * eventhandler (proxy being bound on setup()) detects a GESTURE event
        * @param {Object} event_ jQuery-Event-Object being passed by $.bind()
        * @return {Void}
        */
        add : function(event_) {
          // add pseudo event: properties on $.data
          var _$element = jQuery(this);
          var _oDatajQueryGestures = _$element.data('ojQueryGestures');
//          _oDatajQueryGestures[event_.type] = { 'originalType' : event_.type , 'threshold' : event_.data.threshold, 'preventDefault' : event_.data.preventDefault } ;
          _oDatajQueryGestures[event_.type] = { 'originalType' : event_.type } ;
          return false;
        },

        /**
        * For every $.unbind(GESTURE) the remove-function will be called.
        * Instead of removing the actual eventlister, the event is removed from $.data on the element.
        * @param {Object} event_ jQuery-Event-Object being passed by $.bind()
        * @return {Void}
        */
        remove : function(event_) {
          // remove pseudo event: properties on $.data
          var _$element = jQuery(this);
          var _oDatajQueryGestures = _$element.data('ojQueryGestures');
          _oDatajQueryGestures[event_.type] = false;
          _$element.data('ojQueryGestures' ,_oDatajQueryGestures );
          return false;
        },

        /**
        * The last $.unbind()-call on the domElement triggers the teardown function
        * removing the eventlistener
        * @return {Void}
        */
        // @TODO: maybe rework teardown to work with event type?!
        teardown : function() {
          // split the arguments to necessary controll arguements
          var _aSplit = sInternal_.split('_');
          var _sDOMEvent = _aSplit[0]; //
          // get the associated gesture event and strip the counter: necessary for distinguisihng similliar events such as tapone-tapfour
          var _sGestureEvent = _aSplit[1].slice(0,_aSplit[1].length-2);
          var _$element = jQuery(this);
          var _oDatajQueryGestures;
          var oObj;
          // bind the event handler on the first $.bind() for a gestureend-event, set marker
          if (!_$element.data('ojQueryGestures') || !_$element.data('ojQueryGestures')[_sDOMEvent])  {
            // setup pseudo event
            _oDatajQueryGestures = _$element.data('ojQueryGestures') || {};
            oObj = {};
            // remove marker for:  domEvent being set on this element
            oObj[_sDOMEvent] = false;
            $.extend(true,_oDatajQueryGestures,oObj);
            _$element.data('ojQueryGestures' ,_oDatajQueryGestures);

            // remove gesture events
            if($.hasGestures) {
              switch(_sGestureEvent) {

                // event: orientationchange
                case 'orientationchange':
                  _$element.get(0).removeEventListener('orientationchange', _onOrientationchange, false);
                break;

                case 'shake':
                case 'shakefrontback':
                case 'shakeleftright':
                case 'shakeupdown':
                case 'tilt':
                  _$element.get(0).removeEventListener('devicemotion', _onDevicemotion, false);
                break;

                // event :
                // - touchstart
                // - touchmove
                // - touchend
                case 'tap':
                case 'swipe':
                case 'swipeup':
                case 'swiperightup':
                case 'swiperight':
                case 'swiperightdown':
                case 'swipedown':
                case 'swipeleftdown':
                case 'swipeleft':
                case 'swipeleftup':
                  _$element.get(0).removeEventListener('touchstart', _onTouchstart, false);
                  _$element.get(0).removeEventListener('touchmove', _onTouchmove, false);
                  _$element.get(0).removeEventListener('touchend', _onTouchend, false);
                break;

                // event: gestureend
                case 'pinchopen':
                case 'pinchclose' :
                case 'rotatecw' :
                case 'rotateccw' :
                  _$element.get(0).removeEventListener('gesturestart', _onGesturestart, false);
                  _$element.get(0).removeEventListener('gestureend', _onGestureend, false);
                break;

                // event: gesturechange
                case 'pinch':
                case 'rotate':
                  _$element.get(0).removeEventListener('gesturestart', _onGesturestart, false);
                  _$element.get(0).removeEventListener('gesturechange', _onGesturechange, false);
                break;
              }
            }
            // remove substitute for gesture events
            else {
              switch(_sGestureEvent) {
                // event substitutes:
                // - touchstart: mousedown
                // - touchmove: none
                // - touchend: mouseup
                case 'tap':
                case 'swipe':
//                  _$element.get(0).removeEventListener('mousedown', _onTouchstart, false);
//                  _$element.get(0).removeEventListener('mousemove', _onTouchmove, false);
//                  _$element.get(0).removeEventListener('mouseup', _onTouchend, false);
                  _$element.unbind('mousedown', _onTouchstart);
                  _$element.unbind('mousemove', _onTouchmove);
                  _$element.unbind('mouseup', _onTouchend);
                break;

                // no substitution
                case 'orientationchange':
                case 'pinchopen':
                case 'pinchclose' :
                case 'rotatecw' :
                case 'rotateccw' :
                case 'pinch':
                case 'rotate':
                case 'shake':
                case 'tilt':

                break;
              }
            }

          }
        return false;
        }

      };
    });

  /**
  * Creates the object that ist passed as second argument to the $element.triggerHandler function.
  * This object contains detailed informations about the gesture event.
  * @param {Object} oOptions_  {type: {String}, touches: {String}, deltaY: {String},deltaX : {String}, startMove: {Object}, event:{DOM-Event}, timestamp:{String},vector: {Number}}
  * @example _createOptions (
  *       {
  *         type: 'swipemove',
  *         touches: '1',
  *         deltaY: _iDeltaY,
  *         deltaX : _iDeltaX,
  *         startMove: _oDatajQueryGestures.oStartTouch,
  *         event:event_,
  *         timestamp:_oEventData.timestamp,
  *         vector: -1
  *       }
  *     );
  * @returns {Object}
  *     {
  *       type: eventtype e.g. "swipe","pinch",
  *       originalEvent: {DOM-Event},
  *       // default: just one entry on the delta-array - the first touchpoint
  *       // the first touchpoint is the reference point for every gesture,
  *       // because moving touchpoints in various directions would result in
  *       // a gesture.
  *       // delta and direction details are just provided for touch not for gesture / motion events
  *       delta : [
  *         {
  *           lastX:{Number} , // x-axis: relative to the last touchevent (e.g. touchmove!)
  *           lastY:{Number}, // y-axis: relative to the last touchevent (e.g. touchmove!)
  *           moved: {Number},  // distance: relative to the original touchpoint
  *           startX: {Number} , // relative to the original touchpoint
  *           startY: {Number} ,// relative to the original touchpoint
  *         } ],
  *       // based on the first touchpoint
  *       direction : { // relative to the last touchevent (e.g. touchmove!)
  *         vector: {Number}, // -1|+1, indicates the direction if necessary(pinch/rotate)
  *         orientation: {Number} // window.orientation: -90,0,90,180 || null (window.orienntation)
  *         lastX : {Number}, // -1,0,+1 relative to the last touchevent (e.g. touchmove!)
  *         lastY : {Number}, // -1,0,+1 relative to the last touchevent (e.g. touchmove!)
  *         startX: {Number} , //-1,0,+1 relative to the original touchpoint
  *         startY: {Number} ,// -1,0,+1 relative to the original touchpoint
  *       },
  *       rotation: {Number} || null, // gestureonly: amount of rotation relative to the current position NOT the original
  *       scale: {Number} || null, // gestureonly: amount of scaling relative to the current position NOT the original
  *       duration: {Number}, // ms: relative to the original touchpoint
  *       description : {String} // details as String: {TYPE *}:{TOUCHES 1|2|3|4}:{X-AXIS 'right'|'left'|'steady'}:{Y-AXIS 'down'|'up'|'steady'} e.g. "swipe:1:left:steady" relative to the last touchpoint
  *     };
  */
  function _createOptions(oOptions_) {
    // force properties
    oOptions_.startMove = (oOptions_.startMove) ? oOptions_.startMove : {startX: null,startY:null,timestamp:null}  ;
    var _iNow = new Date().getTime();
    var _oDirection;
    var _oDelta;
    // calculate touch differences
    if (oOptions_.touches) {
      // store delta values
      _oDelta = [
        {
          lastX: oOptions_.deltaX ,
          lastY: oOptions_.deltaY,
          moved: null,
          startX:  oOptions_.screenX - oOptions_.startMove.screenX ,
          startY: oOptions_.screenY - oOptions_.startMove.screenY
        }
      ];

      _oDirection =  {
        vector: oOptions_.vector || null,
        orientation : window.orientation || null,
        lastX : ((_oDelta[0].lastX > 0) ? +1 : ( (_oDelta[0].lastX < 0) ? -1 : 0 ) ),
        lastY : ((_oDelta[0].lastY > 0) ? +1 : ( (_oDelta[0].lastY < 0) ? -1 : 0 ) ),
        startX : ((_oDelta[0].startX > 0) ? +1 : ( (_oDelta[0].startX < 0) ? -1 : 0 ) ),
        startY : ((_oDelta[0].startY > 0) ? +1 : ( (_oDelta[0].startY < 0) ? -1 : 0 ) )
      };

      // calculate distance traveled using the pythagorean theorem
      _oDelta[0].moved =  Math.sqrt(Math.pow(Math.abs(_oDelta[0].startX), 2) + Math.pow(Math.abs(_oDelta[0].startY), 2));

    }
    return {
      type: oOptions_.type || null,
      originalEvent: oOptions_.event || null,
      delta : _oDelta  || null,
      direction : _oDirection || { orientation : window.orientation || null, vector: oOptions_.vector || null},
      duration: (oOptions_.duration) ? oOptions_.duration : ( oOptions_.startMove.timestamp ) ? _iNow - oOptions_.timestamp : null,
      rotation: oOptions_.rotation || null,
      scale: oOptions_.scale || null,
      description : oOptions_.description || [
        oOptions_.type,
        ':',
        oOptions_.touches,
        ':',
        ((_oDelta[0].lastX != 0) ? ((_oDelta[0].lastX > 0) ? 'right' : 'left') : 'steady'),
        ':',
        ((_oDelta[0].lastY != 0) ? ( (_oDelta[0].lastY > 0) ? 'down' : 'up') :'steady')
        ].join('')
    };

  }



  /**
  * DOM-event handlers
  */

  /**
  * Handler: orientationchange
  * Triggers the bound orientationchange handler on the window element
  * The "orientationchange" handler will receive an object with additional information
  * about the event.
  *  {
  * direction : {
  *   orientation: {-90|0|90|180}
  * },
  * description : [
  *   'orientationchange:{landscape:clockwise:|portrait:default|landscape:counterclockwise|portrait:upsidedown}:{-90|0|90|180}' // e.g. 'orientation:landscape:clockwise:-90
  * }
  * @param {DOM-Event} event_
  * @return {Void}
  */
  function _onOrientationchange(event_) {

    // window.orientation: -90,0,90,180
    var _aDict = ['landscape:clockwise:','portrait:default:','landscape:counterclockwise:','portrait:upsidedown:'];

    $(window).triggerHandler('orientationchange',
      {
        direction : {orientation: window.orientation},
        description : [
          'orientationchange:',
          _aDict[( (window.orientation / 90) +1)],
          window.orientation
          ].join('')
      });
  }


  /**
  * Handler: devicemotion
  * Calculates "motion events" such as shake, tilt, wiggle by observing "changes in space"
  * For understanding "directions", place your mobile device on a table with the bottom
  * (home button) close to you:
  *  - x-axis: horizontal left / right
  *  - y-axis: horizontal front / back (through the home button)
  *  - z-axis: vertical through your device
  * @param {DOM-Event} event_
  * @returns {Object}
  *     {
  *       type: eventtype e.g. "shake",
  *       originalEvent: {DOM-Event},
  *       // delta and direction details are just provided for touch not for gesture / motion events
  *       delta : null,
  *       direction :{
  *         vector: null,
  *         orientation: -90,0,90,180 || null (window.orienntation)
  *       }
  *       rotation: {Number} , //  amount of rotation relative to the current position NOT the original
  *       scale: {Number} , // amount of scaling relative to the current position NOT the original
  *       duration: {Number}, // ms: duration of the motion
  *       description : {String} // details as String: pinch:{'close'|'open'} e.g. "pinch:-1:close" ||  rotate:{'counterclockwise'|'clockwise'} e.g. "rotate:-1:counterclockwise"
  *     };
  * @param {DOM-Event} event_
  * @return {Void}
  */
  function _onDevicemotion(event_) {

    var _sType;
    var _$element = jQuery(window);
    //var _bHasGyroscope = $.hasGyroscope;

    // skip custom notification: devicemotion is triggered every 0.05s regardlesse of any gesture

    // get options
    var _oDatajQueryGestures = _$element.data('ojQueryGestures');

    var _oThreshold = $.jGestures.defaults.thresholdShake;

    // get last position or set initital values
    var _oLastDevicePosition = _oDatajQueryGestures.oDeviceMotionLastDevicePosition || {
      accelerationIncludingGravity : {
        x: 0,
        y: 0,
        z: 0
      },
      shake : {
        eventCount: 0,
        intervalsPassed: 0,
        intervalsFreeze: 0
      },
      shakeleftright : {
        eventCount: 0,
        intervalsPassed: 0,
        intervalsFreeze: 0
      },
      shakefrontback : {
        eventCount: 0,
        intervalsPassed: 0,
        intervalsFreeze: 0
      },
      shakeupdown : {
        eventCount: 0,
        intervalsPassed: 0,
        intervalsFreeze: 0
      }
    };

    // cache current values
    var _oCurrentDevicePosition = {
      accelerationIncludingGravity : {
        x: event_.accelerationIncludingGravity.x,
        y: event_.accelerationIncludingGravity.y,
        z: event_.accelerationIncludingGravity.z
      },
      shake: {
        eventCount: _oLastDevicePosition.shake.eventCount,
        intervalsPassed: _oLastDevicePosition.shake.intervalsPassed,
        intervalsFreeze: _oLastDevicePosition.shake.intervalsFreeze
       },
       shakeleftright: {
        eventCount: _oLastDevicePosition.shakeleftright.eventCount,
        intervalsPassed: _oLastDevicePosition.shakeleftright.intervalsPassed,
        intervalsFreeze: _oLastDevicePosition.shakeleftright.intervalsFreeze
       },
       shakefrontback: {
        eventCount: _oLastDevicePosition.shakefrontback.eventCount,
        intervalsPassed: _oLastDevicePosition.shakefrontback.intervalsPassed,
        intervalsFreeze: _oLastDevicePosition.shakefrontback.intervalsFreeze
       },
       shakeupdown: {
        eventCount: _oLastDevicePosition.shakeupdown.eventCount,
        intervalsPassed: _oLastDevicePosition.shakeupdown.intervalsPassed,
        intervalsFreeze: _oLastDevicePosition.shakeupdown.intervalsFreeze
       }

    };


    // options
    var _aType;
    var _aDescription;
    var _oObj;


    // trigger events for all bound pseudo events on this element
    for (_sType in _oDatajQueryGestures) {
      // get current pseudo event


      // trigger bound events on this element
      switch(_sType) {

        case 'shake':
        case 'shakeleftright':
        case 'shakefrontback':
        case 'shakeupdown':

          // options
          _aType = [];
          _aDescription = [];

          _aType.push(_sType);

          // freeze shake - prevent multiple shake events on one  shaking motion (user won't stop shaking immediately)
          if (++_oCurrentDevicePosition[_sType].intervalsFreeze > _oThreshold.freezeShakes && _oCurrentDevicePosition[_sType].intervalsFreeze < (2*_oThreshold.freezeShakes) ) { break; }

          // set control values
          _oCurrentDevicePosition[_sType].intervalsFreeze  = 0;
          _oCurrentDevicePosition[_sType].intervalsPassed++;

          // check for shaking motions: massive acceleration changes in every direction
          if ( ( _sType === 'shake' ||_sType === 'shakeleftright' ) && ( _oCurrentDevicePosition.accelerationIncludingGravity.x > _oThreshold.leftright.sensitivity  || _oCurrentDevicePosition.accelerationIncludingGravity.x < (-1* _oThreshold.leftright.sensitivity) ) ) {
            _aType.push('leftright');
            _aType.push('x-axis');
          }

          if ( ( _sType === 'shake' ||_sType === 'shakefrontback' ) && (_oCurrentDevicePosition.accelerationIncludingGravity.y > _oThreshold.frontback.sensitivity  || _oCurrentDevicePosition.accelerationIncludingGravity.y < (-1 * _oThreshold.frontback.sensitivity) ) ) {
            _aType.push('frontback');
            _aType.push('y-axis');
          }

          if ( ( _sType === 'shake' ||_sType === 'shakeupdown' ) && ( _oCurrentDevicePosition.accelerationIncludingGravity.z+9.81 > _oThreshold.updown.sensitivity  || _oCurrentDevicePosition.accelerationIncludingGravity.z+9.81 < (-1 * _oThreshold.updown.sensitivity) ) ) {
            _aType.push('updown');
            _aType.push('z-axis');
          }

          // at least one successful shaking event
          if (_aType.length > 1) {
            // minimum number of shaking motions during  the defined "time" (messured by events - device event interval: 0.05s)
            if (++_oCurrentDevicePosition[_sType].eventCount == _oThreshold.requiredShakes && (_oCurrentDevicePosition[_sType].intervalsPassed) < _oThreshold.freezeShakes ) {
              // send event
              _$element.triggerHandler(_sType, _createOptions ({type: _sType, description: _aType.join(':'), event:event_,duration:_oCurrentDevicePosition[_sType].intervalsPassed*5 }) );
              // reset
              _oCurrentDevicePosition[_sType].eventCount = 0;
              _oCurrentDevicePosition[_sType].intervalsPassed = 0;
              // freeze shake
              _oCurrentDevicePosition[_sType].intervalsFreeze = _oThreshold.freezeShakes+1;
            }
            // too slow, reset
            else if (_oCurrentDevicePosition[_sType].eventCount == _oThreshold.requiredShakes && (_oCurrentDevicePosition[_sType].intervalsPassed) > _oThreshold.freezeShakes ) {
              _oCurrentDevicePosition[_sType].eventCount = 0 ;
              _oCurrentDevicePosition[_sType].intervalsPassed = 0;
            }
          }
        break;

      }

      // refresh pseudo events
      _oObj = {};
      _oObj.oDeviceMotionLastDevicePosition = _oCurrentDevicePosition;
      _$element.data('ojQueryGestures',$.extend(true,_oDatajQueryGestures,_oObj));

    }
  }


  /**
  * Handler: touchstart or mousedown
  * Setup pseudo-event by storing initial values such as :
  * screenX : {Number}
  * screenY : {Number}
  * timestamp: {Number}
  *  on the pseudo gesture event and
  *  sets up additional eventlisteners for handling touchmove events.
  * @param {DOM-Event} event_
  * @return {Void}
  */
  function _onTouchstart(event_) {

    // ignore bubbled handlers
    // if ( event_.currentTarget !== event_.target ) { return; }

    var _$element = jQuery(event_.currentTarget);
    // var _$element = jQuery(event_.target);

    // trigger custom notification
    _$element.triggerHandler($.jGestures.events.touchstart,event_);


    // set the necessary touch events
    if($.hasGestures) {
      event_.currentTarget.addEventListener('touchmove', _onTouchmove, false);
      event_.currentTarget.addEventListener('touchend', _onTouchend, false);
    }
    // event substitution
    else {
//      event_.currentTarget.addEventListener('mousemove', _onTouchmove, false);
//      event_.currentTarget.addEventListener('mouseup', _onTouchend, false);
      _$element.bind('mousemove', _onTouchmove);
      _$element.bind('mouseup', _onTouchend);
    }

    // get stored pseudo event
    var _oDatajQueryGestures = _$element.data('ojQueryGestures');

    // var _oEventData = _oDatajQueryGestures[_sType];
    var _eventBase = (event_.touches) ? event_.touches[0] : event_;
    // store current values for calculating relative values (changes between touchmoveevents)
    var _oObj = {};
    _oObj.oLastSwipemove = { screenX : _eventBase.screenX, screenY : _eventBase.screenY, timestamp:new Date().getTime()};
    _oObj.oStartTouch = { screenX : _eventBase.screenX, screenY : _eventBase.screenY, timestamp:new Date().getTime()};

    _$element.data('ojQueryGestures',$.extend(true,_oDatajQueryGestures,_oObj));
  }


  /**
  * Handler: touchmove or mousemove
  * Calculates the x/y changes since the last event,
  * compares it to $.jGestures.defaults.thresholdMove and triggers
  * an swipemove event if the distance exceed the
  * threshold.
  * Custom-event argument object:
  * {Object}
  *     {
  *       type: e.g. 'swipemove',
  *       ≈: {DOM-Event},
  *       // default: just one entry on the delta-array - the first touchpoint
  *       // the first touchpoint is the reference point for every gesture,
  *       // because moving touchpoints in various directions would result in
  *       // a gesture.
  *       // delta and direction details are just provided for touch not for gesture / motion events
  *       delta : [
  *         {
  *           lastX:{Number} , // x-axis: relative to the last touchevent (e.g. touchmove!)
  *           lastY:{Number}, // y-axis: relative to the last touchevent (e.g. touchmove!)
  *           moved: {Number},  // distance: relative to the original touchpoint
  *           startX: {Number} , // relative to the original touchpoint
  *           startY: {Number} ,// relative to the original touchpoint
  *         } ],
  *       // based on the first touchpoint
  *       direction : { // relative to the last touchevent (e.g. touchmove!)
  *         vector: {Number}, // -1|+1, indicates the direction if necessary(pinch/rotate)
  *         orientation: {Number} // window.orientation: -90,0,90,180 || null (window.orienntation)
  *         lastX : {Number}, // -1,0,+1 relative to the last touchevent (e.g. touchmove!)
  *         lastY : {Number}, // -1,0,+1 relative to the last touchevent (e.g. touchmove!)
  *         startX: {Number} , //-1,0,+1 relative to the original touchpoint
  *         startY: {Number} ,// -1,0,+1 relative to the original touchpoint
  *       },
  *       rotation: null, // gestureonly: amount of rotation relative to the current position NOT the original
  *       scale: null, // gestureonly: amount of scaling relative to the current position NOT the original
  *       duration: {Number}, // ms: relative to the original touchpoint
  *       description : {String} // details as String: {TYPE *}:{TOUCHES 1|2|3|4}:{X-AXIS 'right'|'left'|'steady'}:{Y-AXIS 'down'|'up'|'steady'} e.g. "swipe:1:left:steady" relative to the last touchpoint
  *     };
  *
  * @param {DOM-Event} event_
  * @return {Void}
  */
  function _onTouchmove(event_) {

    var _$element = jQuery(event_.currentTarget);
    // var _$element = jQuery(event_.target);

    // get stored pseudo event
    var _oDatajQueryGestures = _$element.data('ojQueryGestures');

    var _bHasTouches = !!event_.touches;
    var _iScreenX = (_bHasTouches) ? event_.changedTouches[0].screenX : event_.screenX;
    var _iScreenY = (_bHasTouches) ? event_.changedTouches[0].screenY : event_.screenY;

    //relative to the last event
    var _oEventData = _oDatajQueryGestures.oLastSwipemove;
    var _iDeltaX = _iScreenX - _oEventData.screenX   ;
    var _iDeltaY = _iScreenY - _oEventData.screenY;

    var _oDetails;

      // there's a swipemove set (not the first occurance), trigger event
    if (!!_oDatajQueryGestures.oLastSwipemove) {
      // check
      _oDetails = _createOptions({type: 'swipemove', touches: (_bHasTouches) ? event_.touches.length: '1', screenY: _iScreenY,screenX:_iScreenX ,deltaY: _iDeltaY,deltaX : _iDeltaX, startMove:_oEventData, event:event_, timestamp:_oEventData.timestamp});
      _$element.triggerHandler(_oDetails.type,_oDetails);
    }
    // store the new values
    var _oObj = {};
    var _eventBase = (event_.touches) ? event_.touches[0] : event_;
    _oObj.oLastSwipemove = { screenX : _eventBase.screenX, screenY : _eventBase.screenY, timestamp:new Date().getTime()};
    _$element.data('ojQueryGestures',$.extend(true,_oDatajQueryGestures,_oObj));
  }


  /**
  * Handler: touchend or mouseup
  * Removes the additional handlers (move/end)
  * Calculates the x/y changes since the touchstart event
  * not in relation to the last move event.
  * Triggers the
  * swipeone|swipetwo|swipethree|swipefour|
  * swipeup|swiperightup|swiperight|swiperightdown|swipedown|
  * swipeleftdown|swipeleft|swipeleftup|
  * tapone|taptwo|tapthree|tapfour
  * event.
  *   {Object}
  *     {
  *       type: eventtype e.g. "swipeone","swipeleftdown",
  *       originalEvent: {DOM-Event},
  *       // default: just one entry on the delta-array - the first touchpoint
  *       // the first touchpoint is the reference point for every gesture,
  *       // because moving touchpoints in various directions would result in
  *       // a gesture.
  *       // delta and direction details are just provided for touch not for gesture / motion events
  *       delta : [
  *         {
  *           lastX:{Number} , // x-axis: relative to the last touchevent (e.g. touchmove!)
  *           lastY:{Number}, // y-axis: relative to the last touchevent (e.g. touchmove!)
  *           moved: {Number},  // distance: relative to the original touchpoint
  *           startX: {Number} , // relative to the original touchpoint
  *           startY: {Number} ,// relative to the original touchpoint
  *         } ],
  *       // based on the first touchpoint
  *       direction : { // relative to the last touchevent (e.g. touchmove!)
  *         vector: {Number}, // -1|+1, indicates the direction if necessary(pinch/rotate)
  *         orientation: {Number} // window.orientation: -90,0,90,180 || null (window.orienntation)
  *         lastX : {Number}, // -1,0,+1 relative to the last touchevent (e.g. touchmove!)
  *         lastY : {Number}, // -1,0,+1 relative to the last touchevent (e.g. touchmove!)
  *         startX: {Number} , //-1,0,+1 relative to the original touchpoint
  *         startY: {Number} ,// -1,0,+1 relative to the original touchpoint
  *       },
  *       rotation: null,
  *       scale: null ,
  *       duration: {Number}, // ms: relative to the original touchpoint
  *       description : {String} // details as String: {TYPE *}:{TOUCHES 1|2|3|4}:{X-AXIS 'right'|'left'|'steady'}:{Y-AXIS 'down'|'up'|'steady'} e.g. "swipe:1:left:steady" relative to the last touchpoint
  *     };
  * @param {DOM-Event} event_
  * @return {Void}
  */
  function _onTouchend(event_) {

    // ignore bubbled handlers
    // if ( event_.currentTarget !== event_.target ) { return; }

    var _$element = jQuery(event_.currentTarget);
    var _bHasTouches = !!event_.changedTouches;
    var _iTouches = (_bHasTouches) ? event_.changedTouches.length : '1';
    var _iScreenX = (_bHasTouches) ? event_.changedTouches[0].screenX : event_.screenX;
    var _iScreenY = (_bHasTouches) ? event_.changedTouches[0].screenY : event_.screenY;

    // trigger custom notification
    _$element.triggerHandler($.jGestures.events.touchendStart,event_);

    // var _$element = jQuery(event_.target);
    // remove events
    if($.hasGestures) {
      event_.currentTarget.removeEventListener('touchmove', _onTouchmove, false);
      event_.currentTarget.removeEventListener('touchend', _onTouchend, false);
    }
    // event substitution
    else {
//      event_.currentTarget.removeEventListener('mousemove', _onTouchmove, false);
//      event_.currentTarget.removeEventListener('mouseup', _onTouchend, false);
      _$element.unbind('mousemove', _onTouchmove);
      _$element.unbind('mouseup', _onTouchend);
    }
    // get all bound pseudo events
    var _oDatajQueryGestures = _$element.data('ojQueryGestures');

    // if the current change on the x/y position is above the defined threshold for moving an element set the moved flag
    // to distinguish between a moving gesture and a shaking finger trying to tap
    var _bHasMoved = (
      Math.abs(_oDatajQueryGestures.oStartTouch.screenX - _iScreenX) > $.jGestures.defaults.thresholdMove ||
      Math.abs(_oDatajQueryGestures.oStartTouch.screenY - _iScreenY) > $.jGestures.defaults.thresholdMove
    ) ? true : false;

    // if the current change on the x/y position is above the defined threshold for swiping set the moved flag
    // to indicate we're dealing with a swipe gesture
    var _bHasSwipeGesture = (
      Math.abs(_oDatajQueryGestures.oStartTouch.screenX - _iScreenX) > $.jGestures.defaults.thresholdSwipe ||
      Math.abs(_oDatajQueryGestures.oStartTouch.screenY - _iScreenY) > $.jGestures.defaults.thresholdSwipe
    ) ? true : false;


    var _sType;
    var _oEventData ;

    var _oDelta;

    // calculate distances in relation to the touchstart position not the last touchmove event!
    var _iDeltaX;
    var _iDeltaY;
    var _oDetails;

    var _aDict = ['zero','one','two','three','four'];

    // swipe marker
    var _bIsSwipe;


    // trigger events for all bound pseudo events on this element
    for (_sType in _oDatajQueryGestures) {

      // get current pseudo event
      _oEventData = _oDatajQueryGestures.oStartTouch;

      _oDelta = {};
      _iScreenX = (_bHasTouches) ? event_.changedTouches[0].screenX : event_.screenX;
      _iScreenY = (_bHasTouches) ? event_.changedTouches[0].screenY : event_.screenY;
      // calculate distances in relation to the touchstart position not the last touchmove event!
      _iDeltaX = _iScreenX - _oEventData.screenX ;
      _iDeltaY = _iScreenY - _oEventData.screenY;
      _oDetails = _createOptions({type: 'swipe', touches: _iTouches, screenY: _iScreenY,screenX:_iScreenX ,deltaY: _iDeltaY,deltaX : _iDeltaX, startMove:_oEventData, event:event_, timestamp:  _oEventData.timestamp });


      // swipe marker
      _bIsSwipe = false;

      // trigger bound events on this element
      switch(_sType) {
        case 'swipeone':

          if( _bHasTouches === false && _iTouches == 1 && _bHasMoved === false){
            // trigger tapone!
            break;
          }
          if (_bHasTouches===false || ( _iTouches == 1  && _bHasMoved === true && _bHasSwipeGesture===true)) {
            _bIsSwipe = true;

            _oDetails.type = ['swipe',_aDict[_iTouches]].join('');
            _$element.triggerHandler(_oDetails.type,_oDetails);
          }
        break;

        case 'swipetwo':
          if (( _bHasTouches && _iTouches== 2 && _bHasMoved === true && _bHasSwipeGesture===true)) {
            _bIsSwipe = true;
            _oDetails.type = ['swipe',_aDict[_iTouches]].join('');
            _$element.triggerHandler(_oDetails.type,_oDetails);
          }
        break;

        case 'swipethree':
          if ( ( _bHasTouches && _iTouches == 3 && _bHasMoved === true && _bHasSwipeGesture===true)) {
            _bIsSwipe = true;
            _oDetails.type = ['swipe',_aDict[_iTouches]].join('');
            _$element.triggerHandler(_oDetails.type,_oDetails);
          }
        break;

        case 'swipefour':
          if ( ( _bHasTouches && _iTouches == 4 && _bHasMoved === true && _bHasSwipeGesture===true)) {
            _bIsSwipe = true;
            _oDetails.type = ['swipe',_aDict[_iTouches]].join('');
            _$element.triggerHandler(_oDetails.type,_oDetails);
          }
        break;

        case 'swipeup':
        case 'swiperightup':
        case 'swiperight':
        case 'swiperightdown':
        case 'swipedown':
        case 'swipeleftdown':
        case 'swipeleft':
        case 'swipeleftup':
          if ( _bHasTouches && _bHasMoved === true && _bHasSwipeGesture===true) {
            _bIsSwipe = true;
            _oDetails.type = [
                  'swipe',
                ((_oDetails.delta[0].lastX != 0) ? ((_oDetails.delta[0].lastX > 0) ? 'right' : 'left') : ''),
                ((_oDetails.delta[0].lastY != 0) ? ((_oDetails.delta[0].lastY > 0) ? 'down' : 'up') :'')
                  ].join('');
            _$element.triggerHandler(_oDetails.type, _oDetails);
          }
        break;

        case 'tapone':
        case 'taptwo':
        case 'tapthree':
        case 'tapfour':
          if (( /* _bHasTouches && */ _bHasMoved !== true && _bIsSwipe !==true) && (_aDict[_iTouches] ==_sType.slice(3)) ) {
            _oDetails.description = ['tap',_aDict[_iTouches]].join('');
            _oDetails.type = ['tap',_aDict[_iTouches]].join('');
            _$element.triggerHandler(_oDetails.type,_oDetails);
            }
          break;

      }

      // refresh pseudo events
      var _oObj = {};
//      _oObj[_sType] = false;
//      _oObj.hasTouchmoved = false;
      _$element.data('ojQueryGestures',$.extend(true,_oDatajQueryGestures,_oObj));
      _$element.data('ojQueryGestures',$.extend(true,_oDatajQueryGestures,_oObj));

    }
    _$element.triggerHandler($.jGestures.events.touchendProcessed,event_);
  }


  /**
  * Handler: gesturestart
  * Setup pseudo-event by storing initial values such as :
  * timestamp: {Number}
  *  on the pseudo gesture event
  * Since the gesture-event doesn't supply event.touches no tuchpoints will be calculated
  * @param {DOM-Event} event_
  * @return {Void}
  */
  function _onGesturestart(event_) {

    // ignore bubbled handlers
    // if ( event_.currentTarget !== event_.target ) { return; }

    var _$element = jQuery(event_.currentTarget);
    // var _$element = jQuery(event_.target);

    // trigger custom notification
    _$element.triggerHandler($.jGestures.events.gesturestart,event_);


    // get stored pseudo event
    var _oDatajQueryGestures = _$element.data('ojQueryGestures');

    // var _oEventData = _oDatajQueryGestures[_sType];
    // store current values for calculating relative values (changes between touchmoveevents)
    var _oObj = {};
    _oObj.oStartTouch = {timestamp:new Date().getTime()};
    _$element.data('ojQueryGestures',$.extend(true,_oDatajQueryGestures,_oObj));
  }

  /**
  * Handler: gesturechange
  * Read the event_.scale / event_.rotate values,
  * an triggers a pinch|rotate event if necessary.
  * Since the gesture-event doesn't supply event.touches no tuchpoints will be calculated
  * @returns {Object}
  *     {
  *       type: eventtype e.g. "pinch","rotate",
  *       originalEvent: {DOM-Event},
  *       // delta and direction details are just provided for touch not for gesture / motion events
  *       delta : null,
  *       direction : {
  *         vector: {Number}, // -1|+1, indicates the direction if necessary(pinch/rotate)
  *          orientation: {Number} // window.orientation: -90,0,90,180 || null (window.orienntation)
  *        },
  *       rotation: {Number} , //  amount of rotation relative to the current position NOT the original
  *       scale: {Number} , // amount of scaling relative to the current position NOT the original
  *       duration: {Number}, // ms: relative to the original touchpoint
  *       description : {String} // details as String: pinch:{'close'|'open'} e.g. "pinch:-1:close" ||  rotate:{'counterclockwise'|'clockwise'} e.g. "rotate:-1:counterclockwise"
  *     };
  * @param {DOM-Event} event_
  * @return {Void}
  */
  function _onGesturechange(event_) {

    // ignore bubbled handlers
    // if ( event_.currentTarget !== event_.target ) { return; }

    var _$element = jQuery(event_.currentTarget);
    // var _$element = jQuery(event_.target);
    var _iDelta,_iDirection,_sDesc,_oDetails;
    // get all pseudo events
    var _oDatajQueryGestures = _$element.data('ojQueryGestures');

    // trigger events for all bound pseudo events on this element
    var _sType;
    for (_sType in _oDatajQueryGestures) {

      // trigger a specific bound event
      switch(_sType) {

        case 'pinch':
          _iDelta = event_.scale;
          if ( ( ( _iDelta < 1 ) && (_iDelta % 1) < (1 - $.jGestures.defaults.thresholdPinchclose) ) || ( ( _iDelta > 1 ) && (_iDelta % 1) > ($.jGestures.defaults.thresholdPinchopen) ) ) {
            _iDirection = (_iDelta < 1 ) ? -1 : +1 ;
            _oDetails = _createOptions({type: 'pinch', scale: _iDelta, touches: null,startMove:_oDatajQueryGestures.oStartTouch, event:event_, timestamp: _oDatajQueryGestures.oStartTouch.timestamp, vector:_iDirection, description: ['pinch:',_iDirection,':' , ( (_iDelta < 1 ) ? 'close' : 'open' )].join('') });
            _$element.triggerHandler(_oDetails.type, _oDetails);
          }
        break;

        case 'rotate':
          _iDelta = event_.rotation;
          if ( ( ( _iDelta < 1 ) &&  ( -1*(_iDelta) > $.jGestures.defaults.thresholdRotateccw ) ) || ( ( _iDelta > 1 ) && (_iDelta  > $.jGestures.defaults.thresholdRotatecw) ) ) {
            _iDirection = (_iDelta < 1 ) ? -1 : +1 ;
            _oDetails = _createOptions({type: 'rotate', rotation: _iDelta, touches: null, startMove:_oDatajQueryGestures.oStartTouch, event:event_, timestamp: _oDatajQueryGestures.oStartTouch.timestamp, vector:_iDirection, description: ['rotate:',_iDirection,':' , ( (_iDelta < 1 ) ? 'counterclockwise' : 'clockwise' )].join('') });
            _$element.triggerHandler(_oDetails.type, _oDetails);
          }
        break;

      }
    }

  }


  /**
  * Handler: gestureend
  * Read the event_.scale / event_.rotate values,
  * compares it to $.jGestures.defaults.threshold* and triggers
  * a pinchclose|pinchclose|rotatecw|rotateccw event if the distance exceed the
  * Since the gesture-event doesn't supply event.touches no tuchpoints will be calculated
  * * Custom-event argument object:
  * @returns {Object}
  *     {
  *       type: eventtype e.g. "pinchclose","pinchopen", "rotatecw", "rotateccw",
  *       originalEvent: {DOM-Event},
  *       // delta and direction details are just provided for touch not for gesture / motion events
  *       delta : null,
  *       // based on the first touchpoint
  *       direction : {
  *         vector: {Number}, // -1|+1, indicates the direction if necessary(pinch/rotate)
  *         orientation: {Number} // window.orientation: -90,0,90,180 || null (window.orienntation)
  *       },
  *       rotation: {Number} , //  amount of rotation relative to the current position NOT the original
  *       scale: {Number} , // amount of scaling relative to the current position NOT the original
  *       duration: {Number}, // ms: relative to the original touchpoint
  *       description : {String} // details as String: pinch:{'close'|'open'} e.g. "pinch:-1:close" ||  rotate:{'counterclockwise'|'clockwise'} e.g. "rotate:-1:counterclockwise"
  *     };
  * @param {DOM-Event} event_
  * @return {Void}
  */
  function _onGestureend(event_) {
    // ignore bubbled handlers
    // if ( event_.currentTarget !== event_.target ) { return; }

    var _$element = jQuery(event_.currentTarget);
    // var _$element = jQuery(event_.target);

    // trigger custom notification
    _$element.triggerHandler($.jGestures.events.gestureendStart,event_);

    var _iDelta;
    var _oDatajQueryGestures = _$element.data('ojQueryGestures');

    // trigger handler for every bound event
    var _sType;
    for (_sType in _oDatajQueryGestures) {

      switch(_sType) {

        case 'pinchclose':
          _iDelta = event_.scale;
          if (( _iDelta < 1 ) && (_iDelta % 1) < (1 - $.jGestures.defaults.thresholdPinchclose)) {
            _$element.triggerHandler('pinchclose', _createOptions ({type: 'pinchclose', scale:_iDelta, vector: -1, touches: null, startMove: _oDatajQueryGestures.oStartTouch, event:event_, timestamp:_oDatajQueryGestures.oStartTouch.timestamp,description: 'pinch:-1:close' }) );
          }
        break;

        case 'pinchopen':
          _iDelta = event_.scale;
          if ( ( _iDelta > 1 ) && (_iDelta % 1) > ($.jGestures.defaults.thresholdPinchopen) ) {
            _$element.triggerHandler('pinchopen', _createOptions ({type: 'pinchopen', scale:_iDelta, vector: +1, touches: null, startMove: _oDatajQueryGestures.oStartTouch, event:event_, timestamp:_oDatajQueryGestures.oStartTouch.timestamp,description: 'pinch:+1:open'}) );
          }
        break;

        case 'rotatecw':
          _iDelta = event_.rotation;
          if ( ( _iDelta > 1 ) && (_iDelta  > $.jGestures.defaults.thresholdRotatecw) ) {
            _$element.triggerHandler('rotatecw', _createOptions ({type: 'rotatecw', rotation:_iDelta, vector: +1, touches: null, startMove: _oDatajQueryGestures.oStartTouch, event:event_, timestamp:_oDatajQueryGestures.oStartTouch.timestamp,description: 'rotate:+1:clockwise'}) );
          }
        break;

        case 'rotateccw':
          _iDelta = event_.rotation;
          if ( ( _iDelta < 1 ) &&  ( -1*(_iDelta) > $.jGestures.defaults.thresholdRotateccw ) ) {
              _$element.triggerHandler('rotateccw', _createOptions ({type: 'rotateccw', rotation:_iDelta, vector: -1, touches: null, startMove: _oDatajQueryGestures.oStartTouch, event:event_, timestamp:_oDatajQueryGestures.oStartTouch.timestamp,description: 'rotate:-1:counterclockwise'}) );
            }
        break;

        }
      }
      _$element.triggerHandler($.jGestures.events.gestureendProcessed,event_);
    }
  }
)(jQuery);
/*!
 * skrollr core
 *
 * Alexander Prinzhorn - https://github.com/Prinzhorn/skrollr
 *
 * Free to use under terms of MIT license
 */

(function(window, document, undefined) {
  'use strict';

  /*
   * Global api.
   */
  var skrollr = {
    get: function() {
      return _instance;
    },
    //Main entry point.
    init: function(options) {
      return _instance || new Skrollr(options);
    },
    VERSION: '0.6.25'
  };

  //Minify optimization.
  var hasProp = Object.prototype.hasOwnProperty;
  var Math = window.Math;
  var getStyle = window.getComputedStyle;

  //They will be filled when skrollr gets initialized.
  var documentElement;
  var body;

  var EVENT_TOUCHSTART = 'touchstart';
  var EVENT_TOUCHMOVE = 'touchmove';
  var EVENT_TOUCHCANCEL = 'touchcancel';
  var EVENT_TOUCHEND = 'touchend';

  var SKROLLABLE_CLASS = 'skrollable';
  var SKROLLABLE_BEFORE_CLASS = SKROLLABLE_CLASS + '-before';
  var SKROLLABLE_BETWEEN_CLASS = SKROLLABLE_CLASS + '-between';
  var SKROLLABLE_AFTER_CLASS = SKROLLABLE_CLASS + '-after';

  var SKROLLR_CLASS = 'skrollr';
  var NO_SKROLLR_CLASS = 'no-' + SKROLLR_CLASS;
  var SKROLLR_DESKTOP_CLASS = SKROLLR_CLASS + '-desktop';
  var SKROLLR_MOBILE_CLASS = SKROLLR_CLASS + '-mobile';

  var DEFAULT_EASING = 'linear';
  var DEFAULT_DURATION = 1000;//ms
  var DEFAULT_MOBILE_DECELERATION = 0.004;//pixel/ms²

  var DEFAULT_SMOOTH_SCROLLING_DURATION = 200;//ms

  var ANCHOR_START = 'start';
  var ANCHOR_END = 'end';
  var ANCHOR_CENTER = 'center';
  var ANCHOR_BOTTOM = 'bottom';

  //The property which will be added to the DOM element to hold the ID of the skrollable.
  var SKROLLABLE_ID_DOM_PROPERTY = '___skrollable_id';

  var rxTouchIgnoreTags = /^(?:input|textarea|button|select)$/i;

  var rxTrim = /^\s+|\s+$/g;

  //Find all data-attributes. data-[_constant]-[offset]-[anchor]-[anchor].
  var rxKeyframeAttribute = /^data(?:-(_\w+))?(?:-?(-?\d*\.?\d+p?))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/;

  var rxPropValue = /\s*(@?[\w\-\[\]]+)\s*:\s*(.+?)\s*(?:;|$)/gi;

  //Easing function names follow the property in square brackets.
  var rxPropEasing = /^([a-z\-]+)\[(\w+)\]$/;

  var rxCamelCase = /-([a-z0-9_])/g;
  var rxCamelCaseFn = function(str, letter) {
    return letter.toUpperCase();
  };

  //Numeric values with optional sign.
  var rxNumericValue = /[\-+]?[\d]*\.?[\d]+/g;

  //Used to replace occurences of {?} with a number.
  var rxInterpolateString = /\{\?\}/g;

  //Finds rgb(a) colors, which don't use the percentage notation.
  var rxRGBAIntegerColor = /rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+/g;

  //Finds all gradients.
  var rxGradient = /[a-z\-]+-gradient/g;

  //Vendor prefix. Will be set once skrollr gets initialized.
  var theCSSPrefix = '';
  var theDashedCSSPrefix = '';

  //Will be called once (when skrollr gets initialized).
  var detectCSSPrefix = function() {
    //Only relevant prefixes. May be extended.
    //Could be dangerous if there will ever be a CSS property which actually starts with "ms". Don't hope so.
    var rxPrefixes = /^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;

    //Detect prefix for current browser by finding the first property using a prefix.
    if(!getStyle) {
      return;
    }

    var style = getStyle(body, null);

    for(var k in style) {
      //We check the key and if the key is a number, we check the value as well, because safari's getComputedStyle returns some weird array-like thingy.
      theCSSPrefix = (k.match(rxPrefixes) || (+k == k && style[k].match(rxPrefixes)));

      if(theCSSPrefix) {
        break;
      }
    }

    //Did we even detect a prefix?
    if(!theCSSPrefix) {
      theCSSPrefix = theDashedCSSPrefix = '';

      return;
    }

    theCSSPrefix = theCSSPrefix[0];

    //We could have detected either a dashed prefix or this camelCaseish-inconsistent stuff.
    if(theCSSPrefix.slice(0,1) === '-') {
      theDashedCSSPrefix = theCSSPrefix;

      //There's no logic behind these. Need a look up.
      theCSSPrefix = ({
        '-webkit-': 'webkit',
        '-moz-': 'Moz',
        '-ms-': 'ms',
        '-o-': 'O'
      })[theCSSPrefix];
    } else {
      theDashedCSSPrefix = '-' + theCSSPrefix.toLowerCase() + '-';
    }
  };

  var polyfillRAF = function() {
    var requestAnimFrame = window.requestAnimationFrame || window[theCSSPrefix.toLowerCase() + 'RequestAnimationFrame'];

    var lastTime = _now();

    if(_isMobile || !requestAnimFrame) {
      requestAnimFrame = function(callback) {
        //How long did it take to render?
        var deltaTime = _now() - lastTime;
        var delay = Math.max(0, 1000 / 60 - deltaTime);

        return window.setTimeout(function() {
          lastTime = _now();
          callback();
        }, delay);
      };
    }

    return requestAnimFrame;
  };

  var polyfillCAF = function() {
    var cancelAnimFrame = window.cancelAnimationFrame || window[theCSSPrefix.toLowerCase() + 'CancelAnimationFrame'];

    if(_isMobile || !cancelAnimFrame) {
      cancelAnimFrame = function(timeout) {
        return window.clearTimeout(timeout);
      };
    }

    return cancelAnimFrame;
  };

  //Built-in easing functions.
  var easings = {
    begin: function() {
      return 0;
    },
    end: function() {
      return 1;
    },
    linear: function(p) {
      return p;
    },
    quadratic: function(p) {
      return p * p;
    },
    cubic: function(p) {
      return p * p * p;
    },
    swing: function(p) {
      return (-Math.cos(p * Math.PI) / 2) + 0.5;
    },
    sqrt: function(p) {
      return Math.sqrt(p);
    },
    outCubic: function(p) {
      return (Math.pow((p - 1), 3) + 1);
    },
    //see https://www.desmos.com/calculator/tbr20s8vd2 for how I did this
    bounce: function(p) {
      var a;

      if(p <= 0.5083) {
        a = 3;
      } else if(p <= 0.8489) {
        a = 9;
      } else if(p <= 0.96208) {
        a = 27;
      } else if(p <= 0.99981) {
        a = 91;
      } else {
        return 1;
      }

      return 1 - Math.abs(3 * Math.cos(p * a * 1.028) / a);
    }
  };

  /**
   * Constructor.
   */
  function Skrollr(options) {
    documentElement = document.documentElement;
    body = document.body;

    detectCSSPrefix();

    _instance = this;

    options = options || {};

    _constants = options.constants || {};

    //We allow defining custom easings or overwrite existing.
    if(options.easing) {
      for(var e in options.easing) {
        easings[e] = options.easing[e];
      }
    }

    _edgeStrategy = options.edgeStrategy || 'set';

    _listeners = {
      //Function to be called right before rendering.
      beforerender: options.beforerender,

      //Function to be called right after finishing rendering.
      render: options.render,

      //Function to be called whenever an element with the `data-emit-events` attribute passes a keyframe.
      keyframe: options.keyframe
    };

    //forceHeight is true by default
    _forceHeight = options.forceHeight !== false;

    if(_forceHeight) {
      _scale = options.scale || 1;
    }

    _mobileDeceleration = options.mobileDeceleration || DEFAULT_MOBILE_DECELERATION;

    _smoothScrollingEnabled = options.smoothScrolling !== false;
    _smoothScrollingDuration = options.smoothScrollingDuration || DEFAULT_SMOOTH_SCROLLING_DURATION;

    //Dummy object. Will be overwritten in the _render method when smooth scrolling is calculated.
    _smoothScrolling = {
      targetTop: _instance.getScrollTop()
    };

    //A custom check function may be passed.
    _isMobile = ((options.mobileCheck || function() {
      return (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera);
    })());

    if(_isMobile) {
      _skrollrBody = document.getElementById('skrollr-body');

      //Detect 3d transform if there's a skrollr-body (only needed for #skrollr-body).
      if(_skrollrBody) {
        _detect3DTransforms();
      }

      _initMobile();
      _updateClass(documentElement, [SKROLLR_CLASS, SKROLLR_MOBILE_CLASS], [NO_SKROLLR_CLASS]);
    } else {
      _updateClass(documentElement, [SKROLLR_CLASS, SKROLLR_DESKTOP_CLASS], [NO_SKROLLR_CLASS]);
    }

    //Triggers parsing of elements and a first reflow.
    _instance.refresh();

    _addEvent(window, 'resize orientationchange', function() {
      var width = documentElement.clientWidth;
      var height = documentElement.clientHeight;

      //Only reflow if the size actually changed (#271).
      if(height !== _lastViewportHeight || width !== _lastViewportWidth) {
        _lastViewportHeight = height;
        _lastViewportWidth = width;

        _requestReflow = true;
      }
    });

    var requestAnimFrame = polyfillRAF();

    //Let's go.
    (function animloop(){
      _render();
      _animFrame = requestAnimFrame(animloop);
    }());

    return _instance;
  }

  /**
   * (Re)parses some or all elements.
   */
  Skrollr.prototype.refresh = function(elements) {
    var elementIndex;
    var elementsLength;
    var ignoreID = false;

    //Completely reparse anything without argument.
    if(elements === undefined) {
      //Ignore that some elements may already have a skrollable ID.
      ignoreID = true;

      _skrollables = [];
      _skrollableIdCounter = 0;

      elements = document.getElementsByTagName('*');
    } else if(elements.length === undefined) {
      //We also accept a single element as parameter.
      elements = [elements];
    }

    elementIndex = 0;
    elementsLength = elements.length;

    for(; elementIndex < elementsLength; elementIndex++) {
      var el = elements[elementIndex];
      var anchorTarget = el;
      var keyFrames = [];

      //If this particular element should be smooth scrolled.
      var smoothScrollThis = _smoothScrollingEnabled;

      //The edge strategy for this particular element.
      var edgeStrategy = _edgeStrategy;

      //If this particular element should emit keyframe events.
      var emitEvents = false;

      //If we're reseting the counter, remove any old element ids that may be hanging around.
      if(ignoreID && SKROLLABLE_ID_DOM_PROPERTY in el) {
        delete el[SKROLLABLE_ID_DOM_PROPERTY];
      }

      if(!el.attributes) {
        continue;
      }

      //Iterate over all attributes and search for key frame attributes.
      var attributeIndex = 0;
      var attributesLength = el.attributes.length;

      for (; attributeIndex < attributesLength; attributeIndex++) {
        var attr = el.attributes[attributeIndex];

        if(attr.name === 'data-anchor-target') {
          anchorTarget = document.querySelector(attr.value);

          if(anchorTarget === null) {
            throw 'Unable to find anchor target "' + attr.value + '"';
          }

          continue;
        }

        //Global smooth scrolling can be overridden by the element attribute.
        if(attr.name === 'data-smooth-scrolling') {
          smoothScrollThis = attr.value !== 'off';

          continue;
        }

        //Global edge strategy can be overridden by the element attribute.
        if(attr.name === 'data-edge-strategy') {
          edgeStrategy = attr.value;

          continue;
        }

        //Is this element tagged with the `data-emit-events` attribute?
        if(attr.name === 'data-emit-events') {
          emitEvents = true;

          continue;
        }

        var match = attr.name.match(rxKeyframeAttribute);

        if(match === null) {
          continue;
        }

        var kf = {
          props: attr.value,
          //Point back to the element as well.
          element: el,
          //The name of the event which this keyframe will fire, if emitEvents is
          eventType: attr.name.replace(rxCamelCase, rxCamelCaseFn)
        };

        keyFrames.push(kf);

        var constant = match[1];

        if(constant) {
          //Strip the underscore prefix.
          kf.constant = constant.substr(1);
        }

        //Get the key frame offset.
        var offset = match[2];

        //Is it a percentage offset?
        if(/p$/.test(offset)) {
          kf.isPercentage = true;
          kf.offset = (offset.slice(0, -1) | 0) / 100;
        } else {
          kf.offset = (offset | 0);
        }

        var anchor1 = match[3];

        //If second anchor is not set, the first will be taken for both.
        var anchor2 = match[4] || anchor1;

        //"absolute" (or "classic") mode, where numbers mean absolute scroll offset.
        if(!anchor1 || anchor1 === ANCHOR_START || anchor1 === ANCHOR_END) {
          kf.mode = 'absolute';

          //data-end needs to be calculated after all key frames are known.
          if(anchor1 === ANCHOR_END) {
            kf.isEnd = true;
          } else if(!kf.isPercentage) {
            //For data-start we can already set the key frame w/o calculations.
            //#59: "scale" options should only affect absolute mode.
            kf.offset = kf.offset * _scale;
          }
        }
        //"relative" mode, where numbers are relative to anchors.
        else {
          kf.mode = 'relative';
          kf.anchors = [anchor1, anchor2];
        }
      }

      //Does this element have key frames?
      if(!keyFrames.length) {
        continue;
      }

      //Will hold the original style and class attributes before we controlled the element (see #80).
      var styleAttr, classAttr;

      var id;

      if(!ignoreID && SKROLLABLE_ID_DOM_PROPERTY in el) {
        //We already have this element under control. Grab the corresponding skrollable id.
        id = el[SKROLLABLE_ID_DOM_PROPERTY];
        styleAttr = _skrollables[id].styleAttr;
        classAttr = _skrollables[id].classAttr;
      } else {
        //It's an unknown element. Asign it a new skrollable id.
        id = (el[SKROLLABLE_ID_DOM_PROPERTY] = _skrollableIdCounter++);
        styleAttr = el.style.cssText;
        classAttr = _getClass(el);
      }

      _skrollables[id] = {
        element: el,
        styleAttr: styleAttr,
        classAttr: classAttr,
        anchorTarget: anchorTarget,
        keyFrames: keyFrames,
        smoothScrolling: smoothScrollThis,
        edgeStrategy: edgeStrategy,
        emitEvents: emitEvents,
        lastFrameIndex: -1
      };

      _updateClass(el, [SKROLLABLE_CLASS], []);
    }

    //Reflow for the first time.
    _reflow();

    //Now that we got all key frame numbers right, actually parse the properties.
    elementIndex = 0;
    elementsLength = elements.length;

    for(; elementIndex < elementsLength; elementIndex++) {
      var sk = _skrollables[elements[elementIndex][SKROLLABLE_ID_DOM_PROPERTY]];

      if(sk === undefined) {
        continue;
      }

      //Parse the property string to objects
      _parseProps(sk);

      //Fill key frames with missing properties from left and right
      _fillProps(sk);
    }

    return _instance;
  };

  /**
   * Transform "relative" mode to "absolute" mode.
   * That is, calculate anchor position and offset of element.
   */
  Skrollr.prototype.relativeToAbsolute = function(element, viewportAnchor, elementAnchor) {
    var viewportHeight = documentElement.clientHeight;
    var box = element.getBoundingClientRect();
    var absolute = box.top;

    //#100: IE doesn't supply "height" with getBoundingClientRect.
    var boxHeight = box.bottom - box.top;

    if(viewportAnchor === ANCHOR_BOTTOM) {
      absolute -= viewportHeight;
    } else if(viewportAnchor === ANCHOR_CENTER) {
      absolute -= viewportHeight / 2;
    }

    if(elementAnchor === ANCHOR_BOTTOM) {
      absolute += boxHeight;
    } else if(elementAnchor === ANCHOR_CENTER) {
      absolute += boxHeight / 2;
    }

    //Compensate scrolling since getBoundingClientRect is relative to viewport.
    absolute += _instance.getScrollTop();

    return (absolute + 0.5) | 0;
  };

  /**
   * Animates scroll top to new position.
   */
  Skrollr.prototype.animateTo = function(top, options) {
    options = options || {};

    var now = _now();
    var scrollTop = _instance.getScrollTop();

    //Setting this to a new value will automatically cause the current animation to stop, if any.
    _scrollAnimation = {
      startTop: scrollTop,
      topDiff: top - scrollTop,
      targetTop: top,
      duration: options.duration || DEFAULT_DURATION,
      startTime: now,
      endTime: now + (options.duration || DEFAULT_DURATION),
      easing: easings[options.easing || DEFAULT_EASING],
      done: options.done
    };

    //Don't queue the animation if there's nothing to animate.
    if(!_scrollAnimation.topDiff) {
      if(_scrollAnimation.done) {
        _scrollAnimation.done.call(_instance, false);
      }

      _scrollAnimation = undefined;
    }

    return _instance;
  };

  /**
   * Stops animateTo animation.
   */
  Skrollr.prototype.stopAnimateTo = function() {
    if(_scrollAnimation && _scrollAnimation.done) {
      _scrollAnimation.done.call(_instance, true);
    }

    _scrollAnimation = undefined;
  };

  /**
   * Returns if an animation caused by animateTo is currently running.
   */
  Skrollr.prototype.isAnimatingTo = function() {
    return !!_scrollAnimation;
  };

  Skrollr.prototype.isMobile = function() {
    return _isMobile;
  };

  Skrollr.prototype.setScrollTop = function(top, force) {
    _forceRender = (force === true);

    if(_isMobile) {
      _mobileOffset = Math.min(Math.max(top, 0), _maxKeyFrame);
    } else {
      window.scrollTo(0, top);
    }

    return _instance;
  };

  Skrollr.prototype.getScrollTop = function() {
    if(_isMobile) {
      return _mobileOffset;
    } else {
      return window.pageYOffset || documentElement.scrollTop || body.scrollTop || 0;
    }
  };

  Skrollr.prototype.getMaxScrollTop = function() {
    return _maxKeyFrame;
  };

  Skrollr.prototype.on = function(name, fn) {
    _listeners[name] = fn;

    return _instance;
  };

  Skrollr.prototype.off = function(name) {
    delete _listeners[name];

    return _instance;
  };

  Skrollr.prototype.destroy = function() {
    var cancelAnimFrame = polyfillCAF();
    cancelAnimFrame(_animFrame);
    _removeAllEvents();

    _updateClass(documentElement, [NO_SKROLLR_CLASS], [SKROLLR_CLASS, SKROLLR_DESKTOP_CLASS, SKROLLR_MOBILE_CLASS]);

    var skrollableIndex = 0;
    var skrollablesLength = _skrollables.length;

    for(; skrollableIndex < skrollablesLength; skrollableIndex++) {
      _reset(_skrollables[skrollableIndex].element);
    }

    documentElement.style.overflow = body.style.overflow = '';
    documentElement.style.height = body.style.height = '';

    if(_skrollrBody) {
      skrollr.setStyle(_skrollrBody, 'transform', 'none');
    }

    _instance = undefined;
    _skrollrBody = undefined;
    _listeners = undefined;
    _forceHeight = undefined;
    _maxKeyFrame = 0;
    _scale = 1;
    _constants = undefined;
    _mobileDeceleration = undefined;
    _direction = 'down';
    _lastTop = -1;
    _lastViewportWidth = 0;
    _lastViewportHeight = 0;
    _requestReflow = false;
    _scrollAnimation = undefined;
    _smoothScrollingEnabled = undefined;
    _smoothScrollingDuration = undefined;
    _smoothScrolling = undefined;
    _forceRender = undefined;
    _skrollableIdCounter = 0;
    _edgeStrategy = undefined;
    _isMobile = false;
    _mobileOffset = 0;
    _translateZ = undefined;
  };

  /*
    Private methods.
  */

  var _initMobile = function() {
    var initialElement;
    var initialTouchY;
    var initialTouchX;
    var currentElement;
    var currentTouchY;
    var currentTouchX;
    var lastTouchY;
    var deltaY;

    var initialTouchTime;
    var currentTouchTime;
    var lastTouchTime;
    var deltaTime;

    _addEvent(documentElement, [EVENT_TOUCHSTART, EVENT_TOUCHMOVE, EVENT_TOUCHCANCEL, EVENT_TOUCHEND].join(' '), function(e) {
      var touch = e.changedTouches[0];

      currentElement = e.target;

      //We don't want text nodes.
      while(currentElement.nodeType === 3) {
        currentElement = currentElement.parentNode;
      }

      currentTouchY = touch.clientY;
      currentTouchX = touch.clientX;
      currentTouchTime = e.timeStamp;

      if(!rxTouchIgnoreTags.test(currentElement.tagName)) {
        e.preventDefault();
      }

      switch(e.type) {
        case EVENT_TOUCHSTART:
          //The last element we tapped on.
          if(initialElement) {
            initialElement.blur();
          }

          _instance.stopAnimateTo();

          initialElement = currentElement;

          initialTouchY = lastTouchY = currentTouchY;
          initialTouchX = currentTouchX;
          initialTouchTime = currentTouchTime;

          break;
        case EVENT_TOUCHMOVE:
          //Prevent default event on touchIgnore elements in case they don't have focus yet.
          if(rxTouchIgnoreTags.test(currentElement.tagName) && document.activeElement !== currentElement) {
            e.preventDefault();
          }

          deltaY = currentTouchY - lastTouchY;
          deltaTime = currentTouchTime - lastTouchTime;

          _instance.setScrollTop(_mobileOffset - deltaY, true);

          lastTouchY = currentTouchY;
          lastTouchTime = currentTouchTime;
          break;
        default:
        case EVENT_TOUCHCANCEL:
        case EVENT_TOUCHEND:
          var distanceY = initialTouchY - currentTouchY;
          var distanceX = initialTouchX - currentTouchX;
          var distance2 = distanceX * distanceX + distanceY * distanceY;

          //Check if it was more like a tap (moved less than 7px).
          if(distance2 < 49) {
            if(!rxTouchIgnoreTags.test(initialElement.tagName)) {
              initialElement.focus();

              //It was a tap, click the element.
              var clickEvent = document.createEvent('MouseEvents');
              clickEvent.initMouseEvent('click', true, true, e.view, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);
              initialElement.dispatchEvent(clickEvent);
            }

            return;
          }

          initialElement = undefined;

          var speed = deltaY / deltaTime;

          //Cap speed at 3 pixel/ms.
          speed = Math.max(Math.min(speed, 3), -3);

          var duration = Math.abs(speed / _mobileDeceleration);
          var targetOffset = speed * duration + 0.5 * _mobileDeceleration * duration * duration;
          var targetTop = _instance.getScrollTop() - targetOffset;

          //Relative duration change for when scrolling above bounds.
          var targetRatio = 0;

          //Change duration proportionally when scrolling would leave bounds.
          if(targetTop > _maxKeyFrame) {
            targetRatio = (_maxKeyFrame - targetTop) / targetOffset;

            targetTop = _maxKeyFrame;
          } else if(targetTop < 0) {
            targetRatio = -targetTop / targetOffset;

            targetTop = 0;
          }

          duration = duration * (1 - targetRatio);

          _instance.animateTo((targetTop + 0.5) | 0, {easing: 'outCubic', duration: duration});
          break;
      }
    });

    //Just in case there has already been some native scrolling, reset it.
    window.scrollTo(0, 0);
    documentElement.style.overflow = body.style.overflow = 'hidden';
  };

  /**
   * Updates key frames which depend on others / need to be updated on resize.
   * That is "end" in "absolute" mode and all key frames in "relative" mode.
   * Also handles constants, because they may change on resize.
   */
  var _updateDependentKeyFrames = function() {
    var viewportHeight = documentElement.clientHeight;
    var processedConstants = _processConstants();
    var skrollable;
    var element;
    var anchorTarget;
    var keyFrames;
    var keyFrameIndex;
    var keyFramesLength;
    var kf;
    var skrollableIndex;
    var skrollablesLength;
    var offset;
    var constantValue;

    //First process all relative-mode elements and find the max key frame.
    skrollableIndex = 0;
    skrollablesLength = _skrollables.length;

    for(; skrollableIndex < skrollablesLength; skrollableIndex++) {
      skrollable = _skrollables[skrollableIndex];
      element = skrollable.element;
      anchorTarget = skrollable.anchorTarget;
      keyFrames = skrollable.keyFrames;

      keyFrameIndex = 0;
      keyFramesLength = keyFrames.length;

      for(; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
        kf = keyFrames[keyFrameIndex];

        offset = kf.offset;
        constantValue = processedConstants[kf.constant] || 0;

        kf.frame = offset;

        if(kf.isPercentage) {
          //Convert the offset to percentage of the viewport height.
          offset = offset * viewportHeight;

          //Absolute + percentage mode.
          kf.frame = offset;
        }

        if(kf.mode === 'relative') {
          _reset(element);

          kf.frame = _instance.relativeToAbsolute(anchorTarget, kf.anchors[0], kf.anchors[1]) - offset;

          _reset(element, true);
        }

        kf.frame += constantValue;

        //Only search for max key frame when forceHeight is enabled.
        if(_forceHeight) {
          //Find the max key frame, but don't use one of the data-end ones for comparison.
          if(!kf.isEnd && kf.frame > _maxKeyFrame) {
            _maxKeyFrame = kf.frame;
          }
        }
      }
    }

    //#133: The document can be larger than the maxKeyFrame we found.
    _maxKeyFrame = Math.max(_maxKeyFrame, _getDocumentHeight());

    //Now process all data-end keyframes.
    skrollableIndex = 0;
    skrollablesLength = _skrollables.length;

    for(; skrollableIndex < skrollablesLength; skrollableIndex++) {
      skrollable = _skrollables[skrollableIndex];
      keyFrames = skrollable.keyFrames;

      keyFrameIndex = 0;
      keyFramesLength = keyFrames.length;

      for(; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
        kf = keyFrames[keyFrameIndex];

        constantValue = processedConstants[kf.constant] || 0;

        if(kf.isEnd) {
          kf.frame = _maxKeyFrame - kf.offset + constantValue;
        }
      }

      skrollable.keyFrames.sort(_keyFrameComparator);
    }
  };

  /**
   * Calculates and sets the style properties for the element at the given frame.
   * @param fakeFrame The frame to render at when smooth scrolling is enabled.
   * @param actualFrame The actual frame we are at.
   */
  var _calcSteps = function(fakeFrame, actualFrame) {
    //Iterate over all skrollables.
    var skrollableIndex = 0;
    var skrollablesLength = _skrollables.length;

    for(; skrollableIndex < skrollablesLength; skrollableIndex++) {
      var skrollable = _skrollables[skrollableIndex];
      var element = skrollable.element;
      var frame = skrollable.smoothScrolling ? fakeFrame : actualFrame;
      var frames = skrollable.keyFrames;
      var framesLength = frames.length;
      var firstFrame = frames[0];
      var lastFrame = frames[frames.length - 1];
      var beforeFirst = frame < firstFrame.frame;
      var afterLast = frame > lastFrame.frame;
      var firstOrLastFrame = beforeFirst ? firstFrame : lastFrame;
      var emitEvents = skrollable.emitEvents;
      var lastFrameIndex = skrollable.lastFrameIndex;
      var key;
      var value;

      //If we are before/after the first/last frame, set the styles according to the given edge strategy.
      if(beforeFirst || afterLast) {
        //Check if we already handled this edge case last time.
        //Note: using setScrollTop it's possible that we jumped from one edge to the other.
        if(beforeFirst && skrollable.edge === -1 || afterLast && skrollable.edge === 1) {
          continue;
        }

        //Add the skrollr-before or -after class.
        if(beforeFirst) {
          _updateClass(element, [SKROLLABLE_BEFORE_CLASS], [SKROLLABLE_AFTER_CLASS, SKROLLABLE_BETWEEN_CLASS]);

          //This handles the special case where we exit the first keyframe.
          if(emitEvents && lastFrameIndex > -1) {
            _emitEvent(element, firstFrame.eventType, _direction);
            skrollable.lastFrameIndex = -1;
          }
        } else {
          _updateClass(element, [SKROLLABLE_AFTER_CLASS], [SKROLLABLE_BEFORE_CLASS, SKROLLABLE_BETWEEN_CLASS]);

          //This handles the special case where we exit the last keyframe.
          if(emitEvents && lastFrameIndex < framesLength) {
            _emitEvent(element, lastFrame.eventType, _direction);
            skrollable.lastFrameIndex = framesLength;
          }
        }

        //Remember that we handled the edge case (before/after the first/last keyframe).
        skrollable.edge = beforeFirst ? -1 : 1;

        switch(skrollable.edgeStrategy) {
          case 'reset':
            _reset(element);
            continue;
          case 'ease':
            //Handle this case like it would be exactly at first/last keyframe and just pass it on.
            frame = firstOrLastFrame.frame;
            break;
          default:
          case 'set':
            var props = firstOrLastFrame.props;

            for(key in props) {
              if(hasProp.call(props, key)) {
                value = _interpolateString(props[key].value);

                //Set style or attribute.
                if(key.indexOf('@') === 0) {
                  element.setAttribute(key.substr(1), value);
                } else {
                  skrollr.setStyle(element, key, value);
                }
              }
            }

            continue;
        }
      } else {
        //Did we handle an edge last time?
        if(skrollable.edge !== 0) {
          _updateClass(element, [SKROLLABLE_CLASS, SKROLLABLE_BETWEEN_CLASS], [SKROLLABLE_BEFORE_CLASS, SKROLLABLE_AFTER_CLASS]);
          skrollable.edge = 0;
        }
      }

      //Find out between which two key frames we are right now.
      var keyFrameIndex = 0;

      for(; keyFrameIndex < framesLength - 1; keyFrameIndex++) {
        if(frame >= frames[keyFrameIndex].frame && frame <= frames[keyFrameIndex + 1].frame) {
          var left = frames[keyFrameIndex];
          var right = frames[keyFrameIndex + 1];

          for(key in left.props) {
            if(hasProp.call(left.props, key)) {
              var progress = (frame - left.frame) / (right.frame - left.frame);

              //Transform the current progress using the given easing function.
              progress = left.props[key].easing(progress);

              //Interpolate between the two values
              value = _calcInterpolation(left.props[key].value, right.props[key].value, progress);

              value = _interpolateString(value);

              //Set style or attribute.
              if(key.indexOf('@') === 0) {
                element.setAttribute(key.substr(1), value);
              } else {
                skrollr.setStyle(element, key, value);
              }
            }
          }

          //Are events enabled on this element?
          //This code handles the usual cases of scrolling through different keyframes.
          //The special cases of before first and after last keyframe are handled above.
          if(emitEvents) {
            //Did we pass a new keyframe?
            if(lastFrameIndex !== keyFrameIndex) {
              if(_direction === 'down') {
                _emitEvent(element, left.eventType, _direction);
              } else {
                _emitEvent(element, right.eventType, _direction);
              }

              skrollable.lastFrameIndex = keyFrameIndex;
            }
          }

          break;
        }
      }
    }
  };

  /**
   * Renders all elements.
   */
  var _render = function() {
    if(_requestReflow) {
      _requestReflow = false;
      _reflow();
    }

    //We may render something else than the actual scrollbar position.
    var renderTop = _instance.getScrollTop();

    //If there's an animation, which ends in current render call, call the callback after rendering.
    var afterAnimationCallback;
    var now = _now();
    var progress;

    //Before actually rendering handle the scroll animation, if any.
    if(_scrollAnimation) {
      //It's over
      if(now >= _scrollAnimation.endTime) {
        renderTop = _scrollAnimation.targetTop;
        afterAnimationCallback = _scrollAnimation.done;
        _scrollAnimation = undefined;
      } else {
        //Map the current progress to the new progress using given easing function.
        progress = _scrollAnimation.easing((now - _scrollAnimation.startTime) / _scrollAnimation.duration);

        renderTop = (_scrollAnimation.startTop + progress * _scrollAnimation.topDiff) | 0;
      }

      _instance.setScrollTop(renderTop, true);
    }
    //Smooth scrolling only if there's no animation running and if we're not forcing the rendering.
    else if(!_forceRender) {
      var smoothScrollingDiff = _smoothScrolling.targetTop - renderTop;

      //The user scrolled, start new smooth scrolling.
      if(smoothScrollingDiff) {
        _smoothScrolling = {
          startTop: _lastTop,
          topDiff: renderTop - _lastTop,
          targetTop: renderTop,
          startTime: _lastRenderCall,
          endTime: _lastRenderCall + _smoothScrollingDuration
        };
      }

      //Interpolate the internal scroll position (not the actual scrollbar).
      if(now <= _smoothScrolling.endTime) {
        //Map the current progress to the new progress using easing function.
        progress = easings.sqrt((now - _smoothScrolling.startTime) / _smoothScrollingDuration);

        renderTop = (_smoothScrolling.startTop + progress * _smoothScrolling.topDiff) | 0;
      }
    }

    //That's were we actually "scroll" on mobile.
    if(_isMobile && _skrollrBody) {
      //Set the transform ("scroll it").
      skrollr.setStyle(_skrollrBody, 'transform', 'translate(0, ' + -(_mobileOffset) + 'px) ' + _translateZ);
    }

    //Did the scroll position even change?
    if(_forceRender || _lastTop !== renderTop) {
      //Remember in which direction are we scrolling?
      _direction = (renderTop > _lastTop) ? 'down' : (renderTop < _lastTop ? 'up' : _direction);

      _forceRender = false;

      var listenerParams = {
        curTop: renderTop,
        lastTop: _lastTop,
        maxTop: _maxKeyFrame,
        direction: _direction
      };

      //Tell the listener we are about to render.
      var continueRendering = _listeners.beforerender && _listeners.beforerender.call(_instance, listenerParams);

      //The beforerender listener function is able the cancel rendering.
      if(continueRendering !== false) {
        //Now actually interpolate all the styles.
        _calcSteps(renderTop, _instance.getScrollTop());

        //Remember when we last rendered.
        _lastTop = renderTop;

        if(_listeners.render) {
          _listeners.render.call(_instance, listenerParams);
        }
      }

      if(afterAnimationCallback) {
        afterAnimationCallback.call(_instance, false);
      }
    }

    _lastRenderCall = now;
  };

  /**
   * Parses the properties for each key frame of the given skrollable.
   */
  var _parseProps = function(skrollable) {
    //Iterate over all key frames
    var keyFrameIndex = 0;
    var keyFramesLength = skrollable.keyFrames.length;

    for(; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
      var frame = skrollable.keyFrames[keyFrameIndex];
      var easing;
      var value;
      var prop;
      var props = {};

      var match;

      while((match = rxPropValue.exec(frame.props)) !== null) {
        prop = match[1];
        value = match[2];

        easing = prop.match(rxPropEasing);

        //Is there an easing specified for this prop?
        if(easing !== null) {
          prop = easing[1];
          easing = easing[2];
        } else {
          easing = DEFAULT_EASING;
        }

        //Exclamation point at first position forces the value to be taken literal.
        value = value.indexOf('!') ? _parseProp(value) : [value.slice(1)];

        //Save the prop for this key frame with his value and easing function
        props[prop] = {
          value: value,
          easing: easings[easing]
        };
      }

      frame.props = props;
    }
  };

  /**
   * Parses a value extracting numeric values and generating a format string
   * for later interpolation of the new values in old string.
   *
   * @param val The CSS value to be parsed.
   * @return Something like ["rgba(?%,?%, ?%,?)", 100, 50, 0, .7]
   * where the first element is the format string later used
   * and all following elements are the numeric value.
   */
  var _parseProp = function(val) {
    var numbers = [];

    //One special case, where floats don't work.
    //We replace all occurences of rgba colors
    //which don't use percentage notation with the percentage notation.
    rxRGBAIntegerColor.lastIndex = 0;
    val = val.replace(rxRGBAIntegerColor, function(rgba) {
      return rgba.replace(rxNumericValue, function(n) {
        return n / 255 * 100 + '%';
      });
    });

    //Handle prefixing of "gradient" values.
    //For now only the prefixed value will be set. Unprefixed isn't supported anyway.
    if(theDashedCSSPrefix) {
      rxGradient.lastIndex = 0;
      val = val.replace(rxGradient, function(s) {
        return theDashedCSSPrefix + s;
      });
    }

    //Now parse ANY number inside this string and create a format string.
    val = val.replace(rxNumericValue, function(n) {
      numbers.push(+n);
      return '{?}';
    });

    //Add the formatstring as first value.
    numbers.unshift(val);

    return numbers;
  };

  /**
   * Fills the key frames with missing left and right hand properties.
   * If key frame 1 has property X and key frame 2 is missing X,
   * but key frame 3 has X again, then we need to assign X to key frame 2 too.
   *
   * @param sk A skrollable.
   */
  var _fillProps = function(sk) {
    //Will collect the properties key frame by key frame
    var propList = {};
    var keyFrameIndex;
    var keyFramesLength;

    //Iterate over all key frames from left to right
    keyFrameIndex = 0;
    keyFramesLength = sk.keyFrames.length;

    for(; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
      _fillPropForFrame(sk.keyFrames[keyFrameIndex], propList);
    }

    //Now do the same from right to fill the last gaps

    propList = {};

    //Iterate over all key frames from right to left
    keyFrameIndex = sk.keyFrames.length - 1;

    for(; keyFrameIndex >= 0; keyFrameIndex--) {
      _fillPropForFrame(sk.keyFrames[keyFrameIndex], propList);
    }
  };

  var _fillPropForFrame = function(frame, propList) {
    var key;

    //For each key frame iterate over all right hand properties and assign them,
    //but only if the current key frame doesn't have the property by itself
    for(key in propList) {
      //The current frame misses this property, so assign it.
      if(!hasProp.call(frame.props, key)) {
        frame.props[key] = propList[key];
      }
    }

    //Iterate over all props of the current frame and collect them
    for(key in frame.props) {
      propList[key] = frame.props[key];
    }
  };

  /**
   * Calculates the new values for two given values array.
   */
  var _calcInterpolation = function(val1, val2, progress) {
    var valueIndex;
    var val1Length = val1.length;

    //They both need to have the same length
    if(val1Length !== val2.length) {
      throw 'Can\'t interpolate between "' + val1[0] + '" and "' + val2[0] + '"';
    }

    //Add the format string as first element.
    var interpolated = [val1[0]];

    valueIndex = 1;

    for(; valueIndex < val1Length; valueIndex++) {
      //That's the line where the two numbers are actually interpolated.
      interpolated[valueIndex] = val1[valueIndex] + ((val2[valueIndex] - val1[valueIndex]) * progress);
    }

    return interpolated;
  };

  /**
   * Interpolates the numeric values into the format string.
   */
  var _interpolateString = function(val) {
    var valueIndex = 1;

    rxInterpolateString.lastIndex = 0;

    return val[0].replace(rxInterpolateString, function() {
      return val[valueIndex++];
    });
  };

  /**
   * Resets the class and style attribute to what it was before skrollr manipulated the element.
   * Also remembers the values it had before reseting, in order to undo the reset.
   */
  var _reset = function(elements, undo) {
    //We accept a single element or an array of elements.
    elements = [].concat(elements);

    var skrollable;
    var element;
    var elementsIndex = 0;
    var elementsLength = elements.length;

    for(; elementsIndex < elementsLength; elementsIndex++) {
      element = elements[elementsIndex];
      skrollable = _skrollables[element[SKROLLABLE_ID_DOM_PROPERTY]];

      //Couldn't find the skrollable for this DOM element.
      if(!skrollable) {
        continue;
      }

      if(undo) {
        //Reset class and style to the "dirty" (set by skrollr) values.
        element.style.cssText = skrollable.dirtyStyleAttr;
        _updateClass(element, skrollable.dirtyClassAttr);
      } else {
        //Remember the "dirty" (set by skrollr) class and style.
        skrollable.dirtyStyleAttr = element.style.cssText;
        skrollable.dirtyClassAttr = _getClass(element);

        //Reset class and style to what it originally was.
        element.style.cssText = skrollable.styleAttr;
        _updateClass(element, skrollable.classAttr);
      }
    }
  };

  /**
   * Detects support for 3d transforms by applying it to the skrollr-body.
   */
  var _detect3DTransforms = function() {
    _translateZ = 'translateZ(0)';
    skrollr.setStyle(_skrollrBody, 'transform', _translateZ);

    var computedStyle = getStyle(_skrollrBody);
    var computedTransform = computedStyle.getPropertyValue('transform');
    var computedTransformWithPrefix = computedStyle.getPropertyValue(theDashedCSSPrefix + 'transform');
    var has3D = (computedTransform && computedTransform !== 'none') || (computedTransformWithPrefix && computedTransformWithPrefix !== 'none');

    if(!has3D) {
      _translateZ = '';
    }
  };

  /**
   * Set the CSS property on the given element. Sets prefixed properties as well.
   */
  skrollr.setStyle = function(el, prop, val) {
    var style = el.style;

    //Camel case.
    prop = prop.replace(rxCamelCase, rxCamelCaseFn).replace('-', '');

    //Make sure z-index gets a <integer>.
    //This is the only <integer> case we need to handle.
    if(prop === 'zIndex') {
      if(isNaN(val)) {
        //If it's not a number, don't touch it.
        //It could for example be "auto" (#351).
        style[prop] = val;
      } else {
        //Floor the number.
        style[prop] = '' + (val | 0);
      }
    }
    //#64: "float" can't be set across browsers. Needs to use "cssFloat" for all except IE.
    else if(prop === 'float') {
      style.styleFloat = style.cssFloat = val;
    }
    else {
      //Need try-catch for old IE.
      try {
        //Set prefixed property if there's a prefix.
        if(theCSSPrefix) {
          style[theCSSPrefix + prop.slice(0,1).toUpperCase() + prop.slice(1)] = val;
        }

        //Set unprefixed.
        style[prop] = val;
      } catch(ignore) {}
    }
  };

  /**
   * Cross browser event handling.
   */
  var _addEvent = skrollr.addEvent = function(element, names, callback) {
    var intermediate = function(e) {
      //Normalize IE event stuff.
      e = e || window.event;

      if(!e.target) {
        e.target = e.srcElement;
      }

      if(!e.preventDefault) {
        e.preventDefault = function() {
          e.returnValue = false;
          e.defaultPrevented = true;
        };
      }

      return callback.call(this, e);
    };

    names = names.split(' ');

    var name;
    var nameCounter = 0;
    var namesLength = names.length;

    for(; nameCounter < namesLength; nameCounter++) {
      name = names[nameCounter];

      if(element.addEventListener) {
        element.addEventListener(name, callback, false);
      } else {
        element.attachEvent('on' + name, intermediate);
      }

      //Remember the events to be able to flush them later.
      _registeredEvents.push({
        element: element,
        name: name,
        listener: callback
      });
    }
  };

  var _removeEvent = skrollr.removeEvent = function(element, names, callback) {
    names = names.split(' ');

    var nameCounter = 0;
    var namesLength = names.length;

    for(; nameCounter < namesLength; nameCounter++) {
      if(element.removeEventListener) {
        element.removeEventListener(names[nameCounter], callback, false);
      } else {
        element.detachEvent('on' + names[nameCounter], callback);
      }
    }
  };

  var _removeAllEvents = function() {
    var eventData;
    var eventCounter = 0;
    var eventsLength = _registeredEvents.length;

    for(; eventCounter < eventsLength; eventCounter++) {
      eventData = _registeredEvents[eventCounter];

      _removeEvent(eventData.element, eventData.name, eventData.listener);
    }

    _registeredEvents = [];
  };

  var _emitEvent = function(element, name, direction) {
    if(_listeners.keyframe) {
      _listeners.keyframe.call(_instance, element, name, direction);
    }
  };

  var _reflow = function() {
    var pos = _instance.getScrollTop();

    //Will be recalculated by _updateDependentKeyFrames.
    _maxKeyFrame = 0;

    if(_forceHeight && !_isMobile) {
      //un-"force" the height to not mess with the calculations in _updateDependentKeyFrames (#216).
      body.style.height = '';
    }

    _updateDependentKeyFrames();

    if(_forceHeight && !_isMobile) {
      //"force" the height.
      body.style.height = (_maxKeyFrame + documentElement.clientHeight) + 'px';
    }

    //The scroll offset may now be larger than needed (on desktop the browser/os prevents scrolling farther than the bottom).
    if(_isMobile) {
      _instance.setScrollTop(Math.min(_instance.getScrollTop(), _maxKeyFrame));
    } else {
      //Remember and reset the scroll pos (#217).
      _instance.setScrollTop(pos, true);
    }

    _forceRender = true;
  };

  /*
   * Returns a copy of the constants object where all functions and strings have been evaluated.
   */
  var _processConstants = function() {
    var viewportHeight = documentElement.clientHeight;
    var copy = {};
    var prop;
    var value;

    for(prop in _constants) {
      value = _constants[prop];

      if(typeof value === 'function') {
        value = value.call(_instance);
      }
      //Percentage offset.
      else if((/p$/).test(value)) {
        value = (value.slice(0, -1) / 100) * viewportHeight;
      }

      copy[prop] = value;
    }

    return copy;
  };

  /*
   * Returns the height of the document.
   */
  var _getDocumentHeight = function() {
    var skrollrBodyHeight = (_skrollrBody && _skrollrBody.offsetHeight || 0);
    var bodyHeight = Math.max(skrollrBodyHeight, body.scrollHeight, body.offsetHeight, documentElement.scrollHeight, documentElement.offsetHeight, documentElement.clientHeight);

    return bodyHeight - documentElement.clientHeight;
  };

  /**
   * Returns a string of space separated classnames for the current element.
   * Works with SVG as well.
   */
  var _getClass = function(element) {
    var prop = 'className';

    //SVG support by using className.baseVal instead of just className.
    if(window.SVGElement && element instanceof window.SVGElement) {
      element = element[prop];
      prop = 'baseVal';
    }

    return element[prop];
  };

  /**
   * Adds and removes a CSS classes.
   * Works with SVG as well.
   * add and remove are arrays of strings,
   * or if remove is ommited add is a string and overwrites all classes.
   */
  var _updateClass = function(element, add, remove) {
    var prop = 'className';

    //SVG support by using className.baseVal instead of just className.
    if(window.SVGElement && element instanceof window.SVGElement) {
      element = element[prop];
      prop = 'baseVal';
    }

    //When remove is ommited, we want to overwrite/set the classes.
    if(remove === undefined) {
      element[prop] = add;
      return;
    }

    //Cache current classes. We will work on a string before passing back to DOM.
    var val = element[prop];

    //All classes to be removed.
    var classRemoveIndex = 0;
    var removeLength = remove.length;

    for(; classRemoveIndex < removeLength; classRemoveIndex++) {
      val = _untrim(val).replace(_untrim(remove[classRemoveIndex]), ' ');
    }

    val = _trim(val);

    //All classes to be added.
    var classAddIndex = 0;
    var addLength = add.length;

    for(; classAddIndex < addLength; classAddIndex++) {
      //Only add if el not already has class.
      if(_untrim(val).indexOf(_untrim(add[classAddIndex])) === -1) {
        val += ' ' + add[classAddIndex];
      }
    }

    element[prop] = _trim(val);
  };

  var _trim = function(a) {
    return a.replace(rxTrim, '');
  };

  /**
   * Adds a space before and after the string.
   */
  var _untrim = function(a) {
    return ' ' + a + ' ';
  };

  var _now = Date.now || function() {
    return +new Date();
  };

  var _keyFrameComparator = function(a, b) {
    return a.frame - b.frame;
  };

  /*
   * Private variables.
   */

  //Singleton
  var _instance;

  /*
    A list of all elements which should be animated associated with their the metadata.
    Exmaple skrollable with two key frames animating from 100px width to 20px:

    skrollable = {
      element: <the DOM element>,
      styleAttr: <style attribute of the element before skrollr>,
      classAttr: <class attribute of the element before skrollr>,
      keyFrames: [
        {
          frame: 100,
          props: {
            width: {
              value: ['{?}px', 100],
              easing: <reference to easing function>
            }
          },
          mode: "absolute"
        },
        {
          frame: 200,
          props: {
            width: {
              value: ['{?}px', 20],
              easing: <reference to easing function>
            }
          },
          mode: "absolute"
        }
      ]
    };
  */
  var _skrollables;

  var _skrollrBody;

  var _listeners;
  var _forceHeight;
  var _maxKeyFrame = 0;

  var _scale = 1;
  var _constants;

  var _mobileDeceleration;

  //Current direction (up/down).
  var _direction = 'down';

  //The last top offset value. Needed to determine direction.
  var _lastTop = -1;

  //The last time we called the render method (doesn't mean we rendered!).
  var _lastRenderCall = _now();

  //For detecting if it actually resized (#271).
  var _lastViewportWidth = 0;
  var _lastViewportHeight = 0;

  var _requestReflow = false;

  //Will contain data about a running scrollbar animation, if any.
  var _scrollAnimation;

  var _smoothScrollingEnabled;

  var _smoothScrollingDuration;

  //Will contain settins for smooth scrolling if enabled.
  var _smoothScrolling;

  //Can be set by any operation/event to force rendering even if the scrollbar didn't move.
  var _forceRender;

  //Each skrollable gets an unique ID incremented for each skrollable.
  //The ID is the index in the _skrollables array.
  var _skrollableIdCounter = 0;

  var _edgeStrategy;


  //Mobile specific vars. Will be stripped by UglifyJS when not in use.
  var _isMobile = false;

  //The virtual scroll offset when using mobile scrolling.
  var _mobileOffset = 0;

  //If the browser supports 3d transforms, this will be filled with 'translateZ(0)' (empty string otherwise).
  var _translateZ;

  //Will contain data about registered events by skrollr.
  var _registeredEvents = [];

  //Animation frame id returned by RequestAnimationFrame (or timeout when RAF is not supported).
  var _animFrame;

  //Expose skrollr as either a global variable or a require.js module
  if(typeof define === 'function' && define.amd) {
    define('skrollr', function () {
      return skrollr;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = skrollr;
  } else {
    window.skrollr = skrollr;
  }

}(window, document));
/* ========================================================================
 * Bootstrap: affix.js v3.1.1
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */



+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$window.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (this.affixed == 'top') position.top += scrollTop

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    var affixType = 'affix' + (affix ? '-' + affix : '')
    var e         = $.Event(affixType + '.bs.affix')

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

    this.$element
      .removeClass(Affix.RESET)
      .addClass(affixType)
      .trigger($.Event(affixType.replace('affix', 'affixed')))

    if (affix == 'bottom') {
      this.$element.offset({ top: scrollHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: alert.js v3.1.1
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */



+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
/* ========================================================================
 * Bootstrap: button.js v3.1.1
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */



+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: carousel.js v3.1.1
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */



+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return this.sliding = false

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })
    this.$element.trigger(e)
    if (e.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid.bs.carousel', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0)
        })
        .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid.bs.carousel')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: collapse.js v3.1.1
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */



+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') option = !option
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: dropdown.js v3.1.1
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */



+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role=menu]' + desc + ', [role=listbox]' + desc)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).focus()
  }

  function clearMenus(e) {
    $(backdrop).remove()
    $(toggle).each(function () {
      var $parent = getParent($(this))
      var relatedTarget = { relatedTarget: this }
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu], [role=listbox]', Dropdown.prototype.keydown)

}(jQuery);
/* ========================================================================
 * Bootstrap: tab.js v3.1.1
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */



+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: transition.js v3.1.1
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */



+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd',
      'MozTransition'    : 'transitionend',
      'OTransition'      : 'oTransitionEnd otransitionend',
      'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: scrollspy.js v3.1.1
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */



+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    if (activeTarget && scrollTop <= offsets[0]) {
      return activeTarget != (i = targets[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: modal.js v3.1.1
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */



+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(jQuery);
/* ========================================================================
 * Bootstrap: tooltip.js v3.1.1
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */



+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return
      var that = this;

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.hoverState = null

      var complete = function() {
        that.$element.trigger('shown.bs.' + that.type)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one($.support.transition.end, complete)
          .emulateTransitionEnd(150) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element.trigger('hidden.bs.' + that.type)
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth,
      height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    clearTimeout(this.timeout)
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);
/* ========================================================================
 * Bootstrap: popover.js v3.1.1
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */



+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);












(function() {
  var s;

  s = skrollr.init();

  (function($, window, document) {
    var nextSlide, prevSlide, resizeIntro, setNextSlide, setPrevSlide, setSlide, slideIndex;
    resizeIntro = function() {
      $('#loading').css({
        height: $(window).height()
      });
      return $('.slide .container').css({
        height: $(window).height()
      });
    };
    resizeIntro();
    $(window).on('resize', function() {
      return resizeIntro();
    });
    $('.gallery').each(function() {
      var el, images;
      el = $(this);
      images = el.find('img');
      return images.on('click', function(event) {
        $(this).removeClass('active');
        if ($(this).next().length > 0) {
          return $(this).next().addClass('active');
        } else {
          return $(this).parent().find('img:first-child').addClass('active');
        }
      });
    });
    $(window).load(function() {
      return $('body').removeClass('loading');
    });
    slideIndex = 1;
    setSlide = function(direction) {
      var $currentSlide, $incomingSlide, $slides;
      $slides = $('.slide');
      $currentSlide = $slides.filter('.active');
      if (direction === 'prev') {
        slideIndex--;
        if (slideIndex < 1) {
          $incomingSlide = $currentSlide;
          slideIndex = 1;
        } else {
          $incomingSlide = $currentSlide.prev('.slide');
        }
      }
      if (direction === 'next') {
        slideIndex++;
        if (slideIndex > $slides.length) {
          $incomingSlide = $currentSlide;
          slideIndex = $slides.length;
        } else {
          $incomingSlide = $currentSlide.next('.slide');
        }
      }
      $slides.removeClass('active');
      $incomingSlide.addClass('active');
      $currentSlide = $slides.filter('.active');
      return s.animateTo($currentSlide.data('scroll-position'), {
        duration: 300
      });
    };
    setPrevSlide = function() {
      return setSlide('prev');
    };
    setNextSlide = function() {
      return setSlide('next');
    };
    prevSlide = _.debounce(setPrevSlide, 100, true);
    nextSlide = _.debounce(setNextSlide, 100, true);
    $(window).on({
      mousewheel: function(e) {
        if (e.originalEvent.wheelDelta >= 0) {
          return prevSlide();
        } else {
          return nextSlide();
        }
      }
    });
    $('body').on({
      touchmove: function(e) {
        return e.stopPropagation();
      }
    });
    $(document).on({
      swipeone: function(event, obj) {
        var direction;
        direction = obj.description.split(":")[3];
        if (direction === "down") {
          return prevSlide();
        } else if (direction === "up") {
          return nextSlide();
        }
      }
    });
    $(document).keydown(function(e) {
      if (e.keyCode === 38) {
        return prevSlide();
      }
    });
    return $(document).keydown(function(e) {
      if (e.keyCode === 40) {
        return nextSlide();
      }
    });
  })(jQuery, window, document);

}).call(this);
