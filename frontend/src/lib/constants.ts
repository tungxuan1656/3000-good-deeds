import {
  HeartHandshakeIcon,
  HomeIcon,
  LeafIcon,
  LineChartIcon,
  MoreHorizontalIcon,
  SettingsIcon,
  TargetIcon,
  TimerIcon,
} from 'lucide-react'

import type { GoalTypeDTO } from '@/types/api'

export const PATHS = {
  LOGIN: '/login',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  HOME: '/',
  TIMELINE: '/timeline',
  STATS: '/stats',
  GOALS: '/goals',
  DEEDS: '/deeds',
  INNER: '/inner',
  MORE: '/more',
  INNER_RANDOM_ACTS: '/inner/random-acts',
  INNER_JOURNAL: '/inner/journal',
  INNER_JOURNAL_HISTORY: '/inner/journal/history',
  SETTINGS: '/settings',
}

export const INNER_JOURNAL_TYPES = ['gratitude', 'repentance'] as const
export type InnerJournalType = (typeof INNER_JOURNAL_TYPES)[number]

export const INNER_JOURNAL_TYPE_LABELS: Record<InnerJournalType, string> = {
  gratitude: 'Biết ơn',
  repentance: 'Sám hối',
}

export const INNER_JOURNAL_TYPE_GUIDANCE: Record<InnerJournalType, string> = {
  repentance:
    'Hãy chậm lại một chút, nhìn thẳng vào điều đã khiến tâm bạn bất an hôm nay, ghi lại với sự trung thực và nhẹ nhàng, không để tự trách, chỉ để thấy rõ và buông xuống.',
  gratitude:
    'Hãy dành một khoảnh khắc nhận ra điều tốt đẹp đã đến với mình trong ngày, dù rất nhỏ, ghi lại để nuôi dưỡng sự trân trọng và giúp tâm mình lắng dịu hơn.',
}

export const INNER_JOURNAL_IMMUTABLE_NOTE =
  'Những dòng này được giữ nguyên như khoảnh khắc bạn đã thấy và đã viết; sau khi lưu, nội dung sẽ không sửa lại được, để việc quán chiếu được trọn vẹn và những gì được viết ra có thể buông xuống.'

export const APP_MENU_ITEMS = [
  { label: 'Trang chủ', path: PATHS.HOME, icon: HomeIcon },
  { label: 'Hành trình', path: PATHS.TIMELINE, icon: TimerIcon },
  { label: 'Tu tập', path: PATHS.INNER, icon: LeafIcon },
  { label: 'Thống kê', path: PATHS.STATS, icon: LineChartIcon },
  { label: 'Mục tiêu', path: PATHS.GOALS, icon: TargetIcon },
  { label: 'Gợi ý việc thiện', path: PATHS.INNER_RANDOM_ACTS, icon: HeartHandshakeIcon },
  { label: 'Cài đặt', path: PATHS.SETTINGS, icon: SettingsIcon },
]

export const BOTTOM_TAB_ITEMS = [
  { label: 'Trang chủ', path: PATHS.HOME, icon: HomeIcon },
  { label: 'Hành trình', path: PATHS.TIMELINE, icon: TimerIcon },
  { label: 'Tu tập', path: PATHS.INNER, icon: LeafIcon },
  { label: 'Thống kê', path: PATHS.STATS, icon: LineChartIcon },
  { label: 'Thêm', path: PATHS.MORE, icon: MoreHorizontalIcon },
]

export const GOAL_TYPES = ['weekly', 'monthly', 'yearly'] as const
export const GOAL_LABELS: Record<GoalTypeDTO, string> = {
  weekly: 'Mục tiêu tuần',
  monthly: 'Mục tiêu tháng',
  yearly: 'Mục tiêu năm',
}

export const MOOD_TAGS = ['An vui', 'Biết ơn', 'Nhẹ lòng', 'Ấm áp', 'Bình an', 'Hy vọng']

export const ONBOARDING_CONTENT = {
  general: {
    title: 'Chào mừng',
    steps: [
      {
        image: '/onboarding/onboarding_1.1.jpg',
        title: 'Đây không phải mạng xã hội',
        description:
          'Đây là không gian riêng để bạn nhìn lại chính mình, không khoe khoang và không so sánh.',
      },
      {
        image: '/onboarding/onboarding_1.2.jpg',
        title: 'Không chấm điểm – Không thao túng',
        description:
          'Ứng dụng không dùng điểm số hay cơ chế gây nghiện. Mọi thứ đều nhẹ nhàng và tự nguyện.',
      },
      {
        image: '/onboarding/onboarding_1.3.jpg',
        title: 'Mỗi việc nhỏ đều quý',
        description: 'Một hành động tử tế nhỏ cũng đủ nuôi dưỡng tâm mình mỗi ngày.',
      },
      {
        image: '/onboarding/onboarding_1.4.jpg',
        title: 'Dữ liệu thuộc về bạn',
        description: 'Mọi ghi nhận đều riêng tư. Bạn có thể xuất hoặc xóa dữ liệu bất cứ lúc nào.',
      },
    ],
  },
  deeds: {
    title: 'Ghi nhận việc thiện',
    steps: [
      {
        image: '/onboarding/onboarding_2.1.jpg',
        title: 'Thân – Khẩu – Ý',
        description: 'Bạn có thể ghi nhận theo ba nhóm để nhìn rõ cách mình thực hành mỗi ngày.',
      },
      {
        image: '/onboarding/onboarding_2.2.jpg',
        title: 'Ghi nhận để nhìn lại',
        description: 'Chỉ cần vài dòng ngắn để nhớ lại điều đã làm, không cần dài.',
      },
      {
        image: '/onboarding/onboarding_2.3.jpg',
        title: 'Riêng tư tuyệt đối',
        description: 'Ghi nhận này chỉ mình bạn thấy. Không công khai, không chia sẻ.',
      },
      {
        image: '/onboarding/onboarding_2.4.jpg',
        title: 'Sau khi lưu',
        description: 'Bạn có thể xem lại trong hành trình để soi chiếu khi cần.',
      },
    ],
  },
  quoteRandomActs: {
    title: 'Pháp ngữ & Gieo duyên',
    steps: [
      {
        image: '/onboarding/onboarding_3.1.jpg',
        title: 'Pháp ngữ theo phiên',
        description: 'Mỗi lần mở app, một câu pháp ngữ sẽ đồng hành với bạn trong phiên đó.',
      },
      {
        image: '/onboarding/onboarding_3.2.jpg',
        title: 'Gợi ý việc thiện nhỏ',
        description: 'Gợi ý chỉ để khởi tâm. Nếu phù hợp thì thử, không phù hợp có thể bỏ qua.',
      },
    ],
  },
  journey: {
    title: 'Hành trình',
    steps: [
      {
        image: '/onboarding/onboarding_4.1.jpg',
        title: 'Đường dài – không vội',
        description: 'Hành trình là tiến trình dài hạn, không phải cuộc đua.',
      },
      {
        image: '/onboarding/onboarding_4.2.jpg',
        title: 'Giữ nhịp nhẹ nhàng',
        description: 'Mỗi bước nhỏ đều đáng trân trọng. Hãy đi theo nhịp của mình.',
      },
    ],
  },
  stats: {
    title: 'Thống kê',
    steps: [
      {
        image: '/onboarding/onboarding_5.1.jpg',
        title: 'Soi chiếu, không phán xét',
        description: 'Các con số chỉ để nhìn lại thói quen của mình, không phải để đánh giá.',
      },
      {
        image: '/onboarding/onboarding_5.2.jpg',
        title: 'Chuỗi ngày chỉ là nhịp',
        description: 'Đứt quãng cũng không sao. Hãy bắt đầu lại khi bạn sẵn sàng.',
      },
    ],
  },
  journal: {
    title: 'Sổ tay quán chiếu',
    steps: [
      {
        image: '/onboarding/onboarding_6.1.jpg',
        title: 'Không gian riêng tư',
        description: 'Một nơi an toàn để bạn nhìn lại thân – khẩu – ý của mình.',
      },
      {
        image: '/onboarding/onboarding_6.2.jpg',
        title: 'Viết xong là đặt xuống',
        description: 'Viết để nhìn rõ rồi buông nhẹ. Không cần giữ lại cảm xúc nặng nề.',
      },
      {
        image: '/onboarding/onboarding_6.3.jpg',
        title: 'Sám hối / Biết ơn',
        description: 'Hai chế độ giúp bạn quán chiếu theo cách phù hợp với mình.',
      },
    ],
  },
}

export const ONBOARDING_KEYS = {
  general: 'onboarding.general.v1',
  deeds: 'onboarding.deeds.v1',
  quoteRandomActs: 'onboarding.quoteRandomActs.v1',
  journey: 'onboarding.journey.v1',
  stats: 'onboarding.stats.v1',
  journal: 'onboarding.journal.v1',
}
