/**
 * PDF Generation Utility
 * Creates downloadable PDF reports using browser-native approach
 */

export interface ReportCardData {
  studentName: string;
  studentId: string;
  className: string;
  section: string;
  academicYear: string;
  schoolName: string;
  subjects: Array<{
    name: string;
    marks: number;
    totalMarks: number;
    grade: string;
    rank?: number;
  }>;
  attendance: {
    present: number;
    total: number;
    percentage: number;
  };
  overallPercentage: number;
  overallGrade: string;
  classRank?: number;
  remarks?: string;
}

function getGrade(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
}

export function generateReportCardHTML(data: ReportCardData): string {
  const subjectRows = data.subjects
    .map(
      (s) => `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">${s.name}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${s.marks}/${s.totalMarks}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${((s.marks / s.totalMarks) * 100).toFixed(1)}%</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: ${s.grade.startsWith('A') ? '#22c55e' : s.grade.startsWith('B') ? '#3b82f6' : '#f59e0b'};">${s.grade}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${s.rank || '-'}</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Report Card - ${data.studentName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #fff; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; }
    .header h1 { color: #3b82f6; font-size: 28px; margin-bottom: 5px; }
    .header p { color: #666; }
    .student-info { display: flex; justify-content: space-between; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 8px; }
    .info-group { }
    .info-group label { font-size: 12px; color: #666; display: block; }
    .info-group span { font-size: 16px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #3b82f6; color: white; padding: 12px; text-align: left; }
    .summary { display: flex; gap: 20px; margin-bottom: 30px; }
    .summary-card { flex: 1; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; border-radius: 12px; text-align: center; }
    .summary-card .value { font-size: 32px; font-weight: bold; }
    .summary-card .label { font-size: 14px; opacity: 0.9; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
    .remarks { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 20px; }
    @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 ${data.schoolName}</h1>
      <p>Academic Report Card - ${data.academicYear}</p>
    </div>
    
    <div class="student-info">
      <div class="info-group">
        <label>Student Name</label>
        <span>${data.studentName}</span>
      </div>
      <div class="info-group">
        <label>Student ID</label>
        <span>${data.studentId}</span>
      </div>
      <div class="info-group">
        <label>Class & Section</label>
        <span>${data.className} - ${data.section}</span>
      </div>
      <div class="info-group">
        <label>Class Rank</label>
        <span>#${data.classRank || '-'}</span>
      </div>
    </div>
    
    <div class="summary">
      <div class="summary-card">
        <div class="value">${data.overallPercentage.toFixed(1)}%</div>
        <div class="label">Overall Percentage</div>
      </div>
      <div class="summary-card">
        <div class="value">${data.overallGrade}</div>
        <div class="label">Overall Grade</div>
      </div>
      <div class="summary-card">
        <div class="value">${data.attendance.percentage.toFixed(1)}%</div>
        <div class="label">Attendance</div>
      </div>
    </div>
    
    <table>
      <thead>
        <tr>
          <th>Subject</th>
          <th style="text-align: center;">Marks</th>
          <th style="text-align: center;">Percentage</th>
          <th style="text-align: center;">Grade</th>
          <th style="text-align: center;">Rank</th>
        </tr>
      </thead>
      <tbody>
        ${subjectRows}
      </tbody>
    </table>
    
    ${data.remarks ? `<div class="remarks"><strong>Teacher's Remarks:</strong> ${data.remarks}</div>` : ''}
    
    <div class="footer">
      <p>This is a computer-generated report card from CUSTOS School Management System.</p>
      <p>Generated on: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
    </div>
  </div>
</body>
</html>
`;
}

export function downloadReportCardPDF(data: ReportCardData): void {
  const html = generateReportCardHTML(data);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.print();
    };
    
    // Fallback for browsers that don't trigger onload
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}

// Generate sample report card data for testing
export function generateSampleReportCard(studentName: string = 'John Doe'): ReportCardData {
  return {
    studentName,
    studentId: 'STU2026001',
    className: 'Class 10',
    section: 'A',
    academicYear: '2025-2026',
    schoolName: 'CUSTOS School',
    subjects: [
      { name: 'Mathematics', marks: 92, totalMarks: 100, grade: 'A+', rank: 3 },
      { name: 'Physics', marks: 88, totalMarks: 100, grade: 'A', rank: 5 },
      { name: 'Chemistry', marks: 78, totalMarks: 100, grade: 'B+', rank: 12 },
      { name: 'English', marks: 85, totalMarks: 100, grade: 'A', rank: 8 },
      { name: 'Hindi', marks: 82, totalMarks: 100, grade: 'A', rank: 10 },
      { name: 'History', marks: 90, totalMarks: 100, grade: 'A+', rank: 4 },
      { name: 'Computer Science', marks: 95, totalMarks: 100, grade: 'A+', rank: 1 },
    ],
    attendance: {
      present: 175,
      total: 200,
      percentage: 87.5,
    },
    overallPercentage: 87.14,
    overallGrade: 'A',
    classRank: 5,
    remarks: 'Excellent performance! Shows great potential in Science and Mathematics. Keep up the good work!',
  };
}
