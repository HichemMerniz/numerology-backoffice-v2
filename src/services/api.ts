import { API_BASE_URL } from "@/config/api";

// Register User
export const registerUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
};

// Login User
export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
};

// Fetch Numerology Data
export const getNumerologyData = async (
  token: string,
  data: {
    lastName: string;
    firstName: string;
    middleNames: string[];
    birthDate: string;
    maritalName?: string;
    usedFirstName?: string;
    carriedNameFor25Years?: boolean;
  }
) => {
  const response = await fetch(`${API_BASE_URL}/api/calculations/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch numerology data");
  }

  return response.json();
};

// Generate PDF Report
export const generateNumerologyPDF = async (
  token: string,
  name?: string,
  dob?: string,
  id?: string
) => {
  const response = await fetch(`${API_BASE_URL}/api/pdf/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, dob, id }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate PDF");
  }

  const data = await response.json();

  if (!data.success || !data.file) {
    throw new Error("Invalid response from PDF generation");
  }

  // Extract the filename - this could be a UUID or another format
  let filename;

  // Handle UUID format if present in the response
  if (data.pdfUrl) {
    filename = data.pdfUrl;
  } else {
    // Extract filename from path as fallback
    filename = data.file.split("/").pop() || data.file.split("\\").pop();

    // Remove any path traversal attempts
    filename = filename.replace(/\.\.\//g, "").replace(/\.\.\\/g, "");

    // Only keep the base filename without any path components
    filename = filename.split("/").pop() || filename.split("\\").pop();
  }

  // Create the download URL with the correct format
  const downloadUrl = `${API_BASE_URL}/api/pdf/download/${id}.pdf`;

  return {
    downloadUrl,
    // filename: filename || `numerology-report-${name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
  };
};

// Fetch Numerology History
export const getNumerologyHistory = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/numerology/history`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch numerology history");
  }

  return response.json();
};

// Get History Entry Details
export const getHistoryDetails = async (token: string, historyId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/numerology/history/${historyId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch history details");
  }

  return response.json();
};

/**
 * Delete a numerology reading by ID
 * @param id - The ID of the numerology reading to delete
 * @returns A promise that resolves when the reading is deleted
 */
export const deleteNumerologyReading = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/numerology/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete numerology reading");
  }

  return;
};

/**
 * Get paginated numerology readings history
 * @param page - The page number to fetch
 * @param limit - The number of items per page
 * @returns A promise that resolves to the paginated data
 */
export const getNumerologyReadingsHistory = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  readings: any[];
  totalPages: number;
  currentPage: number;
  totalReadings: number;
}> => {
  const response = await fetch(
    `${API_BASE_URL}/api/numerology/history?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Failed to fetch numerology readings history"
    );
  }

  return response.json();
};
