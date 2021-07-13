<template>
  <div class="pokemon-detail">
    <b-card no-body class="overflow-hidden" style="max-width: 700px">
      <b-row no-gutters>
        <b-col md="6">
          <b-skeleton v-if="loading" height="350px"></b-skeleton>
          <b-card-img
            v-else
            :src="selected.sprites.other['official-artwork'].front_default"
            :alt="`${selected.name}'s image`"
            class="rounded-0"
          ></b-card-img>
        </b-col>
        <b-col md="6">
          <b-card-body :title="selected.name">
            <div class="stats">
              <div
                v-for="(item, index) in getStats"
                :key="index"
                class="row mb-1"
              >
                <div class="col-md-12 stat-name">
                  {{ item.name.split("-").join(" ") }}
                </div>
                <div class="col-md-12 stat-value">
                  <b-progress
                    :value="item.value"
                    :variant="item.colour"
                    show-progress
                  ></b-progress>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-col>
      </b-row>
      <b-row no-gutters>
        <b-col md="12">
          <div class="attributes">
            <div class="attribute-items basic-attributes">
              <div class="attribute-item--container">
                <span class="attribute-title">Height</span>
                <span class="attribute-value">{{ selected.height }}</span>
              </div>
              <div class="attribute-item--container">
                <span class="attribute-title">Weight</span>
                <span class="attribute-value">{{ selected.weight }}</span>
              </div>
            </div>
            <div class="attribute-items attribute-types">
              <div class="attribute-type--title">Types</div>
              <div class="attribute-type--items">
                <span
                  v-for="(typeItem, indexType) in selected.types"
                  :key="indexType"
                  >{{ typeItem.type.name }}</span
                >
              </div>
            </div>
            <div class="attribute-items attribute-weakness">
              <div class="attribute-type--title">Weakness</div>
              <div class="attribute-type--items">
                <span v-for="(item, index) in weakness" :key="index">{{
                  item.name
                }}</span>
              </div>
            </div>
          </div>
        </b-col>
        <b-col md="12">
          <div class="attribute-items abilities">
            <div class="abilities-title">Abilities</div>
            <div
              v-for="(item, index) in abilities"
              :key="index"
              class="abilities-item"
            >
              <div class="ability-name"># {{ item.name }}</div>
              <div class="ability-text">{{ item.text }}</div>
            </div>
          </div>
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
      abilities: [],
      weakness: [],
      loading: false,
    };
  },
  beforeDestroy() {
    this.$store.dispatch("setSelected", {});
  },
  async mounted() {
    // When refresh page or user go directly to detail page
    const selected = this.selected;
    if (!selected.types.length) {
      this.loading = true;
      let name = this.$route.params.name;
      await request
        .get(`api/v2/pokemon/${name}`)
        .then((res) => {
          this.$store.dispatch("setSelected", res.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    }
    this.fetchAbilities(this.selected.abilities);
    this.fetchWeakness();
  },
  computed: {
    ...mapState(["selected"]),
    getStats() {
      return this.selected.stats.map((item) => {
        let colour = "secondary";
        switch (item.stat.name) {
          case "hp":
            colour = "success";
            break;
          case "attack":
            colour = "danger";
            break;
          case "defense":
            colour = "info";
            break;
          case "special-attack":
            colour = "warning";
            break;
          case "special-defense":
            colour = "primary";
            break;
          default:
            colour = "secondary";
        }
        return {
          value: item.base_stat,
          name: item.stat.name,
          colour,
        };
      });
    },
  },
  methods: {
    fetchAbilities(abilities) {
      abilities.forEach((item) => {
        request.get(item.ability.url).then((res) => {
          let ability = res.data.effect_entries.filter(
            (entry) => entry.language.name === "en"
          );
          if (ability.length) {
            ability = ability[0];
          } else {
            ability = { effect: "" };
          }
          this.abilities.push({
            name: item.ability.name,
            text: ability.effect,
          });
        });
      });
    },
    fetchWeakness() {
      this.selected.types.forEach((item) => {
        request.get(item.type.url).then((res) => {
          this.weakness = this.weakness.concat(
            res.data.damage_relations.double_damage_from
          );
        });
      });
    },
  },
};
</script>

<style lang="less">
.pokemon-detail {
  padding: 30px 200px;

  @media (max-width: 576px) {
    padding: 20px;
  }
  .card {
    .card-body {
      .stats {
        .stat-name {
          text-transform: capitalize;
        }
        .stat-value {
          margin-bottom: 5px;
        }
      }
    }
    .card-title {
      text-transform: capitalize;
    }
    .attributes {
      padding: 0 20px;
      .attribute-items {
        margin: 20px 0;
      }
      .basic-attributes {
        display: flex;
        align-items: center;
        .attribute-item--container {
          display: flex;
          flex-direction: column;
          width: 50%;

          .attribute-title {
            font-weight: bold;
          }
        }
      }
      .attribute-types,
      .attribute-weakness {
        .attribute-type--title {
          font-weight: bold;
          margin-bottom: 10px;
        }
        .attribute-type--items {
          span {
            display: inline-block;
            margin: 5px;
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 40px;
            font-size: 0.8em;
            padding: 5px 10px;
            transition: all ease 0.1s;
            text-transform: capitalize;

            &:hover {
              cursor: pointer;
              background-color: rgba(0, 0, 0, 0.3);
            }
          }
        }
      }
    }
    .abilities {
      padding: 0 20px;
      .abilities-title {
        font-weight: bold;
        margin-bottom: 10px;
      }
      .abilities-item {
        margin-bottom: 15px;
        .ability-name {
          text-transform: capitalize;
        }
        .ability-text {
          color: #555;
        }
      }
    }
  }
}
</style>
