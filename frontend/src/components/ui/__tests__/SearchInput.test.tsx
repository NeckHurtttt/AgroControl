import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import SearchInput from '../SearchInput';

describe('SearchInput', () => {
  it('tiene label visible y avisa cada cambio con onChange', async () => {
    const onChange = vi.fn();
    function Controlado() {
      const [valor, setValor] = useState('');
      return (
        <SearchInput
          label="Buscar predio"
          value={valor}
          onChange={(nuevo) => {
            setValor(nuevo);
            onChange(nuevo);
          }}
        />
      );
    }
    render(<Controlado />);

    const input = screen.getByLabelText('Buscar predio');
    await userEvent.type(input, 'San');

    expect(onChange).toHaveBeenLastCalledWith('San');
    expect(input).toHaveValue('San');
  });
});
