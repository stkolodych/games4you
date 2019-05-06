<template>
    <div class="dashboard_form">
        <h1>Add posts</h1>
        <form @submit.prevent="submitHandler">
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
    </div>
</template>
<script>
import { required, maxLength } from "vuelidate/lib/validators";

export default {
    data() {
        return {
            formData: {
                title: '',
                desc: '',
                content: '',
                rating: ''
            }
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
        submitHandler() {

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
