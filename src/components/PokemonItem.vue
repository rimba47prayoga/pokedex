<template>
  <b-card no-body tag="article" class="pokemon-item">
    <b-card-body>
      <b-card-img
        v-show="item.img_loaded"
        :alt="`${item.name}'s image`"
        :src="item.detail.sprites.other['official-artwork'].front_default"
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
        <span
          v-for="(typeItem, indexType) in item.detail.types"
          :key="indexType"
          @click="typeSelected = typeItem.type.url"
          class="pokemon-type"
          >{{ typeItem.type.name }}</span
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
  },
};
</script>

<style></style>
