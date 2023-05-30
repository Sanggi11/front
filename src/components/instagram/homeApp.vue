<template>

  <h4> {{$store.state.name}}</h4>
  <h4> {{$store.state.age}}</h4>
  <button @click="$store.commit('changeAge',10)">나이증가</button>
  <button @click="$store.commit('changeName')">이름변경</button> 
  <p>{{$store.state.more}}</p>
  <button @click="$store.dispatch('getData')">더보기</button>
  <p>{{now2}} {{counter}}</p>
  

  <button @click='counter++'>버튼</button>
  
  <div class="header">
    <ul class="header-button-left">
      <li v-if="step !== 0" @click="step = 0;image = '';$refs.fileInput.value = ''; ">Cancel</li>
    </ul>
    <ul class="header-button-right">
      <li v-if="step !== 0 && step < 2" @click="step++">Next</li>
      <li v-else-if="step === 2" @click="publish">Complete</li>
    </ul>
    <img src="../../assets/logo.png" class="logo" />
  </div>

  <InstContainer :instaData="instaData" :step="step" :image="image" @write="writeData= $event"/>

  <button v-if="step === 0" @click="more"> 더보기 </button>

  <div class="footer">
    <ul class="footer-button-plus">
      <input ref="fileInput" @change="upload" accept="image/*" type="file" id="file" class="inputfile" />
      <label for="file" class="input-plus">+</label>
    </ul>
  </div>
</template>

<script>
import InstContainer from './InstContainer.vue';
import InstData from '../../instaData.ts';
import axios from 'axios';
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'homeApp',
  data() {
    return {
      instaData: InstData,
      requestCount: 0,
      selectContent: 0,
      step: 0,
      image: '',
      writeData: '',
      selectFilter : '',
      counter : 0,
    }
  },
  props: {
  },
  mounted() {
        this.emitter.on('filter', (data) => {
            this.selectFilter = data;
        })
        this.emitter.on('changeStep3', () => {
            this.step = 3;
        })
    },

  computed: { // 컴퓨티드 는 갱신안됨 데이터 저장공간
    // 그냥 state 하나 꺼내 쓸때 computed 안에서 사용하면 편할수도 있음
    name2(){
      return this.$store.state.name // 이런식으로 긴 소스를 하나로 정의해서 씀 
    },
    ...mapState(['name','age','liked']), // 이런식으로 this.$store.state.name이런긴걸 정의를 간단하게 할수 있음
    ...mapState({ 작명 : 'name', 작명2 : 'age', 작명3 : 'liked' }), // 이런식으로 작명을 바꿔서 쓸수도 있음

    now2(){
      return new Date()
    }
  },

  methods: {

    ...mapMutations(['changeAge','changeName']), // 이런식으로 this.$store.commit('changeAge',10) 이런걸 간단하게 할수 있음
    ...mapActions(['getData']), // 엑션 this.$store.dispatch('getData') 이런걸 간단하게 할수 있음 

    now(){
      return new Date()
    },

    more() {
      axios.get(`https://codingapple1.github.io/vue/more${this.requestCount}.json`)
        .then((response) => {
          console.log(response);
          this.instaData.push(response.data);
          this.requestCount++;
        })
        .catch((error) => {
          console.log(error);
        })
    },
    upload(e) {
      let file = e.target.files;
      console.log(file);
      console.log(file[0].type);
      let url = URL.createObjectURL(file[0]);
      console.log(url);
      this.step++;
      this.image = url;
      console.log(this.image);
    },
    publish() {
      var file = {
        name: "LEE SANGGI",
        userImage: "https://placeimg.com/100/100/arch",
        postImage: `${this.image}`,
        likes: 36,
        date: "May 15",
        liked: false,
        content: `${this.writeData}`,
        filter: this.selectFilter,
      };
      this.instaData.unshift(file); // push data

      this.step = 0;
    }
  },

  components: {
    InstContainer,
  }
}
</script>

<style> body {
   margin: 0;
 }

 ul {
   padding: 5px;
   list-style-type: none;
 }

 .logo {
   width: 22px;
   margin: auto;
   display: block;
   position: absolute;
   left: 0;
   right: 0;
   top: 13px;
 }

 .header {
   width: 100%;
   height: 40px;
   background-color: white;
   padding-bottom: 8px;
   position: sticky;
   top: 0;
 }

 .header-button-left {
   color: skyblue;
   float: left;
   width: 50px;
   padding-left: 20px;
   cursor: pointer;
   margin-top: 10px;
 }

 .header-button-right {
   color: skyblue;
   float: right;
   width: 80px;
   cursor: pointer;
   margin-top: 10px;
 }

 .footer {
   width: 100%;
   position: sticky;
   bottom: 0;
   padding-bottom: 10px;
   background-color: white;
 }

 .footer-button-plus {
   width: 80px;
   margin: auto;
   text-align: center;
   cursor: pointer;
   font-size: 24px;
   padding-top: 12px;
 }

 .sample-box {
   width: 100%;
   height: 600px;
   background-color: bisque;
 }

 .inputfile {
   display: none;
 }

 .input-plus {
   cursor: pointer;
 }

 #app {
   box-sizing: border-box;
   font-family: "consolas";
   margin-top: 60px;
   width: 100%;
   max-width: 1000px;
   margin: auto;
   position: relative;
   border-right: 1px solid #eee;
   border-left: 1px solid #eee;
 }</style>