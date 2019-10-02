<template>
  <div class="forum-list">
    <h2 class="list-title">
      <router-link
        class="text-large"
        :to="{name: 'CategoryShow', params: {id: category['.key']}}">
        {{category.name}}
      </router-link>
    </h2>
    <ForumList :forums="categoryForums"/>
  </div>
</template>

<script>
  import ForumList from '@/components/ForumList';
  
  export default {
    name: 'CategoryListItem',
    components: {
      ForumList
    },
    props: {
      category: {
        required: true,
        type: Object
      }
    },
    computed: {
      categoryForums () {
        return Object.values(this.$store.state.forums.items)
          .filter(forum => forum.categoryId === this.category['.key'])
      }
    }
  }
</script>

<style scoped>

</style>
