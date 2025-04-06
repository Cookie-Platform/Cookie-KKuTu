# PieKKuTu
[끄투를 새롭게! 달레끄투](pie-kkutu.kro.kr)

본 프로젝트는 Cookie Platform 관리 제작합니다.

본 레포지토리를 사용하실 경우 layout.pug 또는 ko.KR.json에
```
글자로 놀자! 끄투 온라인. 본 게임은 달레끄투투의 레포지토리를 참고하여 제작되었습니다.
```
와 같이 소스를 변경해주시길 바랍니다.
아울러, 본 프로젝트에 원 끄투 레포지토리 파일과 PR 소스는 GNU 공중 일반 라이선스, 달레끄투 자체 제작은 GNU 아페로 공중 일반 라이선스입니다.

### 제작자
- [JJoriping](https://github.com/jjoriping) - 원 레포지토리 제작자
- [cookedas1](https://github.com/cookedas1) - 달레끄투 제작자.
- [TyphoonDANAS](https://github.com/TyphoonDANAS) - VelTu 제작자(참고 - DDDoS 보안 기능)
- [RevelabsKR](https://github.com/RevelabsKR) - 끄투코리아 제작팀(참고 - DDDoS 보안 기능)
- [d0ul](https://github.com/d0ul) - 플러스끄투 제작자(참고 - FA, 플끄 UI)

## 설치 전 참고
- 이 방법은 Windows 환경을 기준으로 작성되었습니다.
 - 참고하시길 바랍니다.
- 자신의 운영체제에 맞는 버전으로 설치/다운로드 해주시길 바랍니다.

### 설치 방법
1. 먼저 nodejs 버전 22로 다운로드 후 install 합니다.
 - 이 버전으로 설치하지 않을 경우 코드 중 오류가 포함되있을 수도 있습니다.
2. PostgreSQL을 버전 14로 다운로드 합니다.
3. Redis를 3.0.504 버전으로 다운로드 합니다.
 - Redis는 랭킹 데이터베이스입니다.
4. CMD 및 PowerShell을 이용해 DB를 main이라는 이름으로 생성합니다.
 - 유저 비밀번호는 PostgreSQL 인스톨에서 설정한 것을 입력하면 됩니다.
 - 비밀번호를 입력했을 때, 안보이는 것은 보안을 위해서기 때문입니다.
5. db.sql을 db에 입력합니다.
 - 예) psql -U "postgres" -d "main" -f "~~/db.sql"
 - ~~/db.sql은 db.sql의 경로입니다.
6. KKuTu-master/Server/lib/sub/global copy.json와 auth copy.json의 이름을 global.json, auth.json으로 변경합니다.
7. global.json에서 PG_PASS 값을 PostgreSQL 비밀번호로 변경합니다.
8. KKuTu-master/server-setup.bat를 실행합니다.
 - 이 작업은 node_modules를 설치합니다.

### 실행 방법
1. Redis를 실행합니다.
 - MSI로 설치를 했다면 실행할 필요가 없습니다.
2. KKuTu-master/Server/run.bat 파일을 실행합니다.
3. 서버매니저의 서버탭에서 서버 열기를 누릅니다.
4. 인터넷에서 localhost를 입력 후 들어갑니다.

#### 이슈 작성 전
- JJoriping님의 KKuTu의 이슈 689를 읽고 이슈를 작성하세요.
- ~~를 어떻게 하나요? 같은 질문은 이미 이슈에 나와있습니다.
