<template>
    <div class="list" v-for="data in blogData" :key="data">
        <router-link :to="'/ListDetail/'+data.number">
            <h5>{{ data.title }}</h5>
        </router-link>
        <p> {{ data.content }} </p>
    </div>
</template>
<script>
export default {
    name: 'ListComponent',
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