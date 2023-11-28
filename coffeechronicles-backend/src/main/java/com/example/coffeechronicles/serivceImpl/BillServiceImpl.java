package com.example.coffeechronicles.serivceImpl;

import com.example.coffeechronicles.entity.Bill;
import com.example.coffeechronicles.entity.Product;
import com.example.coffeechronicles.entity.TransactionDetails;
import com.example.coffeechronicles.entity.User;
import com.example.coffeechronicles.jwt.JwtFilter;
import com.example.coffeechronicles.repo.BillRepo;
import com.example.coffeechronicles.service.BillService;
import com.google.common.base.Strings;
import com.google.gson.reflect.TypeToken;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.google.gson.Gson;

import com.itextpdf.text.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.*;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class BillServiceImpl implements BillService {

    @Autowired
    private BillRepo billRepo;

    @Autowired
    private JwtFilter jwtFilter;

    private static final String KEY="rzp_test_S2pk7BAUZxcuzg";
    private static final String KEY_SECRET="1IOQQNml0TCxT5lsXE3XwI8k";
    private static final String CURRENCY="INR";

    public final String STORE_LOCATION="/home/samrat/Bills";

    @Override
    public ResponseEntity<String> generateBill(Map<String, Object> requestMap) {
        try{
            String filename;
            if( this.validateRequestMap(requestMap)){
                if(requestMap.containsKey("isGenerate")&& !(Boolean) requestMap.get("isGenerate") ){
                    filename= (String) requestMap.get("uuid");
                }
                else{
                    filename= this.getUUID();
                    requestMap.put("uuid", filename);
                    this.insertBill(requestMap);
                }
                // print user data (name , email m contactNumber , ...)
                String data = "Name: " + requestMap.get("name") + "\n" + "Contact Number: " + requestMap.get("contactNumber") +
                        "\n" + "Email: " + requestMap.get("email") + "\n" + "Payment Method: " + requestMap.get("paymentMethod");
                Document document = new Document();
                PdfWriter.getInstance(document, new FileOutputStream(this.STORE_LOCATION + "/" + filename + ".pdf"));
                document.open();
                setRectangleInPdf(document);

                // print pdf Header
                Paragraph chunk = new Paragraph("COFFEE CHRONICLES", getFont("Header"));
                chunk.setAlignment(Element.ALIGN_CENTER);
                document.add(chunk);


                Paragraph paragraph = new Paragraph(data + "\n \n", getFont("Data"));
                document.add(paragraph);

                // Create table in pdf to print data
                PdfPTable table = new PdfPTable(4);
                table.setWidthPercentage(100);
                addTableHeader(table);


                // Print table data
                JSONArray jsonArray = this.getJsonArrayFromString((String) requestMap.get("productDetail"));
                for (int i = 0; i < jsonArray.length(); i++) {
                    addRows(table, this.getMapFromJson(jsonArray.getString(i)));
                }

                document.add(table);

                // print pdf Footer
                Paragraph footer = new Paragraph("Total : " + requestMap.get("totalAmount") + "\n"
                        + "Thank you for visiting our website.", getFont("Data"));
                document.add(footer);
                document.close();
                return new ResponseEntity<>("{\"uuid\":\"" + filename + "\"}", HttpStatus.OK);

//                return new ResponseEntity<>("Created", HttpStatus.OK);
            }
            else{
                new ResponseEntity<>("Invalid Data",HttpStatus.BAD_REQUEST);
            }
        }
        catch(Exception ex){
            ex.printStackTrace();
        }
        return new ResponseEntity<>("Something Went Wrong", HttpStatus.INTERNAL_SERVER_ERROR);
    }


//    @Override
//    public ResponseEntity<String> generateBill(Map<String, Object> requestMap) {
//        try{
//            String filename;
//            if( this.validateRequestMap(requestMap)){
//                if(requestMap.containsKey("isGenerate")&& !(Boolean) requestMap.get("isGenerate") ){
//                    filename= (String) requestMap.get("uuid");
//                }
//                else{
//                    filename= this.getUUID();
//                    requestMap.put("uuid", filename);
//                    this.insertBill(requestMap);
//                }
//
//                return new ResponseEntity<>("Created", HttpStatus.OK);
//            }
//            else{
//                new ResponseEntity<>("Invalid Data",HttpStatus.BAD_REQUEST);
//            }
//        }
//        catch(Exception ex){
//            ex.printStackTrace();
//        }
//        return new ResponseEntity<>("Something Went Wrong", HttpStatus.INTERNAL_SERVER_ERROR);
//    }

    @Override
    public ResponseEntity<List<Bill>> getBill() {
        List<Bill> bills = new ArrayList<>();
        try{
            if(jwtFilter.isAdmin()){
                bills= billRepo.getAllBills();
            }
            else{
                bills= billRepo.getBillByUsername( jwtFilter.getCurrentUser());
            }
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return new ResponseEntity<>(bills, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> delete(Integer id) {
        try {
            if (jwtFilter.isAdmin()) {
                Optional optional = billRepo.findById(id);
                if (!optional.isEmpty()) {
                    billRepo.deleteById(id);
                    //System.out.println("Product is deleted successfully");
                    return new ResponseEntity<>("Bill is deleted successfully", HttpStatus.OK);
                }
                //System.out.println("Product id doesn't exist");
                return new ResponseEntity<>("Bill id doesn't exist", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>("SOMETHING_WENT_WRONG", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<byte[]> getPdf(Map<String, Object> requestMap) {
        log.info("Inside getPdf : requestMap {}", requestMap);
        try {
            byte[] byteArray = new byte[0];
            if (!requestMap.containsKey("uuid") && this.validateRequestMap(requestMap)) {
                return new ResponseEntity<>(byteArray, HttpStatus.BAD_REQUEST);
            }
            String filepath = this.STORE_LOCATION + "/" + (String) requestMap.get("uuid") + ".pdf";

            if (this.isFileExist(filepath)) {
                byteArray = getByteArray(filepath);
                return new ResponseEntity<>(byteArray, HttpStatus.OK);
            } else {
                requestMap.put("isGenerate", false);
                generateBill(requestMap);
                byteArray = getByteArray(filepath);
                return new ResponseEntity<>(byteArray, HttpStatus.OK);
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    private void insertBill(Map<String, Object> requestMap) {
        try{
            Bill bill = new Bill();
            bill.setUuid((String)requestMap.get("uuid"));
            bill.setName((String)requestMap.get("name"));
            bill.setEmail((String) requestMap.get("email"));
            bill.setContactNumber((String) requestMap.get("contactNumber"));
            bill.setPaymentMethod((String)requestMap.get("paymentMethod"));
            bill.setOrderType((String)requestMap.get("orderType"));
            bill.setTotalAmount((String)requestMap.get("totalAmount"));
            bill.setProductDetail((String) requestMap.get("productDetail"));
            bill.setCreatedBy(jwtFilter.getCurrentUser());
            billRepo.save(bill);

        }
        catch (Exception ex){
            ex.printStackTrace();
        }
    }

    private boolean validateRequestMap(Map<String, Object> requestMap) {
        return requestMap.containsKey("name")&&
                requestMap.containsKey("email")&&
                requestMap.containsKey("contactNumber") &&
                requestMap.containsKey("paymentMethod")&&
                requestMap.containsKey("totalAmount")&&
                requestMap.containsKey("orderType")&&
                requestMap.containsKey("productDetail");
    }
    public String getUUID(){
        Date date = new Date();
        return "BILL-" + date.getTime() ;
    }


    private byte[] getByteArray(String filepath) throws Exception {
        File initalFile = new File(filepath);
        InputStream targetStream = new FileInputStream(initalFile);
        byte[] byteArray = IOUtils.toByteArray(targetStream);
        targetStream.close();
        return byteArray;
    }

    public static Boolean isFileExist(String path){
        log.info("Inside isFileExist {}" , path);
        try {
            File file = new File(path);
            return (file != null && file.exists()) ? Boolean.TRUE : Boolean.FALSE;

        }catch (Exception ex){
            ex.printStackTrace();
        }
        return false;
    }



    //for pdf//


    private void setRectangleInPdf(Document document) throws DocumentException {
        log.info("Inside setRectangleInPdf.");
        Rectangle rectangle = new Rectangle(577, 825, 18, 15);
        rectangle.enableBorderSide(1);
        rectangle.enableBorderSide(2);
        rectangle.enableBorderSide(4);
        rectangle.enableBorderSide(8);
        rectangle.setBorderColor(BaseColor.BLACK);
        rectangle.setBorderWidth(1);
        document.add(rectangle);
    }
    private Font getFont(String type) {
        log.info("Inside getFont");
        switch (type) {
            case "Header":
                Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLDOBLIQUE, 18, BaseColor.BLACK);
                headerFont.setStyle(Font.BOLD);
                return headerFont;
            case "Data":
                Font dareFont = FontFactory.getFont(FontFactory.TIMES_ROMAN, 11, BaseColor.BLACK);
                dareFont.setStyle(Font.BOLD);
                return dareFont;
            default:
                return new Font();
        }
    }

    private void addTableHeader(PdfPTable table) {
        log.info("Inside addTableHeader");
        Stream.of("Name", "Quantity", "Price", "Sub Total")
                .forEach(columnTitle -> {
                    PdfPCell header = new PdfPCell();
                    header.setBackgroundColor(BaseColor.LIGHT_GRAY);
                    header.setBorderWidth(2);
                    header.setPhrase(new Phrase(columnTitle));
                    header.setBackgroundColor(BaseColor.YELLOW);
                    header.setHorizontalAlignment(Element.ALIGN_CENTER);
                    header.setVerticalAlignment(Element.ALIGN_CENTER);
                    table.addCell(header);
                });
    }

    public JSONArray getJsonArrayFromString(String data) throws JSONException {
        JSONArray jsonArray = new JSONArray(data);
        return jsonArray;
    }

    public  Map<String , Object> getMapFromJson(String data){
        if(!Strings.isNullOrEmpty(data))
            return new Gson().fromJson(data , new TypeToken<Map<String , Object>>(){
            }.getType());
        return new HashMap<>();
    }

    private void addRows(PdfPTable table, Map<String, Object> data) {
        log.info("Inside addRows");
        table.addCell((String) data.get("name"));
//        table.addCell((String) data.get("category"));
        table.addCell((String) data.get("quantity"));
//        table.addCell(Double.toString((Double) data.get("price")));
//        table.addCell(Double.toString((Double) data.get("total")));
        // Convert "price" and "total" to Double
        double price = Double.parseDouble((String) data.get("price"));
        double total = Double.parseDouble((String) data.get("total"));

        table.addCell(String.valueOf(price));
        table.addCell(String.valueOf(total));
    }


    //transaction-razorpay
    public TransactionDetails createTransaction(Double amount) {
        try {
            JSONObject jsonObject= new JSONObject();
            jsonObject.put("amount",(amount*100));
            jsonObject.put("currency",CURRENCY);
            RazorpayClient razorpayClient = new RazorpayClient(KEY, KEY_SECRET);

            Order order = razorpayClient.orders.create(jsonObject);
            TransactionDetails transactionDetails= prepareTransaction(order);
            return transactionDetails;
//            return prepareTransaction(order);
//            System.out.println(order);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return  null;
    }
    private TransactionDetails prepareTransaction(Order order){
        String orderId= order.get("id");
        String currency=order.get("currency");
        Integer amount= order.get("amount");

        TransactionDetails transactionDetails= new TransactionDetails(orderId,currency,amount,KEY);
        return transactionDetails;
    }

    @Override
    public ResponseEntity<String> update(Map<String, String> requestMap) {
        try {
            if (jwtFilter.isUser()) {
                Optional<Bill> optional = billRepo.findById(Integer.parseInt(requestMap.get("id")));
                if (!optional.isEmpty()) {

                    billRepo.updateActive(Boolean.parseBoolean(requestMap.get("active")), Integer.parseInt(requestMap.get("id")));

                    return new ResponseEntity<>("Bill Status is updated Successfully", HttpStatus.OK);

                } else {
                    return new ResponseEntity<>("Bill id doesn't exist", HttpStatus.OK);
                }
            } else {
                return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>("SOMETHING_WENT_WRONG", HttpStatus.INTERNAL_SERVER_ERROR);

    }
}
