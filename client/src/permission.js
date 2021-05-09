import router from './router'
import store from 'store'

const allowList = ['/login', '/readerIndex', '/creatorIndex', '/masterIndex', '/register'] // no redirect allowList

router.beforeEach((to, from, next) => {
  /* has token */
  if (store.get('Token')) {
    if (to.name === 'login' || to.name === 'register') {
      next({ name: from.name })
    } else if (!to.name) {
      if (from.name) {
        next({ name: from.name })
      } else {
        store.remove('Token')
        store.remove('acgnConfig')
        next({ name: 'login' })
      }
    } else if (from.name === 'masterIndex') {
      next({ name: 'masterIndex' })
    } else {
      next()
    }
  } else {
    if (to.name !== 'login' && to.name !== 'register') {
      next({ name: 'login' })
    }
    next()
  }
})
