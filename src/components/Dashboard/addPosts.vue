<template>
    <div class="dashboard_form">
        <h1>ADD POSTS</h1>
        <form @submit.prevent="submitHandler">

            <div v-if="imageUpload">
                <img :src="imageUpload">
            </div>

            <div class="input_field">
                <input 
                    type="file"
                    @change="processFile($event)"
                >
            </div>

            <div 
                class="input_field"
                :class="{'invalid': $v.formData.title.$error}"
            >
                <label>Title</label>
                <input 
                    type="text"
                    @blur="$v.formData.title.$touch()"
                    v-model="formData.title"
                >
                <p class="error_label" v-if="$v.formData.title.$error">
                    This input is required
                </p>
            </div>

            <div 
                class="input_field"
                :class="{'invalid': $v.formData.desc.$error}"
            >
                <label>Description</label>
                <input 
                    type="text"
                    @blur="$v.formData.desc.$touch()"
                    v-model="formData.desc"
                >
                <p class="error_label" v-if="$v.formData.desc.$error">
                    This input is required
                </p>
                <p class="error_label" v-if="!$v.formData.desc.maxLength">
                    Must not be greater than {{ $v.formData.desc.$params.maxLength.max }} characters
                </p>
            </div>

            <div class="input_field">
                <wysiwyg
                    v-model="formData.content"
                />
            </div>

            <div 
                class="input_field"
                :class="{'invalid': $v.formData.rating.$error}"
            >
                <label>Rating</label>
                <select
                    v-model="formData.rating"
                    @blur="$v.formData.rating.$touch()"
                >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
                <p class="error_label" v-if="$v.formData.rating.$error">
                    You need to select at least one
                </p>
            </div>

            <button type="submit">Add post</button>
        </form>

        <md-dialog :md-active="dialog">
            <p>
                Your post has no content, are you sure you want to post this?
            </p>
            <md-dialog-actions>
                <md-button class="md-primary" @click="dialogOnCancel">Oops, I want to add it</md-button>
                <md-button class="md-primary" @click="dialogOnConfirm">Yes i am sure</md-button>
            </md-dialog-actions>
        </md-dialog>

        <div v-if="addpost" class="post_succesfull">
            Your post was posted
        </div>

    </div>
</template>
<script>
import { required, maxLength } from "vuelidate/lib/validators";

export default {
    data() {
        return {
            dialog: false,
            formData: {
                title: '',
                desc: '',
                content: '',
                rating: '',
                img: ''
            }
        }
    },
    computed: {
        addpost() {
            let status = this.$store.getters['admin/addPostStatus'];
            if(status) {
                this.clearPost();
            }
            return status;
        },
        imageUpload() {
            let imageUrl = this.$store.getters['admin/imageUpload'];
            this.formData.img = imageUrl;
            return imageUrl;
        }
    },
    validations: {
        formData: {
            title: {
                required
            },
            desc: {
                required,
                maxLength: maxLength(100)
            },
            rating: {
                required
            }
        }
    },
    methods: {
        processFile(event) {
            let file = event.target.files[0];
            this.$store.dispatch('admin/imageUpload', file);
        },
        clearPost() {
            this.$v.$reset();
            this.formData = {
                title: '',
                desc: '',
                content: '',
                rating: ''
            }
        },
        submitHandler() {
            if(!this.$v.$invalid) {
                if(this.formData.content === '') {
                    this.dialog = true;
                } else {
                    this.addPost();
                }
            } else {
                alert('something is wrong')
            }
        },
        addPost() {
            this.$store.dispatch("admin/addPost", this.formData);
        },
        dialogOnCancel() {
            this.dialog = false;
        },
        dialogOnConfirm() {
            this.dialog = false;
            this.addPost();
        }
    }
}
</script>

<style scoped>
@import "~vue-wysiwyg/dist/vueWysiwyg.css";

 .input_field.invalid input,
 .input_field.invalid select {
     border: 1px solid red;
 }
</style>
