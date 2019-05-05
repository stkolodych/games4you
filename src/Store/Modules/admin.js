import Vue from 'vue';
import router from '../../routes';

const FbAuth = "https://www.googleapis.com/identitytoolkit/v3/relyingparty";
const FbApiKey = "AIzaSyAZsCjWuzveM68JdKJySJj8qcj90TH6h9o";

const admin = {
    namespaced: true,
    state: {
        token: null,
        refresh: null,
        authFailed: false
    },
    getters: {
        isAuth(state) {
            if(state.token) {
                return true;
            }
            return false;
        }
    },
    mutations: {
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

                    localStorage.setItem("token", authData.id_token);
                    localStorage.setItem("refresh", authData.refresh_token);
                })
            }
        }
    }
}

export default admin;