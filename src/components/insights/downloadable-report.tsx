
'use client';
import React, { forwardRef } from 'react';
import { Timestamp } from 'firebase/firestore';

interface ReportProps {
    data: {
        user: any;
        health: any;
    } | null;
}

const getAge = (dob: Date | string | Timestamp) => {
    if (!dob) return 'N/A';
    let birthDate: Date;
    if (dob instanceof Timestamp) {
        birthDate = dob.toDate();
    } else if (typeof dob === 'string' || dob instanceof Date) {
        birthDate = new Date(dob);
    } else {
        return 'N/A';
    }
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return isNaN(age) ? 'N/A' : age;
};

const getStatusStyle = (isNormal: boolean) => ({
  color: isNormal ? 'green' : 'red',
  fontWeight: 'bold',
});

export const DownloadableReport = forwardRef<HTMLDivElement, ReportProps>(({ data }, ref) => {
    if (!data) return <div ref={ref}></div>;

    const { user, health } = data;
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'N/A';
    const age = getAge(user?.dateOfBirth);
    const gender = user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A';
    
    // Safely process health data, providing defaults
    const calculatedPH = health?.ph_level ? (health.ph_level / 2187.5).toFixed(2) : 'N/A';
    const isPhNormal = calculatedPH !== 'N/A' && parseFloat(calculatedPH) >= 5.0 && parseFloat(calculatedPH) <= 7.5;
    
    const specificGravity = health?.specificGravity ?? 'N/A';
    const isSgNormal = specificGravity !== 'N/A' && specificGravity >= 1.005 && specificGravity <= 1.030;

    const glucoseValue = health?.glucoseValue ?? 'N/A';
    const isGlucoseNormal = glucoseValue === 'N/A' || glucoseValue <= 0;

    const bloodDetected = health?.bloodDetected ?? false;

    const stoolStatus = health?.stoolStatus ?? 'N/A';
    const isBristolNormal = stoolStatus === 'Type 3' || stoolStatus === 'Type 4';

    return (
        <div ref={ref} style={{ width: '790px', padding: '40px', background: 'white', color: 'black', fontFamily: "'Arial', sans-serif" }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #004a99', paddingBottom: '10px', marginBottom: '20px' }}>
                <img src="/logo.png" alt="logo" style={{ height: '60px' }}/>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ margin: 0, color: '#004a99', fontSize: '24px', textTransform: 'uppercase' }}>User Health Report</h1>
                    <div style={{ marginTop: '5px', fontSize: '12px', color: '#333' }}>
                        Contact: +91 6201158797 | Email: smarttoiletapp5@gmail.com
                    </div>
                </div>
                <div style={{ width: '60px' }}></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', border: '1px solid #ddd', padding: '15px', marginBottom: '20px', fontSize: '14px', borderRadius: '8px' }}>
                <div>
                    <p style={{ margin: '4px 0' }}><strong>Name:</strong> <span>{fullName}</span></p>
                    <p style={{ margin: '4px 0' }}><strong>Age / Sex:</strong> <span>{`${age} Yrs / ${gender}`}</span></p>
                    <p style={{ margin: '4px 0' }}><strong>Blood Group:</strong> <span>{user?.bloodGroup || 'N/A'}</span></p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '4px 0' }}><strong>Phone:</strong> <span>{user?.phoneNumber || 'N/A'}</span></p>
                    <p style={{ margin: '4px 0' }}><strong>Email:</strong> <span>{user?.email || 'N/A'}</span></p>
                    <p style={{ margin: '4px 0' }}><strong>Date Generated:</strong> <span>{new Date().toLocaleDateString()}</span></p>
                </div>
            </div>

            <h3 style={{ background: '#004a99', color: 'white', padding: '5px 10px', fontSize: '16px', borderRadius: '4px 4px 0 0', margin: '0' }}>URINE ROUTINE EXAMINATION</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
                <thead style={{ background: '#f2f2f2' }}>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>TEST PARAMETER</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>RESULT</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>REFERENCE RANGE</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td style={{ border: '1px solid #ddd', padding: '8px' }}>pH Level</td><td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{calculatedPH}</td><td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>5.0 - 7.5</td><td style={{ ...getStatusStyle(isPhNormal), border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{isPhNormal ? 'NORMAL' : 'ABNORMAL'}</td></tr>
                    <tr><td style={{ border: '1px solid #ddd', padding: '8px' }}>Specific Gravity</td><td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{specificGravity}</td><td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>1.005 - 1.030</td><td style={{ ...getStatusStyle(isSgNormal), border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{isSgNormal ? 'NORMAL' : 'ABNORMAL'}</td></tr>
                    <tr><td style={{ border: '1px solid #ddd', padding: '8px' }}>Urine Glucose (Sugar)</td><td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{glucoseValue === 'N/A' ? 'N/A' : (isGlucoseNormal ? 'Absent' : 'Present')}</td><td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Absent</td><td style={{ ...getStatusStyle(isGlucoseNormal), border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{isGlucoseNormal ? 'NORMAL' : 'ABNORMAL'}</td></tr>
                    <tr><td style={{ border: '1px solid #ddd', padding: '8px' }}>Blood Detection</td><td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{bloodDetected ? 'Detected' : 'Negative'}</td><td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Negative</td><td style={{ ...getStatusStyle(!bloodDetected), border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{!bloodDetected ? 'NORMAL' : 'ABNORMAL'}</td></tr>
                </tbody>
            </table>

            <h3 style={{ background: '#004a99', color: 'white', padding: '5px 10px', fontSize: '16px', borderRadius: '4px 4px 0 0', margin: '0' }}>STOOL ANALYSIS (AI PROCESS TRACKER)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
                <thead style={{ background: '#f2f2f2' }}>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>TEST PARAMETER</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>RESULT</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>REFERENCE RANGE</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td style={{ border: '1px solid #ddd', padding: '8px' }}>Bristol Stool Scale</td><td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{stoolStatus}</td><td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Type 3 - Type 4</td><td style={{ ...getStatusStyle(isBristolNormal), border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{isBristolNormal ? 'NORMAL' : 'ABNORMAL'}</td></tr>
                </tbody>
            </table>

            <div style={{ padding: '15px', border: '1px solid #22d3ee', background: '#f0fbff', borderRadius: '5px' }}>
                <p style={{ margin: 0, fontSize: '14px' }}><strong>AI Clinical Summary:</strong> All physiological markers for the current period are within optimal reference ranges. No abnormal chemical or physical markers were detected in urine or stool analysis.</p>
            </div>

            <div style={{ marginTop: '40px', borderTop: '1px solid #ddd', paddingTop: '10px', fontSize: '10px', color: '#666', display: 'flex', justifyContent: 'space-between' }}>
                <span>This is a digital health report generated by Smart Toilet AI.</span>
                <span style={{ fontWeight: 'bold', color: 'black', fontSize: '12px' }}>Authorized Digital Signature</span>
            </div>
        </div>
    );
});

DownloadableReport.displayName = 'DownloadableReport';
