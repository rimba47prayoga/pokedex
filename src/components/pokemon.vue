<template>
  <div class="pokemon-detail">
    <b-card no-body class="overflow-hidden" style="max-width: 700px;">
      <b-row no-gutters>
        <b-col md="6">
          <b-card-img
            :src="getDetail.sprites.other['official-artwork'].front_default"
            :alt="`${getDetail.name}'s image`"
            class="rounded-0"
          ></b-card-img>
        </b-col>
        <b-col md="6">
          <b-card-body :title="getDetail.name">
            <div class="attribute--container">
              <span class="attribute-title">Height</span>
              <span class="attribute-value">{{ getDetail.height }}</span>
            </div>
          </b-card-body>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { request } from "@/utils";
export default {
  data() {
    return {
      detail: {
        sprites: {
          other: {
            "official-artwork": {
              front_default: ""
            }
          }
        }
      }
    };
  },
  beforeDestroy() {
    this.$store.dispatch("setSelected", {});
  },
  mounted() {
    // When refresh page or user go directly to detail page
    const selected = this.pokemon.selected;
    if (!Object.keys(selected).length) {
      let name = this.$route.params.name;
      request.get(`api/v2/pokemon/${name}`).then(res => {
        this.detail = res.data;
      });
    }
  },
  computed: {
    ...mapState(["pokemon"]),
    getDetail() {
      const selected = this.pokemon.selected;
      if (!Object.keys(selected).length) {
        return this.detail;
      }
      return this.pokemon.selected.detail;
    }
  }
};
</script>

<style lang="less">
.pokemon-detail {
  padding: 30px 200px;
}
</style>
