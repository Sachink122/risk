import BatchDownloadClient from './batch-download-client'

type BatchParams = {
  searchParams: {
    batch?: string
    ids?: string
    id?: string
  }
}

export default function BatchDownloadPage({ searchParams }: BatchParams) {
  const isBatch = searchParams.batch === 'true'
  const reportIds = searchParams.ids?.split(',') || []
  const singleId = searchParams.id || null

  return (
    <BatchDownloadClient
      isBatch={isBatch}
      reportIds={reportIds}
      singleId={singleId}
    />
  )
}