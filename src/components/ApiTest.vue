<template>
  <div class="container">
    <h1>POST Request</h1>
    <form @submit.prevent="submitForm">
      <div class="autocomplete-results" v-if="autocompleteResults.length > 0">
        <div class="autocomplete-result" v-for="(result, i) in autocompleteResults" :key="i" @click="address = result">
          {{ result }}
        </div>
      </div>
      <!-- 'address' 입력 필드 -->
      <div class="form-group d-flex align-items-center">
        <label for="req" class="m-2">Adress:</label>
        <input type="text" id="address" v-model="address" class="form-control" @input="autocomplete('address', $event)"
          @focus="showAutocomplete['address'] = true" @blur="closeAutocomplete('address')">
      </div>
      <div class="autocomplete-results"
        v-if="showAutocomplete['address'] && autocompleteResults['address'] && autocompleteResults['address'].length > 0">
        <div class="autocomplete-result" v-for="(result, i) in autocompleteResults['address']" :key="i"
          @mousedown="address = result; showAutocomplete['address'] = false">
          {{ result }}
        </div>
      </div>
      <!-- 'req' 입력 필드 -->
      <div class="form-group d-flex align-items-center ">
        <label for="req" class="m-2">Request:</label>
        <input type="text" id="req" v-model="req" class="form-control" @input="autocomplete('req', $event)"
          @focus="showAutocomplete['req'] = true" @blur="closeAutocomplete('req')">
      </div>
      <div class="autocomplete-results mb-3"
        v-if="showAutocomplete['req'] && autocompleteResults['req'] && autocompleteResults['req'].length > 0">
        <div class="autocomplete-result" v-for="(result, i) in autocompleteResults['req']" :key="i"
          @mousedown="req = result; showAutocomplete['req'] = false">
          {{ result }}
        </div>
      </div>
      <!-- 'Field Count' -->
      <div class="form-group d-flex flex-column align-items-center">
        <br>
        <label for="fieldCount" class="form-label">Field Count: {{ fieldCount }} </label>
        <input type="range" class="form-range" id="fieldCount" v-model.number="fieldCount" min="1" max="7"
          :style="{ width: '50%' }">
        <br>
      </div>
      <div v-for="(field, index) in fields" :key="index">
        <!-- 'fields' -->
        <div class="form-group d-flex align-items-center ">
          <label for="fieldName" class="m-2">Field Name:</label>
          <input type="text" :id="'fieldName' + index" v-model="field.name" class="form-control"
            @input="autocomplete('fieldName' + index, $event)" @focus="showAutocomplete['fieldName' + index] = true"
            @blur="closeAutocomplete('fieldName' + index)">
        </div>
        <div class="autocomplete-results"
          v-if="showAutocomplete['fieldName' + index] && autocompleteResults['fieldName' + index] && autocompleteResults['fieldName' + index].length > 0">
          <div class="autocomplete-result" v-for="(result, i) in autocompleteResults['fieldName' + index]" :key="i"
            @mousedown="field.name = result; showAutocomplete['fieldName' + index] = false">
            {{ result }}
          </div>
        </div>
        <div class="form-group d-flex align-items-center ">
          <label for="fieldValue" class="m-2">Field Value:</label>
          <input type="text" :id="'fieldValue' + index" v-model="field.value" class="form-control"
            @input="autocomplete('fieldValue' + index, $event)" @focus="showAutocomplete['fieldValue' + index] = true"
            @blur="closeAutocomplete('fieldValue' + index)">
        </div>
        <div class="autocomplete-results"
          v-if="showAutocomplete['fieldValue' + index] && autocompleteResults['fieldValue' + index] && autocompleteResults['fieldValue' + index].length > 0">
          <div class="autocomplete-result" v-for="(result, i) in autocompleteResults['fieldValue' + index]" :key="i"
            @mousedown="field.value = result; showAutocomplete['fieldValue' + index] = false">
            {{ result }}
          </div>
        </div>
      </div>
      <div class="form-group">
        <input type="submit" value="Submit" class="btn btn-primary">
      </div>
      <p v-if="result">{{ resultAsJson }}</p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logincheck: false,
      address: "",
      req: "",
      fieldCount: 1,
      fields: [
        { name: "", value: "" },
      ],
      autocompleteData: ["http://133.242.50.64:8889", "getMessagesAPI", "getraitenAPI", "todoAPI", "getTempoInfo", "userLogin", "getNikkidataAPI", "getNikkidataAPI2", "getTempoLogo", "getUserNameAPI", "cardImage", "recodeRaitenAPI", "getCardListAPI", "makeCardAPT", "deleteCardAPI", "uploadImageAPT", "updateCardAPI", "getUserInfoAPI", "updateUserInfoAPI", "updateLikedRooms", 'user_cd', 'shop_cd', 'room_id'],
      autocompleteResults: {},
      showAutocomplete: {},
      result: "",
    };
  },
  watch: {
    fieldCount(newValue, oldValue) {
      if (newValue > oldValue) {
        for (let i = oldValue; i < newValue; i++) {
          this.fields.push({ name: "", value: "" });
        }
      } else if (newValue < oldValue) {
        this.fields.splice(newValue);
      }
    },
  },
  computed: {
    resultAsJson() {
      return this.result ? JSON.stringify(this.result, null, 2) : null;
    },
  },
  methods: {
    autocomplete(id, event) {
      if (event.target.value === '') {
        this.autocompleteResults[id] = [];
      } else {
        this.autocompleteResults[id] = this.autocompleteData.filter(item =>
          item.toLowerCase().includes(event.target.value.toLowerCase())
        );
      }
    },
    closeAutocomplete(field) {
      this.$nextTick(() => {
        this.showAutocomplete[field] = false;
      });
    },

    async submitForm() {
      try {
        const url = `${this.address}/${this.req}`;
        const data = this.fields.reduce((acc, field) => {
          if (field.name) {
            acc[field.name] = field.value;
          }
          return acc;
        }, {});

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Error in POST request");
        }

        const result = await response.json();
        this.result = result;
        console.log(result);

      } catch (error) {
        console.error(error);
      }
    },
  },
};

</script>
<style>
.form-group label {
  width: 200px;
}

.form-group input {
  flex-grow: 1;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-height: 80%;
  overflow: auto;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.container {
  width: 100%;
  margin: auto;
}
</style>