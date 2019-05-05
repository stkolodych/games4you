<template>
    <div>
        <comp-featured></comp-featured>
        <comp-content></comp-content>
    </div>
</template>

<script>
import compFeatured from "./featured.vue";
import compContent from "./content.vue";

export default {
    components: {
        compFeatured,
        compContent
    }
}
</script>

