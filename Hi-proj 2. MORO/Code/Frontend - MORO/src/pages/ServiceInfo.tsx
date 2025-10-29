
import TabsNav from "../components/TabNav";

import "../styles/serviceinfo.css";

export default function ServiceInfo() {
  return (
    <div className="si">
      {/* 상단 탭 네비 */}
      <section className="container">
        <TabsNav/>
      </section>

      {/* 헤더 타이틀 */}
      <section className="si-hero container">
        <h1 className="si-title">MORO를 어떻게 이용하면 될까요?</h1>
        <p className="si-desc">
          MORO와 대화를 시작합니다. 대화가 구체적일수록 훨씬 정밀한 추천을 받을 수 있어요!
        </p>
      </section>

      {/* Step 1 */}
      <section className="si-step container">
        <h2 className="si-step-title">1. MORO와 대화를 시작합니다</h2>
        <div className="chat-card">
          <ChatBubble role="assistant">만족도 높은 자신만의 여행이 가고 싶다면 먼저 본인에 대해 생각해봐야합니다.</ChatBubble>
          <ChatBubble role="assistant">안녕하세요 username님, 지금까지 자연 속 힐링에 높은 반응을 보이셨어요. 맞다면 알려주세요!</ChatBubble>
          <ChatBubble role="user">힐링이 좋아</ChatBubble>
          <ChatBubble role="assistant">그렇다면 username님, 좋아하는 계절과 활동이 있으실까요?</ChatBubble>
          <ChatBubble role="user">나는 여름을 좋아하고, 혼자서 걷기를 좋아해요.</ChatBubble>
        </div>
        <p className="si-note">MORO와 대화를 통해 요즘 어떤 여행이 어울리는지 또는 거리가 끌렸던 경험/계절/취향을 자유롭게 말씀해주세요.</p>
      </section>

      {/* Step 2 */}
      <section className="si-step container">
        <h2 className="si-step-title">2. 취향/조건을 조금 더 구체화해요</h2>
        <div className="chat-card">
          <ChatBubble role="assistant">휴양지도 괜찮으신가요?</ChatBubble>
          <ChatBubble role="user">휴양지도 좋아요.</ChatBubble>
          <ChatBubble role="assistant">제공드린 키워드 중 마음에 드는 키워드는 없었나요? 없었다면 추가로 고민해보겠습니다.</ChatBubble>
          <ChatBubble role="user">조용한 산책 위주로, 짧은 3박 4일로 가고 싶어</ChatBubble>
          <ChatBubble role="assistant" wide>
            그럼 관광지나 볼거리가 많은 곳보다는 아기자기한 풍경이 매력인 곳이 더 좋겠네요.<br/>
            그동안의 맥락으로 만들어진 경로/장소/메모를 카테고리로 정리해드리고 (username)님 노션 보드에 저장됩니다.
          </ChatBubble>
        </div>
      </section>

      {/* Step 3 */}
      <section className="si-step container">
        <h2 className="si-step-title">3. 지금 입력한 정보는 템플릿으로 저장돼요</h2>
        <div className="chat-card">
          <ChatBubble role="assistant" tone="link">
            (username)님! 추천지를 이렇게 받았거나 플랜이 완료되었으면 아래 링크로 내보내주세요!{" "}
            <a href="#" onClick={(e)=>e.preventDefault()} className="si-link">[템플릿 복제 링크]</a>
          </ChatBubble>
        </div>
      </section>

      {/* Step 4 */}
      <section className="si-step container">
        <h2 className="si-step-title">4. 템플릿은 사용자의 노션 홈으로 복제해서 사용할 수 있어요</h2>
        <p className="si-note">
          템플릿은 노션 페이지 링크로 제공되며 사용자의 노션 홈으로 복제해서 사용할 수 있습니다.<br/>
          노션 페이지를 사용자의 노션 홈에 복제하는 기능은 우측 상단 사각형이 두개 겹쳐져 있는 아이콘을 누르거나 없을 시<br/>
          점 세개 형태의 아이콘을 누르면 확인하실 수 있습니다.<br/><br/>

          노션 템플릿은 만들어져 있는 템플릿에 사용자의 여행 정보를 반영하여 제공합니다.<br/>
          챗봇과 대화를 통해 작성한 계획도 반영하여 제공하기 때문에 이후 추가로 입력할 정보만 입력하면 완성됩니다.<br/><br/>

          다만 <span style={{fontWeight: 600}}>노션 데이터베이스는(일정, 예산 부분) csv 파일 형태로 제공</span>되므로 해당 csv 파일은<br/>
          [ /(슬래시) 입력 혹은 + 버튼 이용해서 요소 추가 - 데이터베이스 - 인라인 뷰 csv 불러오기(import csv) ] 과정을 통해 사용하실 수 있습니다.<br/><br/>
          
          현재 웹페이지에 따로 저장해두는 기능이 없기 때문에 사용자의 노션으로 복제해서 사용하셔야하며<br/>
          제공된 노션 페이지의 <span style={{fontWeight: 600}}>원본은 24시간 동안 유지됩니다. (사용자가 사용자의 노션홈에 복제한 페이지와는 무관)</span>
        </p>
      </section>

      {/* Step 5 */}
      <section className="si-step container">
        <h2 className="si-step-title">5. 노션을 사용하지 않는다면 스마트폰 기본 메모장으로 이용 가능 </h2>
        <p className="si-note">
          노션을 이용하지 않는 사용자의 경우, 챗봇이 노션 사용 여부를 묻는 질문에서 사용하지 않는다고 대답하시면<br/>
          스마트폰 기본 메모앱에 붙여 넣어 사용하실 수 있는 형태로 정리해 제공해드립니다.<br/><br/>

          다만 노션과 완전히 동일한 기능을 지원하지 못하며 텍스트로 제공되므로 이를 참고해주시면 감사하겠습니다.

        </p>
      </section>
    </div>
  );
}

/* --- 내부 미니 컴포넌트: 채팅 말풍선 --- */
function ChatBubble({
  role, children, wide = false, tone
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
  wide?: boolean;
  tone?: "link";
}) {
  const isUser = role === "user";
  return (
    <div
      className={`bubble-row ${isUser ? "right" : "left"}`}
      style={{ justifyContent: isUser ? "flex-end" : "flex-start" }}
    >
      <div
        className={`ch-bubble ${isUser ? "bubble--user" : "bubble--assistant"} ${wide ? "bubble--wide" : ""} ${tone==="link" ? "bubble--link" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}