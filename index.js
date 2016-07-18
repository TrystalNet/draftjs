"use strict";
var trist_1 = require('@trystal/trist');
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
    var levelKeys = fnLevelKeys(splitted.map(function (item) { return item.leader; }));
    var levels = fnLevels(splitted, levelKeys);
    var payloads = splitted.map(function (_a) {
        var id = _a.id, trystup = _a.trystup;
        return ({ id: id, trystup: trystup });
    });
    var chain = trist_1.chainify(payloads, function (id) { return levels[id]; });
    return trist_1.collapseAll(chain, function (id) { return levels[id]; });
}
exports.textToChain = textToChain;
