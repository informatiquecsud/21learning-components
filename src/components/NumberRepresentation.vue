<template>
  <div v-if="false" class="q-pa-md">
    <q-badge color="secondary">Base </q-badge>

    <q-slider
      v-model="base"
      :min="2"
      :max="10"
      :step="1"
      markers
      marker-labels
      color="purple"
      label
    />
  </div>
  <div v-if="false" class="q-pa-md">
    <q-badge color="secondary">Nombre de colonnes </q-badge>

    <q-slider
      v-model="nbColumns"
      :min="2"
      :max="64"
      :step="1"
      markers
      marker-labels
      color="red"
      label
    />
  </div>
  <table>
    <thead>
      <tr>
        <th scope="row">Poids</th>
        <th v-for="weight in weights" scope="col" :key="weight">
          {{ weight }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">
          Nombre de billets <br /><q-btn
            label="Reset"
            color="primary"
            @click="reset"
          ></q-btn>
        </th>
        <td v-for="(nbCoin, i) in nbCoins" :key="i" scope="row">
          <q-input
            v-model.number="nbCoins[i]"
            type="number"
            filled
            dense
            style="max-width: 60px"
            :rules="[
              (val) =>
                val < base ||
                'Le nombre de billets doit être inférieur à la base',
              (val) => val >= 0 || 'Le nombre de billets doit être positif',
            ]"
          />
          <q-btn
            :disable="nbCoins[i] >= base - 1"
            label="+"
            color="primary"
            round
            size="10px"
            @click="(e) => nbCoins[i]++"
          ></q-btn>
          <q-btn
            :disable="nbCoins[i] === 0"
            class="q-ml-sm"
            label="-"
            color="primary"
            round
            size="10px"
            @click="(e) => nbCoins[i]--"
          ></q-btn>
        </td>
      </tr>

      <tr v-if="true">
        <th scope="row">Chiffre en base {{ base }}</th>
        <td
          class="hex-digit"
          v-for="(nbCoin, i) in nbCoins"
          :key="i"
          scope="row"
        >
          {{ toDigit(nbCoins[i]) }}
        </td>
      </tr>
      <tr>
        <th scope="row">Total par type de billet</th>
        <td v-for="(nbCoin, i) in nbCoins" :key="i" scope="row">
          {{ nbCoins[i] * weights[i] }}
        </td>
      </tr>
      <tr>
        <th>
          Valeur totale (décimale)
          <q-btn
            label="+"
            color="primary"
            round
            size="10px"
            @click="(e) => incrementValue(0)"
          ></q-btn>
          <q-btn
            :disable="totalValue <= 0"
            class="q-ml-sm"
            label="-"
            color="primary"
            round
            size="10px"
            @click="(e) => decrementValue(0)"
          ></q-btn>
        </th>
        <td class="totalValue">
          {{ totalValue }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const nbColumns = ref(5);
const base = ref(5);
const nbCoins = ref([]);

const reset = () => {
  nbCoins.value = Array(nbColumns.value).fill(0);
};

onMounted(async () => {
  const { b, n } = route.query;
  base.value = Number(b) || 2;
  nbColumns.value = Number(n) || 8;
  console.log("nbCoins", nbCoins.value, Array(nbColumns.value).fill(0));
  nbCoins.value = Array(nbColumns.value).fill(0);
});

const toDigit = (number) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return number >= 10 ? alphabet[number - 10] : String(number);
};

const incrementValue = (index) => {
  if (nbCoins.value[nbColumns.value - 1 - index] < base.value - 1) {
    nbCoins.value[nbColumns.value - 1 - index]++;
  } else {
    nbCoins.value[nbColumns.value - 1 - index] = 0;
    incrementValue(index + 1);
  }
};

const decrementValue = (index) => {
  if (nbCoins.value[nbColumns.value - 1 - index] > 0) {
    nbCoins.value[nbColumns.value - 1 - index]--;
  } else {
    nbCoins.value[nbColumns.value - 1 - index] = base.value - 1;
    decrementValue(index + 1);
  }
};

const weights = computed(() => {
  let result = [];
  for (let i = 0; i < nbColumns.value; i++) {
    result.push(Math.pow(base.value, nbColumns.value - 1 - i));
  }
  return result;
});

const totalValue = computed(() => {
  let result = 0;
  for (let i = 0; i < nbColumns.value; i++) {
    console.log(nbCoins.value);
    console.log(weights.value);
    result += nbCoins.value[i] * weights.value[i];
  }
  return result;
});
</script>

<style lang="scss" scoped>
thead,
tfoot {
  background-color: #3f87a6;
  color: #fff;
}

tbody {
  background-color: #e4f0f5;
}

caption {
  padding: 10px;
  caption-side: bottom;
}

table {
  border-collapse: collapse;
  border: 2px solid rgb(200, 200, 200);
  letter-spacing: 1px;
  font-family: sans-serif;
  font-size: 1rem;
}

td,
th {
  border: 1px solid rgb(190, 190, 190);
  padding: 5px 10px;
}

td {
  text-align: center;
}

td.totalValue {
  font-weight: bold;
  color: red;
  font-size: 1.3rem;
}

.hex-digit {
  color: green;
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
