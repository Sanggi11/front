<template>
    <div class="list" v-for="data in blogData" :key="data">
        
            <h5 @click="$router.push('/ListDetail/'+data.number)">{{ data.title }}</h5>

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