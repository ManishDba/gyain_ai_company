import React, { useEffect } from "react";
import { View, ActivityIndicator, Text, StyleSheet, Alert } from "react-native";
import XLSX from "xlsx";
import ReactNativeBlobUtil from "react-native-blob-util";

// Format value
const formatCellValue = (value, columnName, columnType) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (value instanceof Date) return value;
  return String(value);
};

const ExcelScreen = ({ route, navigation }) => {
  const { pdfData } = route.params;

  useEffect(() => {
    generateAndOpenExcel(pdfData);

    // Auto-close after 1 sec
    const timer = setTimeout(() => navigation.goBack(), 1200);
    return () => clearTimeout(timer);
  }, []);

  const generateAndOpenExcel = async (data) => {
    if (!data || !data.Columns || !data.Rows || data.Rows.length === 0) {
      Alert.alert("No Data", "There is no data to export.");
      return;
    }

    try {
      // Header + rows
      const header = data.Columns.map((col) => col.Name || col.name || "");
      const rows = data.Rows.map((row) =>
        row.map((cell, i) => {
          const col = data.Columns[i] || {};
          return formatCellValue(cell, col.Name, col.Type);
        })
      );

      const sheetData = [header, ...rows];

      // Create sheet
      const ws = XLSX.utils.aoa_to_sheet(sheetData);

      // Auto-fit column width
      const colWidths = [];
      sheetData.forEach((row) => {
        row.forEach((cell, colIdx) => {
          const cellValue = cell === null || cell === undefined ? "" : String(cell);
          const cellLength = cellValue.length;

          if (!colWidths[colIdx] || cellLength > colWidths[colIdx].length) {
            colWidths[colIdx] = { length: cellLength };
          }
        });
      });

      ws["!cols"] = colWidths.map((item) => ({
        wch: Math.min(Math.max(item.length + 5, 10), 50),
      }));

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // Write base64
      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

      // Save file
      const dirs = ReactNativeBlobUtil.fs.dirs;
      const fileName = "table_data.xlsx";
      const path = `${dirs.DownloadDir}/${fileName}`;

      await ReactNativeBlobUtil.fs.writeFile(path, wbout, "base64");

      // Open Excel
      ReactNativeBlobUtil.android
        .actionViewIntent(
          path,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        .catch(() => {
          Alert.alert("No App", "Please install Microsoft Excel or Google Sheets.");
        });
    } catch (error) {
      Alert.alert("Failed", error.message || "Excel export error");
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>Preparing Excel file...</Text>
    </View>
  );
};

export default ExcelScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
});
