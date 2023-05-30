<template>
  <!-- modal -->
  <div class="black-bg" v-if="modal == true" @click="closeModal">
    <div class="white-bg" @click.stop>
      <img :src="data[push].image" style="width: 100%; max-height: 300px; object-fit: contain;">
      <h4>{{ data[push].title }}</h4>
      <p>{{ data[push].content }}</p>
      <p> {{ month }} month select : {{ data[push].price * month }}</p>
      <input type="range" min="1" max="12" :value="month" @input="updateMonth($event.target.value)" >
      <button @click="closeModal">close modal</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ModalComponent',
  props: {
    modal: Boolean,
    push: Number,
    data: Array,
    month: Number,
  },
  methods: {
    closeModal() {
      this.$emit('CloseModal');
    },
    updateMonth(value) {
    this.$emit('update:month', Number(value));
  },
  },
  watch: {
    month(a) {
      // if over 13 month or under 1 month 
      // show alert 
      if (a > 12 || a < 1) {
        alert('12개월 이하로 입력해주세요');
        this.$emit('update:month', 1);
      }
    }
  },
  data() {
    return {
    
    }
  }
}
</script>
<style>
.black-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}

.white-bg {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 5px;
  padding: 20px;
}

</style>
