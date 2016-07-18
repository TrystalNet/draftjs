/**
 * Most receent d.ts was found in definitity typed; manually copied them 
 * over top of the obsolete definitions there; in a new install, or if 
 * xxx is updated, this process will have to be repated 
 */

import { Entity, Modifier, EditorState, RichUtils } from 'draft-js'

import { KeyCodes as KC } from '@trystal/keys'
import { BGS, FGS, FACES } from '@trystal/constants'

const {removeInlineStyle} = Modifier
const {toggleInlineStyle} = RichUtils

export function bindings(keyCode) {
  switch (keyCode) {
    case KC.CTRLK: return 'strikethrough'
    default: return undefined
  }
}
export function isPartialKey(keyCode) {
  return [KC.CTRL1, KC.CTRLA, KC.CTRLS, KC.CTRLF, KC.CTRLH].indexOf(keyCode) >= 0
}
export function getSimpleBinding(keyCode) {
  switch (keyCode) {
    case KC.CTRLK: return 'strikethrough'
    case KC.CTRLL: return 'insert-link'
    case KC.CTRLSHIFTV: return 'insert-internal-link'
  }
  return null
}
export function getCompoundBinding(partialKey, keyCode) {
  switch (partialKey) {
    case KC.CTRL1:
      switch (keyCode) {
        case KC.ONE: return 'insert-field-1'
        case KC.TWO: return 'insert-field-2'
      }
      break
    case KC.CTRLA:
      switch (keyCode) {
        case KC.ONE: return 'F0'
        case KC.TWO: return 'F1'
        case KC.THREE: return 'F2'
      }
      break
    case KC.CTRLS:
      switch (keyCode) {
        case KC.ONE: return 'S1'
        case KC.TWO: return 'S2'
        case KC.THREE: return 'S3'
        case KC.FOUR: return 'S4'
        case KC.FIVE: return 'S5'
      }
      break
    case KC.CTRLF:
      switch (keyCode) {
        case KC.ZERO: return 'FG0'
        case KC.TWO: return 'FG2'
        case KC.THREE: return 'FG3'
        case KC.FOUR: return 'FG4'
        case KC.FIVE: return 'FG5'
      }
      break
    case KC.CTRLH:
      switch (keyCode) {
        case KC.ZERO: return 'BG0'
        case KC.ONE: return 'BG1'
        case KC.TWO: return 'BG2'
        case KC.THREE: return 'BG3'
        case KC.FOUR: return 'BG4'
        case KC.FIVE: return 'BG5'
      }
  }
  return 'do-nothing'
}
export const styleMap = {
  STRIKEOUT: { textDecoration: 'line-through' },
  FG0: { color: 'black' },
  FG2: { color: FGS[2] },
  FG3: { color: FGS[3] },
  FG4: { color: FGS[4] },
  FG5: { color: FGS[5] },
  BG0: { backgroundColor: null },
  BG1: { backgroundColor: BGS[1] },
  BG2: { backgroundColor: BGS[2] },
  BG3: { backgroundColor: BGS[3] },
  BG4: { backgroundColor: BGS[4] },
  BG5: { backgroundColor: BGS[5] },
  F0: { fontFamily: FACES[0] },
  F1: { fontFamily: FACES[1] },
  F2: { fontFamily: FACES[2] },
  S1: { fontSize: '16px' },
  S2: { fontSize: '21px' },
  S3: { fontSize: '16px' },
  S4: { fontSize: '30px' },
  S5: { fontSize: '36px' }
}
export const addFieldReducer = (state, formula) => { // cmd === field-0 or field-1 ??
  const key = Entity.create('FIELD', 'IMMUTABLE', { formula })
  const newContentState = Modifier.insertText(state.getCurrentContent(), state.getSelection(), formula, null, key)
  return EditorState.push(state, newContentState, 'apply-entity')
}

export const addDefaultText = (editorState, defaultText) => {
  let selectionState = editorState.getSelection()
  if(!selectionState.isCollapsed()) return editorState
  const contentState = Modifier.insertText(editorState.getCurrentContent(), selectionState, defaultText + ' ')
  editorState = EditorState.push(editorState, contentState, 'insert-characters')
  selectionState = selectionState.set('focusOffset',selectionState.getFocusOffset() + defaultText.length)
  editorState = EditorState.acceptSelection(editorState, selectionState)
  return editorState
}

export const addLinkReducer = (editorState, urlValue) => {
  editorState = addDefaultText(editorState, 'LINK')
  const key = Entity.create('LINK', 'MUTABLE', { url: urlValue }) // TS doesn't get that Entity.create returns a string
  return RichUtils.toggleLink(editorState, editorState.getSelection(), key)
}

const BGCODES = ['BG0', 'BG1', 'BG2', 'BG3', 'BG4', 'BG5']
const FGCODES = ['FG0', 'FG2', 'FG3', 'FG4', 'FG5']
const SIZES = ['S1', 'S2', 'S3', 'S4', 'S5']
const FAMS = ['F0', 'F1', 'F2']

function getEm(format) {
  if (/FG./.test(format)) return FGCODES
  if (/BG./.test(format)) return BGCODES
  if (/S./.test(format)) return SIZES
  if (/F./.test(format)) return FAMS
}

export const setStyle = (state, style) => {
  const REMOVES = getEm(style)
  const selection = state.getSelection()
  const nextContentState = REMOVES.reduce(
    (contentState, style) => removeInlineStyle(contentState, selection, style),
    state.getCurrentContent()
  )
  let newState = EditorState.push(state, nextContentState, 'change-inline-style')
  const currentStyle = state.getCurrentInlineStyle()
  if (selection.isCollapsed()) newState = currentStyle.reduce((state, color) => toggleInlineStyle(state, color), newState)
  if (!currentStyle.has(style)) newState = toggleInlineStyle(newState, style)
  return newState
}

export const findLinkEntities = (contentBlock, callback) => {
  contentBlock.findEntityRanges(
    character => {
      const entityKey = character.getEntity()
      if(entityKey === null) return false
      const entity = Entity.get(entityKey)
      return (entity.getType() === 'LINK')
    },
    callback
  )
}

// continue with subtracting the editor out of the main code
// have had to hack some of the defs because the typings are way out of date

export const findFieldEntities = (contentBlock, callback) => {
  contentBlock.findEntityRanges(
    character => {
      const entityKey = character.getEntity()
      if(!entityKey) return false
      const entity = Entity.get(entityKey)
      return (
        entity.getType() === 'FIELD'
      )
    },
    callback
  )
}

