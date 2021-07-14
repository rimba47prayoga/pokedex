<template>
  <b-card no-body tag="article" class="pokemon-item">
    <b-card-body>
      <b-card-img
        v-show="item.img_loaded"
        :alt="`${item.name}'s image`"
        :src="getImage(item)"
        @click="goToDetail(item)"
        @load="onImageLoad(item)"
      />
      <b-skeleton v-if="!item.img_loaded" height="165px"></b-skeleton>
      <b-card-title>
        <router-link
          :to="{ name: 'pokemon-detail', params: { name: item.name } }"
        >
          {{ item.name }}
        </router-link>
      </b-card-title>
      <div class="pokemon-item--type">
        <router-link
          v-for="(typeItem, indexType) in item.detail.types"
          :key="indexType"
          :to="{
            name: 'homepage',
            query: { type: typeItem.type.name },
          }"
          class="pokemon-type"
          >{{ typeItem.type.name }}</router-link
        >
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    onImageLoad(item) {
      item.img_loaded = true;
    },
    goToDetail(item) {
      this.$store.dispatch("setSelected", item.detail);
      this.$router.push({
        name: "pokemon-detail",
        params: {
          name: item.name,
        },
      });
    },
    getImage(item) {
      // const scrappedBaseUrl =
      //   "https://assets.pokemon.com/assets/cms2/img/pokedex/full//";
      // const index = String(item.detail.id).padStart("3", "0");
      // return `${scrappedBaseUrl}${index}.png`;
      return item.detail.sprites.other["official-artwork"].front_default;
    },
  },
};
</script>

<style></style>
