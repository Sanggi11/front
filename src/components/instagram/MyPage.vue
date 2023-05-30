<template>
    <div v-if="follower.length > 0" style="padding : 10px">
        <h4>팔로워</h4>
        <input v-model="searchData" placeholder="?" />
        <div class="post-header" v-for=" data in filteredFollowers" :key=data>
            <div class="profile" :style="{ backgroundImage: `url(${data.image})` }"></div>
            <span class="profile-name">{{ data.name }}</span>
        </div>
    </div>
</template>

<script>
import { computed } from '@vue/reactivity';
import axios from 'axios';
import { watch } from 'vue';
import { onMounted, reactive, ref, toRefs } from 'vue';
import { useStore } from 'vuex';

export default {
    name: 'MyPage',
    setup(props) {

        let filteredFollowers = computed(() => {
            if (searchData.value) {
                return follower.value.filter(f => f.name.includes(searchData.value));
            }
            return follower.value;
        });

        let searchData = ref(''); // 검색어

        let follower = ref([]); //Compostion API 사용법 //그나머지는 ref로 사용
        let test = reactive({ name: 'test' }); // 보통 array, object는 reactive로 사용 근데 그냥 ref로 사용해도 무방
        let { one } = toRefs(props);
        console.log(one.value);
        onMounted(() => {
            axios.get('/follower.json').then((res) => {
                follower.value = res.data;
            }).catch((err) => {
                console.log(err);
            })
            console.log(follower);
            console.log(test);
        })

        watch(follower, (newVal, oldVal) => {
            console.log(newVal);
            console.log(oldVal);
        })

        let result = computed(() => { return follower.value.length })
        console.log(result.value);

        let store = useStore();
        console.log(store.state.name);
        console.log(store.commit('changeName', 'test'));


        return { follower,filteredFollowers }
    },
    data() {
        return {

        }
    },
    props: {
        one: Number,
    },
    methods: {
    },
    components: {
    }
}
</script>

<style></style>