import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Swal from 'sweetalert2'; // Still import Swal to use its mocked version
import { vi } from 'vitest';

import PaginaInicio from '../pages/paginaInicio';

// CORRECTED MOCK FOR SWEETALERT2
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(() => Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false })), // Mock returns a resolved Promise
  },
}));

const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

describe('PaginaInicio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // It's good practice to ensure the mocked Swal.fire is cleared too
    // even though vi.clearAllMocks() should cover it if it's a global mock.
    // For explicit control:
    vi.mocked(Swal.fire).mockClear();
  });

  test('renderiza el formulario de login correctamente', () => {
    render(
      <Router>
        <PaginaInicio />
      </Router>
    );

    expect(screen.getByText(/Login to your Account/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('muestra mensaje de error con credenciales incorrectas', async () => {
    render(
      <Router>
        <PaginaInicio />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'usuario' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'incorrecta' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledTimes(1);
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'Usuario o contraseña incorrectos',
      });
    });
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('redirecciona a /ventas con credenciales correctas', async () => {
    render(
      <Router>
        <PaginaInicio />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'admin123' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: '12345' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // In this specific test, if you want the .then() to actually resolve,
    // you might need to control the return value of Swal.fire for this test.
    // However, since the default mock now returns a resolved promise,
    // the .then() block will execute automatically.

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledTimes(1);
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Acceso concedido',
        text: 'Bienvenido a la plataforma',
        timer: 2000,
        showConfirmButton: false,
      });
    });

    // The navigate call happens inside the .then() block of Swal.fire.
    // Because our mock now resolves the promise, this waitFor will correctly
    // wait for the navigation to occur.
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/ventas');
    });
  });

  test('actualiza el estado de username al escribir', () => {
    render(
      <Router>
        <PaginaInicio />
      </Router>
    );
    const usernameInput = screen.getByPlaceholderText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    expect(usernameInput.value).toBe('testuser');
  });

  test('actualiza el estado de password al escribir', () => {
    render(
      <Router>
        <PaginaInicio />
      </Router>
    );
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    expect(passwordInput.value).toBe('testpass');
  });
});