::确保G:/Delelte/testFile/PDF/Nomal存在就好，在转换过程中其会自动生成output与config(progress目录)
echo 1
PDFConsole.exe 58aafb75986b4cd2fe62df1102029a38 file2word G:/Delelte/testFile/PDF/Nomal/Test0323-1.pdf G:/Delelte/testFile/PDF/Nomal/output G:/Delelte/testFile/PDF/Nomal/Config/0323doc.ini 1-9999 doc
echo 2
PDFConsole.exe 58aafb75986b4cd2fe62df1102029a38 file2excel G:/Delelte/testFile/PDF/Nomal/Test0323-1.pdf G:/Delelte/testFile/PDF/Nomal/output G:/Delelte/testFile/PDF/Nomal/Config/0323xls.ini 1-9999 xls
echo 3
PDFConsole.exe 58aafb75986b4cd2fe62df1102029a38 file2ppt G:/Delelte/testFile/PDF/Nomal/Test0323-1.pdf G:/Delelte/testFile/PDF/Nomal/output G:/Delelte/testFile/PDF/Nomal/Config/0323ppt.ini 1-9999 ppt 
echo 4
PDFConsole.exe 58aafb75986b4cd2fe62df1102029a38 file2html G:/Delelte/testFile/PDF/Nomal/Test0323-1.pdf G:/Delelte/testFile/PDF/Nomal/output/html G:/Delelte/testFile/PDF/Nomal/Config/0323html.ini 1-3 html
echo 5
PDFConsole.exe 58aafb75986b4cd2fe62df1102029a38 file2txt G:/Delelte/testFile/PDF/Nomal/Test0323-1.pdf G:/Delelte/testFile/PDF/Nomal/output G:/Delelte/testFile/PDF/Nomal/Config/0323txt.ini 1-3 txt
echo 6
PDFConsole.exe 58aafb75986b4cd2fe62df1102029a38 file2img G:/Delelte/testFile/PDF/Nomal/Test0323-1.pdf G:/Delelte/testFile/PDF/Nomal/output/img G:/Delelte/testFile/PDF/Nomal/Config/0323img.ini 1-999 jpg
echo 7
::PDFConsole.exe 35aa63663b45d36bb5e9c99a237f54dc file2pdf G:/Delelte/testFile/Office/TestConvert.docx G:/Delelte/testFile/Office/Nomal/output/pdf G:/Delelte/testFile/Office/Nomal/Config/0323pdf.ini 1-999 pdf "" 1 lanshen 
echo 8
::PDFConsole.exe 4f439ba0806247fcc18bddba6de50787 pdfgetimg G:/Delelte/testFile/PDF/getimg/TestImg.pdf G:/Delelte/testFile/PDF/getimg/output G:/Delelte/testFile/PDF/getimg/Config/0323pdf.ini 1-999 jpg "" "" "" 250 2
echo "end"