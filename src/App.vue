<template>
  <!-- discont -->
  <!-- <Discount v-if="showDiscount == true" :discont="discont" /> -->
  <Modal  :data="roomdata" :modal="modal" :push="pushing" :month="month" 
  @openModal="modal = true, pushing = $event" @CloseModal="modal = false" @update:month="month = $event"/>
  <!-- upbar -->
  <div class="mt-4 d-flex justify-content-center">
    <ul class="nav nav-pills gap-2 p-1 small bg-primary rounded-5 shadow-sm half-size" id="pillNav2" role="tablist"
      style="--bs-nav-link-color: var(--bs-white); --bs-nav-pills-link-active-color: var(--bs-primary); --bs-nav-pills-link-active-bg: var(--bs-white);">
      <li class="nav-item" role="presentation">
        <router-link class="nav-link rounded-5" id="home-tab2" to="/" active-class="active">Home</router-link>
      </li>
      <li class="nav-item" role="presentation">
        <router-link class="nav-link rounded-5" id="profile-tab2" to="/list" active-class="active">list</router-link>
      </li>
      <li class="nav-item" role="presentation">
        <router-link class="nav-link rounded-5" id="contact-tab2" to="/api_test"
          active-class="active">Api_test</router-link>
      </li>
      <li class="nav-item" role="presentation">
        <router-link class="nav-link rounded-5" id="contact-tab2" to="/instaHome"
          active-class="active">instagram</router-link>
      </li>
      <li class="nav-item" role="presentation">
        <router-link class="nav-link rounded-5" id="contact-tab2" to="/Todo"
          active-class="active">Todo</router-link>
      </li>
    </ul>
  </div><br>

  <div v-if="$route.path === '/'">
    <button @click="priceSort">price sort</button>
    <button @click="priceSortdesc">priceSortdesc</button>
    <button @click="priceSortmax50">priceUnder50M</button>
    <button @click="priceSortAlphabet">priceSortAlphabet</button>
    <button @click="sortBack">reset</button>
  </div>

  <!-- contents -->
  <!-- <router-link to="/">home</router-link>
  <router-link to="/list">list</router-link> -->
  <div class="mt-4 mb-3" v-if="$route.path !== '/'">
    <router-view :blogData="blogData" />
  </div>
  <div class="mt-4 mb-3" v-if="$route.path === '/'">
    <Card @openModal="modal = true;
    pushing = $event" :data="roomdata[i]" v-for="(data, i) in roomdata" :key="data" />
  </div>
</template>

<script>
import data from './products.ts';
// import Discount from './components/Discount.vue';
import Modal from './components/Modal.vue';
import blogData from './blog.ts';
import Card from './components/Card.vue';

export default {
  name: 'App',
  data() {
    return {
      discont: 20,
      showDiscount: true,
      pushing: 0,
      roomdataOriginal: [...data],
      roomdata: data,
      modal: false,
      신고수: [],
      month: 1,
      blogData: blogData,
    }
  },
  methods: {
    increase(i) {
      this.신고수[i] += 1
    },
    priceSort() {
      this.roomdata.sort((a, b) => {
        return a.price - b.price
      })
    },
    priceSortdesc() {
      this.roomdata.sort((a, b) => {
        return b.price - a.price
      })
    },
    sortBack() {
      this.roomdata = [...this.roomdataOriginal]
    },
    priceSortmax50() {
      this.roomdata = [...this.roomdataOriginal].filter(item => item.price <= 500000);
    },
    priceSortAlphabet() {
      this.roomdata.sort((a, b) => {
        return a.title.localeCompare(b.title);
      })
    },
  },
  //when update
  updated() {

  },

  created() {
    //beforeMount 
  },

  //afterMount
  mounted() {
    setInterval(() => {
      if (this.discont > 0) {
        this.discont--; // 0보다 크면 1씩 감소
      }
      if (this.discont == 0) {
        this.discont = 20;
      }
    }, 1000); // 1 secound
  },
  components: {
    // Discount,
    Modal,
    Card,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


.menu {
  background: darkslateblue;
  padding: 15px;
  border-radius: 5px;
}

.menu a {
  color: white;
  padding: 10px;
}

.room-img {
  width: 100%;
  margin-top: 40px;
  border-radius: 5px;
  margin: 10px;
}

.fade-enter-from {
  transform: translateY(-100px);
  opacity: 0;
}

.fade-enter-active {
  transition: all 1s;
}

.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-leave-from {
  opacity: 1;
}

.fade-leave-active {
  transition: all 1s;
}

.fade-leave-to {
  opacity: 0;
}
</style>
