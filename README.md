# 7기 미니 프로젝트 1조(BE) 🐶🐱🐰 쇼미더펫

## 👏 프로젝트 소개
내 반려동물이 너무너무 사랑스럽고 자랑하고 싶지 않으신가요?</br>
그럴 때는 쇼미더펫을 이용해서 반려동물을 자랑해보세요!</br>
쇼미더펫을 이용하시면 반려동물의 사진과 글을 올리며 여러 사람과 소통할 수 있어요!

## 👨‍💻 프로젝트 기간 및 참여인원
2022.06.10.(금) ~ 2022.06.16.(목)</br>

|구분|주특기|Name|
|:---:|:---:|:---:|
|FE|<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">|이가연|
|FE|<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">|이윤영|
|BE|<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">|이호욱|
|BE|<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">|정연욱|
|BE|<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">|조세림|
|BE|<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">|채예찬|

## ⚙️ BE 구현 기능 및 사용 라이브러리 목록
- 회원가입 & 로그인 & 중복검사 기능: bcrypt, Joi, jsonwebtoken 라이브러리 활용
- 게시글 작성 기능: multer, multer-s3-v2, aws-sdk 라이브러리 활용하여 파일 업로드 가능하게 구현
- 게시글 전체조회 기능
- 게시글 상세조회 기능
- 게시글 수정 기능
- 게시글 삭제 기능
- 게시글 좋아요 기능
- 댓글 작성 기능
- 댓글 조회 기능
- 댓글 수정 기능
- 댓글 삭제 기능
- swagger 추가

## 📖 API 설계 명세서
https://www.notion.so/SA-1-b7e7381627244f518ae98ef2e36871cd

## 🛠 BE 사용기술
<div align=center>
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/mongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white">
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
</div>

<div align=center>
<img src="https://img.shields.io/badge/amazonaws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white"> 
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
</div>

## 🤯 Trouble Shooting
- 회원가입&로그인 기능: 프론트 분들 요청에 따라 response 변경
- 게시글 CRUD 기능
  - 게시글 상세조회 기능에 본인여부 확인 추가
  - date 날짜 형식을 프론트분들 요청에 따라 yyyy-mm-dd 형식으로 변경</br>
   (board 스키마의 data형식을 string타입으로 바꾸고 moment와 문자열 메소드 split을 사용)
  - multer-s3와 aws-sdk의 버전을 맞춰서 설치하지 않아 오류가 발생함 -> aws-sdk 버전에 맞춰 multer-s3를 multer-s3-v2로 설치하니 문제 해결됨
  - 게시글 작성 post 요청시 thunder client에서는 이미지 파일이 s3로 잘 넘어갔는데 postman으로 요청 시에는 오류가 발생하고 이미지도 s3로 넘어가지 않음. 이 문제는 아직 해결되지 않았으며, postman의 보안문제라고 추측함
  - thunder client 사용 시 form 데이터 value 값에 json 형식으로 post 요청을 하였을 때는 오류가 발생했는데 key값과 value값 각각에 데이터를 하나씩 넣었더니 문제가 해결되었음
- 댓글 CRUD 기능
  - 각각의 게시글의 댓글을 분류하기 위해 params로 commentId값을 설정하였는데 자동으로 commentID 값을 설정하기 위해 maxcommentId 변수 설정 후 commentId값을 1로 설정하고 if문을 사용하여 문제 해결
- Git
  - merge 과정에서 package.json file과 package-lock.json file의 충돌이 발생하였음 -> package-lock.json과 package.json의 연관성을 찾아 node_modules와 package-lock.json file을 삭제 후 다시 npm install 시도 But, 실패 -> 결과적으로 기존 파일에서 해결점을 찾지 못해 git main branch에 있는 파일을 클론하여 다시 프로젝트를 설정하여 문제 해결
  - merge 충돌을 겪은 후 항상 협업 전에는 각자의 branch를 생성하고 origin 원격저장소에 있는 변경된 main branch를 자신의 branch로 pull한 후 작업을 시작해야겠다고 느낌
