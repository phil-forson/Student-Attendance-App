import * as FileSystem from 'expo-file-system';
// ExcelJS
import ExcelJS from 'exceljs';
// Share excel via share dialog
import * as Sharing from 'expo-sharing';
// From @types/node/buffer
import { Buffer as NodeBuffer } from 'buffer';

const generateShareableExcel = async (data: Array<any>): Promise<string> => {
    const now = new Date();
    const fileName = 'StudentAttendance.xlsx';
    const fileUri = FileSystem.cacheDirectory + fileName;
    return new Promise<string>((resolve, reject) => {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Me';
      workbook.created = now;
      workbook.modified = now;
      // Add a sheet to work on
      const worksheet = workbook.addWorksheet('My Sheet', {});
      // Just some columns as used on ExcelJS Readme
      worksheet.columns = [
        { header: 'Id', key: 'id', width: 10 },
        { header: 'Full Name', key: 'name', width: 32 },
        { header: 'Attendance Status', key: 'status', width: 10, }
      ];
      // Add some test data
      data.map((item: any) => {
        worksheet.addRow({ id: item.userData.userId, name: `${item.userData?.firstName} ${item.userData?.lastName}`, status: item.attendanceData?.clockIn === null ? "Absent" : "Present" });
      })
  
      // Test styling
  
      // Style first row
      worksheet.getRow(1).font = {
        name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true
      };
      // Style second column
      
  
      // Write to file
      workbook.xlsx.writeBuffer().then((buffer: ExcelJS.Buffer) => {
        // Do this to use base64 encoding
        const nodeBuffer = NodeBuffer.from(buffer);
        const bufferStr = nodeBuffer.toString('base64');
        FileSystem.writeAsStringAsync(fileUri, bufferStr, {
          encoding: FileSystem.EncodingType.Base64
        }).then(() => {
          resolve(fileUri);
        });
      });
    });
  }

  export const shareExcel = async (data: Array<any>) => {
    const shareableExcelUri: string = await generateShareableExcel(data);
    Sharing.shareAsync(shareableExcelUri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Android
      dialogTitle: 'Your dialog title here', // Android and Web
      UTI: 'com.microsoft.excel.xlsx' // iOS
    }).catch(error => {
      console.error('Error', error);
    }).then(() => {
      console.log('Return from sharing dialog');
    });

    
  }