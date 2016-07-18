import { ContentBlock, EditorState } from 'draft-js';
import { KeyCodes as KC } from '@trystal/keys';
export declare function bindings(keyCode: KC): string | undefined;
export declare function isPartialKey(keyCode: KC): boolean;
export declare function getSimpleBinding(keyCode: KC): string | null;
export declare function getCompoundBinding(partialKey: KC, keyCode: KC): string;
export declare const styleMap: {
    STRIKEOUT: {
        textDecoration: string;
    };
    FG0: {
        color: string;
    };
    FG2: {
        color: string | null;
    };
    FG3: {
        color: string | null;
    };
    FG4: {
        color: string | null;
    };
    FG5: {
        color: string | null;
    };
    BG0: {
        backgroundColor: null;
    };
    BG1: {
        backgroundColor: string | null;
    };
    BG2: {
        backgroundColor: string | null;
    };
    BG3: {
        backgroundColor: string | null;
    };
    BG4: {
        backgroundColor: string | null;
    };
    BG5: {
        backgroundColor: string | null;
    };
    F0: {
        fontFamily: string;
    };
    F1: {
        fontFamily: string;
    };
    F2: {
        fontFamily: string;
    };
    S1: {
        fontSize: string;
    };
    S2: {
        fontSize: string;
    };
    S3: {
        fontSize: string;
    };
    S4: {
        fontSize: string;
    };
    S5: {
        fontSize: string;
    };
};
export declare const addFieldReducer: (state: EditorState, formula: string) => EditorState;
export declare const addDefaultText: (editorState: EditorState, defaultText: string) => EditorState;
export declare const addLinkReducer: (editorState: EditorState, urlValue: string) => EditorState;
export declare const setStyle: (state: EditorState, style: string) => EditorState;
export interface CB1 {
    (start: number, end: number): void;
}
export declare const findLinkEntities: (contentBlock: ContentBlock, callback: CB1) => void;
export declare const findFieldEntities: (contentBlock: ContentBlock, callback: CB1) => void;
