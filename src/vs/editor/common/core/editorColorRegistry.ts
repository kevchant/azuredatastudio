/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from 'vs/nls';
import { Color, RGBA } from 'vs/base/common/color';
import { activeContrastBorder, editorBackground, registerColor, editorWarningForeground, editorInfoForeground, editorWarningBorder, editorInfoBorder, contrastBorder, editorFindMatchHighlight } from 'vs/platform/theme/common/colorRegistry';
import { registerThemingParticipant } from 'vs/platform/theme/common/themeService';

/**
 * Definition of the editor colors
 */
export const editorLineHighlight = registerColor('editor.lineHighlightBackground', { dark: null, light: null, hcDark: null, hcLight: null }, nls.localize('lineHighlight', 'Background color for the highlight of line at the cursor position.'));
export const editorLineHighlightBorder = registerColor('editor.lineHighlightBorder', { dark: '#282828', light: '#eeeeee', hcDark: '#f38518', hcLight: contrastBorder }, nls.localize('lineHighlightBorderBox', 'Background color for the border around the line at the cursor position.'));
export const editorRangeHighlight = registerColor('editor.rangeHighlightBackground', { dark: '#ffffff0b', light: '#fdff0033', hcDark: null, hcLight: null }, nls.localize('rangeHighlight', 'Background color of highlighted ranges, like by quick open and find features. The color must not be opaque so as not to hide underlying decorations.'), true);
export const editorRangeHighlightBorder = registerColor('editor.rangeHighlightBorder', { dark: null, light: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder }, nls.localize('rangeHighlightBorder', 'Background color of the border around highlighted ranges.'), true);
export const editorSymbolHighlight = registerColor('editor.symbolHighlightBackground', { dark: editorFindMatchHighlight, light: editorFindMatchHighlight, hcDark: null, hcLight: null }, nls.localize('symbolHighlight', 'Background color of highlighted symbol, like for go to definition or go next/previous symbol. The color must not be opaque so as not to hide underlying decorations.'), true);
export const editorSymbolHighlightBorder = registerColor('editor.symbolHighlightBorder', { dark: null, light: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder }, nls.localize('symbolHighlightBorder', 'Background color of the border around highlighted symbols.'), true);

export const editorCursorForeground = registerColor('editorCursor.foreground', { dark: '#AEAFAD', light: Color.black, hcDark: Color.white, hcLight: '#0F4A85' }, nls.localize('caret', 'Color of the editor cursor.'));
export const editorCursorBackground = registerColor('editorCursor.background', null, nls.localize('editorCursorBackground', 'The background color of the editor cursor. Allows customizing the color of a character overlapped by a block cursor.'));
export const editorWhitespaces = registerColor('editorWhitespace.foreground', { dark: '#e3e4e229', light: '#33333333', hcDark: '#e3e4e229', hcLight: '#CCCCCC' }, nls.localize('editorWhitespaces', 'Color of whitespace characters in the editor.'));
export const editorIndentGuides = registerColor('editorIndentGuide.background', { dark: editorWhitespaces, light: editorWhitespaces, hcDark: editorWhitespaces, hcLight: editorWhitespaces }, nls.localize('editorIndentGuides', 'Color of the editor indentation guides.'));
export const editorActiveIndentGuides = registerColor('editorIndentGuide.activeBackground', { dark: editorWhitespaces, light: editorWhitespaces, hcDark: editorWhitespaces, hcLight: editorWhitespaces }, nls.localize('editorActiveIndentGuide', 'Color of the active editor indentation guides.'));
export const editorLineNumbers = registerColor('editorLineNumber.foreground', { dark: '#858585', light: '#237893', hcDark: Color.white, hcLight: '#292929' }, nls.localize('editorLineNumbers', 'Color of editor line numbers.'));

const deprecatedEditorActiveLineNumber = registerColor('editorActiveLineNumber.foreground', { dark: '#c6c6c6', light: '#0B216F', hcDark: activeContrastBorder, hcLight: activeContrastBorder }, nls.localize('editorActiveLineNumber', 'Color of editor active line number'), false, nls.localize('deprecatedEditorActiveLineNumber', 'Id is deprecated. Use \'editorLineNumber.activeForeground\' instead.'));
export const editorActiveLineNumber = registerColor('editorLineNumber.activeForeground', { dark: deprecatedEditorActiveLineNumber, light: deprecatedEditorActiveLineNumber, hcDark: deprecatedEditorActiveLineNumber, hcLight: deprecatedEditorActiveLineNumber }, nls.localize('editorActiveLineNumber', 'Color of editor active line number'));
export const editorDimmedLineNumber = registerColor('editorLineNumber.dimmedForeground', { dark: null, light: null, hcDark: null, hcLight: null }, nls.localize('editorDimmedLineNumber', 'Color of the final editor line when editor.renderFinalNewline is set to dimmed.'));

export const editorRuler = registerColor('editorRuler.foreground', { dark: '#5A5A5A', light: Color.lightgrey, hcDark: Color.white, hcLight: '#292929' }, nls.localize('editorRuler', 'Color of the editor rulers.'));

export const editorCodeLensForeground = registerColor('editorCodeLens.foreground', { dark: '#999999', light: '#919191', hcDark: '#999999', hcLight: '#292929' }, nls.localize('editorCodeLensForeground', 'Foreground color of editor CodeLens'));

export const editorBracketMatchBackground = registerColor('editorBracketMatch.background', { dark: '#0064001a', light: '#0064001a', hcDark: '#0064001a', hcLight: '#0000' }, nls.localize('editorBracketMatchBackground', 'Background color behind matching brackets'));
export const editorBracketMatchBorder = registerColor('editorBracketMatch.border', { dark: '#888', light: '#B9B9B9', hcDark: contrastBorder, hcLight: contrastBorder }, nls.localize('editorBracketMatchBorder', 'Color for matching brackets boxes'));

export const editorOverviewRulerBorder = registerColor('editorOverviewRuler.border', { dark: '#7f7f7f4d', light: '#7f7f7f4d', hcDark: '#7f7f7f4d', hcLight: '#666666' }, nls.localize('editorOverviewRulerBorder', 'Color of the overview ruler border.'));
export const editorOverviewRulerBackground = registerColor('editorOverviewRuler.background', null, nls.localize('editorOverviewRulerBackground', 'Background color of the editor overview ruler.'));

export const editorGutter = registerColor('editorGutter.background', { dark: editorBackground, light: editorBackground, hcDark: editorBackground, hcLight: editorBackground }, nls.localize('editorGutter', 'Background color of the editor gutter. The gutter contains the glyph margins and the line numbers.'));

export const editorUnnecessaryCodeBorder = registerColor('editorUnnecessaryCode.border', { dark: null, light: null, hcDark: Color.fromHex('#fff').transparent(0.8), hcLight: contrastBorder }, nls.localize('unnecessaryCodeBorder', 'Border color of unnecessary (unused) source code in the editor.'));
export const editorUnnecessaryCodeOpacity = registerColor('editorUnnecessaryCode.opacity', { dark: Color.fromHex('#000a'), light: Color.fromHex('#0007'), hcDark: null, hcLight: null }, nls.localize('unnecessaryCodeOpacity', 'Opacity of unnecessary (unused) source code in the editor. For example, "#000000c0" will render the code with 75% opacity. For high contrast themes, use the  \'editorUnnecessaryCode.border\' theme color to underline unnecessary code instead of fading it out.'));

export const ghostTextBorder = registerColor('editorGhostText.border', { dark: null, light: null, hcDark: Color.fromHex('#fff').transparent(0.8), hcLight: Color.fromHex('#292929').transparent(0.8) }, nls.localize('editorGhostTextBorder', 'Border color of ghost text in the editor.'));
export const ghostTextForeground = registerColor('editorGhostText.foreground', { dark: Color.fromHex('#ffffff56'), light: Color.fromHex('#0007'), hcDark: null, hcLight: null }, nls.localize('editorGhostTextForeground', 'Foreground color of the ghost text in the editor.'));
export const ghostTextBackground = registerColor('editorGhostText.background', { dark: null, light: null, hcDark: null, hcLight: null }, nls.localize('editorGhostTextBackground', 'Background color of the ghost text in the editor.'));

const rulerRangeDefault = new Color(new RGBA(0, 122, 204, 0.6));
export const overviewRulerRangeHighlight = registerColor('editorOverviewRuler.rangeHighlightForeground', { dark: rulerRangeDefault, light: rulerRangeDefault, hcDark: rulerRangeDefault, hcLight: rulerRangeDefault }, nls.localize('overviewRulerRangeHighlight', 'Overview ruler marker color for range highlights. The color must not be opaque so as not to hide underlying decorations.'), true);
export const overviewRulerError = registerColor('editorOverviewRuler.errorForeground', { dark: new Color(new RGBA(255, 18, 18, 0.7)), light: new Color(new RGBA(255, 18, 18, 0.7)), hcDark: new Color(new RGBA(255, 50, 50, 1)), hcLight: '#B5200D' }, nls.localize('overviewRuleError', 'Overview ruler marker color for errors.'));
export const overviewRulerWarning = registerColor('editorOverviewRuler.warningForeground', { dark: editorWarningForeground, light: editorWarningForeground, hcDark: editorWarningBorder, hcLight: editorWarningBorder }, nls.localize('overviewRuleWarning', 'Overview ruler marker color for warnings.'));
export const overviewRulerInfo = registerColor('editorOverviewRuler.infoForeground', { dark: editorInfoForeground, light: editorInfoForeground, hcDark: editorInfoBorder, hcLight: editorInfoBorder }, nls.localize('overviewRuleInfo', 'Overview ruler marker color for infos.'));

export const editorBracketHighlightingForeground1 = registerColor('editorBracketHighlight.foreground1', { dark: '#FFD700', light: '#0431FAFF', hcDark: '#FFD700', hcLight: '#0431FAFF' }, nls.localize('editorBracketHighlightForeground1', 'Foreground color of brackets (1). Requires enabling bracket pair colorization.'));
export const editorBracketHighlightingForeground2 = registerColor('editorBracketHighlight.foreground2', { dark: '#DA70D6', light: '#319331FF', hcDark: '#DA70D6', hcLight: '#319331FF' }, nls.localize('editorBracketHighlightForeground2', 'Foreground color of brackets (2). Requires enabling bracket pair colorization.'));
export const editorBracketHighlightingForeground3 = registerColor('editorBracketHighlight.foreground3', { dark: '#179FFF', light: '#7B3814FF', hcDark: '#87CEFA', hcLight: '#7B3814FF' }, nls.localize('editorBracketHighlightForeground3', 'Foreground color of brackets (3). Requires enabling bracket pair colorization.'));
export const editorBracketHighlightingForeground4 = registerColor('editorBracketHighlight.foreground4', { dark: '#00000000', light: '#00000000', hcDark: '#00000000', hcLight: '#00000000' }, nls.localize('editorBracketHighlightForeground4', 'Foreground color of brackets (4). Requires enabling bracket pair colorization.'));
export const editorBracketHighlightingForeground5 = registerColor('editorBracketHighlight.foreground5', { dark: '#00000000', light: '#00000000', hcDark: '#00000000', hcLight: '#00000000' }, nls.localize('editorBracketHighlightForeground5', 'Foreground color of brackets (5). Requires enabling bracket pair colorization.'));
export const editorBracketHighlightingForeground6 = registerColor('editorBracketHighlight.foreground6', { dark: '#00000000', light: '#00000000', hcDark: '#00000000', hcLight: '#00000000' }, nls.localize('editorBracketHighlightForeground6', 'Foreground color of brackets (6). Requires enabling bracket pair colorization.'));

export const editorBracketHighlightingUnexpectedBracketForeground = registerColor('editorBracketHighlight.unexpectedBracket.foreground', { dark: new Color(new RGBA(255, 18, 18, 0.8)), light: new Color(new RGBA(255, 18, 18, 0.8)), hcDark: new Color(new RGBA(255, 50, 50, 1)), hcLight: '' }, nls.localize('editorBracketHighlightUnexpectedBracketForeground', 'Foreground color of unexpected brackets.'));

export const editorBracketPairGuideBackground1 = registerColor('editorBracketPairGuide.background1', { dark: '#00000000', light: '#00000000', hcDark: '#00000000', hcLight: '#00000000' }, nls.localize('editorBracketPairGuide.background1', 'Background color of inactive bracket pair guides (1). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideBackground2 = registerColor('editorBracketPairGuide.background2', { dark: '#00000000', light: '#00000000', hcDark: '#00000000', hcLight: '#00000000' }, nls.localize('editorBracketPairGuide.background2', 'Background color of inactive bracket pair guides (2). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideBackground3 = registerColor('editorBracketPairGuide.background3', { dark: '#00000000', light: '#00000000', hcDark: '#00000000', hcLight: '#00000000' }, nls.localize('editorBracketPairGuide.background3', 'Background color of inactive bracket pair guides (3). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideBackground4 = registerColor('editorBracketPairGuide.background4', { dark: '#00000000', light: '#00000000', hcDark: '#00000000', hcLight: '#00000000' }, nls.localize('editorBracketPairGuide.background4', 'Background color of inactive bracket pair guides (4). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideBackground5 = registerColor('editorBracketPairGuide.background5', { dark: '#00000000', light: '#00000000', hcDark: '#00000000', hcLight: '#00000000' }, nls.localize('editorBracketPairGuide.background5', 'Background color of inactive bracket pair guides (5). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideBackground6 = registerColor('editorBracketPairGuide.background6', { dark: '#00000000', light: '#00000000', hcDark: '#00000000', hcLight: '#00000000' }, nls.localize('editorBracketPairGuide.background6', 'Background color of inactive bracket pair guides (6). Requires enabling bracket pair guides.'));

export const editorBracketPairGuideActiveBackground1 = registerColor('editorBracketPairGuide.activeBackground1', { dark: '#00000000', light: '#00000000', hcDark: '#00000000', hcLight: '#00000000' }, nls.localize('editorBracketPairGuide.activeBackground1', 'Background color of active bracket pair guides (1). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideActiveBackground2 = registerColor('editorBracketPairGuide.activeBackground2', { dark: '#00000000', light: '#00000000', hcDark: '#00000000', hcLight: '#00000000' }, nls.localize('editorBracketPairGuide.activeBackground2', 'Background color of active bracket pair guides (2). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideActiveBackground3 = registerColor('editorBracketPairGuide.activeBackground3', { dark: '#00000000', light: '#00000000', hcDark: '#00000000', hcLight: '#00000000' }, nls.localize('editorBracketPairGuide.activeBackground3', 'Background color of active bracket pair guides (3). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideActiveBackground4 = registerColor('editorBracketPairGuide.activeBackground4', { dark: '#00000000', light: '#00000000', hcDark: '#00000000', hcLight: '#00000000' }, nls.localize('editorBracketPairGuide.activeBackground4', 'Background color of active bracket pair guides (4). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideActiveBackground5 = registerColor('editorBracketPairGuide.activeBackground5', { dark: '#00000000', light: '#00000000', hcDark: '#00000000', hcLight: '#00000000' }, nls.localize('editorBracketPairGuide.activeBackground5', 'Background color of active bracket pair guides (5). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideActiveBackground6 = registerColor('editorBracketPairGuide.activeBackground6', { dark: '#00000000', light: '#00000000', hcDark: '#00000000', hcLight: '#00000000' }, nls.localize('editorBracketPairGuide.activeBackground6', 'Background color of active bracket pair guides (6). Requires enabling bracket pair guides.'));

export const editorUnicodeHighlightBorder = registerColor('editorUnicodeHighlight.border', { dark: '#BD9B03', light: '#CEA33D', hcDark: '#ff0000', hcLight: '#CEA33D' }, nls.localize('editorUnicodeHighlight.border', 'Border color used to highlight unicode characters.'));
export const editorUnicodeHighlightBackground = registerColor('editorUnicodeHighlight.background', { dark: '#bd9b0326', light: '#cea33d14', hcDark: '#00000000', hcLight: '#cea33d14' }, nls.localize('editorUnicodeHighlight.background', 'Background color used to highlight unicode characters.'));


// contains all color rules that used to defined in editor/browser/widget/editor.css
registerThemingParticipant((theme, collector) => {
	const background = theme.getColor(editorBackground);
	const lineHighlight = theme.getColor(editorLineHighlight);
	const imeBackground = (lineHighlight && !lineHighlight.isTransparent() ? lineHighlight : background);
	if (imeBackground) {
		collector.addRule(`.monaco-editor .inputarea.ime-input { background-color: ${imeBackground}; }`);
	}
});
