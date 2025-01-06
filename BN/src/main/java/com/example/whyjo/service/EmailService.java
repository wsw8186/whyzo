package com.example.whyjo.service;

import com.example.whyjo.domain.entity.Order;
import com.example.whyjo.domain.entity.OrderItem;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOrderConfirmationEmail(Order order, String userEmail) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(userEmail);
        helper.setSubject("[WhyJo] 주문이 완료되었습니다.");

        StringBuilder emailContent = new StringBuilder();
        emailContent.append("<div style='max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;'>");
        emailContent.append("<h2 style='color: #5f0080; text-align: center;'>주문이 완료되었습니다.</h2>");
        emailContent.append("<p style='text-align: center;'>주문번호: ").append(order.getMerchantUid()).append("</p>");
        emailContent.append("<p style='text-align: center;'>주문일시: ").append(order.getOrderDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("</p>");
        
        emailContent.append("<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>");
        emailContent.append("<tr style='background-color: #f8f9fa;'>");
        emailContent.append("<th style='padding: 10px; border: 1px solid #dee2e6;'>상품명</th>");
        emailContent.append("<th style='padding: 10px; border: 1px solid #dee2e6;'>수량</th>");
        emailContent.append("<th style='padding: 10px; border: 1px solid #dee2e6;'>가격</th>");
        emailContent.append("</tr>");

        NumberFormat numberFormat = NumberFormat.getNumberInstance(Locale.KOREA);
        
        for (OrderItem item : order.getOrderItems()) {
            emailContent.append("<tr>");
            emailContent.append("<td style='padding: 10px; border: 1px solid #dee2e6;'>").append(item.getProductName()).append("</td>");
            emailContent.append("<td style='padding: 10px; border: 1px solid #dee2e6; text-align: center;'>").append(item.getAmount()).append("</td>");
            emailContent.append("<td style='padding: 10px; border: 1px solid #dee2e6; text-align: right;'>").append(numberFormat.format(item.getTotalPrice())).append("원</td>");
            emailContent.append("</tr>");
        }

        emailContent.append("</table>");

        emailContent.append("<div style='margin-top: 20px; text-align: right;'>");
        emailContent.append("<p>배송비: ").append(numberFormat.format(order.getShippingFee())).append("원</p>");
        emailContent.append("<p style='font-weight: bold; color: #5f0080;'>총 결제금액: ").append(numberFormat.format(order.getTotalAmount())).append("원</p>");
        emailContent.append("</div>");

        emailContent.append("<div style='margin-top: 30px; text-align: center;'>");
        emailContent.append("<p>마켓컬리를 이용해 주셔서 감사합니다.</p>");
        emailContent.append("</div>");
        emailContent.append("</div>");

        helper.setText(emailContent.toString(), true);
        mailSender.send(message);
    }
} 