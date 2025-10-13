import csv
import io
from typing import Any, Dict, Optional

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

from app.models.dpr import DPR
from app.models.evaluation import Evaluation
from app.models.risk_assessment import RiskAssessment


async def generate_pdf_report(
    dpr: DPR, evaluation: Evaluation, risk_assessment: Optional[RiskAssessment] = None
) -> bytes:
    """
    Generate a PDF report for a DPR
    """
    # Create a file-like object to receive PDF data
    buffer = io.BytesIO()
    
    # Set up the PDF document
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        title=f"DPR Report - {dpr.title}",
        author="DPR-AI System",
    )
    
    # Define styles
    styles = getSampleStyleSheet()
    title_style = styles['Title']
    heading_style = styles['Heading1']
    subheading_style = styles['Heading2']
    normal_style = styles['Normal']
    
    # Build the PDF content
    elements = []
    
    # Title
    elements.append(Paragraph(f"DPR Assessment Report: {dpr.title}", title_style))
    elements.append(Spacer(1, 12))
    
    # DPR information
    elements.append(Paragraph("DPR Information", heading_style))
    elements.append(Paragraph(f"Title: {dpr.title}", normal_style))
    if dpr.description:
        elements.append(Paragraph(f"Description: {dpr.description}", normal_style))
    elements.append(Paragraph(f"Status: {dpr.status}", normal_style))
    elements.append(Paragraph(f"Uploaded on: {dpr.created_at.strftime('%Y-%m-%d %H:%M')}", normal_style))
    elements.append(Spacer(1, 12))
    
    # Compliance Assessment
    elements.append(Paragraph("Compliance Assessment", heading_style))
    elements.append(Paragraph(f"Overall Compliance Score: {evaluation.compliance_score:.2f}%", normal_style))
    
    # Create a table for compliance details
    compliance_data = [["Section", "Score", "Issues"]]
    
    for section, details in evaluation.compliance_details.items():
        if section != "overall_score":  # Skip the overall score
            section_name = section.replace("_", " ").title()
            section_score = f"{details.get('score', 0):.2f}%"
            section_issues = ", ".join(details.get("issues", []))
            compliance_data.append([section_name, section_score, section_issues])
    
    if len(compliance_data) > 1:  # If we have any sections
        compliance_table = Table(compliance_data, colWidths=[150, 70, 280])
        compliance_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        
        elements.append(compliance_table)
    
    elements.append(Spacer(1, 20))
    
    # Risk Assessment (if available)
    if risk_assessment:
        elements.append(Paragraph("Risk Assessment", heading_style))
        elements.append(Paragraph(f"Overall Risk Score: {risk_assessment.overall_risk_score:.2f}", normal_style))
        
        # Determine risk category
        risk_level = "Low"
        if risk_assessment.overall_risk_score > 70:
            risk_level = "High"
        elif risk_assessment.overall_risk_score > 40:
            risk_level = "Medium"
        
        elements.append(Paragraph(f"Risk Level: {risk_level}", normal_style))
        elements.append(Spacer(1, 12))
        
        # Create a table for risk factors
        risk_data = [["Risk Factor", "Score", "Details"]]
        
        for factor, score in risk_assessment.risk_factors.items():
            factor_name = factor.replace("_", " ").title()
            factor_score = f"{score:.2f}"
            factor_details = risk_assessment.risk_details.get(factor, "")
            if isinstance(factor_details, dict):
                factor_details = ", ".join(f"{k}: {v}" for k, v in factor_details.items())
            risk_data.append([factor_name, factor_score, factor_details])
        
        if len(risk_data) > 1:  # If we have any risk factors
            risk_table = Table(risk_data, colWidths=[150, 70, 280])
            risk_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ]))
            
            elements.append(risk_table)
        
        # Recommendations
        if risk_assessment.recommendations:
            elements.append(Spacer(1, 12))
            elements.append(Paragraph("Recommendations", subheading_style))
            
            for i, (key, rec) in enumerate(risk_assessment.recommendations.items(), 1):
                rec_title = key.replace("_", " ").title()
                if isinstance(rec, str):
                    elements.append(Paragraph(f"{i}. {rec_title}: {rec}", normal_style))
                else:
                    elements.append(Paragraph(f"{i}. {rec_title}:", normal_style))
                    for item in rec:
                        elements.append(Paragraph(f"   • {item}", normal_style))
    
    # Build the PDF
    doc.build(elements)
    
    # Get the PDF data
    buffer.seek(0)
    return buffer.getvalue()


async def generate_csv_report(
    dpr: DPR, evaluation: Evaluation, risk_assessment: Optional[RiskAssessment] = None
) -> bytes:
    """
    Generate a CSV report for a DPR
    """
    # Create a file-like object to receive CSV data
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    
    # Basic information
    writer.writerow(["DPR ASSESSMENT REPORT"])
    writer.writerow([])
    writer.writerow(["DPR Information"])
    writer.writerow(["Title", dpr.title])
    if dpr.description:
        writer.writerow(["Description", dpr.description])
    writer.writerow(["Status", dpr.status])
    writer.writerow(["Uploaded on", dpr.created_at.strftime("%Y-%m-%d %H:%M")])
    writer.writerow([])
    
    # Compliance Assessment
    writer.writerow(["COMPLIANCE ASSESSMENT"])
    writer.writerow(["Overall Compliance Score", f"{evaluation.compliance_score:.2f}%"])
    writer.writerow([])
    writer.writerow(["Section", "Score", "Issues"])
    
    for section, details in evaluation.compliance_details.items():
        if section != "overall_score":  # Skip the overall score
            section_name = section.replace("_", " ").title()
            section_score = f"{details.get('score', 0):.2f}%"
            section_issues = ", ".join(details.get("issues", []))
            writer.writerow([section_name, section_score, section_issues])
    
    writer.writerow([])
    
    # Risk Assessment (if available)
    if risk_assessment:
        writer.writerow(["RISK ASSESSMENT"])
        writer.writerow(["Overall Risk Score", f"{risk_assessment.overall_risk_score:.2f}"])
        
        # Determine risk category
        risk_level = "Low"
        if risk_assessment.overall_risk_score > 70:
            risk_level = "High"
        elif risk_assessment.overall_risk_score > 40:
            risk_level = "Medium"
        
        writer.writerow(["Risk Level", risk_level])
        writer.writerow([])
        writer.writerow(["Risk Factor", "Score", "Details"])
        
        for factor, score in risk_assessment.risk_factors.items():
            factor_name = factor.replace("_", " ").title()
            factor_score = f"{score:.2f}"
            factor_details = risk_assessment.risk_details.get(factor, "")
            if isinstance(factor_details, dict):
                factor_details = ", ".join(f"{k}: {v}" for k, v in factor_details.items())
            writer.writerow([factor_name, factor_score, factor_details])
        
        # Recommendations
        if risk_assessment.recommendations:
            writer.writerow([])
            writer.writerow(["RECOMMENDATIONS"])
            
            for key, rec in risk_assessment.recommendations.items():
                rec_title = key.replace("_", " ").title()
                if isinstance(rec, str):
                    writer.writerow([rec_title, rec])
                else:
                    writer.writerow([rec_title])
                    for item in rec:
                        writer.writerow(["", item])
    
    # Get the CSV data
    buffer.seek(0)
    return buffer.getvalue().encode("utf-8")