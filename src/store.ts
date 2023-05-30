import { createStore, Store } from 'vuex'
import axios from 'axios'

interface State {
  name: string;
  age: number;
  likes: number[];
  likescheak: boolean;
  more: any;
}

const state: State = {
  name: "kim",
  age: 20,
  likes: [0, 0, 0],
  likescheak: false,
  more: {},
};

const store: Store<State> = createStore({
  state,
  mutations: {
    changeName(state) {
      state.name = 'pack';
    },
    changeAge(state, payload) {
      state.age += payload;
    },
    changeLikescheak(state, payload) {
      if (state.likescheak == false) {
        state.likescheak = true;
        state.likes[payload] += 1;
      }
      else {
        state.likescheak = false;
        state.likes[payload] -= 1;
      }
    },
    setDataMore(state, payload) {
      state.more = payload;
    },
  },
  actions: {
    getData({ commit }) {
      axios.get('https://codingapple1.github.io/vue/more0.json')
        .then((result) => {
          console.log(result.data);
          commit('setDataMore', result.data)
        })
        .catch(() => {
          console.log('실패했어요');
        })
    }
  }
});

export default store;
