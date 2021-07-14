<template>
  <div class="pokemons">
    <div class="title-page">Pokemon</div>
    <div class="filter--container">
      <div class="input-container">
        <label>Filter by Type</label>
        <b-form-select
          v-model="typeSelected"
          :options="types"
          :disabled="isFiltering"
          @input="selectType"
        >
          <template #first>
            <b-form-select-option :value="null" disabled
              >-- Please select an option --</b-form-select-option
            >
          </template>
        </b-form-select>
      </div>
    </div>
    <div class="pokemon-item--container">
      <pokemon-item
        v-for="(item, index) in pokemons.results"
        :key="index"
        :item="item"
      ></pokemon-item>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PokemonItem from "./PokemonItem.vue";
import { request, capitalize } from "@/utils";
export default {
  components: {
    PokemonItem,
  },
  data() {
    return {
      pokemons: {
        count: 0,
        next: null,
        previous: null,
        results: [],
      },
      loading: true,
      typeSelected: null,
      isFiltering: false, // disable selection when filtering,
      busy: true,
    };
  },
  async mounted() {
    if (this.$route.query.type) {
      await this.fetchTypes();
      const type = this.types.filter(
        (item) => item.text === capitalize(this.$route.query.type)
      )[0];
      this.typeSelected = type.value;
      this.filterPokemons(type.value);
    } else {
      this.fetchTypes();
      this.fetchPokemons();
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.$nextTick(() => {
      if (to.query.type) {
        const type = this.types.filter(
          (item) => item.text === capitalize(to.query.type)
        )[0];
        this.typeSelected = type.value;
        this.filterPokemons(type.value);
      }
    });
    next();
  },
  computed: {
    ...mapState(["types"]),
  },
  methods: {
    bindDetailPokemons(items) {
      let results = [];
      items.forEach(async (item) => {
        await request
          .get(item.url)
          .then((resItem) => {
            // just push it one by one, because we want to render it partially.
            item.detail = resItem.data;
            results.push({ ...item, img_loaded: false });
          })
          .catch((errors) => {
            console.log(errors);
          });
      });
      this.pokemons.results = results;
    },
    fetchTypes() {
      if (!this.types.length) {
        request.get("api/v2/type").then((res) => {
          // optimized types. So when user go to detail page
          // and back to home page, it will not fetch api again.
          const types = res.data.results.map((item) => {
            return {
              value: item.url,
              text: capitalize(item.name),
            };
          });
          this.$store.dispatch("setTypes", types);
        });
      }
    },
    fetchPokemons(url = "api/v2/pokemon/") {
      request
        .get(url)
        .then((res) => {
          this.pokemons.count = res.data.count;
          this.pokemons.next = res.data.next;
          this.pokemons.previous = res.data.previous;
          this.bindDetailPokemons(res.data.results);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    filterPokemons(url) {
      this.isFiltering = true;
      request
        .get(url)
        .then((res) => {
          this.pokemons.count = res.data.pokemon.length;
          this.pokemons.next = null;
          this.pokemons.previous = null;
          const filteredPokemons = res.data.pokemon.map((item) => item.pokemon);
          this.pokemons.results = [];
          this.bindDetailPokemons(filteredPokemons);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isFiltering = false;
        });
    },
    selectType(url) {
      const type = this.types.filter((item) => item.value === url)[0];
      this.$router.push({ name: "homepage", query: { type: type.text } });
    },
  },
};
</script>

<style lang="less">
.pokemons {
  padding: 30px 200px;
  @media (max-width: 576px) {
    padding: 20px;
  }
  .title-page {
    font-weight: bold;
    font-size: 40px;
    text-align: center;
    margin-bottom: 20px;
  }
  .filter--container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;
    margin-bottom: 20px;

    @media (max-width: 576px) {
      justify-content: flex-start;
    }

    .input-container {
      display: flex;
      flex-direction: column;
    }

    label {
      font-weight: bold;
      margin-right: 20px;
    }
    select {
      width: auto;
    }
  }
  .pokemon-item--container {
    display: block;
    width: 100%;
    height: 100%;
    .pokemon-item {
      display: inline-block;
      width: 22%;
      margin: 1.5%;
      box-shadow: 0 3px 12px rgba(100, 100, 100, 0.3);
      border-radius: 20px;

      @media (max-width: 576px) {
        width: 100%;
        margin: 20px 0;
      }
      .card-body {
        .card-img {
          cursor: pointer;
        }
        .card-title {
          font-size: 20px;
          text-transform: capitalize;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          a {
            color: #343a40;
          }
        }
      }

      .pokemon-item--type {
        .pokemon-type {
          margin-right: 10px;
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 40px;
          font-size: 0.8em;
          padding: 5px 10px;
          transition: all ease 0.1s;
          text-transform: capitalize;
          text-decoration: none;
          color: #333;

          &:hover {
            cursor: pointer;
            background-color: rgba(0, 0, 0, 0.3);
          }
        }
      }
    }
  }
}
</style>
