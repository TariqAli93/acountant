import * as ExcelJS from 'exceljs';
import moment from 'moment'

const exportExcel = (item) => {
    console.log(item);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`تقرير الصندوق`);
    worksheet.views = [{ rightToLeft: true }];
    worksheet.pageSetup.orientation = 'landscape';
    worksheet.pageSetup.paperSize = 'A4';
    worksheet.pageSetup.fitToPage = true;
    worksheet.pageSetup.fitToHeight = 0;
    worksheet.pageSetup.fitToWidth = 1;
    worksheet.pageSetup.horizontalCentered = true;
    worksheet.pageSetup.verticalCentered = true;
    worksheet.pageSetup.scale = 100;

    worksheet.getCell(`A1`).value = 'تقرير الصندوق';
    worksheet.mergeCells("A1:H1");
    worksheet.getCell(`A1`).alignment = { horizontal: "center" };
    worksheet.getCell(`A2`).value = `نوع الحركة`;
    worksheet.getCell(`B2`).value = `المبلغ`;
    worksheet.getCell(`C2`).value = `الملاحظات`;
    worksheet.getCell(`D2`).value = `بواسطة`;
    worksheet.getCell(`E2`).value = `العميل`;
    worksheet.getCell(`F2`).value = `نوع العميل`;
    worksheet.getCell(`G2`).value = `الحساب`;
    worksheet.getCell(`H2`).value = `التاريخ`;

    worksheet.columns = [
        { key: "activitieType", width: '10' },
        { key: "amount", width: '15', alignment: { horizontal: "right" } },
        { key: "note", width: '20', alignment: { horizontal: "right" }, isCustomWidth: true },
        { key: "activitieBy", width: '15', alignment: { horizontal: "right" } },
        { key: "customerName", width: '15', alignment: { horizontal: "right" } },
        { key: "customerType", width: '15', alignment: { horizontal: "right" } },
        { key: "accountName", width: '15', alignment: { horizontal: "right" } },
        { key: "createdAt", width: '15', alignment: { horizontal: "right" } },
    ];

    item.forEach((activitie) => {
        worksheet.addRow({
            activitieType: activitie.activitieType === 1 ? 'سحب' : 'ايداع',
            amount: activitie.amount * 1,
            note: activitie.note,
            activitieBy: activitie.activitieBy,
            customerName: activitie.customerName,
            customerType: activitie.customerType === 1 ? 'موظف' : 'اخر',
            accountName: activitie.accountName,
            createdAt: moment(activitie.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        });
    });

    worksheet.getRow(1).eachCell((cell) => {
        cell.font = {
            name: "Comic Sans MS",
            family: 4,
            size: 20,
            underline: false,
            bold: true,
            color: { argb: "00ffffff" },
        };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "004e47cc",
            },
        };
    });

    worksheet.getRow(2).eachCell((cell) => {
        cell.font = {
            name: "Comic Sans MS",
            family: 4,
            size: 14,
            underline: false,
            bold: true,
            color: { argb: "004e47cc" },
        };
        cell.fill = {
            type: "pattern",
            pattern: "black",
            fgColor: {
                argb: "00ffffff",
            },
        };
    });


    // create downloaded xlsx file
    workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display: none");
        a.href = url;
        a.download = `تقرير الصندوق-${moment().format('YYYY-MM-DD HH:mm:ss')}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    });
}

export default exportExcel;