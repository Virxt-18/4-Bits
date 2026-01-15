export const sendSOSAlert = async (alertData) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  try {
    const response = await fetch(`${baseURL}/api/admin/sos-alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertData),
    });

    // Check if HTTP status is not OK
    if (!response.ok) {
      const errorText = await response.text(); // read response body
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return { success: true, data };

  } catch (error) {
    // Network errors (CORS, server down, wrong URL) show up here
    console.error('Error sending SOS alert:', error);

    // Optional: distinguish network vs HTTP errors
    if (error instanceof TypeError) {
      console.error('Network or CORS error:', error.message);
    } else {
      console.error('HTTP error:', error.message);
    }

    return { success: false, error: error.message };
  }
};
