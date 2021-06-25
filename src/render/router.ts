import {createRouter, createWebHashHistory} from 'vue-router';
import Index from './views/Index.vue';
import Create from './views/Create.vue';

const router:any = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
        path: '/',
        name: 'index',
        component: Index as any,
        meta: {
            title: 'Page 1'
        }
    },
    {
        path: '/create',
        name: 'create',
        component: Create as any,
        meta: {
            title: 'Page 2'
        }
    }
  ]
});

export default router;
