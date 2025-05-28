import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useNavigate } from "react-router-dom";
import AñadirProducto, {
  API_BASE_URL,
  initialFormState,
  validateFormData,
} from "../pages/AñadirProducto";

// Mocks
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

// Mock para fetch
global.fetch = vi.fn();

describe("AñadirProducto Component", () => {
  const mockNavigate = vi.fn();
  const mockCategories = [
    { ProductCategoryID: 1, Name: "Bicicletas" },
    { ProductCategoryID: 2, Name: "Componentes" },
  ];

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    localStorage.setItem("token", "test-token");
    fetch.mockReset();
  });

  test("renders the form correctly", () => {
    render(<AñadirProducto />);
    
    expect(screen.getByText("Añadir Nuevo Producto")).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre del Producto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Número de Producto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Color/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Costo Estándar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Precio de Venta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tamaño/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Peso/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Modelo ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha de Inicio de Venta/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Guardar Producto/i })).toBeInTheDocument();
  });

  test("validates form data correctly", () => {
    // Test required fields
    let formData = { ...initialFormState };
    expect(validateFormData(formData)).toBe("⚠️ El nombre del producto es obligatorio");

    formData.Name = "Test Product";
    expect(validateFormData(formData)).toBe("⚠️ El número de producto es obligatorio");

    formData.ProductNumber = "TEST-123";
    expect(validateFormData(formData)).toBe("⚠️ Debe seleccionar una categoría");

    formData.ProductCategoryID = "1";
    expect(validateFormData(formData)).toBeNull();

    // Test numeric fields
    formData.StandardCost = "-10";
    expect(validateFormData(formData)).toBe("⚠️ El valor de StandardCost no puede ser negativo");

    formData.StandardCost = "10";
    formData.ListPrice = "-5";
    expect(validateFormData(formData)).toBe("⚠️ El valor de ListPrice no puede ser negativo");

    formData.ListPrice = "5";
    formData.Weight = "-1";
    expect(validateFormData(formData)).toBe("⚠️ El valor de Weight no puede ser negativo");
  });

  test("handles input changes correctly", () => {
    render(<AñadirProducto />);
    
    const nameInput = screen.getByLabelText(/Nombre del Producto/i);
    fireEvent.change(nameInput, { target: { name: "Name", value: "New Product" } });
    expect(nameInput.value).toBe("New Product");

    const costInput = screen.getByLabelText(/Costo Estándar/i);
    fireEvent.change(costInput, { target: { name: "StandardCost", value: "10.50" } });
    expect(costInput.value).toBe("10.50");

    // Test invalid number input
    fireEvent.change(costInput, { target: { name: "StandardCost", value: "abc" } });
    expect(costInput.value).toBe("");
  });

  test("fetches categories on mount", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: mockCategories }),
    });

    render(<AñadirProducto />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/products/categories`, {
        headers: {
          Authorization: "Bearer test-token",
        },
      });
    });

    const categorySelect = screen.getByLabelText(/Categoría/i);
    expect(categorySelect).toHaveTextContent("Bicicletas (ID: 1)");
    expect(categorySelect).toHaveTextContent("Componentes (ID: 2)");
  });

  test("shows error message when categories fetch fails", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<AñadirProducto />);

    await waitFor(() => {
      expect(screen.getByText(/❌ Network error/)).toBeInTheDocument();
    });
  });

  test("submits the form successfully", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: mockCategories }),
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Product created" }),
    });

    render(<AñadirProducto />);

    // Wait for categories to load
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/products/categories`, expect.anything());
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Nombre del Producto/i), {
      target: { name: "Name", value: "Test Product" },
    });
    fireEvent.change(screen.getByLabelText(/Número de Producto/i), {
      target: { name: "ProductNumber", value: "TEST-123" },
    });
    fireEvent.change(screen.getByLabelText(/Categoría/i), {
      target: { name: "ProductCategoryID", value: "1" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Guardar Producto/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        },
        body: JSON.stringify({
          Name: "Test Product",
          ProductNumber: "TEST-123",
          Color: null,
          StandardCost: 0,
          ListPrice: 0,
          Size: null,
          Weight: null,
          ProductCategoryID: 1,
          ProductModelID: null,
          SellStartDate: initialFormState.SellStartDate,
        }),
      });
    });

    expect(screen.getByText("✅ Producto creado correctamente")).toBeInTheDocument();
  });

  test("shows error message when form submission fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: mockCategories }),
    });

    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Error creating product" }),
    });

    render(<AñadirProducto />);

    // Wait for categories to load
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/products/categories`, expect.anything());
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Nombre del Producto/i), {
      target: { name: "Name", value: "Test Product" },
    });
    fireEvent.change(screen.getByLabelText(/Número de Producto/i), {
      target: { name: "ProductNumber", value: "TEST-123" },
    });
    fireEvent.change(screen.getByLabelText(/Categoría/i), {
      target: { name: "ProductCategoryID", value: "1" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Guardar Producto/i }));

    await waitFor(() => {
      expect(screen.getByText(/❌ Error creating product/)).toBeInTheDocument();
    });
  });

  test("navigates back when back button is clicked", () => {
    render(<AñadirProducto />);
    fireEvent.click(screen.getByText("Volver"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});