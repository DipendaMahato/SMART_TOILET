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

const getResult = (health: any, param: any) => {
    const chemValue = health?.[param.chemFirebaseKey];

    if (chemValue === undefined) return { category: '—', result: 'N/A' };
    
    switch (param.pad) {
        case 'BIL':
        case 'KET':
        case 'ASC':
        case 'GLU':
        case 'PRO':
        case 'NIT':
        case 'LEU':
            const resultValue = chemValue;
            const isNegative = String(resultValue).toLowerCase() === 'neg' || String(resultValue).toLowerCase() === 'negative' || resultValue === 0;
            return { category: isNegative ? 'Negative' : 'Positive', result: resultValue };
        case 'UBG':
            const ubgValue = chemValue;
            const isNormalUbg = String(ubgValue).toLowerCase() === 'norm' || String(ubgValue).toLowerCase() === 'normal';
             return { category: isNormalUbg ? 'Normal' : 'Abnormal', result: ubgValue };
        case 'BLD':
            const bloodValue = chemValue;
            const isBloodNegative = String(bloodValue).toLowerCase() === 'neg' || String(bloodValue).toLowerCase() === 'negative' || bloodValue === 0;
             return { category: isBloodNegative ? 'Negative' : '+++', result: bloodValue };
        case 'pH':
            return { category: '—', result: chemValue ? parseFloat(chemValue).toFixed(1) : 'N/A' };
        case 'SG':
            return { category: '—', result: chemValue ? parseFloat(chemValue).toFixed(3) : 'N/A' };
        default:
             return { category: '—', result: chemValue };
    }
}


export const ChemistryReport = forwardRef<HTMLDivElement, ReportProps>(({ data }, ref) => {
    if (!data) return <div ref={ref}></div>;

    const { user, health } = data;
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.displayName || 'N/A';
    const age = getAge(user?.dateOfBirth);
    const gender = user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A';

    const reportParameters = [
        { pad: 'BIL', name: 'Bilirubin', chemFirebaseKey: 'chem_bilirubin', unit: 'mg/dL' },
        { pad: 'UBG', name: 'Urobilinogen', chemFirebaseKey: 'chem_urobilinogen', unit: 'mg/dL' },
        { pad: 'KET', name: 'Ketone', chemFirebaseKey: 'chem_ketones', unit: 'mg/dL' },
        { pad: 'ASC', name: 'Ascorbic Acid', chemFirebaseKey: 'chem_ascorbicAcid', unit: 'mg/dL' },
        { pad: 'GLU', name: 'Glucose', chemFirebaseKey: 'chem_glucose', unit: 'mg/dL' },
        { pad: 'PRO', name: 'Protein', chemFirebaseKey: 'chem_protein', unit: 'mg/dL' },
        { pad: 'BLD', name: 'Blood', chemFirebaseKey: 'chem_blood', unit: 'Ery/µL' },
        { pad: 'pH', name: 'pH Level', chemFirebaseKey: 'chem_ph', unit: '—' },
        { pad: 'NIT', name: 'Nitrite', chemFirebaseKey: 'chem_nitrite', unit: '—' },
        { pad: 'LEU', name: 'Leukocytes', chemFirebaseKey: 'chem_leukocytes', unit: 'Leu/µL' },
        { pad: 'SG', name: 'Specific Gravity', chemFirebaseKey: 'chem_specificGravity', unit: '—' },
    ];
    
    const renderTableRows = (parameters: any[]) => {
        return parameters.map((param) => {
            const { category, result } = getResult(health, param);
            return (
            <tr key={param.pad}>
                <td style={{ border: '1px solid #ddd', padding: '6px', fontWeight: 'bold' }}>{param.pad}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{category}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{String(result ?? '...')}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{param.unit}</td>
            </tr>
        )});
    };
    
    const TableHeader = () => (
        <thead style={{ background: '#f2f2f2' }}>
            <tr>
                <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'left' }}>Pad</th>
                <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Category</th>
                <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Result</th>
                <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>Unit</th>
            </tr>
        </thead>
    );


    return (
        <div ref={ref} style={{ width: '210mm', minHeight: '297mm', background: 'white', color: 'black', fontFamily: "'Arial', sans-serif" }}>
            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '2px solid #004a99', paddingBottom: '10px', marginBottom: '15px' }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '60px', height: '60px', marginRight: '20px' }} />
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ margin: 0, color: '#004a99', fontSize: '24px', textTransform: 'uppercase' }}>USER CHEMISTRY REPORT</h1>
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

                <h3 style={{ background: '#004a99', color: 'white', padding: '5px 10px', fontSize: '16px', borderRadius: '4px 4px 0 0', margin: '15px 0 0 0' }}>URINE CHEMISTRY ANALYSIS</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px', fontSize: '13px' }}>
                    <TableHeader />
                    <tbody>
                        {renderTableRows(reportParameters)}
                    </tbody>
                </table>
                
                <div style={{ flexGrow: 1 }}></div>

                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #22d3ee', background: '#f0fbff', borderRadius: '5px' }}>
                    <p style={{ margin: 0, fontSize: '14px' }}><strong>AI Clinical Summary:</strong> All physiological markers for the current period are within optimal reference ranges. No abnormal chemical or physical markers were detected in urine chemistry analysis.</p>
                </div>

                <div style={{ borderTop: '1px solid #ddd', paddingTop: '10px', fontSize: '10px', color: '#666', display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <span>This is a digital health report generated by Smart Toilet AI.</span>
                    <span style={{ fontWeight: 'bold', color: 'black', fontSize: '12px' }}>Authorized Digital Signature</span>
                </div>
            </div>
        </div>
    );
});

ChemistryReport.displayName = 'ChemistryReport';
