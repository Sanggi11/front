<template>
    <div class="detail">
        <h1>{{ blogData[$route.params.id].title }}</h1>
        <p> {{ blogData[$route.params.id].content }} </p>
        <router-link :to="'/List'">
            <h5>돌아가기</h5>
        </router-link>
        <router-view></router-view>
        <Author class="view left-sidebar"></Author>
        <Comment class="view right-sidebar"></Comment>
    
    </div>

</template>
<script>
import Author from "./Author.vue";
import Comment from "./Comment.vue";

export default {
    name: 'ListDetail',
    data() {
        return {
        }
    },
    props: {
        blogData: Array,
    },
    methods: {
    },
    components: {   
        Author,
        Comment, 
    },

}
</script>
<style></style>