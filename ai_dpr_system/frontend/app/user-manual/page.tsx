'use client';

import { Button } from '@/components/ui/button';

export default function UserManual() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-blue-800 dark:text-blue-300">User Manual</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="max-w-none prose prose-blue dark:prose-invert">
          <h2 className="text-2xl font-semibold mb-4">Getting Started with DPR-AI</h2>
          <p className="mb-6">
            Welcome to the DPR-AI platform. This user manual will guide you through the features and functionality of our AI-powered risk assessment system for infrastructure projects.
          </p>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">1. Creating an Account</h3>
            <p className="mb-4">
              To access the DPR-AI platform, you need to have an authorized government account. If you don''t have an account yet, please contact your department administrator.
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4">
              <strong>Steps to login:</strong>
              <ol className="list-decimal pl-5 mt-2">
                <li>Navigate to the login page by clicking the "Login" button in the header</li>
                <li>Enter your government email and password</li>
                <li>Click "Sign In" to access your dashboard</li>
              </ol>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">2. Uploading DPR Documents</h3>
            <p className="mb-4">
              Navigate to the "Upload DPR" section from the dashboard. You can upload your Detailed Project Report (DPR) documents in PDF format. The system currently supports files up to 50MB in size.
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4">
              <strong>Supported file formats:</strong>
              <ul className="list-disc pl-5 mt-2">
                <li>PDF (.pdf)</li>
                <li>Word Documents (.docx)</li>
                <li>Excel Spreadsheets (.xlsx)</li>
                <li>Text files (.txt)</li>
              </ul>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">3. AI Analysis</h3>
            <p className="mb-4">
              Once your document is uploaded, our AI system will analyze it for potential risks across various categories including financial, environmental, technical, and operational aspects.
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4">
              <strong>Risk categories analyzed:</strong>
              <ul className="list-disc pl-5 mt-2">
                <li><strong>Financial Risks:</strong> Budget overruns, funding gaps, cost estimation errors</li>
                <li><strong>Environmental Risks:</strong> Environmental clearances, ecological impact, natural disaster vulnerability</li>
                <li><strong>Technical Risks:</strong> Design flaws, technology obsolescence, integration issues</li>
                <li><strong>Operational Risks:</strong> Resource constraints, timeline delays, stakeholder coordination</li>
                <li><strong>Regulatory Risks:</strong> Compliance issues, legal challenges, policy changes</li>
              </ul>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">4. Reviewing Reports</h3>
            <p className="mb-4">
              After analysis is complete, you''ll receive a detailed risk assessment report. The report highlights potential risks, provides risk scores, and suggests mitigation strategies.
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4">
              <strong>Report sections:</strong>
              <ul className="list-disc pl-5 mt-2">
                <li><strong>Executive Summary:</strong> Overall risk score and key findings</li>
                <li><strong>Risk Breakdown:</strong> Detailed analysis of each identified risk</li>
                <li><strong>Mitigation Recommendations:</strong> Suggested actions to address each risk</li>
                <li><strong>Comparative Analysis:</strong> How your project compares to similar projects</li>
                <li><strong>Supporting Documents:</strong> Related policies and guidelines</li>
              </ul>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">5. Managing Projects</h3>
            <p className="mb-4">
              You can manage all your projects from the dashboard. Track the status, view historical data, and monitor risk mitigation progress over time.
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg my-8 border-l-4 border-blue-500">
            <h4 className="text-blue-700 dark:text-blue-300 font-medium text-lg">Need Help?</h4>
            <p className="text-blue-600 dark:text-blue-200 mt-2">
              If you encounter any issues or have questions, please contact our support team at support@dpr-ai.gov.in or call our helpdesk at 1800-XXX-XXXX (Monday to Friday, 9 AM to 5 PM).
            </p>
          </div>
          
          <h3 className="text-xl font-semibold mb-3">Additional Resources</h3>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Video Tutorials - Step-by-step guides for using the platform</li>
            <li>FAQ Section - Answers to commonly asked questions</li>
            <li>Glossary of Terms - Definitions of technical terms used in the platform</li>
            <li>Best Practices Guide - Recommendations for optimal use of the system</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button 
          onClick={() => window.history.back()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Back to Previous Page
        </Button>
      </div>
    </div>
  );
}
