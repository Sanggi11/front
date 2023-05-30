<template>
    <!-- 실제내용 -->
    <div>
        <img class="room-img" :src="data.image">
        <h3 @click="$emit('openModal',data.id)"> {{ data.content }}</h3>
        <h3> {{ data.price }} won</h3>
    </div>
</template>
<script>
    export default {
    emits : ['openModal'],
    name : 'CardComponent',
    props : {
        data : Object,
    },
    data(){
        return {
        
        }
    },
    methods: {
 
    }
    }
</script>
