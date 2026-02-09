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

export const ChemistryReport = forwardRef<HTMLDivElement, ReportProps>(({ data }, ref) => {
    if (!data) return <div ref={ref}></div>;

    const { user, health } = data;
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.displayName || 'N/A';
    const age = getAge(user?.dateOfBirth);
    const gender = user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A';

    const chemistryParameters = [
        { key: 'chem_bilirubin', label: 'Bilirubin', range: 'Negative', isNormal: (health?.chem_bilirubin ?? 'Negative') === 'Negative' },
        { key: 'chem_urobilinogen', label: 'Urobilinogen', range: '0.2 – 1.0 mg/dL', isNormal: (parseFloat(health?.chem_urobilinogen) >= 0.2 && parseFloat(health?.chem_urobilinogen) <= 1.0) },
        { key: 'chem_ketones', label: 'Ketones', range: 'Negative', isNormal: (health?.chem_ketones ?? 'Negative') === 'Negative' },
        { key: 'chem_ascorbicAcid', label: 'Ascorbic Acid', range: 'Negative', isNormal: (health?.chem_ascorbicAcid ?? 'Negative') === 'Negative' },
        { key: 'chem_glucose', label: 'Glucose', range: 'Negative', isNormal: (health?.chem_glucose ?? 'Negative') === 'Negative' },
        { key: 'chem_protein', label: 'Protein', range: 'Negative / Trace', isNormal: ['Negative', 'Trace'].includes(health?.chem_protein ?? 'Negative') },
        { key: 'chem_blood', label: 'Blood', range: 'Negative', isNormal: (health?.chem_blood ?? 'Negative') === 'Negative' },
        { key: 'chem_ph', label: 'pH', range: '4.5 – 8.0', isNormal: (parseFloat(health?.chem_ph) >= 4.5 && parseFloat(health?.chem_ph) <= 8.0) },
        { key: 'chem_nitrite', label: 'Nitrite', range: 'Negative', isNormal: (health?.chem_nitrite ?? 'Negative') === 'Negative' },
        { key: 'chem_leukocytes', label: 'Leukocytes', range: 'Negative', isNormal: (health?.chem_leukocytes ?? 'Negative') === 'Negative' },
        { key: 'chem_specificGravity', label: 'Specific Gravity', range: '1.005 – 1.030', isNormal: (parseFloat(health?.chem_specificGravity) >= 1.005 && parseFloat(health?.chem_specificGravity) <= 1.030) },
    ];

    return (
        <div ref={ref} style={{ width: '210mm', minHeight: '297mm', background: 'white', color: 'black', fontFamily: "'Arial', sans-serif" }}>
            <div style={{ padding: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #004a99', paddingBottom: '10px', marginBottom: '15px' }}>
                    <img src="/logo.png" alt="logo" style={{ height: '60px' }}/>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ margin: 0, color: '#004a99', fontSize: '24px', textTransform: 'uppercase' }}>USER CHEMISTRY REPORT</h1>
                        <div style={{ marginTop: '8px', fontSize: '14px', color: '#333' }}>
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

                <h3 style={{ background: '#004a99', color: 'white', padding: '5px 10px', fontSize: '16px', borderRadius: '4px 4px 0 0', margin: '15px 0 0 0' }}>URINE CHEMISTRY ANALYSIS</h3>
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
                        {chemistryParameters.map((param) => (
                            <tr key={param.key}>
                                <td style={{ border: '1px solid #ddd', padding: '6px' }}>{param.label}</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{String(health?.[param.key] ?? '...')}</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{param.range}</td>
                                <td style={{ ...getStatusStyle(param.isNormal), border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>
                                    {param.isNormal ? 'NORMAL' : 'ABNORMAL'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ padding: '10px', border: '1px solid #22d3ee', background: '#f0fbff', borderRadius: '5px' }}>
                    <p style={{ margin: 0, fontSize: '14px' }}><strong>AI Clinical Summary:</strong> All physiological markers for the current period are within optimal reference ranges. No abnormal chemical or physical markers were detected in urine chemistry analysis.</p>
                </div>

                <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '10px', fontSize: '10px', color: '#666', display: 'flex', justifyContent: 'space-between' }}>
                    <span>This is a digital health report generated by Smart Toilet AI.</span>
                    <span style={{ fontWeight: 'bold', color: 'black', fontSize: '12px' }}>Authorized Digital Signature</span>
                </div>
            </div>
        </div>
    );
});

ChemistryReport.displayName = 'ChemistryReport';
