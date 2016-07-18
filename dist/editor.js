"use strict";
var draft_js_1 = require('draft-js');
var trystup_1 = require('@trystal/trystup');
var link_1 = require('./link');
var field_1 = require('./field');
var util_1 = require('./util');
function initEditorState(trystup) {
    if (trystup === void 0) { trystup = ''; }
    var contentState = trystup_1.renderDraftJS(trystup.trim()).contentState;
    var specs = [
        { strategy: util_1.findLinkEntities, component: link_1.default },
        { strategy: util_1.findFieldEntities, component: field_1.default }
    ];
    var decorators = new draft_js_1.CompositeDecorator(specs);
    var editorState = draft_js_1.EditorState.createWithContent(contentState, decorators);
    editorState = draft_js_1.EditorState.moveSelectionToEnd(editorState);
    return editorState;
}
exports.initEditorState = initEditorState;
