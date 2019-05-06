<template>
    <div class="container">
        <div class="home_container">
            <md-card
                v-for="(post, index) in posts"
                :key="index"
            >
                <md-card-media md-ratio="4:3">
                    <img :src="post.img" alt="">
                </md-card-media>

                <md-card-header>
                    <h2 class="md-title">{{ post.title }}</h2>
                    <div class="md-subhead">
                        <div>{{ post.desc }}</div>
                    </div>
                </md-card-header>

                <md-card-actions>
                    <app-button
                        type="link"
                        :linkTo="`/posts/${post.id}`"
                        :addClass="['small_link']"
                    >
                        See review
                    </app-button>
                </md-card-actions>

            </md-card>
        </div>
    </div>
</template>
<script>
//import posts from "../../assets/posts.js"
export default {
    computed: {
        posts() {
            return this.$store.getters['posts/getAllPosts']
        }
    },
    created() {
        this.$store.dispatch("posts/getAllPosts", {
            limit: 3
        });
    }
}
</script>

