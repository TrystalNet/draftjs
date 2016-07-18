"use strict";
var React = require('react');
var style = {
    borderLeft: 'black 1px solid',
    borderRight: 'black 1px solid',
    padding: '0px 3px',
    backgroundColor: 'gray',
    color: 'white'
};
var Field = function (props) {
    var children = props.children;
    return React.createElement("span", {style: style}, children);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Field;
