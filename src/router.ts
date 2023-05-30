import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from './firebase';

import List from "./components/ListFolder/List.vue";
import ApiTest from "./components/ApiTest.vue";
import ListDetail from "./components/ListFolder/ListDetail.vue";
import page404 from "./components/page404.vue";
import Author from "./components/ListFolder/Author.vue";
import Comment from "./components/ListFolder/Comment.vue";
import homeApp from "./components/instagram/homeApp.vue";
import Todo from "./components/Todo/Todo.vue";
import Login from './components/Todo/Login.vue';

let user: any;

onAuthStateChanged(firebaseAuth, newUser => {
    user = newUser;
});

const routes: Array<RouteRecordRaw> = [
    { path: '/login', component: Login },
    { path: "/list", component: List, },
    { path: "/api_test", component: ApiTest, },
    {
        path: "/ListDetail/:id(\\d+)", component: ListDetail,
        children: [
            { path: "author", component: Author },
            { path: "comment", component: Comment, },
        ]
    },
    { path: "/instaHome", component: homeApp, },
    {
        path: "/Todo", component: Todo,   //todo 들어가기전 로그인 체크
        beforeEnter: (to, from, next) => {
            if (!user) {
                next('/login');
            } else {
                next();
            }
        }
    },
    { path: "/:catchAll(.*)", component: page404, },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router; 
