import NFeedback from '@/screens/NFeedback';
import NFilter from '@/screens/NFilter';
import NMessages from '@/screens/NMessages';
import NMessenger from '@/screens/NMessenger';
import NNotification from '@/screens/NNotification';
import NPostDetail from '@/screens/NPostDetail';
import NSearch from '@/screens/NSearch';
import NSearchHistory from '@/screens/NSearchHistory';
/* Bottom News Screen */
import NHome from '@/screens/NHome';
import NPost from '@/screens/NPost';
import Profile from '@/screens/Profile';
import { tabBarIcon, BottomTabNavigatorMazi } from '@/navigation/components';
import Pricing from '@/screens/Pricing';
import Payment from '@/screens/Payment';
import NPostEditNew from '@/screens/NPostEditNew';
import NArticle from '@/screens/NArticle';
import NSearchFilter from '@/screens/NSearchFilter';
import NArticleDetail from '@/screens/NArticleDetail';

export const NewsTabScreens = {
  NHome: {
    component: NHome,
    options: {
      title: 'home',
      tabBarIcon: ({ color }) => tabBarIcon({ color, name: 'house' }),
    },
  },
  NPost: {
    component: NPost,
    options: {
      title: 'memories',
      tabBarIcon: ({ color }) => tabBarIcon({ color, name: 'photo-film' }),
    },
  },
  NArticle: {
    component: NArticle,
    options: {
      title: 'support',
      tabBarIcon: ({ color }) => tabBarIcon({ color, name: 'question-circle' }),
    },
  },
  Profile: {
    component: Profile,
    options: {
      title: 'account',
      tabBarIcon: ({ color }) => tabBarIcon({ color, name: 'user-circle' }),
    },
  },
};

const NewsMenu = () => <BottomTabNavigatorMazi tabScreens={NewsTabScreens} />;

export default {
  NewsMenu: {
    component: NewsMenu,
    options: {
      title: 'home',
    },
  },
  NFeedback: {
    component: NFeedback,
    options: {
      title: 'feedback',
    },
  },
  NFilter: {
    component: NFilter,
    options: {
      title: 'filtering',
    },
  },
  NSearchFilter: {
    component: NSearchFilter,
    options: {
      title: 'filtering',
    },
  },
  NMessages: {
    component: NMessages,
    options: {
      title: 'message',
    },
  },
  NMessenger: {
    component: NMessenger,
    options: {
      title: 'messenger',
    },
  },
  NNotification: {
    component: NNotification,
    options: {
      title: 'notification',
    },
  },
  NPostDetail: {
    component: NPostDetail,
    options: {
      title: 'post_detail',
    },
  },
  NArticleDetail: {
    component: NArticleDetail,
    options: {
      title: 'article_detail',
    },
  },
  NPostEditNew: {
    component: NPostEditNew,
    options: {
      title: 'post_view',
    },
  },
  NSearch: {
    component: NSearch,
    options: {
      title: 'search',
    },
  },
  NSearchHistory: {
    component: NSearchHistory,
    options: {
      title: 'search_history',
    },
  },
  Pricing: {
    component: Pricing,
    options: {
      title: 'pricing',
    },
  },
    Payment: {
    component: Payment,
    options: {
      title: 'payment',
    },
  },
};
