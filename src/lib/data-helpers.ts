export const getLatestCombinedSession = (data: any) => {
    if (!data?.Reports) return { latestCombinedSession: null, combinedSessionId: null };

    const dateKeys = Object.keys(data.Reports).filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k));
    if (dateKeys.length === 0) return { latestCombinedSession: null, combinedSessionId: null };
    
    const latestDate = dateKeys.sort().pop();
    if (!latestDate) return { latestCombinedSession: null, combinedSessionId: null };

    const dailyReport = data.Reports[latestDate];
    if (!dailyReport) return { latestCombinedSession: null, combinedSessionId: null };

    const hardwareSessions = dailyReport.Hardware_Sessions;
    const medicalSessions = dailyReport.Medical_Sessions;

    let latestHardwareSession = null;
    let latestHardwareSessionId = null;
    if (hardwareSessions && Object.keys(hardwareSessions).length > 0) {
        latestHardwareSessionId = Object.keys(hardwareSessions).sort().pop();
        if (latestHardwareSessionId) {
            latestHardwareSession = hardwareSessions[latestHardwareSessionId];
        }
    }

    let latestMedicalSession = null;
    let latestMedicalSessionId = null;
    if (medicalSessions && Object.keys(medicalSessions).length > 0) {
        latestMedicalSessionId = Object.keys(medicalSessions).sort().pop();
        if (latestMedicalSessionId) {
            latestMedicalSession = medicalSessions[latestMedicalSessionId];
        }
    }

    if (!latestHardwareSession && !latestMedicalSession) {
        return { latestCombinedSession: null, combinedSessionId: null };
    }

    const latestCombinedSession = {
        sensorData: latestHardwareSession?.sensorData || null,
        Chemistry_Result: latestMedicalSession?.Chemistry_Result || null,
        metadata: latestHardwareSession?.metadata || latestMedicalSession?.metadata || null,
    };
    
    const combinedSessionId = `${latestDate}_${latestHardwareSessionId || 'nohw'}_${latestMedicalSessionId || 'nomed'}`;

    return { latestCombinedSession, combinedSessionId };
};
