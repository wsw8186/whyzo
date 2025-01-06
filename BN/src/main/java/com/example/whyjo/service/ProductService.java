package com.example.whyjo.service;

import com.example.whyjo.domain.entity.Product;
import com.example.whyjo.domain.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // products table create -> insert
    public Product insertProduct(Product product) {

        return productRepository.save(product);
    }

    // 전체 상품 조회
    public List<Product> selectAllProduct() {

        return productRepository.findAll();
    }
    // productid 기준으로 조회
    public Product selectById(Long id) {
        Product product = productRepository.findSellerById(id);
        if (product == null) {
            throw new RuntimeException("상품을 찾을 수 없습니다.");
        }
        return product;
    }

    // productid 기준으로 삭제
    public void deleteProductById(Long id) {
        productRepository.deleteById(id);
    }

    public Product updateProduct(Product product) { //  == insert

        return productRepository.save(product);
    }

    // productid로 seller 찾기
    public boolean checkSeller(Long id, String seller) {
        Product product = productRepository.findSellerById(id);
        return product != null && product.getSeller().equals(seller);
    }

    public List<Product> searchByProductName(String keyword) {
        return productRepository.findByProductnameContainingIgnoreCase(keyword);
    }

}
