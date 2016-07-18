"use strict";
var React = require('react');
var draft_js_1 = require('draft-js');
var Link = function (props) {
    var url = draft_js_1.Entity.get(props.entityKey).getData().url;
    return React.createElement("a", {href: url, style: { color: '#3b5998', textDecoration: 'underline' }}, props.children);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Link;
