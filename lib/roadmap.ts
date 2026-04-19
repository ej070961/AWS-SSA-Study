import type { RoadmapPhase } from "@/types";

export const ROADMAP: RoadmapPhase[] = [
  {
    phase: 1,
    title: "기초 인프라",
    subtitle: "모든 개념의 토대 — 반드시 먼저",
    color: "#4f8ef7",
    topics: [
      {
        name: "IAM",
        domainIndex: 0,
        reason: "AWS 권한 체계의 뿌리. 이걸 모르면 모든 서비스 접근 제어가 이해 안 됨",
        next: ["Security Groups", "Secrets Manager", "KMS"],
      },
      {
        name: "Security Groups",
        domainIndex: 0,
        reason: "EC2/RDS 등 모든 리소스 방화벽. IAM(누가)을 알면 SG(어디서)가 연결됨",
        next: ["NACLs", "ELB"],
      },
      {
        name: "NACLs",
        domainIndex: 0,
        reason: "SG와 한 쌍. SG=인스턴스 레벨, NACL=서브넷 레벨 차이가 핵심",
        next: ["VPC Endpoints", "WAF & Shield"],
      },
      {
        name: "VPC Endpoints",
        domainIndex: 0,
        reason: "인터넷 없이 S3/DynamoDB 접근. 비용 절감 + 보안 동시 해결 패턴",
        next: ["S3 보안", "NACLs"],
      },
    ],
  },
  {
    phase: 2,
    title: "컴퓨팅 & 스토리지",
    subtitle: "시험 출제 비중 최상위",
    color: "#3ecf8e",
    topics: [
      {
        name: "EC2 인스턴스 타입",
        domainIndex: 2,
        reason: "모든 아키텍처의 기본 빌딩 블록. 구매 옵션과 같이 공부",
        next: ["EBS & EFS", "Auto Scaling", "EC2 구매 옵션"],
      },
      {
        name: "EBS & EFS",
        domainIndex: 2,
        reason: "EC2 스토리지 선택 기준. EBS(단일) vs EFS(다중 공유) 비교가 단골",
        next: ["S3 스토리지 클래스", "Backup & DR"],
      },
      {
        name: "S3 보안",
        domainIndex: 0,
        reason: "S3는 시험의 40%에 등장. 버킷 정책/ACL/Block Public Access/암호화 필수",
        next: ["S3 스토리지 클래스", "S3 Replication", "KMS"],
      },
      {
        name: "S3 스토리지 클래스",
        domainIndex: 3,
        reason: "Standard→IA→Glacier 라이프사이클이 비용 최적화 단골 문제",
        next: ["Backup & DR", "비용 관리 도구"],
      },
    ],
  },
  {
    phase: 3,
    title: "고가용성 아키텍처",
    subtitle: "가장 많은 시나리오 문제 출제 영역",
    color: "#f97316",
    topics: [
      {
        name: "ELB",
        domainIndex: 2,
        reason: "ALB/NLB/CLB 구분 + 타깃 그룹 설정이 단골. SG와 묶어서 이해",
        next: ["Auto Scaling", "Route 53"],
      },
      {
        name: "Auto Scaling",
        domainIndex: 2,
        reason: "동적/예약/예측 스케일링 정책 차이가 시험 핵심",
        next: ["RDS Multi-AZ", "ELB"],
      },
      {
        name: "RDS Multi-AZ",
        domainIndex: 2,
        reason: "Multi-AZ(HA) vs Read Replica(성능) 차이가 매 시험 출제",
        next: ["Aurora", "ElastiCache"],
      },
      {
        name: "Aurora",
        domainIndex: 2,
        reason: "Aurora Serverless / Global DB / Multi-Master가 고급 문제 단골",
        next: ["DynamoDB", "RDS Multi-AZ"],
      },
      {
        name: "Route 53",
        domainIndex: 2,
        reason: "라우팅 정책 6가지(가중치/지연/장애조치 등) 시나리오 구분 필수",
        next: ["CloudFront", "Global Accelerator"],
      },
    ],
  },
  {
    phase: 4,
    title: "서버리스 & 이벤트",
    subtitle: "현대 아키텍처 패턴 이해 필수",
    color: "#a855f7",
    topics: [
      {
        name: "SQS",
        domainIndex: 1,
        reason: "Standard vs FIFO, 가시성 타임아웃, DLQ 개념이 핵심",
        next: ["SNS", "Lambda"],
      },
      {
        name: "SNS",
        domainIndex: 1,
        reason: "Fan-out 패턴 (SNS→SQS 복수 구독)이 아키텍처 문제에 자주 등장",
        next: ["SQS", "Lambda"],
      },
      {
        name: "Lambda",
        domainIndex: 1,
        reason: "트리거 종류, 동시성 제한, 레이어 개념이 시험 포인트",
        next: ["API Gateway", "DynamoDB"],
      },
      {
        name: "API Gateway",
        domainIndex: 1,
        reason: "REST vs HTTP vs WebSocket API 차이 + Lambda 통합 패턴",
        next: ["Lambda", "Cognito"],
      },
      {
        name: "Kinesis",
        domainIndex: 1,
        reason: "Data Streams vs Firehose vs Analytics 구분이 빈출",
        next: ["SQS", "S3 스토리지 클래스"],
      },
    ],
  },
  {
    phase: 5,
    title: "보안 심화 & 네트워킹",
    subtitle: "30% 비중 Secure 도메인 마무리",
    color: "#ef4444",
    topics: [
      {
        name: "KMS",
        domainIndex: 0,
        reason: "CMK/AWS 관리형 키 차이, 키 정책 vs IAM 정책 구분이 핵심",
        next: ["Secrets Manager", "S3 보안"],
      },
      {
        name: "Secrets Manager",
        domainIndex: 0,
        reason: "자동 로테이션 기능이 Parameter Store와의 차이점 — 빈출 비교 문제",
        next: ["KMS", "RDS Multi-AZ"],
      },
      {
        name: "WAF & Shield",
        domainIndex: 0,
        reason: "WAF(L7 필터) vs Shield(DDoS) vs Shield Advanced 적용 범위 구분",
        next: ["CloudFront", "NACLs"],
      },
      {
        name: "CloudFront",
        domainIndex: 2,
        reason: "오리진, 캐시 동작, OAC/OAI, Lambda@Edge 패턴이 단골",
        next: ["Route 53", "Global Accelerator"],
      },
      {
        name: "Global Accelerator",
        domainIndex: 2,
        reason: "CloudFront와 비교(Anycast IP vs CDN), 정적 IP 제공 여부가 핵심",
        next: ["Route 53", "CloudFront"],
      },
    ],
  },
  {
    phase: 6,
    title: "비용 최적화",
    subtitle: "20% 비중, 계산 문제 多",
    color: "#eab308",
    topics: [
      {
        name: "EC2 구매 옵션",
        domainIndex: 3,
        reason: "On-Demand/Reserved/Spot/Dedicated 비용 시나리오 선택 문제가 다수",
        next: ["Spot", "Savings Plans"],
      },
      {
        name: "Spot",
        domainIndex: 3,
        reason: "중단 가능 워크로드 + Spot Fleet 전략(lowest-price/diversified) 빈출",
        next: ["EC2 구매 옵션", "Auto Scaling"],
      },
      {
        name: "Savings Plans",
        domainIndex: 3,
        reason: "Compute vs EC2 Savings Plans 적용 범위 차이, Reserved와 비교",
        next: ["EC2 구매 옵션", "비용 관리 도구"],
      },
      {
        name: "비용 관리 도구",
        domainIndex: 3,
        reason: "Cost Explorer/Budgets/Trusted Advisor 역할 구분, 알람 설정",
        next: ["Savings Plans", "S3 스토리지 클래스"],
      },
    ],
  },
];

export const ALL_TOPICS = ROADMAP.flatMap((p) => p.topics.map((t) => t.name));
