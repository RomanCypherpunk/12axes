// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HighlightedQuestionText } from './QuestionTerms';

const terms = [
  { match: 'central bank', term: 'Central bank', definition: 'Manages the currency.' },
  { match: 'independence', term: 'Independence', definition: 'Decides without orders.' }
];

function renderText() {
  render(
    <h2>
      <HighlightedQuestionText questionId="q1" text="The central bank should lose its independence." terms={terms} />
    </h2>
  );
  return screen.getByRole('button', { name: 'central bank' });
}

const tooltip = () => screen.queryByRole('tooltip');
const settle = () => act(() => vi.advanceTimersByTime(200));

describe('HighlightedQuestionText', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('keeps the full question text and turns each term into a button', () => {
    renderText();

    expect(screen.getByRole('heading').textContent).toBe('The central bank should lose its independence.');
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(tooltip()).toBeNull();
  });

  it('shows the definition on hover and links it to the term', () => {
    const term = renderText();

    fireEvent.mouseEnter(term);

    expect(tooltip()?.textContent).toBe('Central bankManages the currency.');
    expect(term.getAttribute('aria-describedby')).toBe(tooltip()?.id);
  });

  it('hides after the pointer leaves, unless it moves onto the tooltip', () => {
    const term = renderText();

    fireEvent.mouseEnter(term);
    fireEvent.mouseLeave(term);
    fireEvent.mouseEnter(tooltip()!);
    settle();
    expect(tooltip()).not.toBeNull();

    fireEvent.mouseLeave(tooltip()!);
    settle();
    expect(tooltip()).toBeNull();
  });

  it('opens on keyboard focus and closes on blur', () => {
    const term = renderText();

    fireEvent.focus(term);
    expect(tooltip()).not.toBeNull();

    fireEvent.blur(term);
    settle();
    expect(tooltip()).toBeNull();
  });

  it('stays pinned after a tap until tapped again', () => {
    const term = renderText();

    fireEvent.click(term);
    fireEvent.mouseLeave(term);
    settle();
    expect(tooltip()).not.toBeNull();

    fireEvent.click(term);
    expect(tooltip()).toBeNull();
  });

  it('closes on Escape and on a tap outside, but not on a tap inside the tooltip', () => {
    const term = renderText();

    fireEvent.click(term);
    fireEvent.pointerDown(tooltip()!);
    expect(tooltip()).not.toBeNull();

    fireEvent.pointerDown(document.body);
    expect(tooltip()).toBeNull();

    fireEvent.click(term);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(tooltip()).toBeNull();
  });

  it('switches the tooltip to another term', () => {
    renderText();

    fireEvent.click(screen.getByRole('button', { name: 'central bank' }));
    fireEvent.pointerDown(screen.getByRole('button', { name: 'independence' }));
    fireEvent.click(screen.getByRole('button', { name: 'independence' }));

    expect(tooltip()?.textContent).toBe('IndependenceDecides without orders.');
  });
});
