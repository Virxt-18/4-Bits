// API endpoint to send SOS alerts to MongoDB backend
export const sendSOSAlert = async (alertData) => {
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const response = await fetch(`${baseURL}/api/admin/sos-alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error sending SOS alert:', error);
    return { success: false, error: error.message };
  }
};
