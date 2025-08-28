import { useState } from "react";
import { useGenerateReport } from "../hooks/queries/useReports";

export default function Report() {
  const [reportType, setReportType] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [htmlPreview, setHtmlPreview] = useState(null);

  const generateReportMutation = useGenerateReport();

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setHtmlPreview(null);

    try {
      const result = await generateReportMutation.mutateAsync({
        reportType,
        outputFormat,
      });

      // For HTML format, update preview
      if (outputFormat === "html") {
        setHtmlPreview(result);
      }
    } catch (err) {
      console.error("Failed to generate report:", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Generate Report</h1>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        {generateReportMutation.error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                {Object.keys(generateReportMutation.error).map((key) => (
                  <p key={key} className="text-sm font-medium text-red-800">
                    {generateReportMutation.error[key][0]}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
              Report Type
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={(ev) => setReportType(ev.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="" disabled>Select Report Type</option>
              <option value="users">Users Report</option>
              <option value="organisations">Organisations Report</option>
            </select>
          </div>

          <div>
            <label htmlFor="outputFormat" className="block text-sm font-medium text-gray-700">
              Output Format
            </label>
            <select
              id="outputFormat"
              value={outputFormat}
              onChange={(ev) => setOutputFormat(ev.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="" disabled>Select Format</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="html">HTML Preview</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={generateReportMutation.isPending}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {generateReportMutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Report'
              )}
            </button>
          </div>
        </form>

        {/* HTML Preview Section */}
        {htmlPreview && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Report Preview</h2>
              <button 
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
                Print Report
              </button>
            </div>
            <div 
              className="bg-white shadow overflow-hidden sm:rounded-lg p-6 border border-gray-200"
              dangerouslySetInnerHTML={{ __html: htmlPreview }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
