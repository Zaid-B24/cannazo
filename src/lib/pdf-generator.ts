import { jsPDF } from "jspdf";
import { type PatientFormData } from "@/lib/types";
import { PRODUCTS } from "@/lib/products";

// Helper to convert file to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const generatePDF = async (data: PatientFormData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let currentY = 0;

  // --- 1. HEADER SECTION ---
  // Green Background Header
  doc.setFillColor(22, 163, 74); // Green-600 (Emerald-like)
  doc.rect(0, 0, pageWidth, 40, "F");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("Medical Consultation Request", margin, 25);

  // Date on the right
  doc.setFontSize(10);
  doc.text(new Date().toLocaleDateString(), pageWidth - margin - 20, 25);

  currentY = 55;

  // --- 2. PATIENT INFORMATION ---
  // Section Title
  doc.setFontSize(14);
  doc.setTextColor(22, 163, 74); // Green color for headers
  doc.text("PATIENT DETAILS", margin, currentY);
  
  // Divider Line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, currentY + 3, pageWidth - margin, currentY + 3);
  currentY += 15;

  // Data Content (2-Column Layout)
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  // Column 1
  doc.setFont("helvetica", "bold");
  doc.text("Full Name:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(data.name, margin + 30, currentY);

  doc.setFont("helvetica", "bold");
  doc.text("Email:", margin, currentY + 10);
  doc.setFont("helvetica", "normal");
  doc.text(data.email, margin + 30, currentY + 10);

  doc.setFont("helvetica", "bold");
  doc.text("Date of Birth:", margin, currentY + 20);
  doc.setFont("helvetica", "normal");
  const dob = data.date_of_birth instanceof Date 
    ? data.date_of_birth.toLocaleDateString() 
    : "N/A";
  doc.text(dob, margin + 30, currentY + 20);

  // Column 2
  const col2X = pageWidth / 2 + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Phone:", col2X, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(data.phone, col2X + 25, currentY);

  doc.setFont("helvetica", "bold");
  doc.text("Gender:", col2X, currentY + 10);
  doc.setFont("helvetica", "normal");
  doc.text(data.gender, col2X + 25, currentY + 10);

  doc.setFont("helvetica", "bold");
  doc.text("Vitals:", col2X, currentY + 20);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.weight} kg  |  ${data.height} cm`, col2X + 25, currentY + 20);

  currentY += 40;

  // --- 3. MEDICAL INFORMATION ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(22, 163, 74);
  doc.text("MEDICAL ASSESSMENT", margin, currentY);
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, currentY + 3, pageWidth - margin, currentY + 3);
  currentY += 15;

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  // Condition
  doc.setFont("helvetica", "bold");
  doc.text("Primary Condition:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(data.medicalCondition, margin + 45, currentY);
  currentY += 10;

  // Symptoms (Text Wrap)
  doc.setFont("helvetica", "bold");
  doc.text("Symptoms & History:", margin, currentY);
  currentY += 7;
  
  doc.setFont("helvetica", "normal");
  const splitSymptoms = doc.splitTextToSize(data.symptoms || "", pageWidth - (margin * 2));
  doc.text(splitSymptoms, margin, currentY);
  
  // Adjust Y based on text height
  currentY += (splitSymptoms.length * 5) + 15;

  // --- 4. SELECTED PRODUCTS ---
  if (data.selectedProducts && data.selectedProducts.length > 0) {
    // Check for page break
    if (currentY > pageHeight - 60) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(22, 163, 74);
    doc.text("PRODUCT INTERESTS", margin, currentY);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, currentY + 3, pageWidth - margin, currentY + 3);
    currentY += 15;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    const productNames = data.selectedProducts.map((id) => {
      const product = PRODUCTS.find((p) => p.id === id);
      return product ? product.name : id; 
    });

    productNames.forEach((name) => {
      // Bullet point style
      doc.setFillColor(100, 100, 100);
      doc.circle(margin + 2, currentY - 1, 1, "F");
      doc.text(name, margin + 8, currentY);
      currentY += 8;
    });
    
    currentY += 10;
  }

  // --- 5. FOOTER / LEGAL ---
  // Move to bottom for Legal
  const bottomY = pageHeight - 40;
  
  doc.setDrawColor(22, 163, 74);
  doc.line(margin, bottomY, pageWidth - margin, bottomY);
  
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  
  doc.setFont("helvetica", "bold");
  doc.text("[ ✓ ] I hereby consent to treatment and confirm that I have provided accurate medical history.", margin, bottomY + 18);
  doc.text("[ ✓ ] I certify that I am over 21 years of age.", margin, bottomY + 25);

  // --- 6. ATTACHMENTS (New Page) ---
  if (data.aadhaar_image_url instanceof File) {
    try {
      doc.addPage();
      
      // Header for attachment page
      doc.setFillColor(240, 240, 240);
      doc.rect(0, 0, pageWidth, 20, "F");
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text("Attachment: Identity Proof", margin, 13);

      const base64Img = await fileToBase64(data.aadhaar_image_url);
      
      // Fit image within margins
      const imgWidth = 160;
      const imgHeight = 100; // Aspect ratio adjustment might be needed in real app
      
      doc.addImage(base64Img, "JPEG", margin, 30, imgWidth, imgHeight);
      
      doc.setFontSize(10);
      doc.text("Document: Aadhaar Card / Identity Proof", margin, 30 + imgHeight + 10);
      
    } catch (error) {
      console.error("Error embedding image", error);
      doc.text("Error loading attached image.", 20, 40);
    }
  }

  // Save
  doc.save(`${data.name.replace(/\s+/g, "_")}_Consultation.pdf`);
};