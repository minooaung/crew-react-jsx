import { useState } from "react";
import { useGenerateReport } from "../hooks/queries/useReports";
import Button from "../components/reusable/Button";

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
            <Button
              variant="primary"
              type="submit"
              disabled={generateReportMutation.isPending}
              loading={generateReportMutation.isPending}
              loadingText="Generating..."
            >
              Generate Report
            </Button>
          </div>
        </form>

        {/* HTML Preview Section */}
        {htmlPreview && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Report Preview</h2>
              <Button
                variant="secondary"
                onClick={() => window.print()}
                icon={
                  <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                  </svg>
                }
                iconPosition="left"
              >
                Print Report
              </Button>
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
