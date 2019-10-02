<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>
      Crea un nuevo hilo en
      <i>{{forum.name}}</i>
    </h1>

    <ThreadEditor
      ref="editor"
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
    forumId: {
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
    forum() {
      return this.$store.state.forums.items[this.forumId];
    },

    hasUnsavedChanges () {
      return (this.$refs.editor.form.text || this.$refs.editor.form.title) && !this.saved;
    }
  },

  methods: {
    ...mapActions('threads', ["createThread"]),
    ...mapActions('forums', ["fetchForum"]),

    save({ title, text }) {
      this.createThread({
        title,
        text,
        forumId: this.forum[".key"]
      }).then(thread => {
        this.saved = true;
        this.$router.push({
          name: "ThreadShow",
          params: { id: thread[".key"] }
        });
      });
    },

    cancel() {
      this.$router.push({
        name: "ForumShow",
        params: {
          id: this.forum[".key"]
        }
      });
    }
  },

  created() {
    this.fetchForum({ id: this.forumId })
      .then(() => { this.asyncDataStatus_fetched() });
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

