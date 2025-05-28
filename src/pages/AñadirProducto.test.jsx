import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AñadirProducto from './AñadirProducto'; // RUTA CORREGIDA: Importación relativa al mismo directorio 'pages'

// Mockear el módulo react-router-dom para useNavigate
const mockedUseNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockedUseNavigate,
    };
});

// Mockear localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        removeItem: vi.fn((key) => {
            delete store[key];
        }),
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mockear fetch globalmente
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AñadirProducto', () => {
    // Limpiar los mocks antes de cada test
    beforeEach(() => {
        mockFetch.mockClear();
        mockedUseNavigate.mockClear();
        localStorageMock.clear();
        localStorageMock.setItem('token', 'fake-token'); // Simular que siempre hay un token
    });

    afterEach(() => {
        vi.restoreAllMocks(); // Restaura los mocks después de cada test
    });

    // Helper para renderizar el componente dentro de BrowserRouter
    const renderComponent = () => {
        render(
            <BrowserRouter>
                <AñadirProducto />
            </BrowserRouter>
        );
    };

    it('debe renderizarse correctamente y cargar categorías', async () => {
        // Definimos el comportamiento de fetch para este test específico
        mockFetch.mockResolvedValueOnce({ // Primera llamada: carga de categorías
            ok: true,
            json: async () => ({
                result: [
                    { ProductCategoryID: 1, Name: 'Category 1' },
                    { ProductCategoryID: 2, Name: 'Category 2' },
                ],
            }),
        });

        renderComponent();

        expect(screen.getByText('Añadir Nuevo Producto')).toBeInTheDocument();
        // Usar getByPlaceholderText para campos de texto con placeholder
        expect(screen.getByPlaceholderText(/Ej: Bicicleta de montaña/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Ej: BK-M82S-42/i)).toBeInTheDocument();
        
        // Para el select de categoría, usar getByRole combobox con el name del label
        expect(screen.getByRole('combobox', { name: /Categoría\*/i })).toBeInTheDocument();

        // Esperar a que las categorías se carguen y se muestren en el select
        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'Category 1 (ID: 1)' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'Category 2 (ID: 2)' })).toBeInTheDocument();
        });
    });

    it('debe mostrar mensaje de error si falla la carga de categorías', async () => {
        // Definimos el comportamiento de fetch para este test específico (falla la primera llamada)
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Failed to load categories' }),
        });

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('❌ Failed to load categories')).toBeInTheDocument();
        });
    });

    it('debe mostrar mensaje de error si el nombre del producto está vacío al enviar', async () => {
        mockFetch.mockResolvedValueOnce({ // Mock para la carga de categorías, para que el componente inicialice
            ok: true,
            json: async () => ({ result: [{ ProductCategoryID: 1, Name: 'Category 1' }] }),
        });

        renderComponent();

        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'Category 1 (ID: 1)' })).toBeInTheDocument();
        });

        // Dejar el campo 'Name' vacío intencionalmente
        fireEvent.change(screen.getByPlaceholderText(/Ej: BK-M82S-42/i), { target: { value: 'PN123' } });
        fireEvent.change(screen.getByRole('combobox', { name: /Categoría\*/i }), { target: { value: '1' } });
        fireEvent.change(screen.getByRole('textbox', { name: /Fecha de Inicio de Venta\*/i }), { target: { value: '2025-01-01' } }); // Asegurarse de rellenar la fecha

        fireEvent.click(screen.getByRole('button', { name: /Guardar Producto/i }));

        await waitFor(() => {
            expect(screen.getByText('⚠️ El nombre del producto es obligatorio')).toBeInTheDocument();
        });
        // Asegurarse de que no se hizo la llamada POST al endpoint de productos
        expect(mockFetch).toHaveBeenCalledTimes(1); // Solo la llamada a categorías
    });

    it('debe mostrar mensaje de error si el número de producto está vacío al enviar', async () => {
        mockFetch.mockResolvedValueOnce({ // Mock para la carga de categorías
            ok: true,
            json: async () => ({ result: [{ ProductCategoryID: 1, Name: 'Category 1' }] }),
        });

        renderComponent();

        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'Category 1 (ID: 1)' })).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/Ej: Bicicleta de montaña/i), { target: { value: 'Test Product' } });
        // Dejar el campo 'ProductNumber' vacío
        fireEvent.change(screen.getByRole('combobox', { name: /Categoría\*/i }), { target: { value: '1' } });
        fireEvent.change(screen.getByRole('textbox', { name: /Fecha de Inicio de Venta\*/i }), { target: { value: '2025-01-01' } }); // Asegurarse de rellenar la fecha
        
        fireEvent.click(screen.getByRole('button', { name: /Guardar Producto/i }));

        await waitFor(() => {
            expect(screen.getByText('⚠️ El número de producto es obligatorio')).toBeInTheDocument();
        });
        expect(mockFetch).toHaveBeenCalledTimes(1); // Solo la llamada a categorías
    });

    it('debe mostrar mensaje de error si no se selecciona una categoría', async () => {
        mockFetch.mockResolvedValueOnce({ // Mock para la carga de categorías
            ok: true,
            json: async () => ({ result: [{ ProductCategoryID: 1, Name: 'Category 1' }] }),
        });

        renderComponent();

        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'Category 1 (ID: 1)' })).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/Ej: Bicicleta de montaña/i), { target: { value: 'Test Product' } });
        fireEvent.change(screen.getByPlaceholderText(/Ej: BK-M82S-42/i), { target: { value: 'PN123' } });
        // No seleccionar categoría (queda en el valor inicial vacío)
        fireEvent.change(screen.getByRole('textbox', { name: /Fecha de Inicio de Venta\*/i }), { target: { value: '2025-01-01' } }); // Asegurarse de rellenar la fecha

        fireEvent.click(screen.getByRole('button', { name: /Guardar Producto/i }));

        await waitFor(() => {
            expect(screen.getByText('⚠️ Debe seleccionar una categoría')).toBeInTheDocument();
        });
        expect(mockFetch).toHaveBeenCalledTimes(1); // Solo la llamada a categorías
    });

    it('debe mostrar mensaje de error si un campo numérico es negativo', async () => {
        mockFetch.mockResolvedValueOnce({ // Mock para la carga de categorías
            ok: true,
            json: async () => ({ result: [{ ProductCategoryID: 1, Name: 'Category 1' }] }),
        });

        renderComponent();

        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'Category 1 (ID: 1)' })).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/Ej: Bicicleta de montaña/i), { target: { value: 'Test Product' } });
        fireEvent.change(screen.getByPlaceholderText(/Ej: BK-M82S-42/i), { target: { value: 'PN123' } });
        fireEvent.change(screen.getByRole('combobox', { name: /Categoría\*/i }), { target: { value: '1' } });
        // Usamos getByPlaceholderText para "Costo Estándar"
        fireEvent.change(screen.getByPlaceholderText('0.00', { name: 'StandardCost' }), { target: { value: '-10' } }); // Valor negativo
        fireEvent.change(screen.getByRole('textbox', { name: /Fecha de Inicio de Venta\*/i }), { target: { value: '2025-01-01' } }); // Asegurarse de rellenar la fecha

        fireEvent.click(screen.getByRole('button', { name: /Guardar Producto/i }));

        await waitFor(() => {
            expect(screen.getByText('⚠️ El valor de StandardCost no puede ser negativo')).toBeInTheDocument();
        });
        expect(mockFetch).toHaveBeenCalledTimes(1); // Solo la llamada a categorías
    });

    it('debe llamar a la API y resetear el formulario en caso de éxito', async () => {
        // Aquí encadenamos los mocks para las dos llamadas de fetch
        mockFetch
            .mockResolvedValueOnce({ // Primera llamada: carga de categorías
                ok: true,
                json: async () => ({
                    result: [{ ProductCategoryID: 1, Name: 'Category 1' }],
                }),
            })
            .mockResolvedValueOnce({ // Segunda llamada: envío del formulario (POST)
                ok: true,
                json: async () => ({ message: 'Producto creado correctamente' }),
            });

        renderComponent();

        // Esperar a que las categorías se carguen
        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'Category 1 (ID: 1)' })).toBeInTheDocument();
        });

        // Rellenar el formulario usando los selectores correctos
        fireEvent.change(screen.getByPlaceholderText(/Ej: Bicicleta de montaña/i), { target: { value: 'Nuevo Producto Test' } });
        fireEvent.change(screen.getByPlaceholderText(/Ej: BK-M82S-42/i), { target: { value: 'NPT-001' } });
        fireEvent.change(screen.getByPlaceholderText(/Ej: Rojo/i), { target: { value: 'Azul' } });
        fireEvent.change(screen.getByPlaceholderText('0.00', { name: 'StandardCost' }), { target: { value: '100.50' } });
        fireEvent.change(screen.getByPlaceholderText('0.00', { name: 'ListPrice' }), { target: { value: '150.75' } });
        fireEvent.change(screen.getByPlaceholderText(/Ej: M/i), { target: { value: 'M' } }); // Para Size, el placeholder es 'Ej: M'
        fireEvent.change(screen.getByPlaceholderText(/Opcional \(ej: 12.5\)/i), { target: { value: '5.2' } });
        fireEvent.change(screen.getByRole('combobox', { name: /Categoría\*/i }), { target: { value: '1' } }); // Seleccionar la categoría
        fireEvent.change(screen.getByPlaceholderText(/Opcional/i, { name: 'ProductModelID' }), { target: { value: 'MODEL-XYZ' } });
        fireEvent.change(screen.getByRole('textbox', { name: /Fecha de Inicio de Venta\*/i }), { target: { value: '2025-01-01' } });


        fireEvent.click(screen.getByRole('button', { name: /Guardar Producto/i }));

        // Esperar a que la llamada a la API se haya completado
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(2); // Una para categorías, otra para el post
            expect(mockFetch).toHaveBeenCalledWith(
                'http://localhost:3000/api/products',
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer fake-token',
                    },
                    body: JSON.stringify({
                        Name: 'Nuevo Producto Test',
                        ProductNumber: 'NPT-001',
                        Color: 'Azul',
                        StandardCost: 100.50,
                        ListPrice: 150.75,
                        Size: 'M',
                        Weight: 5.2,
                        ProductCategoryID: 1,
                        ProductModelID: 'MODEL-XYZ',
                        SellStartDate: '2025-01-01',
                    }),
                })
            );
        });

        // Verificar el mensaje de éxito
        expect(screen.getByText('✅ Producto creado correctamente')).toBeInTheDocument();

        // Verificar que el formulario se ha reseteado
        expect(screen.getByPlaceholderText(/Ej: Bicicleta de montaña/i)).toHaveValue('');
        expect(screen.getByPlaceholderText(/Ej: BK-M82S-42/i)).toHaveValue('');
        expect(screen.getByPlaceholderText('0.00', { name: 'StandardCost' })).toHaveValue('0');
        expect(screen.getByPlaceholderText('0.00', { name: 'ListPrice' })).toHaveValue('0');
        expect(screen.getByRole('combobox', { name: /Categoría\*/i })).toHaveValue(''); // El select se resetea al valor vacío
        expect(screen.getByPlaceholderText(/Ej: Rojo/i)).toHaveValue(''); // Limpiamos también el color
        expect(screen.getByPlaceholderText(/Ej: M/i)).toHaveValue(''); // Limpiamos el tamaño
        expect(screen.getByPlaceholderText(/Opcional \(ej: 12.5\)/i)).toHaveValue(''); // Limpiamos el peso
        expect(screen.getByPlaceholderText(/Opcional/i, { name: 'ProductModelID' })).toHaveValue(''); // Limpiamos el modelo ID
        expect(screen.getByRole('textbox', { name: /Fecha de Inicio de Venta\*/i })).toHaveValue(''); // Limpiamos la fecha
    });

    it('debe manejar errores de la API al crear producto', async () => {
        mockFetch
            .mockResolvedValueOnce({ // Mock para la carga de categorías
                ok: true,
                json: async () => ({
                    result: [{ ProductCategoryID: 1, Name: 'Category 1' }],
                }),
            })
            .mockResolvedValueOnce({ // Mock para el envío del formulario con error
                ok: false,
                json: async () => ({ message: 'Failed to create product' }),
            });

        renderComponent();

        // Esperar a que las categorías se carguen
        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'Category 1 (ID: 1)' })).toBeInTheDocument();
        });

        // Rellenar el formulario mínimamente para que pase la validación del cliente
        fireEvent.change(screen.getByPlaceholderText(/Ej: Bicicleta de montaña/i), { target: { value: 'Product Name' } });
        fireEvent.change(screen.getByPlaceholderText(/Ej: BK-M82S-42/i), { target: { value: 'PN-001' } });
        fireEvent.change(screen.getByRole('combobox', { name: /Categoría\*/i }), { target: { value: '1' } });
        fireEvent.change(screen.getByRole('textbox', { name: /Fecha de Inicio de Venta\*/i }), { target: { value: '2025-01-01' } }); // Asegurarse de rellenar la fecha

        fireEvent.click(screen.getByRole('button', { name: /Guardar Producto/i }));

        await waitFor(() => {
            expect(screen.getByText('❌ Failed to create product')).toBeInTheDocument();
        });

        // El formulario no debería resetearse si hay un error
        expect(screen.getByPlaceholderText(/Ej: Bicicleta de montaña/i)).toHaveValue('Product Name');
    });

    it('debe llamar a navigate(-1) al hacer clic en el botón "Volver"', async () => {
        mockFetch.mockResolvedValueOnce({ // Mock para la carga de categorías
            ok: true,
            json: async () => ({ result: [] }), // No importa si hay categorías para este test
        });

        renderComponent();

        // Esperar a que el componente cargue las categorías (aunque esté vacío)
        await waitFor(() => {
             expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        const backButton = screen.getByRole('button', { name: /Volver/i });
        fireEvent.click(backButton);

        expect(mockedUseNavigate).toHaveBeenCalledWith(-1);
    });

    it('handleNumberChange debe permitir solo números y un punto decimal', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ result: [] }) });
        renderComponent();

        // Usamos getByPlaceholderText para "Costo Estándar"
        const standardCostInput = screen.getByPlaceholderText('0.00', { name: 'StandardCost' });

        fireEvent.change(standardCostInput, { target: { value: 'abc123def.45.6' } });
        expect(standardCostInput).toHaveValue('123.45'); // Solo números y un punto

        // Tu lógica de handleChange actual con `replace(/[^0-9.]/g, '')` y `split('.').slice(0, 2).join('.')`
        // significa que si empiezas con un punto, o si hay un punto seguido de más texto no numérico,
        // el valor puede ser extraño.
        // Si el valor empieza con '.', replace lo deja. Pero luego `slice(0, 2).join('.')` lo mantiene.
        // Revisa la lógica de tu `handleChange` para el caso de '.123'
        // Si la intención es que '.123' se convierta en '0.123' o simplemente que se limpie si no hay números,
        // tu implementación actual (`replace(/[^0-9.]/g, '')` seguida de `split('.').slice(0, 2).join('.')`)
        // dejaría '.123' como '.123'.

        // Para este test, voy a asumir que tu `handleChange` funciona como lo hace con `replace`.
        // Si la intención es que '.123' sea '0.123', tu handleChange necesitaría una pequeña corrección
        // (e.g., `if (value.startsWith('.')) value = '0' + value;`).

        fireEvent.change(standardCostInput, { target: { value: '.123' } });
        expect(standardCostInput).toHaveValue('.123'); // Tu regex actual lo permite

        fireEvent.change(standardCostInput, { target: { value: '123' } });
        expect(standardCostInput).toHaveValue('123');

        fireEvent.change(standardCostInput, { target: { value: '123.' } });
        expect(standardCostInput).toHaveValue('123.');

        fireEvent.change(standardCostInput, { target: { value: '123.45' } });
        expect(standardCostInput).toHaveValue('123.45');
    });

    it('el botón de guardar debe deshabilitarse durante la carga y habilitarse después', async () => {
        mockFetch
            .mockResolvedValueOnce({ // Mock para la carga de categorías
                ok: true,
                json: async () => ({ result: [{ ProductCategoryID: 1, Name: 'Category 1' }] }),
            })
            .mockImplementationOnce(url => { // Mock para el envío del formulario (simular retardo)
                if (url.includes('/products')) {
                    return new Promise(resolve =>
                        setTimeout(() =>
                            resolve({
                                ok: true,
                                json: async () => ({ message: 'Producto creado correctamente' }),
                            }),
                            100 // Retardo para simular la carga
                        )
                    );
                }
                // Fallback para otras llamadas fetch si las hubiera, aunque para este test no se esperan otras.
                return Promise.reject(new Error('Unexpected fetch call'));
            });

        renderComponent();

        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'Category 1 (ID: 1)' })).toBeInTheDocument();
        });

        // Rellenar mínimamente el formulario para que la validación pase
        fireEvent.change(screen.getByPlaceholderText(/Ej: Bicicleta de montaña/i), { target: { value: 'Product' } });
        fireEvent.change(screen.getByPlaceholderText(/Ej: BK-M82S-42/i), { target: { value: 'PN' } });
        fireEvent.change(screen.getByRole('combobox', { name: /Categoría\*/i }), { target: { value: '1' } });
        fireEvent.change(screen.getByRole('textbox', { name: /Fecha de Inicio de Venta\*/i }), { target: { value: '2025-01-01' } });

        const saveButton = screen.getByRole('button', { name: /Guardar Producto/i });
        fireEvent.click(saveButton);

        expect(saveButton).toBeDisabled();
        expect(saveButton).toHaveTextContent('Guardando...');

        await waitFor(() => {
            expect(saveButton).not.toBeDisabled();
            expect(saveButton).toHaveTextContent('Guardar Producto');
            expect(screen.getByText('✅ Producto creado correctamente')).toBeInTheDocument();
        });
    });

    it('debe mostrar mensaje de error si la fecha de inicio de venta está vacía', async () => {
        mockFetch.mockResolvedValueOnce({ 
            ok: true,
            json: async () => ({ result: [{ ProductCategoryID: 1, Name: 'Category 1' }] }),
        });

        renderComponent();

        await waitFor(() => {
            expect(screen.getByRole('option', { name: 'Category 1 (ID: 1)' })).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/Ej: Bicicleta de montaña/i), { target: { value: 'Test Product' } });
        fireEvent.change(screen.getByPlaceholderText(/Ej: BK-M82S-42/i), { target: { value: 'PN123' } });
        fireEvent.change(screen.getByRole('combobox', { name: /Categoría\*/i }), { target: { value: '1' } });
        // Dejar la fecha de inicio de venta vacía
        fireEvent.change(screen.getByRole('textbox', { name: /Fecha de Inicio de Venta\*/i }), { target: { value: '' } });

        fireEvent.click(screen.getByRole('button', { name: /Guardar Producto/i }));

        await waitFor(() => {
            expect(screen.getByText('⚠️ La fecha de inicio de venta es obligatoria')).toBeInTheDocument();
        });
        expect(mockFetch).toHaveBeenCalledTimes(1); // Solo la llamada a categorías
    });

});