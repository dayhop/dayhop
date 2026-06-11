export const metadata = {
  title: '개인정보처리방침 - DayHOP',
  description: 'DayHOP 서비스의 개인정보처리방침을 안내해 드립니다.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-bg min-h-screen py-16 md:py-24">
      <div className="mx-auto max-w-[640px] px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-text-primary mb-3 text-3xl font-semibold tracking-tight">
            개인정보처리방침
          </h1>
          <p className="text-text-tertiary text-sm">시행일자: 2026년 6월 8일</p>
        </div>

        {/* Content */}
        <div className="text-text-secondary space-y-10 text-[15px] leading-relaxed">
          <p>
            주식회사 코드잇(이하 &ldquo;회사&rdquo;)은 이용자의 개인정보를 보호하고 관련 법령을
            준수하기 위하여 최선을 다하고 있습니다. 본 개인정보처리방침은 회사가 제공하는 DayHOP
            서비스(이하 &ldquo;서비스&rdquo;)를 이용하는 이용자의 개인정보가 어떠한 용도와 방식으로
            이용되고 있으며, 개인정보 보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
          </p>

          <section className="space-y-4">
            <h2 className="text-text-primary text-base font-semibold">
              1. 수집하는 개인정보 항목 및 수집방법
            </h2>
            <p>
              회사는 회원가입, 원활한 고객 상담, 각종 서비스 제공을 위해 서비스 최초 이용 시 아래와
              같은 개인정보를 수집하고 있습니다.
            </p>
            <ul className="text-text-tertiary border-border-default space-y-2 border-l-2 pl-4 text-[14px]">
              <li>• 필수 수집 항목: 이메일 주소, 비밀번호, 닉네임, 프로필 이미지</li>
              <li>
                • 서비스 이용 과정에서 자동 생성되어 수집되는 항목: IP 주소, 쿠키, 방문 일시, 서비스
                이용 기록, 불량 이용 기록, 기기 정보
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-text-primary text-base font-semibold">
              2. 개인정보의 수집 및 이용목적
            </h2>
            <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
            <ul className="text-text-tertiary border-border-default space-y-2 border-l-2 pl-4 text-[14px]">
              <li>
                • 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용
                방지와 비인가 사용 방지, 가입 의사 확인, 고지사항 전달
              </li>
              <li>
                • 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산: 콘텐츠 제공, 체험
                예약 및 결제 처리
              </li>
              <li>
                • 신규 서비스 개발 및 마케팅·광고에의 활용: 신규 서비스 개발 및 맞춤 서비스 제공,
                통계학적 특성에 따른 서비스 제공 및 광고 게재, 서비스의 유효성 확인, 이벤트 정보 및
                참여기회 제공
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-text-primary text-base font-semibold">
              3. 개인정보의 보유 및 이용기간
            </h2>
            <p>
              회사는 이용자의 개인정보를 회원 탈퇴 시까지 보유 및 이용하며, 탈퇴 즉시 지체 없이
              파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이
              관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
            </p>
            <ul className="text-text-tertiary border-border-default space-y-2 border-l-2 pl-4 text-[14px]">
              <li>
                • 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한
                법률)
              </li>
              <li>
                • 대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한
                법률)
              </li>
              <li>
                • 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래 등에서의 소비자보호에
                관한 법률)
              </li>
              <li>• 웹사이트 방문 기록 (로그 기록): 3개월 (통신비밀보호법)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-text-primary text-base font-semibold">
              4. 개인정보의 파기절차 및 방법
            </h2>
            <p>
              이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이
              파기합니다. 회사의 개인정보 파기절차 및 방법은 다음과 같습니다.
            </p>
            <ul className="text-text-tertiary border-border-default space-y-2 border-l-2 pl-4 text-[14px]">
              <li>
                • 파기절차: 이용자가 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 별도의 DB로
                옮겨져 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간 보존된 후
                파기됩니다.
              </li>
              <li>
                • 파기방법: 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을
                사용하여 삭제하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여
                파기합니다.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-text-primary text-base font-semibold">
              5. 이용자의 권리와 그 행사방법
            </h2>
            <p>
              이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며
              가입해지를 요청할 수도 있습니다. 이용자가 개인정보의 오류에 대한 정정을 요청하신
              경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지 않습니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-text-primary text-base font-semibold">
              6. 개인정보 보호책임자 및 담당부서
            </h2>
            <p>
              회사는 이용자의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와
              같이 관련 부서 및 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="text-text-tertiary border-border-default my-2 space-y-1 border-t border-b py-4 text-[14px]">
              <p className="text-text-primary font-medium">개인정보 보호담당부서: DayHOP 운영팀</p>
              <p>• 이메일: support@dayhop.co.kr</p>
              <p>• 전화번호: 1544-0000</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
