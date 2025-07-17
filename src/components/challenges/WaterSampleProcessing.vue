<template>
  <Scene>
    <div id="water-sample-processing">
      <div id="flask" class="per-split">
        <div id="skin">
          <div id="progress" :style="{ height: `${reagentAmount}%` }"></div>
        </div>
        <h1>Flask</h1>
        <p>Mysterious Fluid</p>
        <button class="per-flask-action">Take Reading</button>
        <button class="per-flask-action">Filter Out Reagent</button>
      </div>
      <div id="reagents-control" class="per-split">
        <Panel :flex-direction="'column'">
          <TextScreen />
          <div id="reagents">
            <ButtonChunky
              class="per-reagent"
              v-for="(reagent, index) in activeReagents"
              :contentId="reagent"
              @click="setReagent(index)"
              :childIndex="index"
            >
              {{ reagent }}
            </ButtonChunky>
          </div>
          <div id="pagination">
            <ButtonChunky :transition="false" @on-pressed="prevPage" id="left"
              ><</ButtonChunky
            >
            <ButtonChunky :transition="false" @on-pressed="nextPage" id="right"
              >></ButtonChunky
            >
          </div>
        </Panel>
      </div>
    </div>
  </Scene>
</template>

<script lang="ts">
import Panel from "../Panel.vue";
import TextScreen from "../ui/TextScreen.vue";
import ButtonChunky from "../ui/ButtonChunky.vue";
import Scene from "../Scene.vue";
export default {
  components: { ButtonChunky, TextScreen, Panel, Scene },
  data() {
    return {
      reagents: [
        "Vorthex",
        "Glimmerdust",
        "Netherbane",
        "Crystalroot",
        "Moonwhisper",
        "Flameheart",
        "Shadowmere",
        "Starfall",
        "Thornspike",
        "Mistweave",
        "Goldvein",
        "Frostbite",
      ],
      selectedReagent: -1,
      reagentAmount: 0,
      fluidMovement: 0,
      intervalId: -1,
      activePage: 0,
      reagentsPerPage: 6,
    };
  },
  methods: {
    setReagent(reagentIndexInPage: number) {
      const startIndex: number = this.activePage * this.reagentsPerPage;
      this.selectedReagent = startIndex + reagentIndexInPage;
    },
    startFluidMovement(fluidMovement: number) {
      this.fluidMovement = fluidMovement;
    },
    stopFluidMovement() {
      this.fluidMovement = 0;
      clearInterval(this.intervalId);
    },
    nextPage() {
      const maxIndex = this.reagents.length / this.reagentsPerPage;
      this.activePage = Math.min(this.activePage + 1, maxIndex - 1);
    },
    prevPage() {
      this.activePage = Math.max(this.activePage - 1, 0);
    },
  },
  watch: {
    fluidMovement(fluidMovement: number) {
      this.fluidMovement = fluidMovement;
      if (fluidMovement !== 0) {
        this.intervalId = setInterval(() => {
          this.reagentAmount += 5 * this.fluidMovement;
        }, 50);
      }
    },
  },
  computed: {
    activeReagents() {
      const startIndex: number = this.activePage * this.reagentsPerPage;
      const endIndex: number = startIndex + this.reagentsPerPage;
      return this.reagents.slice(startIndex, endIndex);
    },
  },
  mounted() {},
};
</script>

<style scoped>
#water-sample-processing {
  height: 100%;
  width: 100%;
  background: #67546a;
  display: flex;
  flex-wrap: nowrap;
  background: url(/img/metal-grunge-2.jpg);
  background-size: cover;
}

.per-split {
  flex-basis: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#flask {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

#reagents {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  min-width: 25rem;
}

.per-flask-action {
  height: 3rem;
  padding: 0 0.5rem;
}

#reagents-control {
  position: relative;
}

.per-reagent {
  padding: 0.5rem;
  text-align: left;
  position: relative;
}

#skin {
  height: 5rem;
  width: 2rem;
  background: white;
  position: relative;
}

#progress {
  width: 100%;
  background: green;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

#pagination {
  display: flex;
  padding: 0 1rem;
  gap: 0.5rem;
  justify-content: center;
}

#left,
#right {
  text-align: center;
}
</style>
