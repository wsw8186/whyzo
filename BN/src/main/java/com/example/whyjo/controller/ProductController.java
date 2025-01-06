package com.example.whyjo.controller;



import com.example.whyjo.domain.entity.Product;
import com.example.whyjo.service.ProductService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.List;

@RestController
@RequestMapping("/product")
@Slf4j
@Transactional(rollbackOn = Exception.class)
public class ProductController {
    // 1. 로그인 안되면 out/ 2. seller 아니면 out / 2.5 등록 seller 아니면 out

    // userid(로그인에 사용된), role으로 valid 확인 필요!
    // remember-me -> local / 일반 - coockie? session? token?

    String imageDir = "C:\\Users\\Sangwon\\Desktop\\whyjo\\src\\main\\frontend\\public\\product\\";


    @Autowired
    private ProductService productService;

    @PostMapping("/add")    // 후에 경로 변경
    public ResponseEntity<?> addProduct(@RequestPart("data") Product product,
                                        @RequestPart("images") List<MultipartFile> files
    ) {
        try {
            product.setImage(imageController(files, product.getSeller()));     // 이미지 저장 후 반환값 = 이미지 이름 목록

            productService.insertProduct(product);

            return ResponseEntity.ok().body("상품 등록이 성공적으로 처리되었습니다.");
        } catch (Exception e) {
            System.out.println("[PC] addController Fail" + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("상품 등록 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/listAll")
    public ResponseEntity<List<Product>> listAll() {
        try {
            List<Product> list = productService.selectAllProduct();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            System.out.println("[PC] listAll Fail" + e.getMessage());
            return null;
        }
    }
    @GetMapping("/listId/{id}")
    public ResponseEntity<?> listById(@PathVariable("id") long id) {    // productid -> id로 변경
        try {
            Product product = productService.selectById(id);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            System.out.println("[PC] listById Fail" + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("상품 선택 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/edit/{id}")
    public ResponseEntity<?> editProduct(@PathVariable("id") long id) {  // productid -> id로 변경
        try {
            Product product = productService.selectById(id);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            System.out.println("[PC] editProduct Fail" + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("상품 편집 중 오류가 발생했습니다.");
        }
    }
    @PutMapping("/edit/update")
    public ResponseEntity<?> updateProduct(@RequestPart("data") Product newProduct,
                                           @RequestPart("images") List<MultipartFile> files
    ) {
        try {
            Product oldProduct = productService.selectById(newProduct.getId());
            
            // 기존 이미지 삭제
            List<String> imagesToDelete = newProduct.getImagesToDelete();
            if (imagesToDelete != null && !imagesToDelete.isEmpty()) {
                imageDelete(imagesToDelete, oldProduct.getSeller());
            }

            // 상품 정보 업데이트
            oldProduct.setProductname(newProduct.getProductname());
            oldProduct.setPrice(newProduct.getPrice());
            oldProduct.setDiscount(newProduct.getDiscount());
            oldProduct.setType(newProduct.getType());
            oldProduct.setUnit(newProduct.getUnit());
            oldProduct.setSubtitle(newProduct.getSubtitle());
            oldProduct.setDescription(newProduct.getDescription());

            // 새 이미지 저장
            oldProduct.setImage(imageController(files, oldProduct.getSeller()));

            productService.updateProduct(oldProduct);

            return ResponseEntity.ok().body("상품 수정이 성공적으로 처리되었습니다.");
        } catch (Exception e) {
            System.out.println("[PC] updateController Failed" + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("상품 수정 중 오류가 발생했습니다.");
        }
    }

    @DeleteMapping("/edit/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable("id") long id)  {  // productid -> id로 변경
        try {
            Product product = productService.selectById(id);
            imageDelete(product.getImage(), product.getSeller());
            productService.deleteProductById(id);

            return ResponseEntity.ok().body("상품 삭제가 성공적으로 처리되었습니다.");
        } catch (Exception e) {
            System.out.println("[PC] deleteController Fail" + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("상품 삭제 중 오류가 발생했습니다.");
        }

    }

    // 이미지 로컬에 저장, 이미지명 list 반환
    private List<String> imageController(List<MultipartFile> files, String seller) throws IOException {
        try {
            List<String> imagenames = new ArrayList<>();

            for (MultipartFile file : files) {   
                String randomName = UUID.randomUUID().toString();           
                String originalName = file.getOriginalFilename();           
                String saveName = randomName + "_" + originalName;          
                File saveFile = new File(imageDir+seller, saveName);  

                if (!saveFile.getParentFile().exists()) {           
                    saveFile.getParentFile().mkdirs();
                }
                file.transferTo(saveFile);                          
                // 전체 경로를 포함하여 저장
                imagenames.add(seller + "/" + saveName);  // seller 폴더명을 포함한 경로 저장

            }
            return imagenames;    
        } catch (IOException e) {
            System.out.println("[PC] imageController Fail" + e.getMessage());
            return Collections.singletonList("");
        }
    }
    // 로컬에 seller 폴더 삭제
    private void imageDelete(List<String> files, String seller) {
        try {
            for (String file : files) {                                    // 파일 1개씩
                File saveFile = new File(imageDir + seller, file);  // 이름, 경로를 가진 객체
                saveFile.delete();                                         // 폴더 내 파일 삭제
            }
            File dir = new File(imageDir + seller);               // 사용자명 폴더 삭제
            dir.delete();
        } catch (Exception e) {
            System.out.println("[PC] imageDelete Fail: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(@RequestParam String keyword) {
        try {
            List<Product> products = productService.searchByProductName(keyword);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("검색 중 오류가 발생했습니다.");
        }
    }

}
