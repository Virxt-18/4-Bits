// API endpoint to submit reports to MongoDB backend
export const submitReport = async (reportData) => {
  try {
    const response = await fetch('http://localhost:3001/api/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting report:', error);
    return { success: false, error: error.message };
  }
};
