"use strict";
var draft_js_1 = require('draft-js');
var keys_1 = require('@trystal/keys');
var constants_1 = require('@trystal/constants');
var removeInlineStyle = draft_js_1.Modifier.removeInlineStyle;
var toggleInlineStyle = draft_js_1.RichUtils.toggleInlineStyle;
function bindings(keyCode) {
    switch (keyCode) {
        case keys_1.KeyCodes.CTRLK: return 'strikethrough';
        default: return undefined;
    }
}
exports.bindings = bindings;
function isPartialKey(keyCode) {
    return [keys_1.KeyCodes.CTRL1, keys_1.KeyCodes.CTRLA, keys_1.KeyCodes.CTRLS, keys_1.KeyCodes.CTRLF, keys_1.KeyCodes.CTRLH].indexOf(keyCode) >= 0;
}
exports.isPartialKey = isPartialKey;
function getSimpleBinding(keyCode) {
    switch (keyCode) {
        case keys_1.KeyCodes.CTRLK: return 'strikethrough';
        case keys_1.KeyCodes.CTRLL: return 'insert-link';
        case keys_1.KeyCodes.CTRLSHIFTV: return 'insert-internal-link';
    }
    return null;
}
exports.getSimpleBinding = getSimpleBinding;
function getCompoundBinding(partialKey, keyCode) {
    switch (partialKey) {
        case keys_1.KeyCodes.CTRL1:
            switch (keyCode) {
                case keys_1.KeyCodes.ONE: return 'insert-field-1';
                case keys_1.KeyCodes.TWO: return 'insert-field-2';
            }
            break;
        case keys_1.KeyCodes.CTRLA:
            switch (keyCode) {
                case keys_1.KeyCodes.ONE: return 'F0';
                case keys_1.KeyCodes.TWO: return 'F1';
                case keys_1.KeyCodes.THREE: return 'F2';
            }
            break;
        case keys_1.KeyCodes.CTRLS:
            switch (keyCode) {
                case keys_1.KeyCodes.ONE: return 'S1';
                case keys_1.KeyCodes.TWO: return 'S2';
                case keys_1.KeyCodes.THREE: return 'S3';
                case keys_1.KeyCodes.FOUR: return 'S4';
                case keys_1.KeyCodes.FIVE: return 'S5';
            }
            break;
        case keys_1.KeyCodes.CTRLF:
            switch (keyCode) {
                case keys_1.KeyCodes.ZERO: return 'FG0';
                case keys_1.KeyCodes.TWO: return 'FG2';
                case keys_1.KeyCodes.THREE: return 'FG3';
                case keys_1.KeyCodes.FOUR: return 'FG4';
                case keys_1.KeyCodes.FIVE: return 'FG5';
            }
            break;
        case keys_1.KeyCodes.CTRLH:
            switch (keyCode) {
                case keys_1.KeyCodes.ZERO: return 'BG0';
                case keys_1.KeyCodes.ONE: return 'BG1';
                case keys_1.KeyCodes.TWO: return 'BG2';
                case keys_1.KeyCodes.THREE: return 'BG3';
                case keys_1.KeyCodes.FOUR: return 'BG4';
                case keys_1.KeyCodes.FIVE: return 'BG5';
            }
    }
    return 'do-nothing';
}
exports.getCompoundBinding = getCompoundBinding;
exports.styleMap = {
    STRIKEOUT: { textDecoration: 'line-through' },
    FG0: { color: 'black' },
    FG2: { color: constants_1.FGS[2] },
    FG3: { color: constants_1.FGS[3] },
    FG4: { color: constants_1.FGS[4] },
    FG5: { color: constants_1.FGS[5] },
    BG0: { backgroundColor: null },
    BG1: { backgroundColor: constants_1.BGS[1] },
    BG2: { backgroundColor: constants_1.BGS[2] },
    BG3: { backgroundColor: constants_1.BGS[3] },
    BG4: { backgroundColor: constants_1.BGS[4] },
    BG5: { backgroundColor: constants_1.BGS[5] },
    F0: { fontFamily: constants_1.FACES[0] },
    F1: { fontFamily: constants_1.FACES[1] },
    F2: { fontFamily: constants_1.FACES[2] },
    S1: { fontSize: '16px' },
    S2: { fontSize: '21px' },
    S3: { fontSize: '16px' },
    S4: { fontSize: '30px' },
    S5: { fontSize: '36px' }
};
exports.addFieldReducer = function (state, formula) {
    var key = draft_js_1.Entity.create('FIELD', 'IMMUTABLE', { formula: formula });
    var newContentState = draft_js_1.Modifier.insertText(state.getCurrentContent(), state.getSelection(), formula, undefined, key);
    return draft_js_1.EditorState.push(state, newContentState, 'apply-entity');
};
exports.addDefaultText = function (editorState, defaultText) {
    var selectionState = editorState.getSelection();
    if (!selectionState.isCollapsed())
        return editorState;
    var contentState = draft_js_1.Modifier.insertText(editorState.getCurrentContent(), selectionState, defaultText + ' ');
    editorState = draft_js_1.EditorState.push(editorState, contentState, 'insert-characters');
    selectionState = selectionState.set('focusOffset', selectionState.getFocusOffset() + defaultText.length);
    editorState = draft_js_1.EditorState.acceptSelection(editorState, selectionState);
    return editorState;
};
exports.addLinkReducer = function (editorState, urlValue) {
    editorState = exports.addDefaultText(editorState, 'LINK');
    var key = draft_js_1.Entity.create('LINK', 'MUTABLE', { url: urlValue });
    return draft_js_1.RichUtils.toggleLink(editorState, editorState.getSelection(), key);
};
var BGCODES = ['BG0', 'BG1', 'BG2', 'BG3', 'BG4', 'BG5'];
var FGCODES = ['FG0', 'FG2', 'FG3', 'FG4', 'FG5'];
var SIZES = ['S1', 'S2', 'S3', 'S4', 'S5'];
var FAMS = ['F0', 'F1', 'F2'];
function getEm(format) {
    if (/FG./.test(format))
        return FGCODES;
    if (/BG./.test(format))
        return BGCODES;
    if (/S./.test(format))
        return SIZES;
    if (/F./.test(format))
        return FAMS;
    return null;
}
exports.setStyle = function (state, style) {
    var REMOVES = getEm(style) || [];
    var selection = state.getSelection();
    var nextContentState = REMOVES.reduce(function (contentState, style) { return removeInlineStyle(contentState, selection, style); }, state.getCurrentContent());
    var newState = draft_js_1.EditorState.push(state, nextContentState, 'change-inline-style');
    var currentStyle = state.getCurrentInlineStyle();
    if (selection.isCollapsed())
        newState = currentStyle.reduce(function (state, color) { return toggleInlineStyle(state, color); }, newState);
    if (!currentStyle.has(style))
        newState = toggleInlineStyle(newState, style);
    return newState;
};
exports.findLinkEntities = function (contentBlock, callback) {
    contentBlock.findEntityRanges(function (character) {
        var entityKey = character.getEntity();
        if (entityKey === null)
            return false;
        var entity = draft_js_1.Entity.get(entityKey);
        return (entity.getType() === 'LINK');
    }, callback);
};
exports.findFieldEntities = function (contentBlock, callback) {
    contentBlock.findEntityRanges(function (character) {
        var entityKey = character.getEntity();
        if (!entityKey)
            return false;
        var entity = draft_js_1.Entity.get(entityKey);
        return (entity.getType() === 'FIELD');
    }, callback);
};
