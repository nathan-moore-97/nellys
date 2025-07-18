import { Table } from "react-bootstrap";


interface DataTableProps<T extends Record<string, any>> {
    data: T[];
}

const DataTable = <T extends Record<string, any>>({ data }: DataTableProps<T>) => {
    // If no data or empty array, show message
    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }

    // Get the column names from the first object's keys
    const columns = Object.keys(data[0]);

    const renderCellValue = (value: any) => {
        if (typeof value === 'boolean') {
            return value ? "True" : "False";
        }
        return value;
    };

    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th key={index}>{column}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((column, colIndex) => (
                            <td key={colIndex}>{renderCellValue(item[column])}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default DataTable;