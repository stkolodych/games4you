import Vue from 'vue';
import router from '../../routes';

const FbAuth = "https://www.googleapis.com/identitytoolkit/v3/relyingparty";
const FbApiKey = "AIzaSyAZsCjWuzveM68JdKJySJj8qcj90TH6h9o";

const admin = {
    namespaced: true,
    state: {
        token: null,
        refresh: null,
        authFailed: false,
        refreshLoading: true,
        addPost: false,
        imageUpload: null,
        adminPosts:  null
    },
    getters: {
        isAuth(state) {
            if(state.token) {
                return true;
            }
            return false;
        },
        refreshLoading(state) {
            return state.refreshLoading;
        },
        addPostStatus(state) {
            return state.addPost;
        },
        imageUpload(state) {
            return state.imageUpload;
        },
        getAdminPosts(state) {
            return state.adminPosts;
        }
    },
    mutations: {
        getAdminPosts(state, posts) {
            state.adminPosts = posts;
        },
        imageUpload(state, imageData) {
            state.imageUpload = imageData.secure_url;
        },
        clearImageUpload(state) {
            state.imageUpload = null;
        },
        clearAddPost(state) {
            state.addPost = false;
        },
        addPost(state) {
            state.addPost = true;
        },
        refreshLoading(state) {
            state.refreshLoading = false;
        },
        authUser(state, authData) {
            state.token = authData.idToken;
            state.refresh = authData.refreshToken;

            if(authData.type === 'signin') {
                router.push('/dashboard');
            }
        },
        authFailed(state, type) {
            if(type === 'reset') {
                state.authFailed = false;
            } else {
                state.authFailed = true;
            }
        },
        logoutUser(state) {
            state.token = null;
            state.refresh = null;

            localStorage.removeItem("token");
            localStorage.removeItem("refresh");

            router.push('/');
        }
    },
    actions: {
        deletePost({commit, state}, payload) {
            Vue.http.delete(`posts/${payload}.json?auth=${state.token}`)
            .then( response => {
                let newPosts = [];

                state.adminPosts.forEach( post => {
                    if(post.id != payload) {
                        newPosts.push(post);
                    }
                });
                
                commit('getAdminPosts', newPosts);
            });
        },
        getAdminPosts({commit}) {
            Vue.http.get('posts.json')
            .then( response => response.json())
            .then( response => {
                const posts = [];

                for(let key in response) {
                    posts.push({
                        ...response[key],
                        id: key
                    })
                }
                commit('getAdminPosts', posts.reverse());
            })
        },
        signIn({commit}, payload) {
            Vue.http.post(`${FbAuth}/verifyPassword?key=${FbApiKey}`, {
                ...payload,
                returnSecureToken: true
            })
            .then( response => response.json())
            .then( authData => {
                commit('authUser', {
                    ...authData,
                    type: 'signin'
                })
                localStorage.setItem("token", authData.idToken);
                localStorage.setItem("refresh", authData.refreshToken);
            })
            .catch(error => {
                commit("authFailed");
            })
        },
        refreshToken({commit}) {
            const refreshToken = localStorage.getItem('refresh');

            if(refreshToken) {
                Vue.http.post(`https://securetoken.googleapis.com/v1/token?key=${FbApiKey}`, {
                    grant_type: "refresh_token",
                    refresh_token: refreshToken
                })
                .then( response => response.json())
                .then( authData => {
                    commit('authUser', {
                        idToken: authData.id_token,
                        refreshToken: authData.refresh_token,
                        type: 'refresh'
                    });

                    commit('refreshLoading');

                    localStorage.setItem("token", authData.id_token);
                    localStorage.setItem("refresh", authData.refresh_token);
                })
            } else {
                commit('refreshLoading');
            }
        },
        addPost({commit, state}, payload) {
            Vue.http.post(`posts.json?auth=${state.token}`, payload)
            .then( response => response.json())
            .then( response => {
                commit('addPost');
                setTimeout(()=> {
                    commit('clearAddPost');
                }, 3000);
            })
        },
        imageUpload({commit}, file) {
            const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dpv2j7xxm/image/upload';
            const CLOUDINARY_PRESET = 'ziquxksc';

            let formData = new FormData();

            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_PRESET);

            Vue.http.post(CLOUDINARY_URL, formData, {
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            })
            .then( response => response.json())
            .then( response => {
                commit("imageUpload", response)
            })

        }
    }
}

export default admin;