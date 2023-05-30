<template>
    <div class="detail">
        <h1> {{blogData.title}} </h1>
        <p> 상세페이지 </p>
        <router-link :to="'/List'">
            <h5>돌아가기</h5>
        </router-link>
    </div>

</template>
<script>
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
    }
}
</script>
<style></style>