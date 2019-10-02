<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>
      Edita
      <i>{{thread.title}}</i>
    </h1>

    <ThreadEditor 
      ref="editor"
      :title="thread.title" 
      :text="text" 
      @save="save" 
      @cancel="cancel"
    />
  </div>
</template>

<script>
import ThreadEditor from "@/components/ThreadEditor";
import { mapActions } from "vuex";
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      saved: false
    }
  },

  mixins: [asyncDataStatus],

  components: {
    ThreadEditor
  },

  computed: {
    thread() {
      return this.$store.state.threads.items[this.id];
    },

    text() {
      const post = this.$store.state.posts.items[this.thread.firstPostId];
      return post ? post.text : null;
    },

    hasUnsavedChanges () {
      return (this.$refs.editor.form.text !== this.text || this.$refs.editor.form.title !== this.thread.title) && !this.saved;
    }
  },

  methods: {
    ...mapActions('threads', ['updateThread', 'fetchThread']),
    ...mapActions('posts', ['fetchPost']),

    save({ title, text }) {
      this.updateThread({title, text, id: this.id})
        .then(thread => {
          this.saved = true;
          this.$router.push({
            name: "ThreadShow",
            params: { id: this.id }
          });
        });
    },

    cancel() {
      this.$router.push({
        name: "ThreadShow",
        params: { id: this.id }
      });
    }
  },

  created() {
    this.fetchThread({ id: this.id })
      .then(thread => this.fetchPost({ id: thread.firstPostId }))
      .then(() => { this.asyncDataStatus_fetched() })
  },

  beforeRouteLeave (to, from, next) {
    if (this.hasUnsavedChanges) {
      const confirmed = window.confirm('estás seguro?');
      if (confirmed) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  }
};
</script>

