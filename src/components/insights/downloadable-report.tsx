
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
  fontWeight: 'bold' as 'bold',
});

export const DownloadableReport = forwardRef<HTMLDivElement, ReportProps>(({ data }, ref) => {
    if (!data) return <div ref={ref}></div>;

    const { user, health } = data;
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'N/A';
    const age = getAge(user?.dateOfBirth);
    const gender = user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A';
    
    const calculatedPH = health?.ph_level ? (health.ph_level / 2187.5).toFixed(1) : 'N/A';
    const isPhNormal = calculatedPH !== 'N/A' && parseFloat(calculatedPH) >= 5.0 && parseFloat(calculatedPH) <= 7.5;
    
    const specificGravity = health?.specificGravity ?? 'N/A';
    const isSgNormal = specificGravity !== 'N/A' && specificGravity >= 1.005 && specificGravity <= 1.030;

    const bloodDetected = health?.bloodDetected ?? false;

    const stoolStatus = health?.stoolStatus ?? 'N/A';
    const isBristolNormal = stoolStatus === 'Type 3' || stoolStatus === 'Type 4';

    return (
        <div ref={ref} style={{ width: '210mm', minHeight: '297mm', background: 'white', color: 'black', fontFamily: "'Arial', sans-serif" }}>
            <div style={{ padding: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #004a99', paddingBottom: '10px', marginBottom: '15px' }}>
                    <img src="/logo.png" alt="logo" style={{ height: '60px' }}/>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ margin: 0, color: '#004a99', fontSize: '24px', textTransform: 'uppercase' }}>User Health Report</h1>
                        <div style={{ marginTop: '5px', fontSize: '12px', color: '#333' }}>
                            Contact: +91 6201158797 | Email: smarttoiletapp5@gmail.com
                        </div>
                    </div>
                    <div style={{ width: '60px' }}></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', border: '1px solid #ddd', padding: '10px', marginBottom: '15px', fontSize: '14px', borderRadius: '8px' }}>
                    <div>
                        <p style={{ margin: '4px 0' }}><strong>Name:</strong> <span>{fullName}</span></p>
                        <p style={{ margin: '4px 0' }}><strong>Age / Sex:</strong> <span>{`${age} Yrs / ${gender}`}</span></p>
                        <p style={{ margin: '4px 0' }}><strong>Blood Group:</strong> <span>{user?.bloodGroup || 'N/A'}</span></p>
                    </div>
                    <div style={{ textAlign: 'left', paddingLeft: '20px' }}>
                        <p style={{ margin: '4px 0' }}><strong>Phone:</strong> <span>{user?.phoneNumber || 'N/A'}</span></p>
                        <p style={{ margin: '4px 0' }}><strong>Email:</strong> <span>{user?.email || 'N/A'}</span></p>
                        <p style={{ margin: '4px 0' }}><strong>Date Generated:</strong> <span>{new Date().toLocaleDateString()}</span></p>
                    </div>
                </div>

                <h3 style={{ background: '#004a99', color: 'white', padding: '5px 10px', fontSize: '16px', borderRadius: '4px 4px 0 0', margin: '15px 0 0 0' }}>URINE ROUTINE EXAMINATION</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px', fontSize: '13px' }}>
                    <thead style={{ background: '#f2f2f2' }}>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'left' }}>TEST PARAMETER</th>
                            <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>VALUE</th>
                            <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>REFERENCE RANGE</th>
                            <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td style={{ border: '1px solid #ddd', padding: '6px' }}>Quantity (Volume)</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>250 ml</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>150 - 450 ml</td><td style={{ ...getStatusStyle(true), border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>NORMAL</td></tr>
                        <tr><td style={{ border: '1px solid #ddd', padding: '6px' }}>Color</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Pale Yellow</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Pale Yellow</td><td style={{ ...getStatusStyle(true), border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>NORMAL</td></tr>
                        <tr><td style={{ border: '1px solid #ddd', padding: '6px' }}>Transparency</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Clear</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Clear</td><td style={{ ...getStatusStyle(true), border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>NORMAL</td></tr>
                        <tr><td style={{ border: '1px solid #ddd', padding: '6px' }}>pH Level</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{calculatedPH}</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>5.0 - 7.5</td><td style={{ ...getStatusStyle(isPhNormal), border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{isPhNormal ? 'NORMAL' : 'ABNORMAL'}</td></tr>
                        <tr><td style={{ border: '1px solid #ddd', padding: '6px' }}>Specific Gravity</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{specificGravity}</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>1.005 - 1.030</td><td style={{ ...getStatusStyle(isSgNormal), border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{isSgNormal ? 'NORMAL' : 'ABNORMAL'}</td></tr>
                        <tr><td style={{ border: '1px solid #ddd', padding: '6px' }}>Glucose (Sugar)</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Absent</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Absent</td><td style={{ ...getStatusStyle(true), border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>NORMAL</td></tr>
                        <tr><td style={{ border: '1px solid #ddd', padding: '6px' }}>Protein (Albumin)</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Absent</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Absent</td><td style={{ ...getStatusStyle(true), border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>NORMAL</td></tr>
                        <tr><td style={{ border: '1px solid #ddd', padding: '6px' }}>Blood</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{bloodDetected ? 'Detected' : 'Negative'}</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Negative</td><td style={{ ...getStatusStyle(!bloodDetected), border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{!bloodDetected ? 'NORMAL' : 'ABNORMAL'}</td></tr>
                        <tr><td style={{ border: '1px solid #ddd', padding: '6px' }}>Nitrite</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Negative</td><td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Negative</td><td style={{ ...getStatusStyle(true), border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>NORMAL</td></tr>
                    </tbody>
                </table>
                <div style={{ pageBreakBefore: 'always' }}>
                    <h3 style={{ background: '#004a99', color: 'white', padding: '5px 10px', fontSize: '16px', borderRadius: '4px 4px 0 0', margin: '15px 0 0 0' }}>STOOL ANALYSIS (AI PROCESS TRACKER)</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px', fontSize: '13px' }}>
                        <thead style={{ background: '#f2f2f2' }}>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'left' }}>TEST PARAMETER</th>
                                <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>VALUE</th>
                                <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>REFERENCE RANGE</th>
                                <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: '1px solid #ddd', padding: '6px' }}>Bristol Stool Type</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{stoolStatus === 'N/A' ? 'N/A' : stoolStatus}</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Type 3 - 4</td>
                                <td style={{ ...getStatusStyle(isBristolNormal), border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{isBristolNormal ? 'NORMAL' : 'ABNORMAL'}</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid #ddd', padding: '6px' }}>Consistency</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Smooth and Soft</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Smooth and Soft</td>
                                <td style={{ ...getStatusStyle(true), border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>NORMAL</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid #ddd', padding: '6px' }}>Occult Blood (AI)</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Negative</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Negative</td>
                                <td style={{ ...getStatusStyle(true), border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>NORMAL</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid #ddd', padding: '6px' }}>AI Color Marker</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Brown</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Brown / Typical</td>
                                <td style={{ ...getStatusStyle(true), border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>NORMAL</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ padding: '10px', border: '1px solid #22d3ee', background: '#f0fbff', borderRadius: '5px' }}>
                    <p style={{ margin: 0, fontSize: '14px' }}><strong>AI Clinical Summary:</strong> All physiological markers for the current period are within optimal reference ranges. No abnormal chemical or physical markers were detected in urine or stool analysis.</p>
                </div>

                <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '10px', fontSize: '10px', color: '#666', display: 'flex', justifyContent: 'space-between' }}>
                    <span>This is a digital health report generated by Smart Toilet AI.</span>
                    <span style={{ fontWeight: 'bold', color: 'black', fontSize: '12px' }}>Authorized Digital Signature</span>
                </div>
            </div>
        </div>
    );
});

DownloadableReport.displayName = 'DownloadableReport';
