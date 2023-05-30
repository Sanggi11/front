<template>
    <div v-if="step === 0">
        <Post :instaData="instaData" />
    </div>
    <!-- 필터선택페이지 -->
    <div  v-if="step === 1">
        <div :class="`${selectFilter} upload-image`" :style="{ backgroundImage: `url(${image})` }"></div>
        <div class="filters">
            <FilterBox v-for="filter,i in filterData" :key=i 
            @clickedFilter="selectFilter= $event"
            :image="image" :filterData="filterData[i]">
            슬롯
        </FilterBox>
        </div>
    </div>


    <!-- 글작성페이지 -->
    <div v-if="step === 2">
        <div :class="`${selectFilter} upload-image`" :style="{ backgroundImage: `url(${image})` }"></div>
        <div class="write">
            <textarea class="write-box"> write!</textarea>
        </div>
    </div>

    <!-- 글작성페이지 -->
    <div v-if="step === 3">
        <MyPage :one="one" />
    </div>
</template>

<script>
import Post from './Post.vue';
import FilterBox from './FilterBox.vue';
import MyPage from './MyPage.vue';

export default {
    emits: ['write'],
    name: 'InstContainer',
    mounted() {
        this.emitter.on('filter', (data) => {
            this.selectFilter = data;
        })
    },
    data() {
        return {
            filterData: ["aden", "_1977", "brannan", "brooklyn", "clarendon", "earlybird", "gingham", "hudson",
                "inkwell", "kelvin", "lark", "lofi", "maven", "mayfair", "moon", "nashville", "perpetua",
                "reyes", "rise", "slumber", "stinson", "toaster", "valencia", "walden", "willow", "xpro2"],
            selectFilter: '',
            one: 0,
        }
    },
    watch: {
        step(newVal) {
            if (newVal === 0) {
                this.selectFilter = '';
            }
        }
    },
    props: {
        instaData: Object,
        step: Number,
        image: String,
    },
    methods: {
    },
    components: {
        Post,
        FilterBox,
        MyPage,
    }
}
</script>

<style>
.upload-image {
    width: 100%;
    height: 450px;
    background: cornflowerblue;
    background-size: cover;
    background-position: center;
}

.filters {
    overflow-x: scroll;
    white-space: nowrap;
}

.filter-1 {
    width: 100px;
    height: 100px;
    background-color: cornflowerblue;
    margin: 10px 10px 10px auto;
    padding: 8px;
    display: inline-block;
    color: white;
    background-size: cover;
}

.filters::-webkit-scrollbar {
    height: 5px;
}

.filters::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.filters::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
}

.filters::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.write-box {
    border: none;
    width: 90%;
    height: 100px;
    padding: 15px;
    margin: auto;
    display: block;
    outline: none;
}
</style>