import * as ExcelJS from 'exceljs';
import moment from 'moment'

const exportExcel = (item, type, status) => {
    console.log({ item, type });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`تقرير الصندوق`);
    worksheet.views = [{ rightToLeft: true }];
    worksheet.pageSetup.fitToPage = true;
    worksheet.pageSetup.fitToHeight = 0;
    worksheet.pageSetup.fitToWidth = 1;
    worksheet.pageSetup.margins = {
        left: 0.7,
        right: 0.7,
        top: 0,
        bottom: 0.75,
        header: 0,
        footer: 0.3
    };
    worksheet.pageSetup.horizontalCentered = true;
    worksheet.pageSetup.verticalCentered = false;

    worksheet.getCell(`A1`).value = type === 1 ? 'تقرير الصندوق' : `كشف حساب ${item[0].customerName} - ${status}`;
    worksheet.mergeCells("A1:E1");
    worksheet.getCell(`A1`).alignment = { horizontal: "center" };
    worksheet.getCell(`A2`).value = `نوع الحركة`;
    worksheet.getCell(`B2`).value = `المبلغ`;
    worksheet.getCell(`C2`).value = `بواسطة`;
    worksheet.getCell(`D2`).value = `التاريخ`;
    worksheet.getCell(`E2`).value = `الملاحظات`;

    worksheet.columns = [
        { key: "activitieType", width: '10' },
        { key: "amount", width: '15', alignment: { horizontal: "right" } },
        { key: "activitieBy", width: '15', alignment: { horizontal: "right" } },
        { key: "createdAt", width: '15', alignment: { horizontal: "right" } },
        { key: "note", width: '30', alignment: { horizontal: "right" }, isCustomWidth: true },
    ];

    item.forEach((activitie) => {
        worksheet.addRow({
            activitieType: activitie.activitieType === 1 ? 'سحب' : 'ايداع',
            amount: activitie.amount * 1,
            activitieBy: activitie.activitieBy,
            createdAt: moment(activitie.createdAt).format('YYYY-MM-DD'),
            note: activitie.note,
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
        a.download = type === 1 ? `تقرير الصندوق-${moment().format('YYYY-MM-DD HH:mm:ss')}.xlsx` : `كشف حساب-${item[0].customerName}-${moment().format('YYYY-MM-DD HH:mm:ss')}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    });
}

export default exportExcel;