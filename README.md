WEB PROJECT PLANING
=

## ▶️ 컬리마켓 쇼핑몰
</br>

## ▶️ 개발 동기
<strong>
    <p>쇼핑몰 웹 서비스를 제작하게 된 이유는 뉴스 등 매체를 통해 복잡한 유통 과정을 확인하였고 이를 개선하기 위해 기획 되었습니다.</p>
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
|우상원(조장, BE/FE)|프론트엔드 구현,장바구니, 이메일, 결제, 리뷰, 유저 서비스|전체 서비스| 
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

JPA,
JAVAMAILSENDER

---

#### FE
![REACT](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

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
|인증 서비스|<ul><li>회원가입시 포트원API를 이용한 유저정보 가져오기</li><li>포트원API를 이용한 결제</li></ul>|
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
| /product/listAll | GET         | 상품 리스트를 조회합니다. | 
| /product/listId/{id} | GET           | 상품 상세정보를 조회합니다  |
| /product/add | POST           | 상품을 등록합니다. |
| /product/edit/{id} | GET         | 상품 수정을 원하는 데이터를 조회합니다.  |
| /product/edit/update | PUT        | 상품을 수정합니다.  |
| /product/search | GET        | 원하는 상품을 검색을 통해 조회합니다.  |
| /product/edit/delete/{id} | DELETE        | 상품을 삭제합니다.  |
---
<br/>

### 인증 서비스
| URI                | REQUEST METHOD | DESCRIPTION                  |
|--------------------|----------------|------------------------------|
| /api/auth/login       | POST                | 로그인 관련 서비스입니다 jwt토큰발급하여 쿠키에 저장합니다. |
| /api/auth/logout       | POST                | 로그아웃 관련 서비스입니다 쿠키에 저장된 jwt토큰을 삭제합니다. |
| /api/auth/check       | GET                | 쿠키에 저장된 jwt토큰을 받아 유저정보를 추출합니다.
---
<br/>


### 장바구니 서비스
| URI           | REQUEST METHOD | DESCRIPTION            |
|---------------|----------------|------------------------|
| /api/cart         | GET               | 장바구니에 담긴 물건들을 보여주는 서비스입니다.|
| /api/cart/add         | POST              | 장바구니에 물건을 담는 서비스입니다.|
| /api/cart/{cartItemId}   | DELETE             | 장바구니에 담긴 물건을 삭제할 수 있는 서비스입니다.|
---
<br/>


### 주문/결제 서비스
| URI           | REQUEST METHOD | DESCRIPTION            |
|---------------|----------------|------------------------|
| /api/orders/my-orders         | GET              | 주문한 물건들을 보여주는 서비스입니다.|
| /api/orders         | POST             | 물건들을 주문하는 서비스입니다. 물건 주문은 장바구니에서 가능합니다. |

---
<br/>

### 증명 서비스
| URI           | REQUEST METHOD | DESCRIPTION            |
|---------------|----------------|------------------------|
| /certifications         | POST              | 회원가입시 포트원 본인인증API를 이용하여 인증된 유저정보를 받아오는 서비스 입니다.|

---
<br/>

### 리뷰 서비스
| URI                | REQUEST METHOD | DESCRIPTION                  |
|--------------------|----------------|------------------------------|
| /api/reviews/user       | GET                | 회원이 작성한 리뷰를 조회하는 서비스 입니다. |
| /api/reviews/product/{productId}       | GET                | 상품에 등록된 리뷰를 조회하는 서비스 입니다. |
| /api/reviews       | POST                | 구매한 상품에 대해 리뷰를 작성하는 서비스 입니다. |
| /api/reviews/{reviewId}       | PUT                | 작성한 리뷰를 수정하는 서비스 입니다. |
| /api/reviews/{reviewId}       | DELETE                | 작성한 리뷰를 삭제하는 서비스 입니다. |
---
<br/>

## ▶️ 기능시현
<strong>
    <p>회원가입</p>
    <img width="auto" alt="스크린샷 2025-01-06 오전 10 44 55" src="https://github.com/user-attachments/assets/2ea2d673-208d-4779-8a07-33a161f47c21" />
    <br/>
    <img width="978" src="https://github.com/user-attachments/assets/7189f605-2723-41dd-bca3-28a656967e87" />
    <br/>
</strong>
<br/>
<strong>
    <p>OAuth2로그인</p>
    <img width="auto" alt="스크린샷 2025-01-06 오전 10 44 55" src="https://github.com/user-attachments/assets/c45bb353-caf4-4d1d-888b-928de3f5b64a" />
    <img width="auto" alt="스크린샷 2025-01-06 오전 10 44 55" src="https://github.com/user-attachments/assets/89f359bf-34dc-43cb-9aed-717f8dcb4d7e" />
    <img width="auto" alt="스크린샷 2025-01-06 오전 10 44 55" src="https://github.com/user-attachments/assets/b48b27c5-b5df-4da7-be27-70ce14137eeb" />
    <br/>
    <img width="978" src="https://github.com/user-attachments/assets/d812b683-d937-466b-be39-ed74627e500b" />
     <br/>
</strong>
<br/>
<strong>
    <p>아이디 및 비밀번호 찾기</p>
    <img width="978" src="https://github.com/user-attachments/assets/a2323341-38c4-4672-a1a7-771132de2887" />
     <br/>
</strong>
<br/>
<strong>
    <p>결제</p>
    <p>링크 클릭시 동영상이 재생됩니다</p>
    https://github.com/user-attachments/assets/de356a2e-395a-4f17-9bd5-b5bfe5c2a662
    <br/>
</strong>
<br/>
<strong>
    <p>리뷰</p>
    <p>링크 클릭시 동영상이 재생됩니다</p>
    https://github.com/user-attachments/assets/e1717467-401d-471b-8629-28e9fc928868
    <br/>
</strong>
<br/>
<strong>
    <p>검색 및 필터</p>
    <p>링크 클릭시 동영상이 재생됩니다</p>
    https://github.com/user-attachments/assets/b7d5d146-5a1e-4a72-af7d-63f695699b60
    <br/>
</strong>
<br/>
<strong>
    <p>관리자페이지 및 상품 수정/삭제/등록</p>
    <p>링크 클릭시 동영상이 재생됩니다</p>
    https://github.com/user-attachments/assets/1c6130c0-6c68-462a-b132-b47e024edaf0
    <br/>
</strong>
<br/>






## ▶️ 프로젝트를 진행하며 느낀점
<strong>
  프로젝트를 시작할 때 ERD나 Use Case 설계 없이 바로 코드를 작성하는 일이 많았습니다. 처음에는 이런 방식을 간단하고 빠른 접근이라고 생각했지만, 시간이 지날수록 문제가 발생하기 시작했습니다.
  데이터베이스 관계가 꼬이거나, 기능 요구 사항이 명확하지 않아 작업이 지연되었고, 결과적으로 프로젝트의 방향성을 잃는 일이 잦았습니다. 
  작은 프로젝트였음에도 불구하고 데이터 모델 설계가 부족하여 코드를 대대적으로 수정해야 했던 일이 있었습니다. 
  이 경험을 통해, 제대로 된 설계 없이 시작하면 나중에 수정과 보완에 더 많은 시간이 들 뿐 아니라 팀원들과의 소통에도 큰 어려움을 겪는다는 것을 깨달았습니다.
</strong>



