import {
  // Editor, getDefaultKeyBinding, RichUtils, 
  // convertToRaw, 
  CompositeDecorator,
  EditorState 
} from 'draft-js'


import {renderDraftJS} from '@trystal/trystup'
import Link  from './link'   // jsx
import Field from './field'  // jsx

import { 
  // isPartialKey, styleMap,
  // getSimpleBinding, getCompoundBinding,
  // addFieldReducer, addLinkReducer, bgReducer, fgReducer, familyReducer, sizeReducer,
  findLinkEntities, findFieldEntities 
} from './util'

export function initEditorState(trystup='') {
  const {contentState} = renderDraftJS(trystup.trim())
  const specs = [
    {  strategy: findLinkEntities,  component: Link  }, 
    {  strategy: findFieldEntities, component: Field } 
  ]
  const decorators = new CompositeDecorator(specs)
  let editorState = EditorState.createWithContent(contentState, decorators)
  editorState = EditorState.moveSelectionToEnd(editorState) 
  return editorState
}
