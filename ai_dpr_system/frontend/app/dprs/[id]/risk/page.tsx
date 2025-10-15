type Props = { params: { id: string } }

export default function DprRiskPage({ params }: Props) {
	const { id } = params
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold">DPR Risk for {id}</h1>
			<p className="text-muted-foreground mt-2">This page is under construction.</p>
		</div>
	)
}
