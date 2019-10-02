<template>
  <div class="col-full"
        :class="$style.centered">
    <h1 :class="$style.headingLarge">Not Found</h1>
    <p>
      No podemos encontrar la página deseada.
      <router-link :to="{name: 'Home'}">
        Ir a la página principal.
      </router-link>
    </p>
  </div>
</template>

<script>
  export default {
    name: 'PageNotFound',

    created () {
      this.$emit('ready');
    }
  }
</script>

<style module>
  .headingLarge {
    font-family: "Charlemagne Std";
    font-size: 100px;
    color: #4c4c4c;
  }

  .centered {
    text-align: center;
  }
</style>
