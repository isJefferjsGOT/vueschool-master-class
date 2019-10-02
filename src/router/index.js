import Vue from 'vue'
import Router from 'vue-router'
import ThreadShow from '@/pages/PageThreadShow'
import ThreadCreate from '@/pages/PageThreadCreate'
import ThreadEdit from '@/pages/PageThreadEdit'
import Home from '@/pages/PageHome'
import NotFound from '@/pages/PageNotFound'
import ForumShow from '@/pages/PageForumShow'
import CategoryShow from '@/pages/PageCategoryShow'
import Profile from '@/pages/PageProfile'
import Register from '@/pages/PageRegister'
import SignIn from '@/pages/PageSignIn'
import store from '@/store';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/category/:id',
      name: 'CategoryShow',
      component: CategoryShow,
      props: true
    },
    {
      path: '/forum/:id',
      name: 'ForumShow',
      component: ForumShow,
      props: true
    },
    {
      path: '/thread/create/:forumId',
      name: 'ThreadCreate',
      component: ThreadCreate,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/thread/:id/edit',
      name: 'ThreadEdit',
      component: ThreadEdit,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/thread/:id',
      name: 'ThreadShow',
      component: ThreadShow,
      props: true
    },
    {
      path: '/me',
      name: 'Profile',
      component: Profile,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/me/edit',
      name: 'ProfileEdit',
      component: Profile,
      props: {edit: true},
      meta: { requiresAuth: true }
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { requiresGuest: true }
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn,
      meta: { requiresGuest: true }
    },
    {
      path: '/logout',
      name: 'SignOut',
      meta: { requiresAuth: true },
      beforeEnter (to, from, next) {
        store.dispatch('signOut')
          .then(next({name: 'Home'}));
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(`🚥 navegando a ${to.name} desde ${from.name}`);
  store.dispatch('auth/initAuthentication')
    .then(user => {
      if (to.matched.some(route => route.meta.requiresAuth)) {
        // protected route
        if (user) {
          console.log('🐞🐞 user:', user);
          next();
        } else {
          next({name: 'SignIn', query: {redirectTo: to.path}});
        }
      } else if (to.matched.some(route => route.meta.requiresGuest)) {
        // protected route
        if (!user) {
          next();
        } else {
          next({name: 'Home'});
        }
      } else {
        next();
      }
    })
})

export default router;
