<template>
  <div class="discount">
    <h4> right now {{discont}}% discont </h4>
  </div>
</template>

<script>
export default {
  name : 'DiscountComponent',
  data(){
    return 
  },
  props: {
      discont: Number,
    } 
}
</script>

<style>
.discount{
  background: #f1c40f;
  padding: 10px;
  border-radius: 5px;
  margin: 10px;
  color: white;
  font-weight: bold;
}
</style>