# DB Project

## Backend

- 소소한 변경점
  - 테이블 이름 **모두 소문자로** 바꿈
  - user table **Uid** Autoincrement로 바꿈
  - user table **salt** attribute 지워도 됨
  - user Gender, UType **ENUM**으로 바꿈
  - 디버깅위해 allowNull true로 바꾼것 많음
  - 디비 고쳐서 forward engineering할때 위에 것들 고려해서 해주세용

- 요청한 유저의 정보는 req.Uid, req.username으로 가져올 수 있다.

## Frontend

- containers/eval, containers/submit에 각자 구현하면 됨. topbar는 따로 관리하므로, 페이지에 포함 안해도 됨. /submit , /eval 에 각각 하위페이지 만들면 될듯 함. react-router 문서 읽어보기를 권장합니다 https://reactrouter.com/web/example/nesting
- components/TopBar.js 에 evalBoard, submitBoard에 역할별 TopBar 구현해야 한다.
- 링크 걸때 <a>이나 <link> 로 걸면 안됨. 로그인 세션 풀림. useHistory() 후크 사용하자.
- 가급적 functional component + hook 사용
- 사용자 정보는 useSelector로 state.authentication.user에서 가져옴. role, username등 여기서 가져오면 됨.
- 서버에 요청할때 services/user.service.js 이용해 요청하면 됨. 근데 이건 더 손봐야함. 유저정보는 자동으로 보내게 고칠게용. 요청 보낼때 유저정보 보낼필요 없어용
- 테이블은 https://material-table.com/ 로 통일. 혹시 더 좋은 테이블 컴포넌트 찾으면 말해주세용