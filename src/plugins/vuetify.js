import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import ar from 'vuetify/lib/locale/ar';

Vue.use(Vuetify);

export default new Vuetify({
  rtl: true,
  theme: {
    dark: false,
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#ffffff',
        secondary: '#615D6C',
        accent: '#BABFD1',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      },
    },
  },
  lang: {
    locales: { ar },
    current: 'ar',
  },
  icons: {
    iconfont: 'md',
  },
});
