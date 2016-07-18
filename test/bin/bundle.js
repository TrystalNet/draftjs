/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var trist_1 = __webpack_require__(1);
	var trist_text_1 = __webpack_require__(2);
	var factory = function (levels) {
	    var words = "zero one two three four five six seven eight nine ten".split(' ');
	    return levels.split('')
	        .map(function (strLevel) { return parseInt(strLevel); })
	        .map(function (level) { return _.repeat(' ', level) + words[level]; })
	        .join('\n');
	};
	var dump = function (chain) {
	    var numberOrDash = function (n) { return _.isNumber(n) ? n.toString() : '-'; };
	    var stringOrDash = function (s) { return _.isString(s) ? s : '-'; };
	    var cops = trist_1.chainOps(chain);
	    var head = cops.head();
	    return {
	        rlevels: cops.rlevels(head).map(function (rlevel) { return numberOrDash(rlevel); }).join(''),
	        PVs: cops.pvids(head).map(function (pvid) { return stringOrDash(pvid); }).join(''),
	        NVs: cops.nvids(head).map(function (nvid) { return stringOrDash(nvid); }).join(''),
	    };
	};
	describe('Converts some text lines into a Chain', function () {
	    it('tests the main test case for collapseEmAll', function () {
	        var text = factory('1133221100');
	        var chain = trist_text_1.textToChain(text, function (index) { return index.toString(); });
	        var result = dump(chain);
	        expect(result.rlevels).toEqual('1020-1000-10');
	        expect(result.PVs).toEqual('-0-2341678');
	    });
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	console.log('16-06-28B');
	var nodeProp = function (node, propname) { return node ? node.get(propname) : null; };
	var rlevel = function (node) { return nodeProp(node, 'rlevel'); };
	var prevId = function (node) { return nodeProp(node, 'prev'); };
	var nextId = function (node) { return nodeProp(node, 'next'); };
	var PVId = function (node) { return nodeProp(node, 'PV'); };
	var NVId = function (node) { return nodeProp(node, 'NV'); };
	var payload = function (node) { return nodeProp(node, 'payload'); };
	var _connect = function (chain, prevProp, nextProp) {
	    var ids = [];
	    for (var _i = 3; _i < arguments.length; _i++) {
	        ids[_i - 3] = arguments[_i];
	    }
	    ids.forEach(function (id, index) {
	        if (id) {
	            if (index > 0)
	                chain = chain.setIn([id, prevProp], ids[index - 1]);
	            if (index < ids.length - 1)
	                chain = chain.setIn([id, nextProp], ids[index + 1]);
	        }
	    });
	    return chain;
	};
	var connect = function (chain) {
	    var ids = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        ids[_i - 1] = arguments[_i];
	    }
	    return _connect.apply(void 0, [chain, 'prev', 'next'].concat(ids));
	};
	var connectV = function (chain) {
	    var ids = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        ids[_i - 1] = arguments[_i];
	    }
	    return _connect.apply(void 0, [chain, 'PV', 'NV'].concat(ids));
	};
	function chainOps(chain) {
	    var node = function (id) { return chain.get(id); };
	    var pid = function (id) { return chain.getIn([id, 'prev']); };
	    var pvid = function (id) { return chain.getIn([id, 'PV']); };
	    var nid = function (id) { return chain.getIn([id, 'next']); };
	    var nvid = function (id) { return chain.getIn([id, 'NV']); };
	    var rlevel = function (id) { return chain.getIn([id, 'rlevel']) || 0; };
	    var payload = function (id) { return chain.getIn([id, 'payload']); };
	    var head = function () { return chain.first() ? hid(chain.first().get('id')) : null; };
	    var last = function () { return chain.last() ? tid(chain.last().get('id')) : null; };
	    var hid = function (id) { return !pid(id) ? id : hid(pvid(id) || pid(id)); };
	    var hvid = function (id) { return !pvid(id) ? id : hvid(pvid(id)); };
	    var tid = function (id) { return !nid(id) ? id : tid(nvid(id) || nid(id)); };
	    var tvid = function (id) { return !nvid(id) ? id : tvid(nvid(id)); };
	    var level = function (id) { return !id ? 0 : rlevel(id) + level(pvid(id) || pid(id)); };
	    var lastChildOrSelfId = function (id) { return id ? (nvid(id) ? pid(nvid(id)) : tid(id)) : null; };
	    var ids = function (id) { return !id ? Immutable.List() : ids(nid(id)).unshift(id); };
	    var rlevels = function (id) { return ids(id).map(function (id) { return rlevel(id); }); };
	    var pvids = function (id) { return ids(id).map(function (id) { return pvid(id); }); };
	    var nvids = function (id) { return ids(id).map(function (id) { return nvid(id); }); };
	    var vids = function (A, B) { return A === B ? [A] : [A].concat(vids(nvid(A), B)); };
	    var isOpen = function (id) { return rlevel(nvid(id)) > 0; };
	    var isClosed = function (id) { return nid(id) && !pvid(nid(id)); };
	    var isBoth = function (id) { return isOpen(id) && isClosed(id); };
	    var contextLevel = function (id) { return level(pvid(id) || pid(id)); };
	    var vlevels = function (A, B) { return vids(A, B).map(function (id) { return ({ id: id, vlevel: contextLevel(A) + rlevel(id) }); }); };
	    var lastVisibleChildId = function (id) {
	        var lvc = nvid(id);
	        var lvl = rlevel(lvc);
	        if (!lvc || lvl <= 0)
	            return null;
	        while (nvid(lvc) && (lvl + rlevel(nvid(lvc)) > 0)) {
	            lvc = nvid(lvc);
	            lvl += rlevel(lvc);
	        }
	        return lvc;
	    };
	    var compare = function (A, B) {
	        if (A === B)
	            return 0;
	        var back = pid(A);
	        var forward = nid(A);
	        while (back && forward && back !== B && forward !== B) {
	            back = pid(back);
	            forward = nid(forward);
	        }
	        if (back === B || forward === null)
	            return 1;
	        return -1;
	    };
	    var sort = function () {
	        var ids = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            ids[_i - 0] = arguments[_i];
	        }
	        return ids.sort(compare);
	    };
	    var heads = function () { return chain.keySeq().filter(function (id) { return !pvid(id); }).toArray(); };
	    var vchainLength = function (id) { return !id ? 0 : 1 + vchainLength(nvid(id)); };
	    var vchains = function () { return heads().map(function (id) { return ({ id: id, length: vchainLength(id) }); }); };
	    var vchain = function (id) { return !nvid(id) ? [id] : [id].concat(vchain(nvid(id))); };
	    return {
	        node: node, head: head,
	        pid: pid, nid: nid, pvid: pvid, nvid: nvid, rlevel: rlevel,
	        hid: hid, hvid: hvid, tid: tid, tvid: tvid,
	        level: level,
	        lastChildOrSelfId: lastChildOrSelfId, lastVisibleChildId: lastVisibleChildId,
	        ids: ids, vids: vids, pvids: pvids, nvids: nvids, rlevels: rlevels,
	        sort: sort, vlevels: vlevels,
	        isOpen: isOpen, isClosed: isClosed, isBoth: isBoth,
	        heads: heads, vchains: vchains, vchain: vchain, vchainLength: vchainLength
	    };
	}
	exports.chainOps = chainOps;
	function chainify(payloads, fnLevel) {
	    if (fnLevel === void 0) { fnLevel = function (id) { return 0; }; }
	    return Immutable.fromJS(payloads.reduce(function (accum, payload, index) {
	        var id = payload.id;
	        var prev = index ? payloads[index - 1].id : null;
	        var next = index < payloads.length - 1 ? payloads[index + 1].id : null;
	        var rlevel = fnLevel(id) - (index > 0 ? fnLevel(payloads[index - 1].id) : 0);
	        accum[id] = { id: id, prev: prev, next: next, PV: prev, NV: next, rlevel: rlevel };
	        return accum;
	    }, {}));
	}
	exports.chainify = chainify;
	function collapseAll(chain, fnLevel) {
	    var stack = [];
	    var getPVId = function (level) {
	        var pvId = null;
	        while (!_.isEmpty(stack) && fnLevel(_.last(stack)) >= level)
	            pvId = stack.pop();
	        return pvId;
	    };
	    var C = chainOps(chain);
	    var id = C.head();
	    while (id) {
	        var level = fnLevel(id);
	        var pvId = getPVId(level);
	        var lid = pvId || C.pid(id);
	        var node = chain.get(id)
	            .set('rlevel', level - (lid ? fnLevel(lid) : 0))
	            .set('PV', pvId)
	            .set('NV', null);
	        if (pvId)
	            chain = chain.setIn([pvId, 'NV'], id);
	        chain = chain.set(id, node);
	        stack.push(id);
	        id = C.nid(id);
	    }
	    return chain;
	}
	exports.collapseAll = collapseAll;
	function add(chain, focusId, payload) {
	    var id = payload.id;
	    var ipayload = Immutable.fromJS({ id: id, payload: payload });
	    if (chain.isEmpty()) {
	        chain = chain.set(id, ipayload);
	        chain = chain.setIn([id, 'rlevel'], 0);
	    }
	    else {
	        var CHAIN = chainOps(chain);
	        var A = focusId || CHAIN.tid(chain.last().get('id'));
	        var A2 = CHAIN.lastChildOrSelfId(A);
	        var B = id;
	        var C = CHAIN.nvid(A);
	        chain = chain.set(B, ipayload);
	        chain = connect(chain, A2, B, C);
	        chain = connectV(chain, A, B, C);
	        chain = chain.setIn([B, 'rlevel'], 0);
	    }
	    return chain;
	}
	exports.add = add;
	function indent(chain, anchorId, focusId, offset) {
	    var COPS = chainOps(chain);
	    var _a = COPS.sort(anchorId, focusId), first = _a[0], last = _a[1];
	    chain = chain.setIn([first, 'rlevel'], COPS.rlevel(first) + offset);
	    var nvid = COPS.nvid(last);
	    if (nvid)
	        chain = chain.setIn([nvid, 'rlevel'], COPS.rlevel(nvid) - offset);
	    return chain;
	}
	exports.indent = indent;
	var groupSize = function (maxSize, itemCount) { return Math.round(itemCount / Math.ceil(itemCount / maxSize)); };
	function chunk(chain, tgtSize, fnPayload) {
	    var counter = 0;
	    var COPS = chainOps(chain);
	    var vchain = _.find(COPS.vchains(), function (vchain) { return vchain.length > tgtSize * 1.4; });
	    var _loop_1 = function() {
	        var id = vchain.id, length_1 = vchain.length;
	        var gs = groupSize(tgtSize, length_1);
	        var S1 = COPS.vchain(id);
	        var S2 = _.chunk(S1, gs);
	        var S3 = _.tail(S2);
	        var As = S3.map(function (S3) { return _.first(S3); });
	        var payloads = As.map(function (item) { return fnPayload(counter++); });
	        As.forEach(function (A, index) { return chain = add(chain, COPS.pvid(A), payloads[index]); });
	        S3.forEach(function (chunk) { return chain = indent(chain, _.first(chunk), _.last(chunk), 1); });
	        S3.forEach(function (chunk, index) { return chain = collapse(chain, payloads[index].id, payloads[index].id); });
	        COPS = chainOps(chain);
	        vchain = _.find(COPS.vchains(), function (vchain) { return vchain.length > tgtSize * 1.4; });
	    };
	    while (vchain) {
	        _loop_1();
	    }
	    return chain;
	}
	exports.chunk = chunk;
	function collapse(chain, anchor, focus) {
	    var COPS = chainOps(chain);
	    var sorted = COPS.sort(anchor, focus);
	    var vids = COPS.vids(sorted[0], sorted[1]);
	    var work = vids.filter(function (id) { return COPS.isOpen(id); }).map(function (id) { return ({ id: id, level: COPS.level(id) }); });
	    var maxLevel = Math.max.apply(Math, work.map(function (item) { return item.level; }));
	    work = work.filter(function (pp) { return pp.level === maxLevel; });
	    _.each(work, function (_a) {
	        var A = _a.id, level = _a.level;
	        var B = COPS.nvid(A);
	        var C = COPS.lastVisibleChildId(A);
	        var D = COPS.nvid(C);
	        chain = connectV(chain, A, D);
	        chain = chain.setIn([B, 'PV'], null).setIn([C, 'NV'], null);
	        if (D)
	            chain = chain.setIn([D, 'rlevel'], COPS.level(D) - level);
	    });
	    return chain;
	}
	exports.collapse = collapse;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var trist_1 = __webpack_require__(1);
	var fnLeaderLen = function (leader) { return leader.replace(/\t/g, "    ").length; };
	var fnMatchToSplit = function (id, leader, trystup) { return ({ id: id, leader: leader, trystup: trystup }); };
	var fnSplitOne = function (str, idFactory, index) {
	    var id = idFactory(index);
	    var match = str.match(/^(\s*)(.*$)/);
	    if (!match)
	        return fnMatchToSplit(id, '', '');
	    var leader = match[1], trystup = match[2];
	    return fnMatchToSplit(id, leader, trystup);
	};
	var fnLevelKeys = function (leaders) { return _.uniq(leaders).sort(function (a, b) { return fnLeaderLen(a) - fnLeaderLen(b); }); };
	var fnLevels = function (splitted, levelKeys) { return splitted.reduce(function (accum, item) {
	    var id = item.id, leader = item.leader;
	    accum[id] = levelKeys.indexOf(leader);
	    return accum;
	}, {}); };
	function textToChain(text, fnNextId) {
	    var strs = text.split(/[\r\n]+/).filter(function (str) { return str.length; });
	    var splitted = _.map(strs, function (str, index) { return fnSplitOne(str, fnNextId, index); });
	    var levelKeys = fnLevelKeys(splitted.map(function (item) { return item.leader; })); // ["", "  ", "    "]
	    var levels = fnLevels(splitted, levelKeys); // [1,0,...]
	    var payloads = splitted.map(function (_a) {
	        var id = _a.id, trystup = _a.trystup;
	        return ({ id: id, trystup: trystup });
	    }); // [{id,trystup},{id,trystup},...]
	    var chain = trist_1.chainify(payloads, function (id) { return levels[id]; }); // [{id,next,prev,NV,PV,rlevel},{...},...]
	    return trist_1.collapseAll(chain, function (id) { return levels[id]; }); // {N1:{id,prev,next,PV,NV,rlevel},N2:{...},...}
	}
	exports.textToChain = textToChain;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map