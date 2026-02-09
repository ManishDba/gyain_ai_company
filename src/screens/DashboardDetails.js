import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    ActivityIndicator, 
    RefreshControl, 
    TouchableOpacity 
} from 'react-native';
import LineChartComponent from "../components/charts/LineGraph";
import BarChartComponent from "../components/charts/BarChart";
import PieChartComponent from "../components/charts/PieChart";
import { Table, Row } from "react-native-table-component";
import axios from '../../services/axios';
import endpoint from '../../services/endpoint';

const DashboardDetailScreen = ({ route,navigation }) => {
    const dashboard = route?.params?.dashboard;
    const [queriesData, setQueriesData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true); // New loading state
    
    // Pagination states
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [tablePagination, setTablePagination] = useState({});

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        setLoading(true); // Set loading during refresh
        await fetchQueryData();
        setRefreshing(false);
        setLoading(false);
    }, []);

    const fetchQueryData = async () => {
        if (!dashboard) {
            console.error('No dashboard data received');
            setQueriesData([]);
            setLoading(false); // Ensure loading is false when no dashboard
            return;
        }

        const queriesToFetch = [];

        for (let i = 1; i <= 6; i++) {
            const queryId = dashboard[`query${i}`];
            const heading = dashboard[`query_heading${i}`];
            const presentation = dashboard[`presentation${i}`];

            if (queryId && heading) {
                queriesToFetch.push({ queryId, heading, presentation });
            }
        }

        if (queriesToFetch.length === 0) {
            setQueriesData([]);
            setLoading(false);
            return;
        }

        try {
            const responses = await Promise.all(
                queriesToFetch.map(async ({ queryId }) => {
                    try {
                        const response = await axios.post(endpoint.sqindicators(), { saved_query_id: queryId });
                        return response.data;
                    } catch (error) {
                        console.error(`Error fetching query ${queryId}:`, error);
                        return { Rows: [], Columns: [] };
                    }
                })
            );

            const formattedQueries = queriesToFetch.map((query, index) => ({
                ...query,
                data: responses[index],
            }));

            setQueriesData(formattedQueries);
            
            // Initialize pagination for tables
            const newPagination = {};
            formattedQueries.forEach((query, index) => {
                if (query.presentation === 'table' && query.data?.Rows?.length) {
                    newPagination[index] = 1; 
                }
            });
            setTablePagination(newPagination);
        } catch (error) {
            console.error('Error fetching queries:', error);
            setQueriesData([]);
        } finally {
            setLoading(false); // Always set loading to false after fetch
        }
    };

    useEffect(() => {
        setLoading(true); // Set loading true when starting fetch
        fetchQueryData();
    }, [dashboard]);

    // Pagination functions
    const handlePageChange = (queryIndex, newPage) => {
        setTablePagination(prev => ({
            ...prev,
            [queryIndex]: newPage
        }));
    };

    const getPaginatedRows = (rows, queryIndex) => {
        if (!rows || !Array.isArray(rows)) return [];
        
        const currentPage = tablePagination[queryIndex] || 1;
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        
        return rows.slice(startIndex, endIndex);
    };

    const renderPagination = (totalRows, queryIndex) => {
        const totalPages = Math.ceil(totalRows / rowsPerPage);
        const currentPage = tablePagination[queryIndex] || 1;
        
        if (totalPages <= 1) return null;
        
        return (
            <View style={styles.paginationContainer}>
                <TouchableOpacity
                    style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                    disabled={currentPage === 1}
                    onPress={() => handlePageChange(queryIndex, 1)}
                >
                    <Text style={styles.pageButtonText}>«</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                    disabled={currentPage === 1}
                    onPress={() => handlePageChange(queryIndex, currentPage - 1)}
                >
                    <Text style={styles.pageButtonText}>‹</Text>
                </TouchableOpacity>
                
                <View style={styles.pageInfo}>
                    <Text style={styles.pageInfoText}>
                        {currentPage} / {totalPages}
                    </Text>
                </View>
                
                <TouchableOpacity
                    style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
                    disabled={currentPage === totalPages}
                    onPress={() => handlePageChange(queryIndex, currentPage + 1)}
                >
                    <Text style={styles.pageButtonText}>›</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
                    disabled={currentPage === totalPages}
                    onPress={() => handlePageChange(queryIndex, totalPages)}
                >
                    <Text style={styles.pageButtonText}>»</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderVisualization = (query, index) => {
        if (!query.data?.Rows?.length) {
            return <Text style={styles.errorText}>No data available for {query.heading}</Text>;
        }

        // Helper function to validate data for charts
        const isValidChartData = (rows, chartType) => {
            if (!Array.isArray(rows)) return false;

            if (chartType === 'linechart' || chartType === 'barchart') {
                return rows.every(row => 
                    row.length >=3 && 
                    typeof row[0] === 'string' && 
                    !isNaN(parseFloat(row[1]))
                );
            }

            if (chartType === 'piechart') {
                return rows.every(row => 
                    row.length >= 2 && 
                    typeof row[0] === 'string' && 
                    !isNaN(parseFloat(row[1])) && 
                    parseFloat(row[1]) >= 0
                );
            }

            return true;
        };

        const isValid = isValidChartData(query.data.Rows, query.presentation);

        switch (query.presentation) {
            case 'linechart':
                return isValid ? renderLineChart(query) : renderTable(query, index);
            case 'barchart':
                return isValid ? renderBarChart(query) : renderTable(query, index);
            case 'piechart':
                return isValid ? renderPieChart(query) : renderTable(query, index);
            case 'table':
                return renderTable(query, index);
            default:
                return renderTable(query, index);
        }
    };

    const renderLineChart = (query) => {
        const labels = query.data.Rows.map(row => row[2]);
        const values = query.data.Rows.map(row => row[1]);

        return (
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>{query.heading}</Text>
                <LineChartComponent labels={labels} data={values} />
            </View>
        );
    };

    const renderBarChart = (query) => {
        const labels = query.data.Rows.map(row => row[0]);
        const values = query.data.Rows.map(row => row[1]);

        return (
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>{query.heading}</Text>
                <BarChartComponent labels={labels} data={values} />
            </View>
        );
    };

    const renderPieChart = (query) => {
        const pieData = query.data.Rows.map((row, index) => ({
            name: row[0],
            population: row[1],
            color: `hsl(${(index * 360) / query.data.Rows.length}, 70%, 50%)`,
            legendFontColor: "#000",
            legendFontSize: 12,
        }));
        const labels = pieData?.map(item => item.name);
        const data = pieData?.map(item => item.population);

        return (
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>{query.heading}</Text>
                <PieChartComponent data={data} labels={labels} />
            </View>
        );
    };

    const renderTable = (query, queryIndex) => {
        const tableHead = query.data.Columns.map((col) => col.Name);
        const tableData = query.data.Rows;
        const columnWidths = new Array(tableHead.length).fill(200);
        const paginatedData = getPaginatedRows(tableData, queryIndex);
        const totalRows = tableData.length;

        return (
            <View style={styles.tableContainer}>
                <Text style={styles.chartTitle}>{query.heading}</Text>
                <ScrollView horizontal>
                    <View>
                        <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
                            <Row 
                                data={tableHead} 
                                widthArr={columnWidths} 
                                style={styles.header} 
                                textStyle={styles.headerText} 
                            />
                        </Table>
                        <ScrollView style={styles.dataWrapper}>
                            <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
                                {paginatedData.map((rowData, index) => (
                                    <Row
                                        key={index}
                                        data={rowData}
                                        widthArr={columnWidths}
                                        style={[styles.row, index % 2 && styles.alternateRow]}
                                        textStyle={styles.text}
                                    />
                                ))}
                            </Table>
                        </ScrollView>
                    </View>
                </ScrollView>

                <View style={styles.tableFooter}>
                    {renderPagination(totalRows, queryIndex)}
                    
                    <View style={styles.rowsPerPageContainer}>
                        <Text style={styles.rowsPerPageText}>Rows per page:</Text>
                        <TouchableOpacity
                            style={styles.rowsPerPageSelector}
                            onPress={() => {
                                const options = [5, 10, 25, 50];
                                const currentIndex = options.indexOf(rowsPerPage);
                                const nextIndex = (currentIndex + 1) % options.length;
                                setRowsPerPage(options[nextIndex]);
                                
                                const newPagination = {};
                                Object.keys(tablePagination).forEach(key => {
                                    newPagination[key] = 1;
                                });
                                setTablePagination(newPagination);
                            }}
                        >
                            <Text style={styles.rowsPerPageValue}>{rowsPerPage} ▼</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    // Check if dashboard is missing
    if (!dashboard) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No dashboard found</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
            <Text style={styles.title}>{dashboard.name}</Text>
            {loading ? (
                <Text>Loading...</Text>
            ) : queriesData.length === 0 ? (
                <Text style={styles.errorText}>No dashboard found</Text>
            ) : (
                queriesData
                    .sort((a, b) => (a.presentation === 'table' ? -1 : 1))
                    .map((query, index) => (
                        <View key={index} style={styles.section}>
                            {renderVisualization(query, index)}
                        </View>
                    ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#fff",
        padding: 1
    },
    title: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: 15,
        color: '#174054'
    },
    section: { 
        marginBottom: 20,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#FAFAFA'
    },
    tableContainer: {
        marginBottom: 10,
        borderRadius: 5,
        overflow: "hidden",
    },
    chartContainer: { 
        padding: 10,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#174054',
        marginBottom: 10,
        textAlign: 'center'
    },
    header: { 
        height: 50, 
        backgroundColor: "#174054" 
    },
    headerText: { 
        textAlign: "center", 
        fontWeight: "bold", 
        color: "#fff" 
    },
    row: { 
        height: 40, 
        backgroundColor: "#E7E6E1" 
    },
    alternateRow: {
        backgroundColor: "#F7F6E7"
    },
    dataWrapper: { 
        marginTop: -1 
    },
    text: { 
        textAlign: "center" 
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
        fontWeight: 'bold',
        fontSize: 16,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    pageButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#174054',
        marginHorizontal: 2,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    pageButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    pageInfo: {
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    pageInfoText: {
        color: '#333',
        fontSize: 14,
    },
    tableFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#C1C0B9',
        padding: 10,
    },
    rowsPerPageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowsPerPageText: {
        fontSize: 13,
        color: '#333',
        marginRight: 5,
    },
    rowsPerPageSelector: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    rowsPerPageValue: {
        fontSize: 13,
        color: '#174054',
    }
});

export default DashboardDetailScreen;