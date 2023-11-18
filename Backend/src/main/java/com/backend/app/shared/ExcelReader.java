package com.backend.app.shared;
import com.backend.app.models.Umfrage;
import com.backend.app.models.Unternehmen;
import com.backend.app.services.UmfrageService;
import com.backend.app.services.UnternehmenService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.NumberToTextConverter;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExcelReader {

    @Value("${umfrage.excel.path}")
    private static String umfrageExcelPath;
    @Value("${unternehmen.excel.path}")
    private static String unternehmenExcelPath;

    private static UmfrageService umfrageService;
    private static UnternehmenService unternehmenService;

    static List<Umfrage> umfrageData = new ArrayList<>();
    static List<Unternehmen> unternehmenData = new ArrayList<>();

    @Autowired
    public void ExcelReader(UmfrageService umfrageService, UnternehmenService unternehmenService){
        ExcelReader.umfrageService = umfrageService;
        ExcelReader.unternehmenService = unternehmenService;
    }

    public static void insertData(String[] files){
        if(!umfrageService.isEmpty())
            return;
        for(String filePath : files)
            try (Workbook workbook = new XSSFWorkbook(new FileInputStream(filePath))) {
                Sheet sheet = workbook.getSheetAt(0);
                for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                    Row row = sheet.getRow(rowIndex);

                    if(row.getCell(0) == null)
                        break;
                    String col1 = NumberToTextConverter.toText(row.getCell(0).getNumericCellValue());
                    String col2 = row.getCell(1).getStringCellValue();

                    if(filePath.toLowerCase().contains("umfrage")){
                        Integer col4 = (int)row.getCell(3).getNumericCellValue();
                        Double col5 = row.getCell(4).getNumericCellValue();
                        String col6 = row.getCell(5).getStringCellValue();
                        String col7 = row.getCell(6).getStringCellValue();
                        Boolean col3 = row.getCell(2).getNumericCellValue() != 0.0;

                        Umfrage umfrage = new Umfrage(formatUnternehmenId(col1), col2, col3, col4, numberRounding(col5), col6, col7);
                        umfrageData.add(umfrage);
                    }
                    else{
                        Double col3 = row.getCell(2).getNumericCellValue();
                        Double col4 = row.getCell(3).getNumericCellValue();
                        Double col5 = row.getCell(4).getNumericCellValue();
                        Double col6 = row.getCell(5).getNumericCellValue();
                        Double col7 = row.getCell(6).getNumericCellValue();
                        String col8 = row.getCell(7).getStringCellValue();
                        String col9 = row.getCell(8).getStringCellValue();

                        Unternehmen unternehmen = new Unternehmen(formatUnternehmenId(col1), col2, numberRounding(col3),
                                numberRounding(col4), numberRounding(col5), numberRounding(col6), numberRounding(col7),
                                col8, col9);
                        unternehmenData.add(unternehmen);
                    }
                }
                if(filePath.toLowerCase().contains("umfrage"))
                    umfrageService.insertBatch(umfrageData);
                else
                    unternehmenService.insertBatch(unternehmenData);
            } catch (IOException e) {
                e.printStackTrace();
            }
    }

    public static String formatUnternehmenId(String unternehmenId){
        StringBuilder builder = new StringBuilder(unternehmenId);
        if(builder.length() == 1)
            builder.insert(0, "00");
        else if(builder.length() == 2)
            builder.insert(0, "0");
        return builder.toString();
    }

    public static Double numberRounding(Double value){
        DecimalFormat df = new DecimalFormat("#.##");
        String formattedNumber = df.format(value).replace(",", ".");
        return Double.parseDouble(formattedNumber);
    }
}
