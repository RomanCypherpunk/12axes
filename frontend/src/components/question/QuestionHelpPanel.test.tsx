// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { t } from '../../i18n';
import { QuestionHelpPanel } from './QuestionHelpPanel';

const help = {
  simple: 'Should the president run the bank?',
  example: { agree: 'The bank obeys.', disagree: 'The bank decides alone.' },
  terms: []
};

describe('QuestionHelpPanel', () => {
  afterEach(cleanup);

  it('starts closed and does not point aria-controls at a missing panel', () => {
    render(<QuestionHelpPanel questionId="q1" help={help} />);
    const toggle = screen.getByRole('button', { name: t.helpShow });

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.hasAttribute('aria-controls')).toBe(false);
    expect(screen.queryByText(help.simple)).toBeNull();
  });

  it('opens the simple explanation and both example sides', () => {
    render(<QuestionHelpPanel questionId="q1" help={help} />);

    fireEvent.click(screen.getByRole('button', { name: t.helpShow }));
    const toggle = screen.getByRole('button', { name: t.helpHide });

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById(toggle.getAttribute('aria-controls')!)).not.toBeNull();
    expect(screen.getByText(help.simple)).toBeTruthy();
    expect(screen.getByText(help.example.agree)).toBeTruthy();
    expect(screen.getByText(help.example.disagree)).toBeTruthy();
  });

  it('omits the examples when the question has none', () => {
    render(<QuestionHelpPanel questionId="q1" help={{ ...help, example: null }} />);

    fireEvent.click(screen.getByRole('button', { name: t.helpShow }));

    expect(screen.getByText(help.simple)).toBeTruthy();
    expect(screen.queryByText(t.helpAgreeLabel)).toBeNull();
  });

  it('closes again on a second click', () => {
    render(<QuestionHelpPanel questionId="q1" help={help} />);

    fireEvent.click(screen.getByRole('button', { name: t.helpShow }));
    fireEvent.click(screen.getByRole('button', { name: t.helpHide }));

    expect(screen.queryByText(help.simple)).toBeNull();
  });
});
