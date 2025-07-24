import { Table, Button } from "react-bootstrap";
import { useState, useMemo } from "react";

interface DataTableProps<T extends Record<string, any>> {
    data: T[];
    enumMap?: {
        [K in keyof T]?: any; // Enum object for the property
    };
}

const DataTable = <T extends Record<string, any>>({ data, enumMap = {} }: DataTableProps<T>) => {
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T;
        direction: 'ascending' | 'descending';
    } | null>(null);


    const requestSort = (key: keyof T) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getEnumName = (enumObj: any, value: any): string => {
        const key = Object.keys(enumObj).find(k => enumObj[k] === value);
        return key || String(value);
    };

    const sortedData = useMemo(() => {
        if (!sortConfig) return data;

        return [...data].sort((a, b) => {
            // Handle enum values by comparing their display names if they're enums
            const aValue = enumMap[sortConfig.key] 
                ? getEnumName(enumMap[sortConfig.key], a[sortConfig.key])
                : a[sortConfig.key];
            
            const bValue = enumMap[sortConfig.key] 
                ? getEnumName(enumMap[sortConfig.key], b[sortConfig.key])
                : b[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, [data, sortConfig, enumMap]);

    const renderCellValue = (value: any, column: keyof T) => {
        if (typeof value === 'boolean') {
            return value ? "True" : "False";
        }
        
        if (enumMap[column]) {
            return getEnumName(enumMap[column], value);
        }
        
        return value;
    };

    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }

    const columns = Object.keys(data[0]) as Array<keyof T>;

    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.toString()}>
                            <Button 
                                variant="link"
                                onClick={() => requestSort(column)}
                                style={{ fontWeight: 'bold', padding: 0 }}
                            >
                                {column.toString()}
                                {sortConfig?.key === column && (
                                    sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
                                )}
                            </Button>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortedData.map((item, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((column) => (
                            <td key={column.toString()}>
                                {renderCellValue(item[column], column)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default DataTable;