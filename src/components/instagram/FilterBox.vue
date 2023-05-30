<template>
    <div @click="fire" class="filter-item" :class="filterData"  :style="{backgroundImage: `url(${image})`}">
        <p1 style="position: relative; top: -10px;">{{filterData}}</p1>
    </div>
</template>
<script>

export default {
    name: 'FilterBox',
    data() {
        return {
        }
    },
    props: {
        image: String,
        filterData: String,
    },
    methods: {
        fire() {
            this.emitter.emit('filter', this.filterData)
        }
    },
}
</script>
<style>
.filter-item {
    width: 100px;
    height: 100px;
    margin: 10px 10px 10px auto;
    padding: 1px;
    display: inline-block;
    color: rgb(4, 4, 4);
    background-size: cover;
    background-position: center;
}
</style>