import React from "react";

export function Table({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) {
	return <table className="w-full" {...props}>{children}</table>;
}

export function TableHeader({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
	return <thead {...props}>{children}</thead>;
}

export function TableBody({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
	return <tbody {...props}>{children}</tbody>;
}

export function TableRow({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
	return <tr {...props}>{children}</tr>;
}

export function TableHead({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
	return <th className="text-left p-3" {...props}>{children}</th>;
}

export function TableCell({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
	return <td className="p-3" {...props}>{children}</td>;
}
