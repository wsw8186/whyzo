WEB PROJECT PLANING
=

## ▶️ 컬리마켓 쇼핑몰
</br>

## ▶️ 개발 동기
<strong>
    <p>쇼핑몰 웹 서비스를 제작하게 된 이유는 뉴스 등 매체를 통해 생산의 복잡한 유통 과정을 확인하였고 이를 개선하기 위해 기획 되었습니다.</p>
    <p>생산자들이 사이트 관리자를 통해 상품을 판매할 수 있는 플랫폼을 제공하여 이익을 극대화하고</p>
    <p>소비자들이 신선하고 질 좋은 상품을 합리적인 가격에 구매할 수 있도록 하기 위해 개발되었습니다.</p>
</strong>
<br/>

## ▶️ 개발 목표
<strong>
    <p>쇼핑몰 웹 서비스 구축 및 배포</p>
</strong>
<br/>

## ▶️ 참가 인원 
[우상원 BE/FE]| [김기현 BE]| [지윤서 BE]|
<br/>

## ▶️ 개발 일정
|PLAN|일정|DESCRIPTION|
|---------------|----------------|------------------------|
|주제 선정 <br/> 요구사항 분석 <br/> 기술스택 결정 <br/> 개발환경 구축|2024-12-06 ~ 2024-12-10(05Days)|완료| 
|기본 구조 설계 <br/> 프론트엔드 및 백엔드 개발|2024-12-10 ~ 2024-12-19(10Days)|완료| 
|테스트 및 유지보수|2024-12-19 ~ 2024-12-23(5Days)|완료| 
<br/>

## ▶️ 역할
|조원|주역할|보조역할|
|---------------|----------------|------------------------|
|공통|요구사항분석 및 시스템 설계|-| 
|우상원(조장, BE/FE)|장바구니, 이메일, 결제, 리뷰, 유저 서비스|전체 서비스| 
|김기현(조원1, BE)|상품 서비스| 
|지윤서(조원2, BE)|상품 서비스|
<br/>

## ▶️ 개발 환경
|-|개발 환경|
|---------------|----------------|
|IDE|IntelliJ Idea|
|JDK|JDK 21|
|SpringBoot Version|3.4.0|
|Build Tool|gradle|
|DBMS|Mysql|
|Connection Pool|HikariCP|
|Security|Spring Security|
<br/>

## ▶️ 사용 API
|용도|제공|API 문서|
|---------------|----------------|------------------------|
|결제|아임포트|[링크](https://developers.portone.io/docs/ko/readme?v=v1)|
|인증|아임포트|[링크](https://developers.portone.io/docs/ko/readme?v=v1)|
|주소 찾기|다음|[링크](https://postcode.map.daum.net/guide)|
|OAuth2 로그인|카카오|[링크](https://developers.kakao.com/docs/latest/ko/index)|
|OAuth2 로그인|구글|[링크](https://console.cloud.google.com/)|
|OAuth2 로그인|네이버|[링크](https://developers.naver.com/products/login/api/api.md)|
|메일 발송|NAVER MAIL|
<br/>

## ▶️ SKILLS
#### BE
![JAVA](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=Java&logoColor=white)
![SpringBoot](https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![SpringSecurity](https://img.shields.io/badge/springsecurity-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
---

#### FE
![REACT](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white)
---

#### DATABASE
![MySQL](https://img.shields.io/badge/Mysql-4479A1?style=for-the-badge&logo=Mysql&logoColor=white)
---

<br/>

## ▶️ 주요 기능
|서비스|주요 기능|
|---------------|----------------|
|유저 서비스|<ul><li>JWT 기반 로그인</li><li>소셜 로그인 및 회원가입</li><li>아이디 및 비밀번호 찾기</li></ul>|
|상품 서비스|<ul><li>카테고리별 상품 조회</li><li>상품 등록/수정/삭제</li><li>상품 검색기능</li></ul>|
|사용자 마이페이지|<ul><li>리뷰 조회/등록/수정/삭제</li><li>장바구니 관리</li><li>주문/결제 내역 관리</li></ul>|
|관리자 페이지|<ul><li>상품 관리</li></ul>|
<br/>

## ▶️ ERD
<img width="978" alt="스크린샷 2025-01-06 오전 10 44 55" src="https://github.com/user-attachments/assets/45106404-050c-4453-9a62-de2e0cfc011f" />



## ▶️ 주요 END POINT DOC
### 회원 서비스
| URI           | REQUEST METHOD | DESCRIPTION            |
|---------------|----------------|------------------------|
| /api/v1/users         | POST               | 회원가입을 합니다. 회원가입은 포트원 본인인증 API를 사용해서 인증된 회원만 회원가입이 가능합니다. |
| /api/v1/users     | GET               | 회원이 가입한 이름과 이메일로 유저아이디를 찾는 서비스입니다. |
| /api/v1/users/{userId}     | POST               | 회원가입시 중복된 회원아이디인지 확인하는 서비스입니다. |
| /api/v1/users/password-resets     | POST               | 비밀번호를 잃어버린 회원이 비밀번호를 재설정하는 서비스입니다. |
| /api/v1/users/password-resets/{token}     | GET               | 비밀번호 변경을 위해 발급된 토큰이 유효한지 검사하는 서비스입니다.|
| /api/v1/users/password0resets/{token}    | PUT               | 변경된 비밀번호를 업데이트하는 서비스 입니다.  |
---
<br/>


### 상품 서비스
| URI           | REQUEST METHOD | DESCRIPTION            |
|---------------|----------------|------------------------|
| /productList | GET         | 상품 리스트를 조회합니다. | 
| /product | GET           | 상품 상세정보를 조회합니다  |
| /popularProducts | GET           | 카테고리별 인기 상품 리스트를 반환합니다. |
| /highDiscountProducts | GET         | 할인율이 높은 상품 리스트를 반환합니다.  |
| /recentProducts | GET        | 최근에 등록된 상품 리스트를 반환합니다.  |
| /admin/addProduct | GET        | 상품 등록 폼 페이지를 조회합니다.  |
| /admin/product | POST        | 상품을 등록합니다.  |
| /admin/modifyProduct | GET        | 상품 수정 폼 페이지를 조회합니다.  |
| /admin/product | PUT        | 상품을 수정합니다.  |
---
<br/>

### 게시판 서비스
| URI                | REQUEST METHOD | DESCRIPTION                  |
|--------------------|----------------|------------------------------|
| /customerInquiryBoardList       | GET                | 고객 문의 게시판을 조회합니다. |
| /customerInquiryBoard       | GET                | 고객 문의 상세 정보를 조회합니다. |
| /myCustomerInquiryBoardList       | GET                | 나의 고객 문의 게시판을 조회합니다. |
| /customerInquiryBoardComment       | GET                | 고객 문의 게시글에 작성된 댓글 리스트를 반환합니다. |
| /productInquiryBoardList       | GET                | 상품 문의 게시판을 조회합니다. |
| /productInquiryBoard       | GET                | 상품 문의 게시글을 조회합니다. |
| /productInquiryBoard/passwordCheck       | POST                | 상품 문의 게시글 비밀번호를 체크합니다. |
| /myProductInquiryBoardList      | GET                | 나의 상품 문의 게시판을 조회합니다. |
| /productInquiryBoardListAPI      | GET                | 상품에 대해 작성된 상품 문의 게시글 리스트를 반환합니다. |
| /productInquiry      | GET                | 상품 문의 게시글 작성 페이지를 조회합니다. |
| /productInquiry      | POST                | 상품 문의 게시글을 작성합니다. |
| /updateProductInquiry      | GET                | 상품 문의 게시글 수정 페이지를 조회합니다. |
| /productInquiry      | PUT                | 상품 문의 게시글을 수정합니다. |
| /productInquiry      | DELETE                | 상품 문의 게시글을 삭제합니다. |
| /ProductInquiryBoardComment      | GET                | 게시글에 작성된 댓글 리스트를 반환합니다. |
| /productReviewBoardListAPI      | POST                | 상품에 대해 작성된 상품 리뷰 리스트를 반환합니다. |
| /productReviewBoardList      | GET                | 상품 리뷰 게시판을 조회합니다. |
| /productReviewBoard      | GET                | 상품 리뷰 게시글을 조회합니다. |
| /myProductReviewBoardList      | GET                | 나의 상품 리뷰 게시판을 조회합니다. |
---
<br/>


### 장바구니 서비스
| URI           | REQUEST METHOD | DESCRIPTION            |
|---------------|----------------|------------------------|
| /cart         | GET               | 장바구니에 담긴 물건들을 보여주는 서비스입니다.|
| /cart         | POST              | 장바구니에 물건을 담는 서비스입니다. 비회원도 장바구니에 물건을 담을 수 있습니다. |
| /cart/Amount   | POST             | 장바구니에서도 물건의 수량을 변경할 수 있는 서비스입니다. 수량을 변경하면 cart-items의 테이블에 담긴 수량이 변경됩니다. |
| /cart/delete   | DELETE             | 장바구니에 담긴 물건을 삭제할 수 있는 서비스입니다. 물건을 삭제하면 CASCADE옵션으로 인해 cart의 하위 테이블도 함께 삭제됩니다. |
---
<br/>


### 주문/결제 서비스
| URI           | REQUEST METHOD | DESCRIPTION            |
|---------------|----------------|------------------------|
| /order         | GET              | 주문한 물건들을 보여주는 서비스입니다. 물건 주문 시 주문할 물건만 보여줍니다.|
| /order         | POST             | 물건들을 주문하는 서비스입니다. 물건 주문은 장바구니 또는 상품페이지에서 가능합니다. |
| /order/user    | GET              | 주문자 정보와 동일함 클릭시 회원가입시 입력한 정보를 바탕으로 화면에 전달해주는 서비스입니다. |
| /order/recent    | GET          | 최근에 입력한 배송지를 바탕으로 화면에 전달해주는 서비스입니다. |
| /payment/paymentForm         | GET        | 결제한 정보를 조회할 수 있는 서비스입니다.|
| /payment/save         | POST               | 결제한 정보를 저장하는 서비스입니다. 결제정보 저장 후 회원은 결제 정보 조회가 가능합니다.|
| /payment/cancel         | POST               | 결제를 취소하는 서비스입니다. 결제 취소는 관리자가 승인 한 이후 환불처리가 이루어집니다.|
---
<br/>

### 배송지 서비스
| URI                | REQUEST METHOD | DESCRIPTION                  |
|--------------------|----------------|------------------------------|
| /myPage/editAddress       | GET                | 배송지 작성/수정 페이지를 조회하는 서비스 입니다. |
| /myPage/editAddress       | POST                | 배송지를 작성/수정 하는 서비스 입니다. |
| /myPage/editAddress       | POST                | 배송지를 작성/수정 하는 서비스 입니다. |
| /order/shipping       | GET                | 나의 배송지 정보를 반환하는 서비스 입니다. |
---
<br/>

📃: File Tree
---
```

