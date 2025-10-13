export default function DownloadReportPage() {
  return (
    <div>
      <iframe
        src="/api/reports/download"
        style={{ display: 'none' }}
      />
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Downloading your report...</h1>
        <p className="text-muted-foreground mb-6">
          Your download should start automatically. If it doesn't, 
          <a href="/api/reports/download" className="text-primary font-medium ml-1">click here</a>.
        </p>
        <p className="text-sm text-muted-foreground">
          You will be redirected back to the reports page in a moment.
        </p>
        
        {/* Link to batch download */}
        <p className="mt-8 text-sm">
          Need to download multiple reports? 
          <a href="/reports/export" className="text-primary font-medium ml-1">
            Try batch export
          </a>
        </p>
      </div>
      
      {/* Redirect after a short delay */}
      <script dangerouslySetInnerHTML={{ 
        __html: `
          // Check if this was a batch download request and redirect appropriately
          const urlParams = new URLSearchParams(window.location.search);
          const isBatch = urlParams.get('batch') === 'true';
          const ids = urlParams.get('ids');
          
          if (isBatch && ids) {
            window.location.href = '/reports/download/batch?batch=true&ids=' + ids;
          } else {
            setTimeout(() => {
              window.location.href = '/reports';
            }, 3000);
          }
        ` 
      }} />
    </div>
  )
}