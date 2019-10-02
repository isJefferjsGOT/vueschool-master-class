<template>
  <div class="flex-grid">
    <UserProfileCard
      v-if="!edit"
      :user="user"
    />
    <UserProfileCardEditor
      v-else
      :user="user"
    />
    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead">{{user.username}}'s recent activity</span>
        <a href="#">See only started threads?</a>
      </div>
      <hr>
      <template v-if="this.hasPosts">          
        <PostList :posts="userPosts"/>
      </template>
      <template v-else>
        <p>
          no tienes posts aún. 
        </p>
      </template>
    </div>
  </div>
</template>

<script>
import PostList from "@/components/PostList";
import UserProfileCard from "@/components/UserProfileCard";
import UserProfileCardEditor from "@/components/UserProfileCardEditor";
import { mapGetters } from "vuex";
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
  components: {
    PostList,
    UserProfileCard,
    UserProfileCardEditor
  },

  mixins: [asyncDataStatus],

  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      user: "auth/authUser"
    }),

    userPosts() {
      return this.$store.getters['users/userPosts'](this.user['.key']);
    },

    hasPosts() {
      return !!this.user.posts;
    }

  },

  created () {
    if (!this.hasPosts) {
      console.log("🐞 usuario no tiene posts");
      this.asyncDataStatus_fetched();
      return;
    }

    this.$store.dispatch('posts/fetchPosts', {ids: this.user.posts})
      .then(() => this.asyncDataStatus_fetched())
  }
};
</script>
