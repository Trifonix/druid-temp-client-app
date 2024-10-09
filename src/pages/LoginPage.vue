<template>
    <q-page class="flex flex-center page-background">
        <q-card class="q-pa-md login-card">
            <q-card-section class="row items-center q-gutter-sm justify-center">
                <div class="col text-center">
                    <div class="login-title">Вход в систему</div>
                </div>
            </q-card-section>

            <q-card-section>
                <q-form @submit.prevent="onLogin">
                    <q-input
                        v-model="email"
                        label="Email"
                        type="email"
                        filled
                        class="q-mb-md input-field"
                        required
                    />
                    <q-input
                        v-model="password"
                        label="Пароль"
                        type="password"
                        filled
                        class="q-mb-md input-field"
                        required
                    />
                    <q-btn
                        type="submit"
                        label="Войти"
                        color="primary"
                        class="full-width"
                    />
                </q-form>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { Notify } from "quasar";
import { useRouter } from "vue-router";

const router = useRouter();

const { mutate: userSignIn } = useMutation(
    gql`
        mutation UserSignIn($input: UserSignInInput!) {
            userSignIn(input: $input) {
                recordId
                record {
                    token_type
                    expires_in
                    access_token
                    refresh_token
                }
                status
            }
        }
    `,
    () => ({
        variables: {
            input: {
                login: email.value,
                password: password.value,
            },
        },
    })
);

const email = ref("");
const password = ref("");

const onLogin = async () => {
    if (!email.value || !password.value) return;

    try {
        const { data } = await userSignIn();
        if (data && data.userSignIn) {
            const token = data.userSignIn.record.access_token;
            localStorage.setItem('access_token', token);
            Notify.create({
                message: `Добро пожаловать!`, // прячем токен --- `Ваш токен: ${token.slice(0, 42)}...`
                color: "positive",
                icon: "check_circle",
                position: "top",
                timeout: 2000,
                classes: 'custom-notify'
            });
            router.push({ name: "main" });
        }
    } catch (error) {
        console.error("Ошибка авторизации:", error);
        Notify.create({
            message: "Ошибка входа. Попробуйте снова.",
            color: "negative",
            icon: "error",
            position: "bottom",
            timeout: 2000,
            classes: 'custom-notify'
        });
        if (localStorage.getItem('access_token')) localStorage.removeItem('access_token');
    }
};
</script>

<style scoped>
.page-background {
    background: linear-gradient(135deg, #e3f2fd, #bbdefb);
    min-height: 100vh;
}

.login-card {
    width: 400px;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    background-color: #ffffff;
    padding: 20px;
}

.login-title {
    font-size: 2em;
    font-weight: bold;
    color: #3f51b5;
    margin-bottom: 20px;
}

.full-width {
    width: 100%;
}

.input-field {
    --q-color-primary: #3f51b5;
    --q-input-padding: 12px;
    border-radius: 8px;
    font-size: 1.2em;
}

.q-btn {
    font-size: 1.2em;      
    padding: 12px;
}
</style>