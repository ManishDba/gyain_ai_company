import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { ENV } from '../../env';
 
const PDF_BASE_URL = ENV.PDF_URL;
 
const CustomHtmlTable = ({
  heading = "",
  beforeTableH6 = [],
  tableData = { Columns: [], Rows: [] },
  afterTableH6 = [],
  footerParagraphs = [],
  references = [],
}) => {
  const navigation = useNavigation();
 
  const openPdf = (href) => {
    let cleanHref = href.trim().replace(/^about:\/\//, "").replace(/^file:\/\//, "");
    let finalUrl = cleanHref;
 
    if (!cleanHref.startsWith("http")) {
      const path = cleanHref.replace(/^\/+/, "");
      finalUrl = `${PDF_BASE_URL}/${path}`.replace(/([^:])\/+/g, "$1/");
    }
 
    navigation.navigate("PdfViewerScreen", { url: finalUrl });
  };
 
  // Group paragraphs by h6 headings
  let currentH6Index = -1;
  const groupedContent = [];
  
  afterTableH6.forEach((h6Text, idx) => {
    groupedContent.push({
      type: 'heading',
      text: h6Text
    });
  });
 
  // Add all paragraphs after headings
  footerParagraphs.forEach(para => {
    groupedContent.push({
      type: 'paragraph',
      text: para
    });
  });
 
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Main Heading (h5) */}
      {heading ? <Text style={styles.heading}>{heading}</Text> : null}
 
      {/* h6 Sub-headings BEFORE table */}
      {beforeTableH6.map((h6, idx) => (
        <Text key={`before-${idx}`} style={styles.subHeading}>{h6}</Text>
      ))}
 
      {/* Table */}
      {tableData.Columns.length > 0 && (
        <ScrollView horizontal style={styles.tableScroll} showsHorizontalScrollIndicator={true}>
          <View style={styles.tableWrapper}>
            <View style={styles.table}>
              {/* Header Row */}
              <View style={[styles.tableRow, styles.headerRow]}>
                {tableData.Columns.map((col, idx) => (
                  <View key={idx} style={[styles.cell, styles.headerCell, styles.cellBorder]}>
                    <Text style={styles.headerText}>{col.Name}</Text>
                  </View>
                ))}
              </View>
 
              {/* Data Rows */}
              {tableData.Rows.map((row, rowIdx) => (
                <View key={rowIdx} style={styles.tableRow}>
                  {row.map((cell, cellIdx) => (
                    <View key={cellIdx} style={[styles.cell, styles.cellBorder]}>
                      <Text style={styles.cellText}>{cell}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
 
      {/* Footer Content - h6 headings and paragraphs */}
      {groupedContent.map((item, idx) => {
        if (item.type === 'heading') {
          return (
            <Text key={`h6-${idx}`} style={styles.footerHeading}>
              {item.text}
            </Text>
          );
        } else {
          return (
            <Text key={`para-${idx}`} style={styles.paragraph}>
              {item.text}
            </Text>
          );
        }
      })}
 
      {/* References */}
      {references.length > 0 && (
        <View style={styles.referencesContainer}>
          <Text style={styles.referenceTitle}>Reference:</Text>
          {references.map((ref, idx) => (
            <TouchableOpacity key={idx} onPress={() => openPdf(ref.href)}>
              <Text style={styles.referenceLink}>{ref.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff'
  },
 
  // h5 - Main Heading
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000"
  },
 
  // h6 - Sub Heading (before table)
  subHeading: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 12,
    color: "#000"
  },
 
  // Table Styles (Your Original CSS)
  tableScroll: {
    marginTop: 8,
    marginBottom: 16
  },
  tableWrapper: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    overflow: "hidden"
  },
  table: { flexDirection: "column" },
  tableRow: { flexDirection: "row" },
  headerRow: { backgroundColor: "#d9d9d9" },
  cell: {
    width: 150,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#f5f5f5",
    justifyContent: "center"
  },
  headerCell: { backgroundColor: "#e0e0e0" },
  cellBorder: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000"
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    fontSize: 13
  },
  cellText: {
    textAlign: "center",
    color: "#000",
    fontSize: 12,
    lineHeight: 18
  },
 
  // Footer Heading (h6 after table)
  footerHeading: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    color: "#000"
  },
 
  // All content as paragraphs
  paragraph: {
    fontSize: 15,
    color: "#000",
    lineHeight: 22,
    marginVertical: 3
  },
 
  // References Section
  referencesContainer: {
    marginTop: 20,
    paddingTop: 12,
  },
  referenceTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#000"
  },
  referenceLink: {
    color: "blue",
    textDecorationLine: "underline",
    marginVertical: 3,
    fontSize: 14,
    marginTop:15,
  },
});
 
export default CustomHtmlTable;