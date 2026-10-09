import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkspaceDialog from './WorkspaceDialog';
import { TextField } from '@material-ui/core';
import { readFileSync } from 'fs';
import path from 'path';
import postcss from 'postcss';

test.each([false, true])('outlined labels stay bounded on pages and dialogs (dialog: %s)', inDialog => {
    const css = postcss.parse(readFileSync(path.join(__dirname, '../index.css'), 'utf8'));
    const style = document.createElement('style');
    const selectors = ['.MuiInputLabel-outlined', '.MuiInputLabel-outlined.MuiInputLabel-shrink'];
    css.walkRules(rule => { if (selectors.some(selector => rule.selectors.includes(selector))) style.textContent += rule.toString(); });
    document.head.appendChild(style);
    try {
        const label = 'Find action or customer';
        const field = <TextField id='bounded-label' variant='outlined' label={label} style={{ width: 180 }} />;
        render(inDialog ? <WorkspaceDialog open aria-label='Label fixture'>{field}</WorkspaceDialog> : field);
        const input = screen.getByRole('textbox', { name: label });
        const visibleLabel = screen.getByText(label, { selector: 'label' });
        const restingStyle = window.getComputedStyle(visibleLabel);
        expect(restingStyle.whiteSpace).toBe('nowrap');
        expect(restingStyle.overflow).toBe('hidden');
        expect(restingStyle.textOverflow).toBe('ellipsis');
        expect(restingStyle.maxWidth).toContain('100%');
        fireEvent.focus(input);
        expect(visibleLabel).toHaveClass('MuiInputLabel-shrink');
        expect(window.getComputedStyle(visibleLabel).maxWidth).toContain('133.333%');
        expect(input).toHaveAccessibleName(label);
        fireEvent.change(input, { target: { value: 'Customer search' } });
        fireEvent.blur(input);
        expect(visibleLabel).toHaveClass('MuiInputLabel-shrink');
    } finally { style.remove(); }
});

test.each(['standard', 'editor', 'invoice', 'document', 'operations', 'compact'])('uses the shared %s sizing without a competing Material UI width cap', size => {
    render(<WorkspaceDialog open size={size} className='custom-dialog' aria-label='Sizing fixture'><p>Dialog content</p></WorkspaceDialog>);
    const paper = screen.getByRole('dialog');
    expect(screen.getByLabelText('Sizing fixture')).toHaveClass(`workspace-dialog-${size}`, 'custom-dialog');
    expect(paper).toHaveClass('MuiDialog-paperFullWidth', 'MuiDialog-paperWidthFalse');
    expect(paper).not.toHaveClass('MuiDialog-paperWidthSm');
});

test('defaults to standard sizing and preserves Escape dismissal', () => {
    const onClose = jest.fn();
    render(<WorkspaceDialog open onClose={onClose} aria-label='Sizing fixture'><p>Dialog content</p></WorkspaceDialog>);
    const paper = screen.getByRole('dialog');
    expect(screen.getByLabelText('Sizing fixture')).toHaveClass('workspace-dialog-standard');
    fireEvent.keyDown(paper, { key: 'Escape', keyCode: 27 });
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'escapeKeyDown');
});

test('collapsed outlined-field legends cannot inherit dialog text wrapping', () => {
    const css = postcss.parse(readFileSync(path.join(__dirname, '../index.css'), 'utf8'));
    const style = document.createElement('style');
    const selectors = ['.workspace-dialog .MuiDialogContent-root', '.workspace-dialog .MuiOutlinedInput-root legend'];
    css.walkRules(rule => { if (selectors.some(selector => rule.selectors.includes(selector))) style.textContent += rule.toString(); });
    document.head.appendChild(style);
    try {
        render(<WorkspaceDialog open aria-label='Legend regression fixture'><div className='MuiDialogContent-root'><TextField variant='outlined' label='Internal preparation notes with a longer description' value='' onChange={() => {}} /></div></WorkspaceDialog>);
        const legendLabel = screen.getByText('Internal preparation notes with a longer description', { selector: 'legend > span' });
        expect(window.getComputedStyle(legendLabel).whiteSpace).toBe('nowrap');
        expect(window.getComputedStyle(legendLabel).overflowWrap).toBe('normal');
        expect(window.getComputedStyle(legendLabel).wordBreak).toBe('normal');
        expect(style.textContent).toContain('.workspace-dialog .MuiOutlinedInput-root legend');
    } finally { style.remove(); }
});
