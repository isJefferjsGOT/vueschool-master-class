<template>
  <div v-if="category && asyncDataStatus_ready" class="col-full push-top">
    <h1>{{ category.name }}</h1>
    <CategoryListItem :category="category"/>
  </div>
</template>

<script>
  import CategoryListItem from '@/components/CategoryListItem';
  import {mapActions} from 'vuex';
  import asyncDataStatus from '@/mixins/asyncDataStatus';

  export default {
    name: 'PageCategoryShow',
    components: {
      CategoryListItem
    },

    props: {
      id: {
        required: true,
        type: String
      }
    },

    mixins: [asyncDataStatus],

    computed: {
      category () {
        return this.$store.state.categories.items[this.id]
      }
    },

    methods: {
      ...mapActions('categories', ['fetchCategory']),
      ...mapActions('forums', ['fetchForums'])
    },

    created () {
      this.fetchCategory({id: this.id})
        .then(category => {
          this.fetchForums({ids: category.forums})
            .then(() => { this.asyncDataStatus_fetched() })
        })
    }
  }
</script>

<style scoped>

</style>
