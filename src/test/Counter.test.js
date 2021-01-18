import { getAllByTestId, getByTestId, render, screen, act } from '@testing-library/react';
import Counter from '../components/home/Counter';

describe('Rendering a player one counter', () => {
    test('to see if a player 1 counter is return', () => {
        const { container } = render(<Counter state={1}/>);
        const counter = getByTestId(container, "player1");
        expect(counter.innerHTML).toBe("");
        expect(counter.className).toBe("circle red center");
    })

    test('to see if a player 1 counter with a king is return', () => {
        const { container } = render(<Counter state={3}/>);
        const counter = getByTestId(container, "player1king");
        expect(counter.innerHTML).toBe("K");
        expect(counter.className).toBe("circle red center");
    })
});
