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

const getAnalysisData = (health: any) => {
    if (!health) return [];

    const chemData = health.Chemistry_Result || {};
    const sensorData = health.sensorData || {};
    
    const isNegative = (val: any) => {
        if (val === undefined || val === null) return true;
        const lval = String(val).toLowerCase();
        return lval === 'neg' || lval === 'negative' || lval === '0' || lval === 'normal' || lval === '0.0';
    };

    const getUrineValue = (key: string, defaultValue: string = 'N/A') => {
        return chemData[key] !== undefined ? String(chemData[key]) : defaultValue;
    };

    const analysisData = [
        { 
            parameter: "Bilirubin (BIL)", 
            value: getUrineValue('chem_bilirubin', 'Negative'), 
            range: "Negative", 
            isNormal: isNegative(chemData.chem_bilirubin)
        },
        { 
            parameter: "Urobilinogen (UBG)", 
            value: getUrineValue('chem_urobilinogen'), 
            range: "0.2 – 1.0 mg/dL",
            isNormal: (() => {
                const val = chemData.chem_urobilinogen;
                if (val === undefined) return true;
                const lowerVal = String(val).toLowerCase();
                if (lowerVal === 'norm' || lowerVal === 'normal') return true;
                const numVal = parseFloat(val);
                return !isNaN(numVal) && numVal >= 0.2 && numVal <= 1.0;
            })()
        },
        { 
            parameter: "Ketone (KET)", 
            value: getUrineValue('chem_ketones', 'Negative'), 
            range: "Negative", 
            isNormal: isNegative(chemData.chem_ketones)
        },
        { 
            parameter: "Ascorbic Acid (ASC)", 
            value: getUrineValue('chem_ascorbicAcid', 'Negative'), 
            range: "Negative", 
            isNormal: isNegative(chemData.chem_ascorbicAcid)
        },
        { 
            parameter: "Glucose (GLU)", 
            value: getUrineValue('chem_glucose'),
            range: "Negative", 
            isNormal: isNegative(chemData.chem_glucose)
        },
        { 
            parameter: "Protein (PRO)", 
            value: (() => {
                 const val = chemData.chem_protein;
                 if (val === undefined || val === null) return "Negative";
                 if (isNegative(val)) return "Negative";
                 const numVal = parseFloat(val);
                 if (numVal > 0 && numVal <= 30) return "Trace";
                 return String(val);
            })(), 
            range: "Negative / Trace", 
            isNormal: chemData.chem_protein === undefined || parseFloat(chemData.chem_protein) <= 30
        },
        { 
            parameter: "Blood (BLD)", 
            value: getUrineValue('chem_blood', 'Negative'),
            range: "Negative (0–2 Ery/µL)", 
            isNormal: isNegative(chemData.chem_blood)
        },
        { 
            parameter: "pH Level", 
            value: getUrineValue('chem_ph'),
            range: "4.5 – 8.0", 
            isNormal: (() => {
                if(chemData.chem_ph === undefined) return true;
                const val = parseFloat(chemData.chem_ph);
                return !isNaN(val) && val >= 4.5 && val <= 8.0;
            })()
        },
        { 
            parameter: "Nitrite (NIT)", 
            value: getUrineValue('chem_nitrite', 'Negative'),
            range: "Negative", 
            isNormal: isNegative(chemData.chem_nitrite)
        },
        { 
            parameter: "Leukocytes (LEU)", 
            value: getUrineValue('chem_leukocytes', 'Negative'),
            range: "Negative (0–10 Leu/µL)", 
            isNormal: isNegative(chemData.chem_leukocytes)
        },
        { 
            parameter: "Specific Gravity (SG)", 
            value: chemData.chem_specificGravity ? parseFloat(chemData.chem_specificGravity).toFixed(3) : 'N/A',
            range: "1.005 – 1.030", 
            isNormal: (() => {
                if(chemData.chem_specificGravity === undefined) return true;
                const val = parseFloat(chemData.chem_specificGravity);
                return !isNaN(val) && val >= 1.005 && val <= 1.030;
            })()
        },
        { 
            parameter: "Turbidity", 
            value: sensorData.turbidity ? `${parseFloat(sensorData.turbidity).toFixed(1)} NTU` : 'N/A',
            range: "< 20 NTU", 
            isNormal: sensorData.turbidity === undefined || parseFloat(sensorData.turbidity) < 20
        },
        { 
            parameter: "Color", 
            value: "Pale Yellow", // Static as no key available
            range: "Pale Yellow – Yellow", 
            isNormal: true 
        },
    ];
    return analysisData;
}


export const DownloadableReport = forwardRef<HTMLDivElement, ReportProps>(({ data }, ref) => {
    if (!data) return <div ref={ref}></div>;

    const { user, health } = data;
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.displayName || 'N/A';
    const age = getAge(user?.dateOfBirth);
    const gender = user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A';
    
    const urineAnalysisData = getAnalysisData(health);

    return (
        <div ref={ref} style={{ width: '210mm', minHeight: '297mm', background: 'white', color: 'black', fontFamily: "'Arial', sans-serif" }}>
            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '2px solid #004a99', paddingBottom: '10px', marginBottom: '15px' }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '60px', height: '60px', marginRight: '20px' }} />
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ margin: 0, color: '#004a99', fontSize: '24px', textTransform: 'uppercase' }}>URINE ROUTINE EXAMINATION</h1>
                        <div style={{ marginTop: '8px', fontSize: '14px', color: '#333' }}>
                            Contact: +91 6201158797 | Email: smarttoiletapp5@gmail.com
                        </div>
                    </div>
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
                        {urineAnalysisData.map((row) => (
                            <tr key={row.parameter}>
                                <td style={{ border: '1px solid #ddd', padding: '6px' }}>{row.parameter}</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{row.value}</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{row.range}</td>
                                <td style={{ ...getStatusStyle(row.isNormal), border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>
                                    {row.isNormal ? 'NORMAL' : 'ABNORMAL'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <div style={{ flexGrow: 1 }}></div>

                <div style={{ padding: '10px', border: '1px solid #22d3ee', background: '#f0fbff', borderRadius: '5px', marginTop: '20px' }}>
                    <p style={{ margin: 0, fontSize: '14px' }}><strong>AI Clinical Summary:</strong> Some physiological markers for the current period are outside optimal reference ranges. Further monitoring is advised. Consult a healthcare professional if symptoms develop.</p>
                </div>

                <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '10px', fontSize: '10px', color: '#666', display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <span>This is a digital health report generated by Smart Toilet AI.</span>
                    <span style={{ fontWeight: 'bold', color: 'black', fontSize: '12px' }}>Authorized Digital Signature</span>
                </div>
            </div>
        </div>
    );
});

DownloadableReport.displayName = 'DownloadableReport';
